# Project Truth

Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Status: Accepted truth, ingested from existing project documentation.
Truth confidence: MEDIUM
Last truth ingestion: 2026-10-01
Last adoption audit: 2026-10-01

This file was populated by ingesting the existing project documents into governed truth.

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

- Product name: Job Application Tracker
  - Status: CONFIRMED_AS_WORKING_TITLE
  - Evidence: `job-application-tracker-brd-prd.md` §1.1 — "**Job Application Tracker** … > Working title. The final product name can be decided separately."
- Final product name: NEEDS_CONFIRMATION
  - Status: NEEDS_CONFIRMATION
  - Evidence: PRD §1.1 explicitly defers the naming decision.
- Design system name: Marker
  - Status: CONFIRMED
  - Evidence: `DESIGN.md` line 3 — "Design rules for **Job Application Tracker** (design system name: **Marker**)."
- Repository/directory name: `applicant-tracking-system`
  - Status: CONFIRMED
  - Evidence: folder name and git repository root.
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
- Authentication model: single-role authenticated user; no role-based permission tiers are specified.
  - Status: INFERRED
  - Evidence: PRD §7.1, §10.2, architecture §39.

## Canonical Scope

Currently includes — Phase 1 MVP (CONFIRMED, PRD §6):

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
- Authentication and account management (PRD §7.1)

Deferred — must not be built into MVP (CONFIRMED):

- Phase 2 — Job Search Management: interview tracker, recruiter/contact tracker, resume versions, cover-letter tracking, saved jobs, follow-up notifications, expanded analytics.
- Phase 3 — Intelligence: AI job-description analyzer, skill extraction, skill matching, interview preparation, automatic JD extraction, application insights.
- Phase 4 — Automation & Integrations: Gmail integration, calendar integration, Telegram/Discord notifications, browser extension, officially supported job-platform integrations, automated application-confirmation detection.
  - Evidence: PRD §6, §8, §9; architecture §86–§89.

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

- CONFLICTING — Token file location: `DESIGN.md` §1 states tokens live in `apps/web/src/index.css`, but the file actually present is `index.css` at the repository root and `apps/` does not exist.
  - Status: CONFLICTING
  - Evidence: `DESIGN.md` §1 vs working-tree scan.
  - Resolution: treat the DESIGN.md path as the *intended* post-scaffold location and root `index.css` as the current pre-scaffold location. This conflict should close when the monorepo scaffold is created.
- STALE — Root `README.md` does not exist. The front door of the project is undocumented.
  - Status: STALE
  - Evidence: working-tree scan; `.wwg/reports/wwg-maintenance-review.md`.
- STALE — No `CHANGELOG.md`; no release memory exists yet. Acceptable at documentation stage.
  - Status: STALE
  - Evidence: working-tree scan.
- CONFLICTING — Design-system name `Marker` (DESIGN.md) vs product positioning terms `Job Application Tracker` and `Applicant Tracking System` (PRD). Three names coexist; `Marker` is a component-system name, not a product name.
  - Status: CONFLICTING
  - Evidence: `DESIGN.md` line 3 vs PRD §1.1/§1.2.
  - Resolution: `Marker` is canonical **only** as the design-system name. Never use it as a product name.
- NEEDS_CONFIRMATION — No tests, CI, lint, type-check, or package manifests exist. The testing strategy in architecture §62 and CI plan in §63 are specified but not yet implemented.
  - Status: NEEDS_CONFIRMATION
  - Evidence: working-tree scan; architecture §62–§63.
- NEEDS_CONFIRMATION — Deployment target is recommended, not decided: frontend → Vercel, API → Railway/Render, PostgreSQL → Neon/Supabase, object storage → Cloudflare R2 (architecture §65). No deployment configuration exists.
  - Status: NEEDS_CONFIRMATION
  - Evidence: architecture §65–§66; working-tree scan.

## Open Questions

- Question: What is the final product name?
  - Why it matters: naming affects terminology, package names, README, and user-facing copy; the PRD explicitly defers this.
  - Evidence / uncertainty: PRD §1.1 marks it a working title.
- Question: Does the MVP ship with authentication, or is a single-user/no-auth mode allowed first?
  - Why it matters: authentication and authorization are approval-sensitive and are item 1 of the MVP Definition of Done.
  - Evidence / uncertainty: PRD §7.1 and §35 both assume accounts exist, but §2.4 and the personal-tool framing leave a single-user option open. Needs owner decision.
- Question: Which deployment vendors are actually chosen?
  - Why it matters: infrastructure cost and hosting boundaries depend on this; also relevant to file storage and secrets handling.
  - Evidence / uncertainty: architecture §65 lists recommendations only; no `vercel.json`, `railway.json`, or equivalent exists.
- Question: Is `pnpm` confirmed as the package manager?
  - Why it matters: it determines lockfile, CI setup, and contributor onboarding.
  - Evidence / uncertainty: architecture §5 recommends `pnpm workspaces`; no `pnpm-workspace.yaml` or `package.json` exists to confirm.
- Question: Should root `index.css` move to `apps/web/src/index.css` during scaffold?
  - Why it matters: DESIGN.md §1 makes the token path a hard rule; leaving it at root would create permanent drift.
  - Evidence / uncertainty: CONFLICTING item recorded above.
- Question: What is the confirmed MVP testing/verification gate?
  - Why it matters: WWG health and release readiness depend on a known validation path; currently no test infrastructure exists.
  - Evidence / uncertainty: architecture §62–§63 specify a strategy that is not yet implemented.
- Question: Are `SavedJob`, `Skill`, `Notification`, and `Offer` in or out of the MVP database scope?
  - Why it matters: architecture §35 "MVP Database Tables" and PRD §6 disagree in emphasis; schema scope drives the first migration.
  - Evidence / uncertainty: PRD §6 Phase 1 list vs architecture §35; needs owner confirmation.

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

Evidence rules for this project:

- Cite `file + section` for every accepted claim.
- Distinguish `CONFIRMED_AS_PLAN` (accepted plan) from `CONFIRMED` (observed implementation). Never label planned work as implemented.
- Inferred truth must be labeled `INFERRED` and must not be promoted to confirmed without owner acceptance.