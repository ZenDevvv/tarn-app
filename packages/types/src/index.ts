/**
 * Shared domain vocabulary for Tarn.
 *
 * These types are the frontend-facing contract. They intentionally do NOT
 * re-export Prisma models — architecture §83 requires the frontend to stay
 * decoupled from the ORM so backend models can change without a client rewrite.
 *
 * Canonical vocabulary lives in `.wwg/wiki/terminology.md`.
 */

/**
 * Application lifecycle status (PRD §12, architecture §43).
 * Progress is shown as shape via StageRing, not color (DESIGN.md §6).
 */
export const APPLICATION_STATUSES = [
  'SAVED',
  'APPLIED',
  'APPLICATION_VIEWED',
  'RECRUITER_CONTACTED',
  'HR_INTERVIEW',
  'TECHNICAL_INTERVIEW',
  'FINAL_INTERVIEW',
  'OFFER',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
  'NO_RESPONSE',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Terminal states — no further pipeline movement. */
export const TERMINAL_STATUSES = [
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
] as const satisfies readonly ApplicationStatus[];

/** Statuses that represent an application still in play. */
export const ACTIVE_STATUSES = [
  'SAVED',
  'APPLIED',
  'APPLICATION_VIEWED',
  'RECRUITER_CONTACTED',
  'HR_INTERVIEW',
  'TECHNICAL_INTERVIEW',
  'FINAL_INTERVIEW',
  'OFFER',
] as const satisfies readonly ApplicationStatus[];

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return (TERMINAL_STATUSES as readonly string[]).includes(status);
}

export function isActiveStatus(status: ApplicationStatus): boolean {
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

/** User-defined importance. Never presented as an objective recommendation (PRD §13). */
export const APPLICATION_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type ApplicationPriority = (typeof APPLICATION_PRIORITIES)[number];

/** FollowUp state (PRD §7.7). Distinct from Application status. */
export const FOLLOW_UP_STATES = ['PENDING', 'DUE_TODAY', 'OVERDUE', 'COMPLETED', 'SNOOZED'] as const;
export type FollowUpState = (typeof FOLLOW_UP_STATES)[number];

/** Offer state (PRD §7.20). */
export const OFFER_STATUSES = ['RECEIVED', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED', 'NEGOTIATING'] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

/**
 * Where a job was found (PRD §1.2, §7.3).
 * `OTHER` covers referrals and anything not otherwise listed.
 */
export const JOB_PLATFORMS = [
  'LINKEDIN',
  'INDEED',
  'JOBSTREET',
  'ONLINEJOBSPH',
  'COMPANY_WEBSITE',
  'REFERRAL',
  'OTHER',
] as const;
export type JobPlatform = (typeof JOB_PLATFORMS)[number];

/** An application record, decoupled from Prisma. */
export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  priority: ApplicationPriority | null;
  appliedAt: string | null;
  nextAction: string | null;
  nextActionDueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  userId: string;
  companyId: string | null;
  title: string;
  platform: JobPlatform;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  companyId: string | null;
  title: string;
  platform: JobPlatform;
  url: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface TimelineEvent {
  id: string;
  userId: string;
  applicationId: string;
  type: string;
  note: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  userId: string;
  applicationId: string;
  title: string;
  dueAt: string;
  state: FollowUpState;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  userId: string;
  applicationId: string;
  status: OfferStatus;
  salary: number | null;
  currency: string | null;
  notes: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// API response envelope (architecture §27)
// ---------------------------------------------------------------------------

/** Pagination metadata (architecture §28). */
export interface ApiMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: ApiMeta;
}

/**
 * Error envelope. `fields` carries per-field messages that are safe to show in
 * forms — they are user-facing copy, not debug output (DESIGN.md §12).
 */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}
