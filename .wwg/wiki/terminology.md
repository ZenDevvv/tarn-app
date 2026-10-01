# Terminology

This file defines canonical and observed project language.

Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Status: Accepted terminology, ingested from existing project documentation.
Truth confidence: MEDIUM
Last truth ingestion: 2026-10-01

Canonical terms below are taken from `job-application-tracker-brd-prd.md` (authoritative for product meaning), `job-application-tracker-project-architecture.md` (authoritative for technical nouns), and `DESIGN.md` (authoritative for UI/design nouns).

## Naming Context

Three distinct names coexist in this project and must never be used interchangeably:

| Name | Kind | Canonical meaning | Status | Evidence |
|---|---|---|---|---|
| Job Application Tracker | Product name (working title) | The product itself | CONFIRMED_AS_WORKING_TITLE | PRD §1.1 |
| Applicant Tracking System (ATS) | Positioning phrase | The category the product evolves into; ATS is always qualified as "personal" and "focused on the job seeker" | CONFIRMED | PRD §1.2 |
| Marker | Design system name | The component/token design system only. Never a product name | CONFIRMED | `DESIGN.md` line 3 |
| applicant-tracking-system | Repository name | The code repository | CONFIRMED | repository root |

## Canonical Terms

These are the canonical domain terms. Use them in code, UI copy, docs, and agent reasoning.

| Canonical Term | Definition | Where It Lives | Status | Evidence |
|---|---|---|---|---|
| Application | The core record: one job the user has applied to (or saved), with its status, timeline, follow-ups, interviews, files, and offer | `Application` model; `apps/web/src/features/applications/` | CONFIRMED | PRD §7.3, §11; architecture §34 |
| Job | The role/position description itself, independent of any application. A Job may exist before it becomes an Application | `Job` model | CONFIRMED | PRD §11; architecture §33 |
| Company | The employer organization an application is associated with | `Company` model | CONFIRMED | PRD §7.9, §11 |
| Contact | A recruiter or hiring contact recorded against companies/applications. Tracked data, not a system user | `Contact` model | CONFIRMED | PRD §7.10, §11 |
| Interview | A scheduled or completed interview belonging to an application | `Interview` model | CONFIRMED | PRD §7.11, §11 |
| TimelineEvent | An immutable history entry recording a change on an application | `TimelineEvent` model | CONFIRMED | PRD §4.3, §7.6, §11 |
| FollowUp | A scheduled reminder/action attached to an application | `FollowUp` model | CONFIRMED | PRD §7.7, §11 |
| Resume | A stored resume document/version associated with applications | `Resume` model | CONFIRMED | PRD §7.13, §11 |
| CoverLetter | A stored cover-letter document/version associated with applications | `CoverLetter` model | CONFIRMED | PRD §7.14, §11 |
| Offer | A received job offer attached to an application | `Offer` model | CONFIRMED | PRD §7.20, §11 |
| SavedJob | A job saved for later without having applied yet | `SavedJob` model | CONFIRMED | PRD §7.8, §11 |
| Skill | A capability extracted from or attached to a job | `Skill`, `JobSkill` models | CONFIRMED | PRD §8.2, §11 |
| Tag | A user-defined custom label applied to applications | `Tag`, `ApplicationTag` models | CONFIRMED | PRD §14, §11 |
| Notification | A user-facing alert, planned for later phases | `Notification` model | CONFIRMED | PRD §7.7, §9.3, §11 |
| Status | The current lifecycle position of an application | `Status` enum / `STATUS_CONFIG` | CONFIRMED | PRD §5, §12 |
| Pipeline | The Kanban/status-column view of applications grouped by status | `application-kanban.tsx` | CONFIRMED | PRD §7.4; `DESIGN.md` §8 |
| Application Card | The list/board representation of one application | `application-card.tsx` | CONFIRMED | PRD §19; `DESIGN.md` §8 |
| Next Action | The single recommended next step for an active application | `features/applications` next-action logic | CONFIRMED | PRD §4.2, §7.2; architecture §45 |
| Stage Ring | The shape-based status indicator; the required way to display status | `application-status-badge.tsx` | CONFIRMED | `DESIGN.md` §6 |
| Application Status Badge | The status display component wrapper around Stage Ring | `application-status-badge.tsx` | CONFIRMED | `DESIGN.md` §1, §6 |
| Priority | User-defined importance of an application (LOW/MEDIUM/HIGH); never presented as an objective recommendation | `Priority` field | CONFIRMED | PRD §13 |
| Platform / Source | Where the job was found (LinkedIn, Indeed, JobStreet, OnlineJobsPH, company site, referral, other) | application `source` field | CONFIRMED | PRD §1.2, §6, §7.3 |
| Modular Monolith | The accepted backend architectural style: single runtime, single database, modules owning their own logic | `apps/api/src/modules/` | CONFIRMED | architecture §4 |
| Feature Module | A vertical frontend slice owning its domain components, hooks, and UI | `apps/web/src/features/<name>/` | CONFIRMED | architecture §10; `DESIGN.md` §1 |
| Generic Primitive | A reusable non-domain UI component | `apps/web/src/components/ui/` | CONFIRMED | `DESIGN.md` §1 |
| Feature Module (backend) | A backend business-logic unit mounted onto routes | `apps/api/src/modules/` | CONFIRMED | architecture §4, §20 |

## Status Vocabulary (canonical enum values)

Use these exact values for the default status set. Statuses are configurable rather than hard-coded wherever practical.

`SAVED` · `APPLIED` · `APPLICATION_VIEWED` · `RECRUITER_CONTACTED` · `HR_INTERVIEW` · `TECHNICAL_INTERVIEW` · `FINAL_INTERVIEW` · `OFFER` · `ACCEPTED` · `REJECTED` · `WITHDRAWN` · `NO_RESPONSE`

- Status: CONFIRMED
- Evidence: PRD §12.

## Priority Vocabulary (canonical enum values)

`LOW` · `MEDIUM` · `HIGH`

- Status: CONFIRMED
- Evidence: PRD §13.

## Follow-Up State Vocabulary (canonical values)

`Pending` · `Due today` · `Overdue` · `Completed` · `Snoozed`

- Status: CONFIRMED
- Evidence: PRD §7.7 Follow-Up States.

## Interview Status Vocabulary (canonical values)

`Scheduled` · `Completed` · `Rescheduled` · `Cancelled` · `No-show`

- Status: CONFIRMED
- Evidence: PRD §7.11 Interview Status.

Note: `Completed` is a valid **FollowUp** state and a valid **Interview** status. It is **not** a valid **Application** status. Keep these three state machines separate.

## Technical Vocabulary

| Canonical Term | Definition | Status | Evidence |
|---|---|---|---|
| Server State | Remote data owned by the API; managed with TanStack Query | CONFIRMED | architecture §12.1 |
| Local UI State | Component-local view state; must not use TanStack Query | CONFIRMED | architecture §12.2; rule 3, §92 |
| Global Client State | Cross-component client state; Zustand only if truly needed, and never duplicating server state | CONFIRMED | architecture §12.3; rule 4, §92 |
| Ownership Boundary | The rule that every protected resource is scoped to the authenticated user | CONFIRMED | architecture §36; PRD §33 |
| Idempotency | The guarantee that a retried integration request does not duplicate effects | CONFIRMED | architecture §69 |
| Request ID | A correlation identifier attached to a request for logging/tracing | CONFIRMED | architecture §54 |
| Transaction Boundary | Where multi-entity writes must be atomic | CONFIRMED | architecture §24; rule 7, §92 |

## Observed Terms

| Observed Term | Where Found | Inferred Meaning | Status |
|---|---|---|---|
| Job Search Operating System | PRD §36 | The long-term vision for the product. Never the current product name | CONFIRMED (as vision) |
| Funnel / Application Funnel | PRD §2.2, §7.18 | The distribution of applications across statuses, shown in analytics | CONFIRMED |
| Quick Add | PRD §34 Risk 1 | Minimal-effort application entry, the mitigation for manual-entry fatigue | CONFIRMED |
| Marker | `DESIGN.md` line 3 | Design system name only | CONFIRMED |
| ATS | PRD §1.2 | Applicant Tracking System; always "personal ATS" | CONFIRMED |

## Terminology Conflicts

| Conflict | Evidence | Recommendation |
|---|---|---|
| `applicant` as a domain entity vs `Application` as the record | The repository name uses "applicant"; the PRD and architecture define the record as `Application` and never define an `Applicant` entity | Use `Application` for the record. Use "applicant" only when referring to the human job seeker in prose. Do not create an `Applicant` model. Resolved in favor of `Application`. |
| `Marker` as product name vs as design-system name | `DESIGN.md` line 3 vs PRD §1.1 | `Marker` is the design system name only. Never use it as the product name. |
| `index.css` vs `apps/web/src/index.css` | `DESIGN.md` §1 vs working-tree scan | Canonical token path is `apps/web/src/index.css` per DESIGN.md; root `index.css` is a pre-scaffold location. Recorded as CONFLICTING in Project Truth. |
| `Job` vs `Application` conflation risk | PRD §11; architecture §33 | `Job` is the role description; `Application` is the user's submission/track record. They are distinct and must never be merged. |
| Singular vs plural naming of modules | architecture §4 lists `Follow-ups Module`; structure uses `follow-ups` | Use the kebab-case folder form `follow-ups` in paths and the singular `FollowUp` for the entity. |
| `Status` vs `Stage` | PRD uses `Status`; `DESIGN.md` uses "Stage Ring" and "Stage" | The user-facing/domain field is `Status`. "Stage" is acceptable only inside the Stage Ring visual component name. Do not introduce a separate `Stage` enum. |

## Rules

- Do not rename core concepts casually.
- If a prompt introduces a synonym, decide whether it is canonical before using it broadly.
- If terminology changes, update this file and reconcile code/docs.
- If terminology changes, reconcile reports, tests, governance files, and generated context too.
- Never introduce an `Applicant` data model; the domain record is `Application`.
- Never use `Marker` as a product name.
- Never use the enum value "completed" for application status; the canonical terminal states are `ACCEPTED`, `REJECTED`, and `WITHDRAWN`. Use "completed" only for follow-up and interview state where the PRD defines it.