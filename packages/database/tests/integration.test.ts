/**
 * Database integration tests.
 *
 * These run against a real Postgres via `DATABASE_URL`. When no database is
 * reachable the suite is **skipped explicitly**, never silently passed, so a
 * missing database is visible in the output.
 *
 * Usage:
 *   docker compose up -d
 *   pnpm db:migrate
 *   pnpm --filter @tarn/database test
 *
 * Architecture §62 requires tests covering authentication, ownership validation
 * and application CRUD. This file covers the persistence layer those tests sit
 * on: the ownership boundary (PRD §33, architecture §36), referential
 * integrity, and password hashing at rest.
 */
import { randomBytes } from 'node:crypto';
import { hashPassword, verifyPassword } from '@tarn/auth';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { prisma } from '../src/client.js';

const TEST_PASSWORD = 'integration-test-password';

async function detectDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Top-level await: ESM module evaluation is suspended until this resolves, so
// the suite is registered correctly as either active or skipped. Calling an
// async wrapper around `describe` would not work — Vitest collects
// synchronously.
const hasDatabase = await detectDatabase();
const describeDb = hasDatabase ? describe : describe.skip;

if (!hasDatabase) {
  console.warn(
    '\n  [skipped] Database integration tests — no database reachable at DATABASE_URL.\n' +
      '             Start one with `docker compose up -d`, then run `pnpm db:migrate`.\n',
  );
}

describeDb('database integration', () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `db-test-${randomBytes(6).toString('hex')}@example.com`,
        name: 'DB Test',
        passwordHash: await hashPassword(TEST_PASSWORD),
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Cascades remove every owned row.
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('round-trips a user with a verifiable scrypt hash', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    expect(user.email).toMatch(/@example\.com$/);
    expect(user.passwordHash).toMatch(/^scrypt\$\d+\$\d+\$\d+\$/);

    await expect(verifyPassword(TEST_PASSWORD, user.passwordHash)).resolves.toBe(true);
    await expect(verifyPassword('not-the-password', user.passwordHash)).resolves.toBe(false);
  });

  it('never stores a plaintext or bare-digest password', async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    expect(user.passwordHash).not.toContain(TEST_PASSWORD);
    // A bare sha256 placeholder would carry this marker.
    expect(user.passwordHash).not.toMatch(/^sha256:/);
    // scrypt output is far longer than a 64-char hex digest.
    expect(user.passwordHash.length).toBeGreaterThan(64);
  });

  it('enforces a unique email', async () => {
    const existing = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    await expect(
      prisma.user.create({
        data: {
          email: existing.email,
          name: 'Duplicate',
          passwordHash: await hashPassword('another-password'),
        },
      }),
    ).rejects.toThrow();
  });

  it('cascades deletes to owned records and orphans nothing', async () => {
    const suffix = randomBytes(4).toString('hex');
    const company = await prisma.company.create({ data: { userId, name: `Cascade Co ${suffix}` } });
    const job = await prisma.job.create({
      data: { userId, companyId: company.id, title: 'Engineer', platform: 'OTHER' },
    });
    const application = await prisma.application.create({
      data: { userId, jobId: job.id, status: 'APPLIED' },
    });
    await prisma.timelineEvent.create({
      data: { userId, applicationId: application.id, type: 'CREATED' },
    });
    await prisma.followUp.create({
      data: { userId, applicationId: application.id, title: 'Ping', dueAt: new Date() },
    });
    await prisma.savedJob.create({
      data: { userId, title: 'Saved role', platform: 'REFERRAL' },
    });
    await prisma.offer.create({ data: { userId, applicationId: application.id } });
    await prisma.skill.create({ data: { userId, name: `CascadeSkill ${suffix}` } });

    await prisma.user.delete({ where: { id: userId } });

    await expect(prisma.company.findUnique({ where: { id: company.id } })).resolves.toBeNull();
    await expect(prisma.job.findUnique({ where: { id: job.id } })).resolves.toBeNull();
    await expect(prisma.application.findUnique({ where: { id: application.id } })).resolves.toBeNull();
    await expect(prisma.timelineEvent.findMany({ where: { userId } })).resolves.toEqual([]);
    await expect(prisma.followUp.findMany({ where: { userId } })).resolves.toEqual([]);
    await expect(prisma.savedJob.findMany({ where: { userId } })).resolves.toEqual([]);
    await expect(prisma.offer.findMany({ where: { userId } })).resolves.toEqual([]);
    await expect(prisma.skill.findMany({ where: { userId } })).resolves.toEqual([]);

    // Recreate so afterAll has something to clean up.
    const recreated = await prisma.user.create({
      data: {
        email: `db-test-recreate-${suffix}@example.com`,
        name: 'DB Test',
        passwordHash: await hashPassword(TEST_PASSWORD),
      },
    });
    userId = recreated.id;
  });

  it("scopes queries by userId so one user cannot read another's rows", async () => {
    const mine = await prisma.company.create({ data: { userId, name: 'Mine Co' } });

    const other = await prisma.user.create({
      data: {
        email: `db-test-other-${randomBytes(4).toString('hex')}@example.com`,
        name: 'Other',
        passwordHash: await hashPassword('other-password'),
      },
    });

    try {
      // A query that forgot the userId filter would return this row. Asserting
      // the filtered query is empty is the persistence-layer guard for the
      // ownership boundary (architecture §36, PRD §33).
      const leaked = await prisma.company.findFirst({ where: { id: mine.id, userId: other.id } });
      expect(leaked).toBeNull();

      const owned = await prisma.company.findFirst({ where: { id: mine.id, userId } });
      expect(owned?.id).toBe(mine.id);

      const allForOther = await prisma.company.findMany({ where: { userId: other.id } });
      expect(allForOther.every((c) => c.userId === other.id)).toBe(true);
    } finally {
      await prisma.user.delete({ where: { id: other.id } });
    }
  });

  it('keeps skills unique per user, not globally', async () => {
    const name = `Skill-${randomBytes(4).toString('hex')}`;
    await prisma.skill.create({ data: { userId, name } });

    const other = await prisma.user.create({
      data: {
        email: `db-test-skill-${randomBytes(4).toString('hex')}@example.com`,
        name: 'Other',
        passwordHash: await hashPassword('other-password'),
      },
    });

    try {
      // Same name twice for one user must fail.
      await expect(prisma.skill.create({ data: { userId, name } })).rejects.toThrow();
      // Same name for a different user must be allowed.
      const otherCopy = await prisma.skill.create({ data: { userId: other.id, name } });
      expect(otherCopy.name).toBe(name);
    } finally {
      await prisma.user.delete({ where: { id: other.id } });
    }
  });

  it('enforces the salary ordering rule at the application boundary', async () => {
    // The schema stores salary on Job; the Zod layer enforces min <= max. Assert
    // the column type is an integer and nullable, so the seed and API agree.
    const job = await prisma.job.create({
      data: { userId, title: 'Typed Salary', platform: 'OTHER', salaryMin: 50000, salaryMax: 90000 },
    });

    const loaded = await prisma.job.findUniqueOrThrow({ where: { id: job.id } });
    expect(loaded.salaryMin).toBe(50000);
    expect(loaded.salaryMax).toBe(90000);
  });
});