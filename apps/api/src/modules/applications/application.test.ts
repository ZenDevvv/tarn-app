/**
 * Applications route tests (PRD §7.3, architecture §23-§24, §36, §39.
 *
 * This is the first module where the ownership boundary is exercised against
 * real user data rather than just the `users` table, so **cross-user isolation is
 * the centre of gravity here.** PRD §35 item 12 ("data is isolated between
 * users") is a Definition-of-Done criterion, and
 * `.wwg/governance/test-enforcement.md` rule 4 requires cross-user access attempts
 * as a test case.
 *
 * Runs against a real database and skips loudly, never silently, when none is
 * reachable.
 */
import { randomBytes } from 'node:crypto';
import { prisma } from '@tarn/database';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp, API_PREFIX } from '../../app.js';
import { __setEnvForTests } from '../../config/env.js';
import { __resetLimiters } from '../auth/auth.routes.js';

const testEnv = {
  NODE_ENV: 'test' as const,
  PORT: 4000,
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://tarn:tarn@localhost:5432/tarn',
  JWT_SECRET: 'test-jwt-secret-long-enough-for-hs256',
  COOKIE_SECRET: 'test-cookie-secret-at-least-32-chars',
  WEB_ORIGIN: 'http://localhost:5173',
};

async function hasDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

const dbAvailable = await hasDatabase();
const describeDb = dbAvailable ? describe : describe.skip;

if (!dbAvailable) {
  console.warn(
    '\n  [skipped] Application route tests — no database reachable at DATABASE_URL.\n' +
      '             Start one with `docker compose up -d`, then run `pnpm db:deploy`.\n',
  );
}

const uniq = () => randomBytes(6).toString('hex');

const VALID_APPLICATION = {
  company: { name: 'Acme Corp' },
  job: { title: 'Frontend Engineer', platform: 'LINKEDIN' },
} as const;

function cookieOf(response: request.Response, name: string): string {
  const raw = response.headers['set-cookie'];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.find((c) => c.startsWith(`${name}=`))?.split(';')[0] ?? '';
}

/**
 * A client bound to one user's access cookie.
 *
 * Not supertest's `agent`: `request(app)` does not persist state between calls,
 * so a header set once is dropped by the next request. Each verb applies the
 * cookie explicitly, which is why every call site reads `api.get(...)`.
 */
interface SignedIn {
  userId: string;
  get(path: string): request.Test;
  post(path: string): request.Test;
  patch(path: string): request.Test;
  del(path: string): request.Test;
}

describeDb('applications', () => {
  const userIds: string[] = [];
  const applicationIds: string[] = [];

  beforeAll(() => {
    __setEnvForTests(testEnv);
  });

  // Cleans the PREVIOUS test's rows before each test signs in. Calling this after
  // signIn would delete the account the test is about to use, which produced a
  // foreign-key failure rather than anything to do with the route.
  //
  // `__resetLimiters` is needed because this suite registers several accounts per
  // test and they all arrive from 127.0.0.1, which exhausts the register rate
  // limit (5 per 15 minutes per IP) after the second or third test. That limit is
  // correct behaviour, not a bug — a suite creating dozens of accounts from one
  // address is exactly what it is for.
  beforeEach(async () => {
    __resetLimiters();
    await cleanup();
  });

  afterAll(async () => {
    __setEnvForTests(undefined);
    await prisma.$disconnect();
  });

  /** Creates a signed-in user and returns a client bound to their cookie. */
  async function signIn(name = 'Owner'): Promise<SignedIn> {
    const email = `app-${name.toLowerCase()}-${uniq()}@example.com`;

    const registered = await request(createApp())
      .post(`${API_PREFIX}/auth/register`)
      .send({ email, password: 'correct-horse-battery', name });

    expect(registered.status).toBe(201);
    const userId = registered.body.data.user.id;
    userIds.push(userId);

    const cookie = cookieOf(registered, 'tarn_access');
    const withCookie = (test: request.Test) => test.set('Cookie', cookie);

    return {
      userId,
      get: (path) => withCookie(request(createApp()).get(path)),
      post: (path) => withCookie(request(createApp()).post(path)),
      patch: (path) => withCookie(request(createApp()).patch(path)),
      del: (path) => withCookie(request(createApp()).delete(path)),
    };
  }

  async function createApplication(
    api: SignedIn,
    overrides: Record<string, unknown> = {},
  ): Promise<{ id: string; body: Record<string, unknown> }> {
    const response = await api
      .post(`${API_PREFIX}/applications`)
      .send({ ...VALID_APPLICATION, ...overrides });

    expect(response.status).toBe(201);
    applicationIds.push(response.body.data.id);
    return { id: response.body.data.id, body: response.body.data };
  }

  /** Removes everything this suite created, newest relations first. */
  async function cleanup(): Promise<void> {
    await prisma.application.deleteMany({ where: { id: { in: applicationIds } } });
    await prisma.job.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.company.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    applicationIds.length = 0;
    userIds.length = 0;
  }

  // -------------------------------------------------------------------------
  // Create — architecture §23 and §24
  // -------------------------------------------------------------------------

  describe('POST /applications', () => {
    it('creates the application with its company, job and first timeline entry', async () => {
      const api = await signIn('Create');

      const { body } = await createApplication(api);

      expect(body.status).toBe('APPLIED');
      expect((body.job as Record<string, unknown>).title).toBe('Frontend Engineer');
      expect(((body.job as Record<string, unknown>).company as Record<string, unknown>).name).toBe(
        'Acme Corp',
      );

      const stored = await prisma.application.findUniqueOrThrow({
        where: { id: body.id as string },
        include: { job: { include: { company: true } }, timelineEvents: true },
      });

      // Owned by the caller, not by anything supplied in the payload.
      expect(stored.userId).toBe(api.userId);
      expect(stored.job.userId).toBe(api.userId);
      expect(stored.job.company?.userId).toBe(api.userId);
      // PRD §4.3 / §7.6: history starts immediately, it is not optional.
      expect(stored.timelineEvents).toHaveLength(1);
      expect(stored.timelineEvents[0]?.type).toBe('APPLICATION_CREATED');
    });

    it('reuses an existing company of the same user rather than duplicating it', async () => {
      const api = await signIn('Reuse');

      await createApplication(api);
      await createApplication(api, { job: { title: 'Backend Engineer', platform: 'OTHER' } });

      // Scoped to this test's users: the development seed already contains a
      // company with this name, and an unscoped count would assert against it.
      const companies = await prisma.company.findMany({
        where: { name: 'Acme Corp', userId: { in: userIds } },
      });
      expect(companies).toHaveLength(1);
    });

    it('does not reuse another user’s company (PRD §33)', async () => {
      const first = await signIn('Alpha');
      await createApplication(first);

      const second = await signIn('Beta');
      await createApplication(second);

      // Same company name, two owners: sharing a row would expose one user's
      // applications to the other through the relation. Scoped to these two
      // users, since the seed also has a company with this name.
      const companies = await prisma.company.findMany({
        where: { name: 'Acme Corp', userId: { in: userIds } },
      });
      expect(companies).toHaveLength(2);
      expect(new Set(companies.map((c) => c.userId)).size).toBe(2);
    });

    it('rejects a client-supplied userId rather than filing under it', async () => {
      const victim = await signIn('Victim');
      const attacker = await signIn('Attacker');

      const response = await attacker
        .post(`${API_PREFIX}/applications`)
        .send({ ...VALID_APPLICATION, userId: victim.userId });

      expect(response.status).toBe(201);
      const stored = await prisma.application.findUniqueOrThrow({
        where: { id: response.body.data.id },
      });
      expect(stored.userId).not.toBe(victim.userId);
      expect(stored.userId).toBe(attacker.userId);
    });

    it('rolls the whole thing back when any part fails (architecture §24)', async () => {
      const api = await signIn('Rollback');

      const companiesBefore = await prisma.company.count({ where: { userId: api.userId } });

      // A payload rejected by validation must not leave debris behind. The
      // transaction itself cannot be forced to fail from here without a
      // contrived collision, so this asserts the property that is reachable: a
      // rejected create writes no company and no job.
      const response = await api
        .post(`${API_PREFIX}/applications`)
        .send({ ...VALID_APPLICATION, status: 'NOT_A_STATUS' });

      expect(response.status).toBe(422);
      expect(await prisma.company.count({ where: { userId: api.userId } })).toBe(companiesBefore);
    });

    it('rejects an inverted salary range before writing anything', async () => {
      const api = await signIn('Salary');

      const response = await api.post(`${API_PREFIX}/applications`).send({
        company: { name: 'Acme' },
        job: { title: 'X', platform: 'OTHER', salaryMin: 90000, salaryMax: 10000 },
      });

      expect(response.status).toBe(422);
      expect(await prisma.job.count({ where: { userId: api.userId } })).toBe(0);
      expect(await prisma.company.count({ where: { userId: api.userId } })).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // Read
  // -------------------------------------------------------------------------

  describe('GET /applications', () => {
    it('lists only the caller’s applications', async () => {
      const alice = await signIn('ListAlice');
      const bob = await signIn('ListBob');

      await createApplication(alice);
      await createApplication(bob);

      const aliceList = await alice.get(`${API_PREFIX}/applications`);
      const bobList = await bob.get(`${API_PREFIX}/applications`);

      expect(aliceList.status).toBe(200);
      expect(aliceList.body.data).toHaveLength(1);
      expect(bobList.body.data).toHaveLength(1);
      expect(aliceList.body.data[0].id).not.toBe(bobList.body.data[0].id);
    });

    it('is empty for a brand new account', async () => {
      const api = await signIn('Empty');

      const response = await api.get(`${API_PREFIX}/applications`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Cross-user isolation — PRD §35 item 12
  // -------------------------------------------------------------------------

  describe('cross-user isolation', () => {
    it('returns an identical 404 for another user’s application', async () => {
      const owner = await signIn('Owner');
      const stranger = await signIn('Stranger');

      const { id } = await createApplication(owner);

      const response = await stranger.get(`${API_PREFIX}/applications/${id}`);

      // 404, not 403 — see `forbiddenOrMissing` in error-handler.ts.
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('not_found');
    });

    it('is indistinguishable from a genuinely missing application', async () => {
      const owner = await signIn('Compare');
      const stranger = await signIn('CompareStranger');

      const { id } = await createApplication(owner);

      const notYours = await stranger.get(`${API_PREFIX}/applications/${id}`);
      const doesNotExist = await stranger.get(`${API_PREFIX}/applications/clx00000000000000000000`);

      // Byte-identical. A differing message would let a signed-in user probe for
      // which application ids exist (architecture §32).
      expect(notYours.status).toBe(doesNotExist.status);
      expect(notYours.body).toEqual(doesNotExist.body);
    });

    it('cannot read, edit, delete, or re-status another user’s application', async () => {
      const owner = await signIn('Owner');
      const attacker = await signIn('Attacker');

      const { id } = await createApplication(owner, { notes: 'private note' });

      const reads = await attacker.get(`${API_PREFIX}/applications/${id}`);
      const edits = await attacker.patch(`${API_PREFIX}/applications/${id}`).send({ notes: 'stolen' });
      const restates = await attacker
        .patch(`${API_PREFIX}/applications/${id}/status`)
        .send({ status: 'OFFER' });
      const deletes = await attacker.del(`${API_PREFIX}/applications/${id}`);
      const timeline = await attacker.get(`${API_PREFIX}/applications/${id}/timeline`);

      expect(reads.status).toBe(404);
      expect(edits.status).toBe(404);
      expect(restates.status).toBe(404);
      expect(deletes.status).toBe(404);
      expect(timeline.status).toBe(404);

      // And nothing changed for the real owner.
      const still = await owner.get(`${API_PREFIX}/applications/${id}`);
      expect(still.body.data.notes).toBe('private note');
      expect(still.body.data.status).toBe('APPLIED');
    });

    it('does not leak another user’s application through their timeline', async () => {
      const owner = await signIn('TlOwner');
      const attacker = await signIn('TlAttacker');

      const { id } = await createApplication(owner);

      const response = await attacker.get(`${API_PREFIX}/applications/${id}/timeline`);
      expect(response.status).toBe(404);

      const ownerTimeline = await owner.get(`${API_PREFIX}/applications/${id}/timeline`);
      expect(ownerTimeline.status).toBe(200);
      expect(ownerTimeline.body.data).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // Edit and status
  // -------------------------------------------------------------------------

  describe('PATCH /applications/:id', () => {
    it('updates the caller’s application', async () => {
      const api = await signIn('Edit');
      const { id } = await createApplication(api);

      const response = await api
        .patch(`${API_PREFIX}/applications/${id}`)
        .send({ priority: 'HIGH', nextAction: 'Follow up Friday', notes: 'Recruiter was nice.' });

      expect(response.status).toBe(200);
      expect(response.body.data.priority).toBe('HIGH');
      expect(response.body.data.nextAction).toBe('Follow up Friday');
    });

    it('can clear a field with null', async () => {
      const api = await signIn('Clear');
      const { id } = await createApplication(api, { priority: 'HIGH' });

      const response = await api.patch(`${API_PREFIX}/applications/${id}`).send({ priority: null });

      expect(response.status).toBe(200);
      expect(response.body.data.priority).toBeNull();
    });

    it('rejects a client-supplied userId', async () => {
      const api = await signIn('NoReassign');
      const { id } = await createApplication(api);

      // The status and error code are asserted, not just the resulting ownership.
      // Checking only `stored.userId` would pass whether the key was rejected or
      // silently dropped, so the test could not tell the safe behaviour from the
      // unsafe one it exists to catch.
      const response = await api
        .patch(`${API_PREFIX}/applications/${id}`)
        .send({ userId: 'clxsomeoneelse00000000' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('validation_failed');

      const stored = await prisma.application.findUniqueOrThrow({ where: { id } });
      expect(stored.userId).toBe(api.userId);
    });

    it('rejects status here so every status change goes through the route that records it', async () => {
      const api = await signIn('NoSilentStatus');
      const { id } = await createApplication(api);

      // `PATCH /:id` must not be a second way to change status. If it were, a
      // client could move an application and leave no history entry, breaking the
      // guarantee PRD §4.3 rests on. See D-0010.
      const response = await api.patch(`${API_PREFIX}/applications/${id}`).send({ status: 'OFFER' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('validation_failed');

      const stored = await prisma.application.findUniqueOrThrow({ where: { id } });
      expect(stored.status).toBe('APPLIED');

      const timeline = await api.get(`${API_PREFIX}/applications/${id}/timeline`);
      expect(timeline.body.data).toHaveLength(1);
    });

    it('rejects edits to company or job details rather than ignoring them', async () => {
      const api = await signIn('NoNested');
      const { id } = await createApplication(api);

      // Job and company are separate entities (PRD §11). Rewriting them here
      // would silently change the record for every other application using them.
      const response = await api
        .patch(`${API_PREFIX}/applications/${id}`)
        .send({ job: { title: 'Rewritten' }, company: { name: 'Rewritten' } });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('validation_failed');
      const stored = await prisma.application.findUniqueOrThrow({
        where: { id },
        include: { job: { include: { company: true } } },
      });
      expect(stored.job.title).toBe('Frontend Engineer');
      expect(stored.job.company?.name).toBe('Acme Corp');
    });
  });

  describe('PATCH /applications/:id/status', () => {
    it('changes the status and records it in the timeline', async () => {
      const api = await signIn('Status');
      const { id } = await createApplication(api);

      const response = await api
        .patch(`${API_PREFIX}/applications/${id}/status`)
        .send({ status: 'HR_INTERVIEW' });
      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('HR_INTERVIEW');

      const timeline = await api.get(`${API_PREFIX}/applications/${id}/timeline`);
      const types = timeline.body.data.map((e: { type: string }) => e.type);
      expect(types).toContain('STATUS_CHANGED');
    });

    it('does not write a history entry when the status is unchanged', async () => {
      const api = await signIn('NoChange');
      const { id } = await createApplication(api);

      const before = await api.get(`${API_PREFIX}/applications/${id}/timeline`);
      await api.patch(`${API_PREFIX}/applications/${id}/status`).send({ status: 'APPLIED' });
      const after = await api.get(`${API_PREFIX}/applications/${id}/timeline`);

      // "Changed to APPLIED" when it was already APPLIED makes the timeline lie.
      expect(after.body.data).toHaveLength(before.body.data.length);
    });

    it('rejects an unknown status', async () => {
      const api = await signIn('BadStatus');
      const { id } = await createApplication(api);

      const response = await api
        .patch(`${API_PREFIX}/applications/${id}/status`)
        .send({ status: 'PROMOTED_TO_MASCOT' });

      expect(response.status).toBe(422);
    });
  });

  describe('DELETE /applications/:id', () => {
    it('deletes the caller’s application and returns 204', async () => {
      const api = await signIn('Delete');
      const { id } = await createApplication(api);

      const response = await api.del(`${API_PREFIX}/applications/${id}`);

      expect(response.status).toBe(204);
      expect(await prisma.application.count({ where: { id } })).toBe(0);
    });
  });

  describe('authentication', () => {
    it('rejects every route without a session', async () => {
      // Sequential, not concurrent. Firing all seven at once races Prisma's
      // connection pool during connect and produced ECONNREFUSED, which says
      // nothing about authorization.
      const anonymous = () => request(createApp());
      const ID = 'clx00000000000000000000';

      const attempts: [string, () => request.Test][] = [
        ['GET /', () => anonymous().get(`${API_PREFIX}/applications`)],
        ['POST /', () => anonymous().post(`${API_PREFIX}/applications`).send(VALID_APPLICATION)],
        ['GET /:id', () => anonymous().get(`${API_PREFIX}/applications/${ID}`)],
        ['PATCH /:id', () => anonymous().patch(`${API_PREFIX}/applications/${ID}`).send({})],
        ['DELETE /:id', () => anonymous().delete(`${API_PREFIX}/applications/${ID}`)],
        [
          'PATCH /:id/status',
          () => anonymous().patch(`${API_PREFIX}/applications/${ID}/status`).send({ status: 'APPLIED' }),
        ],
        ['GET /:id/timeline', () => anonymous().get(`${API_PREFIX}/applications/${ID}/timeline`)],
      ];

      for (const [label, build] of attempts) {
        const response = await build();
        expect(response.status, `${label} must reject an unauthenticated caller`).toBe(401);
      }
    });
  });
});
