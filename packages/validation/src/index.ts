/**
 * Shared Zod validation schemas (architecture §40).
 *
 * The frontend imports these for form validation; the API imports the same
 * schemas for request validation. The backend stays authoritative — client
 * validation is a convenience, never a control (architecture §92 rule 5).
 */
import {
  APPLICATION_PRIORITIES,
  APPLICATION_STATUSES,
  FOLLOW_UP_STATES,
  JOB_PLATFORMS,
  OFFER_STATUSES,
} from '@tarn/types';
import { z } from 'zod';

/** PRD §18 / DESIGN.md §11: salary guidance should name the expected format. */
const salary = z.coerce
  .number()
  .int()
  .nonnegative()
  .max(100_000_000, 'Enter a salary as a number, like 50000.');

/** Storage as whole currency units (architecture §82). */
const currency = z
  .string()
  .trim()
  .length(3, 'Use a three-letter currency code, like USD or PHP.')
  .toUpperCase();

/**
 * A cuid identifier field with one consistent, human message.
 *
 * `z.string().cuid(msg)` only overrides the *format* error, so a missing field
 * still reports Zod's default "Required" — which violates DESIGN.md §12. This
 * helper makes missing, wrong-typed and malformed values all report the same
 * actionable copy.
 */
const cuidField = (message: string) =>
  z.string({ required_error: message, invalid_type_error: message }).trim().min(1, message).cuid(message);

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);
export const applicationPrioritySchema = z.enum(APPLICATION_PRIORITIES);
export const followUpStateSchema = z.enum(FOLLOW_UP_STATES);
export const offerStatusSchema = z.enum(OFFER_STATUSES);
export const jobPlatformSchema = z.enum(JOB_PLATFORMS);

// ---------------------------------------------------------------------------
// Auth (PRD §7.1)
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter an email address, like you@example.com.'),
  password: z.string().min(8, 'Use at least 8 characters.').max(200, 'Password is too long.'),
  name: z.string().trim().min(1, 'Enter your name.').max(120),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter an email address, like you@example.com.'),
  password: z.string().min(1, 'Enter your password.'),
});

// ---------------------------------------------------------------------------
// Company (PRD §7.9)
// ---------------------------------------------------------------------------

export const createCompanySchema = z.object({
  name: z.string().trim().min(1, 'Enter a company name.').max(200),
  website: z.string().trim().url('Enter a full URL, like https://example.com.').max(2000).nullish(),
  notes: z.string().trim().max(10_000).nullish(),
});

export const updateCompanySchema = createCompanySchema.partial();

// ---------------------------------------------------------------------------
// Job (PRD §7.15)
// ---------------------------------------------------------------------------

/**
 * The unrefined job shape.
 *
 * `createJobSchema` and `updateJobSchema` both derive from this so the
 * salary-range rule lives in exactly one place. It is kept separate because
 * `.refine()` returns a ZodEffects, which has no `.partial()`.
 */
const jobBaseSchema = z.object({
  companyId: cuidField('Choose a company.').nullish(),
  title: z.string().trim().min(1, 'Enter a job title.').max(200),
  platform: jobPlatformSchema,
  location: z.string().trim().max(200).nullish(),
  salaryMin: salary.nullish(),
  salaryMax: salary.nullish(),
  salaryCurrency: currency.nullish(),
  description: z.string().trim().max(100_000).nullish(),
});

/** Minimum cannot exceed maximum, on either create or update. */
function enforceSalaryRange(
  value: { salaryMin?: number | null | undefined; salaryMax?: number | null | undefined },
  ctx: z.RefinementCtx,
): void {
  const { salaryMin, salaryMax } = value;
  if (salaryMin == null || salaryMax == null) return;
  if (salaryMin > salaryMax) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Minimum salary cannot be higher than maximum salary.',
      path: ['salaryMax'],
    });
  }
}

export const createJobSchema = jobBaseSchema.superRefine(enforceSalaryRange);

export const updateJobSchema = jobBaseSchema.partial().superRefine(enforceSalaryRange);

// ---------------------------------------------------------------------------
// Application (PRD §7.3)
// ---------------------------------------------------------------------------

/**
 * Company details supplied inline with a new application.
 *
 * No identifier is accepted. Architecture §23 has the server find-or-create the
 * company by name, so the client has nothing to reference and — importantly —
 * nothing to reference *someone else's* company with. See the note on
 * `createApplicationSchema` about the rejected "reuse an existing id" shape.
 */
const applicationCompanySchema = z.object({
  name: z.string().trim().min(1, 'Enter a company name.').max(200),
  website: z.string().trim().url('Enter a full URL, like https://example.com.').max(2000).nullish(),
  notes: z.string().trim().max(10_000).nullish(),
});

/**
 * Job details supplied inline with a new application.
 *
 * `companyId` is omitted deliberately: the company comes from the sibling
 * `company` object, and two sources for the same relation is how ownership bugs
 * get in.
 */
const applicationJobSchema = z
  .object({
    title: z.string().trim().min(1, 'Enter a job title.').max(200),
    platform: jobPlatformSchema,
    location: z.string().trim().max(200).nullish(),
    salaryMin: salary.nullish(),
    salaryMax: salary.nullish(),
    salaryCurrency: currency.nullish(),
    description: z.string().trim().max(100_000).nullish(),
  })
  .superRefine(enforceSalaryRange);

/**
 * Create an application.
 *
 * **Why company and job are inline rather than a `jobId`.** Architecture §23
 * describes one `POST /api/v1/applications` creating Company, Job, Application
 * and TimelineEvent, and §24 requires them to succeed or fail together. The
 * earlier version of this schema took an existing `jobId` instead, which forced
 * the user to create a job first — three requests to log one application, and a
 * contract that contradicted the architecture. Owner decision, 2026-10-03.
 *
 * There is deliberately **no** `userId` field, and no way to point at an existing
 * company or job. The owner always comes from the verified session, and the
 * company is matched by name within that owner only.
 */
export const createApplicationSchema = z.object({
  company: applicationCompanySchema,
  job: applicationJobSchema,
  status: applicationStatusSchema.default('APPLIED'),
  priority: applicationPrioritySchema.nullish(),
  appliedAt: z.coerce.date().nullish(),
  nextAction: z.string().trim().max(500).nullish(),
  nextActionDueAt: z.coerce.date().nullish(),
  notes: z.string().trim().max(50_000).nullish(),
});

/**
 * Edit an application.
 *
 * Company and job are **not** editable here. They are separate entities
 * (terminology: "Job and Application are distinct entities and must never be
 * conflated", PRD §11), and editing a job would silently rewrite the record for
 * every other application pointing at it. That needs its own endpoints.
 *
 * `.strict()` is deliberate. Without it an unknown key is silently dropped, so a
 * client sending `{ job: { title: 'New title' } }` would get a success response
 * and reasonably believe the job had been renamed. Rejecting with 422 says "that
 * is not editable here" instead of accepting a lie. It also stops a typo'd field
 * name from being quietly ignored.
 */
export const updateApplicationSchema = z
  .object({
    status: applicationStatusSchema.optional(),
    priority: applicationPrioritySchema.nullish(),
    appliedAt: z.coerce.date().nullish(),
    nextAction: z.string().trim().max(500).nullish(),
    nextActionDueAt: z.coerce.date().nullish(),
    notes: z.string().trim().max(50_000).nullish(),
  })
  .strict();

/** Route parameter for every `/applications/:id` route. */
export const applicationIdSchema = cuidField('Could not find that application.');

/** Architecture §38 `PATCH /applications/:id/status`. */
export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
});

/** Architecture §29: filtering is a query concern, validated centrally. */
export const applicationFiltersSchema = z.object({
  status: z.union([applicationStatusSchema, z.array(applicationStatusSchema)]).optional(),
  priority: z.union([applicationPrioritySchema, z.array(applicationPrioritySchema)]).optional(),
  platform: z.union([jobPlatformSchema, z.array(jobPlatformSchema)]).optional(),
  search: z.string().trim().max(200).optional(),
  /** Architecture §28: pagination. */
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  /** Architecture §30: sorting. */
  sortBy: z.enum(['appliedAt', 'nextActionDueAt', 'updatedAt', 'createdAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ApplicationFilters = z.infer<typeof applicationFiltersSchema>;

// ---------------------------------------------------------------------------
// SavedJob (MVP per D-0004)
// ---------------------------------------------------------------------------

export const createSavedJobSchema = z.object({
  companyId: cuidField('Choose a company.').nullish(),
  title: z.string().trim().min(1, 'Enter a job title.').max(200),
  platform: jobPlatformSchema,
  url: z.string().trim().url('Enter a full URL, like https://example.com.').max(2000).nullish(),
  notes: z.string().trim().max(10_000).nullish(),
});

// ---------------------------------------------------------------------------
// Skill (MVP capture only — extraction/matching are Phase 3, D-0004)
// ---------------------------------------------------------------------------

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, 'Enter a skill name.').max(120),
});

export const assignJobSkillSchema = z.object({
  skillId: cuidField('Choose a skill.'),
  /** Null clears an explicit requirement marker. */
  required: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// FollowUp (PRD §7.7)
// ---------------------------------------------------------------------------

export const createFollowUpSchema = z.object({
  applicationId: cuidField('Choose an application.'),
  title: z.string().trim().min(1, 'Describe the follow-up.').max(300),
  dueAt: z.coerce.date(),
  state: followUpStateSchema.default('PENDING'),
});

// ---------------------------------------------------------------------------
// Offer (MVP per D-0004)
// ---------------------------------------------------------------------------

export const createOfferSchema = z.object({
  applicationId: cuidField('Choose an application.'),
  status: offerStatusSchema.default('RECEIVED'),
  salary: salary.nullish(),
  currency: currency.nullish(),
  notes: z.string().trim().max(20_000).nullish(),
  receivedAt: z.coerce.date().nullish(),
});

export const updateOfferSchema = createOfferSchema.omit({ applicationId: true }).partial();

// ---------------------------------------------------------------------------
// Timeline (PRD §7.6)
// ---------------------------------------------------------------------------

export const createTimelineEventSchema = z.object({
  applicationId: cuidField('Choose an application.'),
  type: z.string().trim().min(1).max(60),
  note: z.string().trim().max(5000).nullish(),
  occurredAt: z.coerce.date().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type CreateSavedJobInput = z.infer<typeof createSavedJobSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>;
