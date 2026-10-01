# Project Truth

Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Status: Accepted truth, ingested from existing project documentation, amended by owner decision.
Truth confidence: MEDIUM
Last truth ingestion: 2026-10-01
Last owner decision batch: 2026-10-01 (product name, MVP auth, package manager, MVP schema scope, token path)
Last adoption audit: 2026-10-01

This file was populated by ingesting the existing project documents into governed truth, then amended by explicit owner decisions recorded in PRD §38 and `.wwg/wiki/decisions/`.

Evidence sources used for this ingestion:

- `job-application-tracker-brd-prd.md` (PRD/BRD, 1377 lines)
- `job-application-tracker-project-architecture.md` (2273 lines)
- `DESIGN.md` (design rules, 295 lines)
- `design-system.html`, `index.css`
- Repository scan of the working tree

Items marked `INFERRED`, `NEEDS_CONFIRMATION`, `CONFLICTING`, or `STALE` should be reviewed before major future work.

If this file conflicts with lower-priority reports, generated notes, task files, or stale documentation, this file wins.

Project Truth must not be silently overwritten. Requirement evolution is allowed when documented and accepted.

## Source-of-Truth Order

This ordering is itself accepted truth and governs every conflict below.

1. `job-application-tracker-brd-prd.md` — what the product does
2. `job-application-tracker-project-architecture.md` — where code lives, which libraries
3. `DESIGN.md` — how it looks and reads
4. `index.css` — the actual token values

- Status: CONFIRMED
- Evidence: `DESIGN.md` "Source-of-truth order when documents disagree"; `job-application-tracker-brd-prd.md` §38 "This document should be treated as the initial product source of truth."

## Implementation Reality

- Implementation status: NOT YET IMPLEMENTED. The repository currently contains documentation and design assets only.
- Status: CONFIRMED
- Evidence: working-tree scan — root contains `.git/`, `.wwg/`, `AGENTS.md`, `DESIGN.md`, `design-system.html`, `index.css`, `job-application-tracker-brd-prd.md`, `job-application-tracker-project-architecture.md`. No `apps/`, no `packages/`, no `package.json`, no `pnpm-workspace.yaml`, no `docker-compose.yml`.

Consequence that agents must respect: every architecture, stack, data-model, auth, and deployment item in this file is labeled `CONFIRMED_AS_PLAN` (accepted plan), not observed implementation. Do not describe the stack as "running", "implemented", or "shipped". Do not claim any feature exists in code.

## Product Identity

- Product name: Tarn
  - Status: CONFIRMED
  - Evidence: owner decision 2026-10-01; recorded in `job-application-tracker-brd-prd.md` §1.1 and §38 Decision Log.
  - Note: always capitalized `Tarn`. The former name "Job Application Tracker" is **retired** — do not use it as the product name in any new file, component, package, or user-facing string. Filenames such as `job-application-tracker-brd-prd.md` are historical and are not a naming rule.
- Retired product name: Job Application Tracker
  - Status: RETIRED
  - Evidence: was a working title in PRD §1.1; superseded 2026-10-01.
  - Caution: `Tarn` is also an ordinary English noun (a patina on metal) and verb. In any sentence where it could be read as the common word, prefer a noun phrase ("the Tarn app", "Tarn's dashboard") to keep the reading unambiguous.
- Design system name: Marker
  - Status: CONFIRMED
  - Evidence: `DESIGN.md` line 3 — "Design rules for **Tarn** (design system name: **Marker**)"; 46 references in `design-system.html`, 18 in `index.css`.
  - Rule: **Marker is never the product name. Tarn is never a design-system name.** These are distinct namespaces.
- Repository/directory name: `applicant-tracking-system`
  - Status: CONFIRMED_STALE
  - Evidence: folder name and git repository root.
  - Note: the directory name does not match the product name. Renaming the directory is a deferred decision, not a blocker. Never infer the product name from the folder name — see the retirement note above.
- Long-term positioning: personal **Applicant Tracking System (ATS)** focused on the job seeker; long-term vision is a personal **Job Search Operating System**.
  - Status: CONFIRMED
  - Evidence: PRD §1.2 and §36.

## Product Category

- Category: personal productivity / job-search SaaS web application (B2C, single-tenant-per-user)
  - Status: INFERRED
  - Evidence: PRD §1.2 "personal web application"; §2.2 business opportunity; §3.1 single persona.

## One-Line Description

- Description: A personal web application that lets an individual job seeker organize, monitor, and manage their entire job-search process — applications, job descriptions, companies, recruiters, interviews, resumes, follow-ups, and offers — in one place instead of scattered spreadsheets, bookmarks, notes, emails, and calendars.
  - Status: CONFIRMED
  - Evidence: PRD §1.2.

## Primary Users and Roles

- Role: Active Job Seeker (primary, sole MVP persona)
  - Status: CONFIRMED
  - Evidence: PRD §3.1 "Primary Persona — Active Job Seeker".
  - Characteristics: applies to multiple positions per week; uses LinkedIn, Indeed, JobStreet, OnlineJobsPH, company websites, referrals; holds multiple resume versions; needs to remember interview schedules; communicates with recruiters; wants to follow up professionally; wants historical records; may apply to multiple roles at one company.
- Role: Recruiter / Hiring Contact — recorded as tracked *data*, not a system user.
  - Status: CONFIRMED
  - Evidence: PRD §7.10 "Recruiter / Contact Management".
- Admin, moderator, employer, and analytics-operator roles: not in scope.
  - Status: CONFIRMED
  - Evidence: PRD §3 defines one persona; §32/§33 describe strict per-user ownership with no privileged roles.
- Authentication model: authenticated single-role user; no role-based permission tiers are specified. **Authentication ships in MVP.**
  - Status: CONFIRMED
  - Evidence: PRD §7.1 (FR-AUTH-001…006), §10.2, §35 item 1, §37 matrix ("Authentication ✓ MVP"); architecture §37–§39 and §35 (`users` in the first migration).
  - Decision note: a proposal on 2026-10-01 to ship MVP **without** authentication was raised and then **rejected by the owner**. Authentication, server-side authorization, and the ownership boundary are MVP requirements, not deferrals. See `.wwg/wiki/decisions/D-0002-mvp-authentication.md`.

## Canonical Scope

Currently includes — Phase 1 MVP (CONFIRMED, PRD §6 and §37 matrix as amended 2026-10-01):

- Authentication and account management (PRD §7.1) — **confirmed MVP scope**
- Dashboard
- Applications (create, edit, manage)
- Application details view
- Status pipeline / Kanban
- Application timeline
- Job information and job-description storage
- Company information
- Platform / source tracking
- Salary information
- Application date, follow-up date, notes
- Search and filtering
- Basic analytics
- **Saved jobs** — promoted into MVP on 2026-10-01
- **Offers** — promoted into MVP on 2026-10-01
- **Skills (capture only)** — the Skill entity ships in MVP; AI skill extraction and matching remain Phase 3

Deferred — must not be built into MVP (CONFIRMED, PRD §6 and §37):

- Phase 2 — Job Search Management: interview tracker, recruiter/contact tracker, resume versions, cover-letter tracking, follow-up notifications, in-app notification records, expanded analytics.
- Phase 3 — Intelligence: AI job-description analyzer, skill extraction, skill matching, interview preparation, automatic JD extraction, application insights.
- Phase 4 — Automation & Integrations: Gmail integration, calendar integration, Telegram/Discord notifications, browser extension, officially supported job-platform integrations, automated application-confirmation detection.
  - Evidence: PRD §6, §8, §9; architecture §86–§89.

**Notification boundary (explicit, 2026-10-01):** `Notification` is deferred to Phase 2. MVP must contain no notification table, no delivery channel, and no notification UI. `notifications` appears in the "later phases" list in architecture §35. Follow-up *dates* are MVP; follow-up *notifications* are not.

**Skill scope split:** the Skill entity and the `job_skills` join ship in MVP so skills can be captured and stored against jobs. AI-driven extraction and matching stay Phase 3 (PRD §8.2). Do not build an AI call into the MVP skill path.

Explicit non-goals (CONFIRMED, PRD §2.4):

- No automatic submission of applications without explicit user action.
- No automated employment decisions for the user.
- No guarantee of job compatibility or hiring success.
- No platform scraping that violates terms of service.
- Not a replacement for official recruitment systems.
- No automatic recruiter communication without user approval.
- AI output is assistance, never an authoritative hiring or career decision.

## Product Principles

Six product principles are accepted truth (PRD §4). They are also registered as WWG Principle Briefs under `.wwg/wiki/principles/`.

- Simple First — adding an application must require minimal effort.
- Next Action Driven — every active application must make the user's next action clear.
- Historical Context — important changes are preserved through an application timeline.
- User Control — automation and AI assist the user rather than make irreversible decisions.
- Searchable — all application information is easy to find.
- Scalable — the initial architecture supports future integrations without a full rewrite.
  - Status: CONFIRMED
  - Evidence: PRD §4.1–§4.6.

## Core Application Lifecycle

- Status: CONFIRMED
- Evidence: PRD §5.
- Happy path: `SAVED → APPLIED → APPLICATION_VIEWED → RECRUITER_CONTACTED → HR_INTERVIEW → TECHNICAL_INTERVIEW → FINAL_INTERVIEW → OFFER → ACCEPTED`
- Alternative exits: any active stage → `REJECTED`; any active stage → `WITHDRAWN`; `APPLIED → NO_RESPONSE`.
- The system must allow users to move applications between statuses without forcing a single rigid workflow.

## Canonical Status, Priority, and Tag Sets

- Default application statuses (configurable, not hard-coded where practical): `SAVED`, `APPLIED`, `APPLICATION_VIEWED`, `RECRUITER_CONTACTED`, `HR_INTERVIEW`, `TECHNICAL_INTERVIEW`, `FINAL_INTERVIEW`, `OFFER`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`, `NO_RESPONSE`.
  - Status: CONFIRMED
  - Evidence: PRD §12.
- Priority levels: `LOW`, `MEDIUM`, `HIGH`. Priority is user-defined and must not be presented as an objective recommendation.
  - Status: CONFIRMED
  - Evidence: PRD §13.
- Custom user tags are supported (examples: React, TypeScript, Remote, Hybrid, Frontend, Full Stack).
  - Status: CONFIRMED
  - Evidence: PRD §14.

## Canonical Terminology

See `.wwg/wiki/terminology.md` for the full canonical term table.

Critical terms: `Application`, `Job`, `Company`, `Contact`, `Interview`, `TimelineEvent`, `FollowUp`, `Resume`, `CoverLetter`, `Offer`, `SavedJob`, `Skill`, `Tag`, `Status`, `Pipeline`, `Stage Ring`, `Next Action`.

Note: `Job` and `Application` are distinct entities and must never be conflated (PRD §11; architecture §33).

## Architecture Truth

All items below are labeled `CONFIRMED_AS_PLAN` (accepted plan), not observed code. See "Implementation Reality".

Architectural style (CONFIRMED, architecture §4):

- Backend is a **modular monolith**. Do not begin with microservices.
- Explicitly not needed initially: Kafka, RabbitMQ, Kubernetes, service mesh, multiple databases.
- Single API runtime and single database; modules own their business logic.

Repository strategy (CONFIRMED, architecture §5):

- **Monorepo** using `pnpm workspaces`.
- **`pnpm` is the confirmed package manager**, not a recommendation (owner decision 2026-10-01). The root must carry `pnpm-workspace.yaml` and a pinned `packageManager` field in `package.json`; commit `pnpm-lock.yaml`. Do not introduce npm or yarn lockfiles.

Planned repository structure (CONFIRMED_AS_PLAN, architecture §6):

```text
apps/web          React frontend (app, components, features, hooks, layouts, lib, routes, types, utils)
apps/api          Express backend (config, lib, middleware, modules, routes, types, utils; app.ts, server.ts)
packages/database Prisma schema, migrations, seed, client
packages/validation Shared Zod schemas
packages/types    Shared TypeScript types
packages/config   Shared configuration
tests/e2e         Playwright end-to-end tests
.github/workflows GitHub Actions
```

Frontend stack (CONFIRMED_AS_PLAN, architecture §2.1): TypeScript, React, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, Recharts, React state; Zustand only if global client state becomes necessary.

Backend stack (CONFIRMED_AS_PLAN, architecture §2.2): Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL, JWT/session in httpOnly cookies, S3-compatible storage, Pino or Winston.

Testing stack (CONFIRMED_AS_PLAN, architecture §2.3): Vitest (unit), React Testing Library (component), Vitest/Supertest (API), Playwright (E2E).

Tooling (CONFIRMED_AS_PLAN, architecture §2.4): pnpm, TypeScript, ESLint, Prettier, Husky, lint-staged, Docker, Docker Compose, GitHub Actions.

Database (CONFIRMED, architecture §3.1): **PostgreSQL**, chosen over MongoDB because the domain is heavily relational and needs foreign keys, transactions, unique constraints, joins, aggregations, and strong indexing.

Planned data model (CONFIRMED_AS_PLAN, PRD §11; architecture §34–§35): User, Application, Company, Job, SavedJob, Contact, Interview, TimelineEvent, FollowUp, Resume, CoverLetter, Skill, JobSkill, Offer, Tag, ApplicationTag, Notification.

Architecture rules — hard constraints agents must follow (CONFIRMED, architecture §92):

1. Do not place Prisma calls directly in React.
2. Do not place core business logic in Express route files.
3. Do not use TanStack Query for local UI state.
4. Do not duplicate server state in Zustand.
5. Validate all external input server-side.
6. Enforce user ownership on every protected resource.
7. Use database transactions for multi-entity operations.
8. Keep generic UI components separate from domain components.
9. Keep AI optional and isolated from core workflows.
10. Keep external automation outside the primary request path.
11. Do not introduce infrastructure until a real requirement exists.
12. Prefer simple, testable modules over abstraction-heavy architecture.

Frontend file-placement rules (CONFIRMED, DESIGN.md §1):

- Tokens live in `apps/web/src/index.css`. Never hard-code a hex value in a component.
- Generic primitives go in `apps/web/src/components/ui/`.
- Domain-aware components go in their feature folder, e.g. `features/applications/components/`.
- Status display lives in `features/applications/components/application-status-badge.tsx` (exports `StageRing`, `ApplicationStatusBadge`, `STATUS_CONFIG`).
- Fonts: `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/instrument-sans`. No other families.
- Icons: `lucide-react` only — 16px in controls and nav, 20px in the mobile tab bar, stroke 1.5, `currentColor`.

## Safety and Production Boundaries

This project is currently a **documentation-stage, pre-implementation** project. Nothing is implemented, so nothing is production-ready.

Do not claim production readiness for (CONFIRMED by absence of code + explicit PRD §35 DoD):

- Any user-facing feature. The MVP Definition of Done (PRD §35) lists 14 criteria, none of which are met because no application exists.
- Any claim that authentication, authorization, or data isolation works. These are specified (PRD §10.2, §32, §33) but unimplemented.
- Any claim of performance, reliability, or accessibility conformance. Specified in PRD §10; unimplemented.

Security requirements that are accepted truth and will govern implementation (CONFIRMED, PRD §10.2/§32/§33; architecture §55):

- Secure authenticated routes; secure session/token handling in httpOnly cookies.
- Server-side authorization checks on every protected resource; server-side ownership validation.
- A user must never be able to reach another user's application data by manipulating IDs or API requests.
- Validate all external input server-side; protect uploaded files; validate upload type and request size.
- Password hashing, CSRF protection where applicable, rate limiting, CORS configuration, HTTPS in production.
- Audit logging for sensitive account actions; environment variable validation at startup; no secrets in frontend bundles (only `VITE_`-prefixed public config may reach the client).

Data ownership (CONFIRMED, PRD §33; architecture §36): every user's applications, companies, contacts, interviews, files, notes, analytics, and saved jobs must be bound to the authenticated user, and all server-side queries must enforce that ownership boundary.

Privacy classification (CONFIRMED, PRD §10.3): resumes, contact information, recruiter information, salary information, interview notes, and employment information are sensitive personal data and must be treated as private user data.

Mock/demo-only areas:

- `design-system.html` is a static design reference page, not an application surface.
- `index.css` at the repository root is the current location of design tokens.
  - Status: CONFIRMED
  - Evidence: working-tree scan.

## Current Product Direction

Current direction (CONFIRMED, PRD §36, architecture §90):

- Phase 1 MVP first, deliberately narrow: Applications, Status, Timeline, Follow-ups, Job Details, Dashboard (PRD §34 Risk 2 mitigation).
- Feature overload is a named product risk; quiet, plain, personal design over enterprise chrome.
- Recommended build order (architecture §90): repository foundation → database → authentication → applications → timeline → follow-ups → dashboard → Kanban → testing/polish.

Avoid drifting into (CONFIRMED):

- Automated application submission without explicit user action.
- Unauthorized scraping or platform ToS violations; prefer official APIs, user-triggered workflows, email parsing, or browser-extension functionality where permitted (PRD §34 Risk 5).
- Letting AI output become authoritative; AI-generated information must be editable and clearly presented as generated assistance (PRD §34 Risk 3).
- Microservices, Kubernetes, or message brokers before a real requirement exists (architecture §4, §92).
- Enterprise UI chrome, gradients, confetti, or "objective" AI recommendations (DESIGN.md §2, §14).

Named product risks and mitigations (CONFIRMED, PRD §34): too much manual entry, feature overload, AI accuracy, integration reliability, job-platform restrictions.

## Known Conflicts and Drift Risks

- RESOLVED_PENDING_SCAFFOLD — Token file location: `DESIGN.md` §1 and architecture §6 both state tokens live in `apps/web/src/index.css`, but the file actually present is `index.css` at the repository root and `apps/` does not exist.
  - Status: RESOLVED_PENDING_SCAFFOLD (was CONFLICTING)
  - Evidence: `DESIGN.md` §1 and new note; architecture §6 and new note; working-tree scan.
  - Decision: the move to `apps/web/src/index.css` is **confirmed** and happens as the first step of the monorepo scaffold (owner decision 2026-10-01). Do not create a phantom `apps/web` tree before the scaffold exists. Until the move lands, root `index.css` is the working token source. This conflict closes automatically once the scaffold is created — re-verify the path at that point.
- STALE — Root `README.md` does not exist. The front door of the project is undocumented.
  - Status: STALE
  - Evidence: working-tree scan; `.wwg/reports/wwg-maintenance-review.md`.
- STALE — No `CHANGELOG.md`; no release memory exists yet. Acceptable at documentation stage.
  - Status: STALE
  - Evidence: working-tree scan.
- RESOLVED — Design-system name `Marker` (DESIGN.md) vs product name `Tarn` (PRD §1.1). Previously three names coexisted; the product name is now Tarn and `Marker` is scoped to the design system only.
  - Status: RESOLVED
  - Evidence: `DESIGN.md` line 3 and the new Naming note; PRD §1.1.
  - Resolution: `Tarn` is the product name. `Marker` is the design-system name only. Never use `Marker` as a product name. See `.wwg/wiki/terminology.md`.
- RETIRED — "Job Application Tracker" as a product name.
  - Status: RETIRED
  - Evidence: superseded by Tarn on 2026-10-01 (PRD §1.1, §38).
  - Note: the two canonical source files keep their historical `job-application-tracker-*` filenames. Do not treat those filenames as a naming rule, and do not propagate the retired name into new files or user-facing strings.
- NEEDS_CONFIRMATION — No tests, CI, lint, type-check, or package manifests exist. The testing strategy in architecture §62 and CI plan in §63 are specified but not yet implemented.
  - Status: NEEDS_CONFIRMATION
  - Evidence: working-tree scan; architecture §62–§63.
- NEEDS_CONFIRMATION — Deployment target is recommended, not decided: frontend → Vercel, API → Railway/Render, PostgreSQL → Neon/Supabase, object storage → Cloudflare R2 (architecture §65). No deployment configuration exists.
  - Status: NEEDS_CONFIRMATION
  - Evidence: architecture §65–§66; working-tree scan.

## Open Questions

All seven questions from the initial ingestion have been answered by the owner on 2026-10-01. They are retained below as decision history with pointers to the decision records.

Resolved on 2026-10-01:

1. Final product name → **Tarn**. PRD §1.1 and §38 updated. See `.wwg/wiki/decisions/D-0001-product-name-tarn.md`.
2. MVP authentication → **auth is in the MVP**; the no-auth proposal was rejected. PRD §7.1/§35/§37 unchanged and now authoritative. See `.wwg/wiki/decisions/D-0002-mvp-authentication.md`.
3. Package manager → **pnpm confirmed**. Architecture §5 updated. See `.wwg/wiki/decisions/D-0003-package-manager-pnpm.md`.
4. MVP schema scope → **`saved_jobs`, `skills`, `job_skills`, `offers` in MVP; `notifications` deferred to Phase 2.** PRD §6/§37 and architecture §35 updated. See `.wwg/wiki/decisions/D-0004-mvp-schema-scope.md`.
5. Token path conflict → **move `index.css` to `apps/web/src/index.css` at scaffold time**, not now. See `.wwg/wiki/decisions/D-0005-token-file-location.md`.

Still open:

- Question: Which deployment vendors are actually chosen?
  - Why it matters: infrastructure cost and hosting boundaries depend on this; also relevant to file storage and secrets handling.
  - Evidence / uncertainty: architecture §65 lists recommendations only; no `vercel.json`, `railway.json`, or equivalent exists.
- Question: Should the repository directory be renamed from `applicant-tracking-system` to `tarn`?
  - Why it matters: the directory name no longer matches the product name, which is a recurring source of confusion and a risk of the retired name being resurrected by tooling. Renaming also breaks local git remotes and CI config.
  - Evidence / uncertainty: directory is currently `applicant-tracking-system`; nothing depends on the name yet since no remote or CI exists. Low risk now, higher cost later.
- Question: What is the confirmed MVP testing/verification gate?
  - Why it matters: WWG health and release readiness depend on a known validation path; currently no test infrastructure exists.
  - Evidence / uncertainty: architecture §62–§63 specify a strategy that is not yet implemented. See `.wwg/governance/test-enforcement.md`.

## Update Rules

Update this file when:

- product category changes
- user roles change
- canonical terminology changes
- architecture boundaries change
- safety boundaries change
- production-readiness boundaries change
- major product decisions become accepted truth
- high-risk behavior, production claims, approval requirements, or verification expectations change
- **implementation status changes** — in particular, promote this file away from "NOT YET IMPLEMENTED" the moment application source code lands, and convert planned architecture into observed architecture with evidence
- the owner changes a product decision recorded in `.wwg/wiki/decisions/` — amend the PRD Decision Log in the same change so the two never disagree

Evidence rules for this project:

- Cite `file + section` for every accepted claim.
- Distinguish `CONFIRMED_AS_PLAN` (accepted plan) from `CONFIRMED` (observed implementation). Never label planned work as implemented.
- Inferred truth must be labeled `INFERRED` and must not be promoted to confirmed without owner acceptance.