/**
 * Development seed (architecture §61, amended for D-0004).
 *
 * MVP scope only. Interviews, contacts, resumes, cover letters and
 * notifications are Phase 2 and have no tables, so they must not appear here.
 *
 * Uses upsert so the seed is idempotent and safe to re-run.
 *
 * The test user's password is hashed with scrypt via `@tarn/auth`. The seed
 * originally stored `sha256:<hex>`, which is not a password hashing scheme —
 * a single fast digest is trivially brute-forced offline.
 */
import { PrismaClient, type ApplicationStatus, type JobPlatform, type OfferStatus } from '@prisma/client';
import { hashPassword } from '@tarn/auth';

const prisma = new PrismaClient();

const TEST_EMAIL = process.env.SEED_USER_EMAIL ?? 'sam@example.com';
const TEST_PASSWORD = process.env.SEED_USER_PASSWORD ?? 'tarn-dev-password';

async function main(): Promise<void> {
  // Hash once and reuse: scrypt is deliberately slow.
  const passwordHash = await hashPassword(TEST_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: { name: 'Sam Rivera' },
    create: {
      email: TEST_EMAIL,
      name: 'Sam Rivera',
      passwordHash,
    },
  });

  const acme = await prisma.company.upsert({
    where: { id: 'seed-company-acme' },
    update: {},
    create: {
      id: 'seed-company-acme',
      userId: user.id,
      name: 'Acme Corp',
      website: 'https://example.com',
      notes: 'Referred by a friend.',
    },
  });

  const northwind = await prisma.company.upsert({
    where: { id: 'seed-company-northwind' },
    update: {},
    create: {
      id: 'seed-company-northwind',
      userId: user.id,
      name: 'Northwind Labs',
      website: null,
      notes: null,
    },
  });

  const react = await prisma.skill.upsert({
    where: { userId_name: { userId: user.id, name: 'React' } },
    update: {},
    create: { userId: user.id, name: 'React' },
  });
  const typescript = await prisma.skill.upsert({
    where: { userId_name: { userId: user.id, name: 'TypeScript' } },
    update: {},
    create: { userId: user.id, name: 'TypeScript' },
  });

  const frontendJob = await prisma.job.upsert({
    where: { id: 'seed-job-frontend' },
    update: {},
    create: {
      id: 'seed-job-frontend',
      userId: user.id,
      companyId: acme.id,
      title: 'Frontend Engineer',
      platform: 'LINKEDIN' satisfies JobPlatform,
      location: 'Remote (PH)',
      salaryMin: 90000,
      salaryMax: 130000,
      salaryCurrency: 'PHP',
      description: 'Build interfaces with React and TypeScript.',
    },
  });

  await prisma.jobSkill.upsert({
    where: { jobId_skillId: { jobId: frontendJob.id, skillId: react.id } },
    update: {},
    create: { jobId: frontendJob.id, skillId: react.id, required: true },
  });
  await prisma.jobSkill.upsert({
    where: { jobId_skillId: { jobId: frontendJob.id, skillId: typescript.id } },
    update: {},
    create: { jobId: frontendJob.id, skillId: typescript.id, required: true },
  });

  const backendJob = await prisma.job.upsert({
    where: { id: 'seed-job-backend' },
    update: {},
    create: {
      id: 'seed-job-backend',
      userId: user.id,
      companyId: northwind.id,
      title: 'Backend Engineer',
      platform: 'COMPANY_WEBSITE' satisfies JobPlatform,
      location: 'Cebu',
      salaryMin: 80000,
      salaryMax: 110000,
      salaryCurrency: 'PHP',
      description: null,
    },
  });

  const applied = await prisma.application.upsert({
    where: { id: 'seed-application-applied' },
    update: {},
    create: {
      id: 'seed-application-applied',
      userId: user.id,
      jobId: frontendJob.id,
      status: 'APPLIED' satisfies ApplicationStatus,
      priority: 'HIGH',
      appliedAt: new Date('2026-09-28T09:00:00Z'),
      nextAction: 'Follow up with the recruiter',
      nextActionDueAt: new Date('2026-10-05T09:00:00Z'),
      notes: 'Applied through LinkedIn.',
    },
  });

  const interviewing = await prisma.application.upsert({
    where: { id: 'seed-application-interviewing' },
    update: {},
    create: {
      id: 'seed-application-interviewing',
      userId: user.id,
      jobId: backendJob.id,
      status: 'HR_INTERVIEW' satisfies ApplicationStatus,
      priority: 'MEDIUM',
      appliedAt: new Date('2026-09-20T09:00:00Z'),
      nextAction: 'Prepare for the HR call',
      nextActionDueAt: new Date('2026-10-03T09:00:00Z'),
      notes: null,
    },
  });

  await prisma.application.upsert({
    where: { id: 'seed-application-rejected' },
    update: {},
    create: {
      id: 'seed-application-rejected',
      userId: user.id,
      jobId: frontendJob.id,
      status: 'REJECTED' satisfies ApplicationStatus,
      priority: 'LOW',
      appliedAt: new Date('2026-08-15T09:00:00Z'),
      nextAction: null,
      nextActionDueAt: null,
      notes: 'Went with another candidate.',
    },
  });

  // Timeline history (PRD §4.3 — history is preserved, never overwritten).
  await prisma.timelineEvent.upsert({
    where: { id: 'seed-timeline-applied-created' },
    update: {},
    create: {
      id: 'seed-timeline-applied-created',
      userId: user.id,
      applicationId: applied.id,
      type: 'CREATED',
      note: 'Application added.',
      occurredAt: new Date('2026-09-28T09:00:00Z'),
    },
  });
  await prisma.timelineEvent.upsert({
    where: { id: 'seed-timeline-interviewing-hr' },
    update: {},
    create: {
      id: 'seed-timeline-interviewing-hr',
      userId: user.id,
      applicationId: interviewing.id,
      type: 'STATUS_CHANGED',
      note: 'Moved to HR interview.',
      occurredAt: new Date('2026-09-26T14:00:00Z'),
    },
  });

  await prisma.followUp.upsert({
    where: { id: 'seed-followup-recruiter' },
    update: {},
    create: {
      id: 'seed-followup-recruiter',
      userId: user.id,
      applicationId: applied.id,
      title: 'Follow up with recruiter',
      dueAt: new Date('2026-10-05T09:00:00Z'),
      state: 'PENDING',
    },
  });
  await prisma.followUp.upsert({
    where: { id: 'seed-followup-prep' },
    update: {},
    create: {
      id: 'seed-followup-prep',
      userId: user.id,
      applicationId: interviewing.id,
      title: 'Prepare for the HR call',
      dueAt: new Date('2026-10-03T09:00:00Z'),
      state: 'PENDING',
    },
  });

  await prisma.savedJob.upsert({
    where: { id: 'seed-savedjob' },
    update: {},
    create: {
      id: 'seed-savedjob',
      userId: user.id,
      companyId: northwind.id,
      title: 'Platform Engineer',
      platform: 'REFERRAL' satisfies JobPlatform,
      url: 'https://example.com/careers/platform',
      notes: 'Referred by Mara. Interesting remote-first setup.',
    },
  });

  await prisma.offer.upsert({
    where: { id: 'seed-offer' },
    update: {},
    create: {
      id: 'seed-offer',
      userId: user.id,
      applicationId: interviewing.id,
      status: 'RECEIVED' satisfies OfferStatus,
      salary: 95000,
      currency: 'PHP',
      notes: 'Awaiting a decision.',
      receivedAt: new Date('2026-09-30T09:00:00Z'),
    },
  });

  console.info('Seed complete.');
  console.info(`  user:   ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  console.info('  companies, jobs, skills, applications, timeline events, follow-ups, saved job, offer');
  console.info('  password hashed with scrypt (N=32768, r=8, p=1)');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });