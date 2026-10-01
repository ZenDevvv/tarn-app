# Project Truth

Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Status: Accepted truth, ingested from existing project documentation, amended by owner decision, and synchronized against the scaffolded foundation.
Truth confidence: MEDIUM
Last truth ingestion: 2026-10-01
Last owner decision batch: 2026-10-01 (product name, MVP auth, package manager, MVP schema scope, token path)
Last implementation sync: 2026-10-01 (monorepo scaffold complete; verified by typecheck, 60 passing tests, and build)
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

- Implementation status: **FOUNDATION SCAFFOLDED. NO PRODUCT FEATURE IS IMPLEMENTED.**
- Status: CONFIRMED
- Evidence: working-tree scan plus executed verification on 2026-10-01.
- Last verified: 2026-10-01

What exists now:

- Monorepo root: `pnpm-workspace.yaml`, `package.json` (pnpm 9.15.4), `tsconfig.base.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `README.md`, `.github/workflows/ci.yml`
- `apps/web` — React + Vite + Tailwind v4 app; renders a shell with a dashboard placeholder that calls the API health endpoint
- `apps/api` — Express app; exposes `GET /api/v1/health` only
- `packages/database` — Prisma schema for the 10 MVP tables, centralized client, idempotent seed
- `packages/validation` — shared Zod schemas
- `packages/types` — shared domain types and the API response envelope
- Design tokens now at `apps/web/src/index.css` (moved from repository root; D-0005 executed)

What does **not** exist yet:

- No migrations have been committed. `prisma migrate diff` confirms the schema generates valid DDL, but no migration has been applied because the Docker daemon was not running during the scaffold.
- No auth. `requireAuth` deliberately returns 501 so protected routes cannot be reached without an owner.
- No applications, pipeline/Kanban, timeline, follow-ups, dashboard metrics, analytics, search, saved jobs, skills UI, or offers UI.
- No React component tests, no API tests against a real database, no Playwright.
- No deployment configuration (architecture §65 vendors remain undecided).

Verified on 2026-10-01 by execution, not assumption:

- `pnpm typecheck` — clean across all 5 workspace packages
- `pnpm test` — 60 tests passing (7 types, 17 schema scope, 23 validation, 13 API)
- `pnpm build` — both apps build; web bundle 251 kB (81 kB gzip)
- API boots only when env is valid, and fails closed with a specific message otherwise
- `GET /api/v1/health` → 200; `GET /api/v1/nope` → 404 with the error envelope

Consequence that agents must respect: the architecture and stack items below were `CONFIRMED_AS_PLAN` and are now **partly observed**. Anything not listed above remains a plan. Do not describe a feature as working because the scaffold builds.

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

All items below are labeled `CONFIRMED_AS_PLAN` (accepted plan). Items marked **[OBSERVED]** were verified by execution during the 2026-10-01 scaffold.

Architectural style (CONFIRMED, architecture §4) **[OBSERVED — directory layout matches]**:

- Backend is a **modular monolith**. Do not begin with microservices.
- Explicitly not needed initially: Kafka, RabbitMQ, Kubernetes, service mesh, multiple databases.
- Single API runtime and single database; modules own their business logic. `apps/api/src/app.ts` mounts per-module routers behind `requireAuth`; the `modules/` directory is created as modules are built.

Repository strategy (CONFIRMED, architecture §5) **[OBSERVED]**:

- **Monorepo** using `pnpm workspaces`.
- **`pnpm` is the confirmed package manager**, not a recommendation (owner decision 2026-10-01). The root carries `pnpm-workspace.yaml` and a pinned `packageManager` field in `package.json`; commit `pnpm-lock.yaml`. Do not introduce npm or yarn lockfiles.
- Note: pnpm is not yet a hard requirement of the repo — `corepack enable` fails on this machine without admin rights, so pnpm 9.15.4 was installed to the user-global prefix. Contributors need `pnpm` on PATH.

Planned repository structure (architecture §6) **[OBSERVED — created]**:

```text
apps/web          React frontend (app, components, features, hooks, layouts, lib, routes, types, utils)
apps/api          Express backend (config, lib, middleware, modules, routes, types, utils; app.ts, server.ts)
packages/database Prisma schema, migrations, seed, client
packages/validation Shared Zod schemas
packages/types    Shared TypeScript types
tests/e2e         Playwright end-to-end tests (planned)
.github/workflows GitHub Actions
```

`packages/config` from architecture §6 was **not** created. Shared config lives in `tsconfig.base.json` and each package's `tsconfig.json` extends it, which removes the need for a separate package. If a real need for a shared runtime config package appears, add it then (architecture §92 rule 11).

Frontend stack (CONFIRMED as plan, architecture §2.1) **[OBSERVED — react, react-router-dom, @tanstack/react-query, tailwindcss v4 installed]**:

TypeScript, React, Vite, Tailwind CSS v4, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, Recharts, React state; Zustand only if global client state becomes necessary. Not yet installed: shadcn/ui, React Hook Form, Recharts, Zustand — none are used yet.

Backend stack (CONFIRMED as plan, architecture §2.2) **[OBSERVED — express, zod, prisma installed]**:

Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL, JWT/session in httpOnly cookies, S3-compatible storage, Pino or Winston. Not yet installed: cookie signing beyond `cookie-parser`, structured logging, S3 storage, and real JWT verification.

Testing stack (CONFIRMED as plan, architecture §2.3) **[PARTLY OBSERVED]**:

Vitest (unit, validation, schema, API) is installed and running. Not yet installed: React Testing Library, Playwright.

Tooling (CONFIRMED as plan, architecture §2.4) **[OBSERVED — pnpm, TypeScript, Prettier, Docker, GitHub Actions]**:

pnpm, TypeScript, ESLint, Prettier, Husky, lint-staged, Docker, Docker Compose, GitHub Actions. Not yet installed: Husky, lint-staged. ESLint config files are not yet written — the root `lint` script exists but there is no flat config to run.

Database (CONFIRMED, architecture §3.1) **[OBSERVED — schema only]**:

**PostgreSQL**, chosen over MongoDB because the domain is heavily relational. Schema is written and validated; no migration has been applied yet.

Planned data model (architecture §34–§35, PRD §11) **[OBSERVED in `packages/database/prisma/schema.prisma`]**:

Implemented: `User`, `Company`, `Job`, `Skill`, `JobSkill`, `Application`, `SavedJob`, `TimelineEvent`, `FollowUp`, `Offer`.
Deferred and absent by design (D-0004): `Interview`, `Contact`, `Resume`, `CoverLetter`, `Notification`, `UserSkill`, `ApplicationSkill`.

`packages/database/prisma/schema.test.ts` enforces this: it fails if a deferred table appears, if an MVP table is renamed or dropped, if the canonical enums change, if a user-owned table loses its `userId`, or if the architecture §78 indexes are removed.

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

This project is a **scaffolded foundation with no product feature implemented**. Nothing here is production-ready, and the build passing is not a readiness signal.

Do not claim production readiness for:

- Any user-facing feature. The MVP Definition of Done (PRD §35) lists 14 criteria; none are met.
- Authentication, authorization, or data isolation. `requireAuth` currently returns 501 by design, so no protected route is reachable at all.
- Any performance, reliability, or accessibility conformance claim. The accessibility checks in `.wwg/wiki/principles/accessibility-principles.md` have not been run against a real screen.

Security posture observed in the scaffold:

- The API refuses to boot without `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, and `WEB_ORIGIN`, and names each missing variable (architecture §57). Verified by execution.
- Body size is capped at 1 MB and an oversized body returns 413 rather than 500.
- CORS echoes only configured origins and sets `Access-Control-Allow-Credentials`.
- Every request carries an `x-request-id` correlation header (architecture §54).
- Unhandled errors return a generic message; internals are logged, not returned (architecture §53).
- `notifications`, `interviews`, `contacts`, `resumes`, `cover_letters` tables do not exist, so there is no unaudited data surface for them.

Known scaffold-level risks:

- The development seed stores `sha256:<hex>` as `passwordHash`. This is a **placeholder, not a password hashing scheme**. No real login path exists, but the seed must be replaced with a proper hash (bcrypt or argon2) before any auth work ships. Do not treat the seeded hash as acceptable.
- The seed prints the test password to stdout. Acceptable for local development only; never run the seed against a shared environment.
- `apps/api` sets `trust proxy` to 1. That is correct behind a single known proxy and wrong behind multiple; revisit per environment (architecture §55).
- ESLint is installed but no config exists, so `pnpm lint` has nothing to enforce. This is a real gap in the CI story, not a cosmetic one.
- `package.json#prisma` is deprecated in Prisma 6 and warns on every database command. It still works; migrate to `prisma.config.ts` before upgrading to Prisma 7.

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

- RESOLVED — Token file location: `DESIGN.md` §1 and architecture §6 both named `apps/web/src/index.css` while the file sat at repository root.
  - Status: RESOLVED (executed 2026-10-01)
  - Evidence: the file was moved to `apps/web/src/index.css` as the first step of the scaffold; the root copy was deleted, so there is no duplicate token source. `DESIGN.md` and architecture §6 now match the working tree.
  - See D-0005.
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
- NEEDS_CONFIRMATION — No React component tests, no Playwright E2E, no database-backed API tests, and no ESLint config exist yet. Vitest unit, validation, schema-scope and API tests do exist and pass.
  - Status: NEEDS_CONFIRMATION
  - Evidence: architecture §62–§63; `.wwg/governance/test-enforcement.md`; working-tree scan 2026-10-01.
- NEEDS_CONFIRMATION — Deployment target is recommended, not decided: frontend → Vercel, API → Railway/Render, PostgreSQL → Neon/Supabase, object storage → Cloudflare R2 (architecture §65). No deployment configuration exists.
  - Status: NEEDS_CONFIRMATION
  - Evidence: architecture §65–§66; working-tree scan.
- STALE — The design token file was moved from repository root to `apps/web/src/index.css` on 2026-10-01, so `DESIGN.md` §1 and architecture §6 now match the working tree. Any agent assuming a root `index.css` is out of date.
  - Status: STALE
  - Evidence: working-tree scan; D-0005.

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
  - Why it matters: the directory name no longer matches the product name, which is a recurring source of confusion and a risk of the retired name being resurrected by tooling. The scaffold has now made this more visible: the root `package.json` is named `tarn` while the directory is not.
  - Evidence / uncertainty: directory is `applicant-tracking-system`; no remote or CI target exists yet, so renaming is still cheap. The cost grows once a git remote or branch protection is configured.
- Question: What password hashing scheme replaces the seed's `sha256:` placeholder?
  - Why it matters: the development seed stores `sha256:<hex>` as `passwordHash`. That is not a password hashing scheme and must not survive into real auth work. See `.wwg/governance/security-review.md`.
  - Evidence / uncertainty: architecture §55 requires password hashing but names no algorithm.
- Question: Should ESLint and Husky be wired up now, or after the first feature?
  - Why it matters: `pnpm lint` currently enforces nothing because no ESLint config exists, and CI runs `typecheck`, `test`, and `build` but no lint gate. The gap is real but not blocking until there is code worth linting.
  - Evidence / uncertainty: architecture §2.4 lists both as recommended tooling.

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