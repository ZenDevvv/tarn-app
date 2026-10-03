/**
 * Applications module — service layer (architecture §20, §23, §24).
 *
 * Business logic lives here, never in route files (architecture §92 rule 2).
 */
import { forbiddenOrMissing, notFound } from '../../middleware/error-handler.js';
import * as repo from './application.repository.js';
import type { ApplicationWithRelations } from './application.repository.js';
import type { CreateApplicationInput, UpdateApplicationInput } from '@tarn/validation';

/**
 * Canonical timeline event types (PRD §7.6).
 *
 * The `TimelineEvent.type` column is a free string, so these are the only values
 * this module writes. Anything outside the list is a bug, not a new event type —
 * which is why they are a union rather than an open string.
 */
export const TIMELINE_TYPES = {
  created: 'APPLICATION_CREATED',
  statusChanged: 'STATUS_CHANGED',
} as const;

/**
 * Create an application together with its company, job and first timeline event
 * (architecture §23), all inside one transaction (architecture §24).
 *
 * **Why the transaction matters here.** Without it, a failure part-way through
 * leaves a company with no application, or a job with no application — rows the
 * user never asked for and cannot see in the UI. Either the application exists
 * with its job and history, or nothing was created.
 */
export async function create(userId: string, input: CreateApplicationInput) {
  const applicationId = await repo.transaction(async (tx) => {
    // Find-or-create, matched **within this user only**. Passing the user's id
    // into the lookup is what stops two users applying to the same employer from
    // sharing a company row.
    const existing = await repo.findCompanyByName(tx, userId, input.company.name);
    const company =
      existing ??
      (await repo.createCompany(tx, {
        userId,
        name: input.company.name,
        website: input.company.website,
        notes: input.company.notes,
      }));

    const job = await repo.createJob(tx, {
      userId,
      companyId: company.id,
      title: input.job.title,
      platform: input.job.platform,
      location: input.job.location,
      salaryMin: input.job.salaryMin,
      salaryMax: input.job.salaryMax,
      salaryCurrency: input.job.salaryCurrency,
      description: input.job.description,
    });

    const application = await repo.createApplication(tx, {
      userId,
      jobId: job.id,
      status: input.status,
      priority: input.priority,
      appliedAt: input.appliedAt,
      nextAction: input.nextAction,
      nextActionDueAt: input.nextActionDueAt,
      notes: input.notes,
    });

    // PRD §7.6 / product principle "Historical Context": the first entry is not
    // optional. An application with no history is how users lose track of what
    // happened and when.
    await repo.createTimelineEvent(tx, {
      userId,
      applicationId: application.id,
      type: TIMELINE_TYPES.created,
      occurredAt: input.appliedAt ?? new Date(),
    });

    return application.id;
  });

  return findById(userId, applicationId);
}

export async function list(userId: string): Promise<ApplicationWithRelations[]> {
  return repo.listApplications(userId);
}

/**
 * Fetch one application, or 404.
 *
 * "Not yours" and "does not exist" produce the identical response
 * (`forbiddenOrMissing`), so this cannot be used to discover other users' ids.
 */
export async function findById(userId: string, id: string): Promise<ApplicationWithRelations> {
  const application = await repo.findApplicationById(userId, id);

  if (!application) throw forbiddenOrMissing();

  return application;
}

export async function update(
  userId: string,
  id: string,
  input: UpdateApplicationInput,
): Promise<ApplicationWithRelations> {
  // Confirm ownership before writing. `updateMany` is scoped anyway, so this is
  // belt-and-braces rather than the only guard — but it keeps the 404 behaviour
  // identical between "missing" and "someone else's".
  await findById(userId, id);

  const data: Record<string, unknown> = {};
  if (input.status !== undefined) data.status = input.status;
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.appliedAt !== undefined) data.appliedAt = input.appliedAt;
  if (input.nextAction !== undefined) data.nextAction = input.nextAction;
  if (input.nextActionDueAt !== undefined) data.nextActionDueAt = input.nextActionDueAt;
  if (input.notes !== undefined) data.notes = input.notes;

  const result = await repo.updateApplication(userId, id, data);

  if (result.count === 0) throw notFound();

  return findById(userId, id);
}

/**
 * Move an application to a new status (architecture §38).
 *
 * Recorded as a timeline event because a status change is exactly the kind of
 * change PRD §4.3 says must survive.
 */
export async function changeStatus(
  userId: string,
  id: string,
  status: string,
): Promise<ApplicationWithRelations> {
  const before = await findById(userId, id);

  if (before.status === status) {
    // No change, so no history entry. Writing "changed to X" when it was already
    // X makes the timeline lie.
    return before;
  }

  await repo.transaction(async (tx) => {
    await repo.updateApplication(userId, id, { status });
    await repo.createTimelineEvent(tx, {
      userId,
      applicationId: id,
      type: TIMELINE_TYPES.statusChanged,
      note: `${before.status} → ${status}`,
    });
  });

  return findById(userId, id);
}

export async function remove(userId: string, id: string): Promise<void> {
  await findById(userId, id);
  await repo.deleteApplication(userId, id);
}

export async function timeline(userId: string, id: string) {
  await findById(userId, id);
  return repo.listTimelineEvents(userId, id);
}
