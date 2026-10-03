/**
 * Applications module — repository layer (architecture §20).
 *
 * Prisma is confined to this file. No controller or service calls the client
 * directly (architecture §92 rule 1).
 *
 * ## The ownership boundary lives here
 *
 * Every function takes `userId` and filters on it. There is deliberately **no**
 * function that takes a bare application id and returns a row, because one such
 * helper is all it takes for a missing filter to become an id-guessing hole.
 * Architecture §36, §39 and PRD §33 make this the project's primary guarantee.
 */
import { prisma } from '@tarn/database';

/** The application shape returned to clients, with its job and company resolved. */
export interface ApplicationWithRelations {
  id: string;
  status: string;
  priority: string | null;
  appliedAt: Date | null;
  nextAction: string | null;
  nextActionDueAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  job: {
    id: string;
    title: string;
    platform: string;
    location: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    description: string | null;
    company: { id: string; name: string; website: string | null } | null;
  };
}

const withRelations = {
  job: {
    select: {
      id: true,
      title: true,
      platform: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      description: true,
      company: { select: { id: true, name: true, website: true } },
    },
  },
} as const;

/** Prisma transaction client type, for use inside `prisma.$transaction`. */
type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export function listApplications(userId: string): Promise<ApplicationWithRelations[]> {
  return prisma.application.findMany({
    where: { userId },
    include: withRelations,
    orderBy: { updatedAt: 'desc' },
  }) as Promise<ApplicationWithRelations[]>;
}

/**
 * Fetch one application **scoped to its owner**.
 *
 * Returns null for both "does not exist" and "belongs to someone else", which the
 * service maps to the same 404. That indistinguishability is the point: a
 * different response would let a signed-in user probe for other users' ids
 * (architecture §32).
 */
export async function findApplicationById(
  userId: string,
  id: string,
): Promise<ApplicationWithRelations | null> {
  return (await prisma.application.findFirst({
    where: { id, userId },
    include: withRelations,
  })) as ApplicationWithRelations | null;
}

/**
 * Find one of this user's companies by name, case-insensitively.
 *
 * `userId` is part of the match, not a post-filter: two users applying to the
 * same employer must not share a company row, or one user's applications would
 * become visible to the other through the relation.
 */
export function findCompanyByName(tx: Tx, userId: string, name: string): Promise<{ id: string } | null> {
  return tx.company.findFirst({
    where: { userId, name: { equals: name.trim(), mode: 'insensitive' } },
    select: { id: true },
  });
}

export function createCompany(
  tx: Tx,
  input: { userId: string; name: string; website?: string | null; notes?: string | null },
): Promise<{ id: string }> {
  return tx.company.create({
    data: {
      userId: input.userId,
      name: input.name.trim(),
      website: input.website ?? null,
      notes: input.notes ?? null,
    },
    select: { id: true },
  });
}

export function createJob(
  tx: Tx,
  input: {
    userId: string;
    companyId: string;
    title: string;
    platform: string;
    location?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    description?: string | null;
  },
) {
  return tx.job.create({
    data: {
      userId: input.userId,
      companyId: input.companyId,
      title: input.title.trim(),
      platform: input.platform as never,
      location: input.location ?? null,
      salaryMin: input.salaryMin ?? null,
      salaryMax: input.salaryMax ?? null,
      salaryCurrency: input.salaryCurrency ?? null,
      description: input.description ?? null,
    },
    select: { id: true },
  });
}

export function createApplication(
  tx: Tx,
  input: {
    userId: string;
    jobId: string;
    status: string;
    priority?: string | null;
    appliedAt?: Date | null;
    nextAction?: string | null;
    nextActionDueAt?: Date | null;
    notes?: string | null;
  },
) {
  return tx.application.create({
    data: {
      userId: input.userId,
      jobId: input.jobId,
      status: input.status as never,
      priority: (input.priority ?? null) as never,
      appliedAt: input.appliedAt ?? null,
      nextAction: input.nextAction ?? null,
      nextActionDueAt: input.nextActionDueAt ?? null,
      notes: input.notes ?? null,
    },
  });
}

/**
 * Append a timeline entry (PRD §7.6, principle: Historical Context).
 *
 * Append-only by convention: there is no update or delete helper in this file.
 */
export function createTimelineEvent(
  tx: Tx,
  input: {
    userId: string;
    applicationId: string;
    type: string;
    note?: string | null;
    occurredAt?: Date;
  },
) {
  return tx.timelineEvent.create({
    data: {
      userId: input.userId,
      applicationId: input.applicationId,
      type: input.type,
      note: input.note ?? null,
      occurredAt: input.occurredAt ?? new Date(),
    },
  });
}

export function updateApplication(userId: string, id: string, data: Record<string, unknown>) {
  return prisma.application.updateMany({
    // Scoped: an update that matched nothing is reported as "not found" by the
    // service, which is the same response another user's id produces.
    where: { id, userId },
    data,
  });
}

export function listTimelineEvents(userId: string, applicationId: string) {
  return prisma.timelineEvent.findMany({
    where: { userId, applicationId },
    orderBy: { occurredAt: 'desc' },
  });
}

export function deleteApplication(userId: string, id: string) {
  return prisma.application.deleteMany({ where: { id, userId } });
}

/** Runs `fn` inside a transaction (architecture §24). */
export function transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn);
}
