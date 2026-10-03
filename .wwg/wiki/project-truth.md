# Project Truth

Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Status: Accepted truth, ingested from existing project documentation, amended by owner decision, and synchronized against the scaffolded foundation.
Truth confidence: MEDIUM
Last truth ingestion: 2026-10-01
Last owner decision batch: 2026-10-01 (product name, MVP auth, package manager, MVP schema scope, token path); 2026-10-02 (repository directory rename executed; `e2e` browser tests stay advisory rather than merge-blocking)
Last implementation sync: 2026-10-03 (authentication module implemented; scaffold, data layer, and delivery pipeline unchanged)
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

- Implementation status: **AUTHENTICATION AND APPLICATIONS IMPLEMENTED. NO OTHER PRODUCT FEATURE IS BUILT.**
- Status: CONFIRMED
- Evidence: working-tree scan plus executed verification on 2026-10-04.
- Last verified: 2026-10-04

What exists now:

- Monorepo root: `pnpm-workspace.yaml`, `package.json` (pnpm 9.15.4), `tsconfig.base.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `README.md`, `.github/workflows/ci.yml`, `eslint.config.mjs`, `.prettierrc.json`, `.editorconfig`, `playwright.config.ts`
- `apps/web` — React + Vite + Tailwind v4 app; sign-in and registration pages, a route-guarded dashboard, a sign-out control, and transparent session refresh. **No applications UI yet.**
- `apps/api` — Express app; `GET /api/v1/health`, the auth module (`register`, `login`, `logout`, `refresh`, `me`), and the applications module (list, create, read, update, delete, status change, timeline) behind `requireAuth`
- `packages/auth` — password hashing (scrypt) **and JWT signing/verification**. **Deviation from architecture §6**, recorded below
- `packages/database` — Prisma schema, centralized client, **committed migration**, idempotent seed, schema-scope tests, database integration tests
- `packages/validation` — shared Zod schemas
- `packages/types` — shared domain types and the API response envelope
- Design tokens at `apps/web/src/index.css` (D-0005 executed)

Database state **[OBSERVED]**:

- First migration `20261001095704_init_mvp_schema` is committed at `packages/database/prisma/migrations/` and applied to local Postgres 16 via docker compose.
- Verified table set: `users`, `companies`, `jobs`, `skills`, `job_skills`, `applications`, `saved_jobs`, `timeline_events`, `follow_ups`, `offers` — exactly the 10 MVP tables.
- Verified absent: `notifications`, `interviews`, `contacts`, `resumes`, `cover_letters` (0 rows in `information_schema.tables`), confirming D-0004.
- Seed verified: 1 user, 2 companies, 2 jobs, 2 skills, 2 job_skills, 3 applications, 2 timeline events, 2 follow-ups, 1 saved job, 1 offer. Re-running the seed is idempotent — counts unchanged.
- Seeded password verified to be `scrypt$…`, not the old `sha256:` placeholder.

What does **not** exist yet:

- No pipeline/Kanban board, no dashboard metrics, no analytics, no search or filtering, no saved jobs UI, no skills UI, no offers UI, no follow-ups.
- **No web UI for applications.** The module is API-only so far; the dashboard is still the auth-guarded placeholder.
- **No account settings and no password recovery.** FR-AUTH-005 (recovery) and FR-AUTH-006 (account settings) are not implemented; both are deliberate deferrals — see "Deferred by owner decision" below.
- No deployment configuration (architecture §65 vendors remain undecided).

## Applications — IMPLEMENTED 2026-10-04

- Status: CONFIRMED by execution. PRD §35 DoD item **2** ("a user can create, edit, and manage applications") is now **met at the API level**. Item **12** ("data is isolated between users") is now **met for applications**, which is the first user-owned feature table to exist and be exercised.
- Routes (architecture §26, §38): `GET`/`POST /applications`, `GET`/`PATCH`/`DELETE /applications/:id`, `PATCH /applications/:id/status`, `GET /applications/:id/timeline`. The last is an addition — see the note below.
- **`requireAuth` is applied to the whole router**, not per route, so a route added later cannot land unprotected.

**Owner decision, 2026-10-04 — company and job are supplied inline, not by id.** `createApplicationSchema` was changed from taking an existing `jobId` to taking `company` and `job` objects. Architecture §23 describes one `POST /applications` creating Company, Job, Application and TimelineEvent, and §24 requires them to succeed or fail together; the old contract contradicted both and would have forced three requests to log one application.

The company is **found-or-created by name, scoped to the owner**. There is no way to pass a `companyId`, so a user cannot file an application against another user's company by id.

**Transaction.** Company, job, application and the first timeline event are created inside one `prisma.$transaction`. Without it, a mid-flight failure leaves a company or a job the user never asked for and cannot see.

**The timeline is written on create and on every status change** (PRD §4.3, §7.6). A status change to the status it already holds writes nothing — "changed to APPLIED" when it was already APPLIED would make the history lie.

**Deliberately not implemented, and why:**

- **`status` is not editable through `PATCH /applications/:id`.** It is changeable only through `PATCH /applications/:id/status`, which writes the status and its timeline entry in one transaction. Accepting it on both routes would give a client a second path that moves an application and records nothing, breaking the guarantee PRD §4.3 rests on. A `PATCH /:id` carrying `status` returns **422**. This was caught in review, not designed in.
- **The `APP-2026-0001` human-readable reference (PRD §7.3).** Adding a column means changing a governed MVP table and its scope test — the same blocker that stopped the `sessions` table. Deferred by owner decision 2026-10-04; the cuid primary key is used instead. Recorded as REC-0025.
- **Editing company or job details through an application.** `updateApplicationSchema` is `.strict()`, so such a payload is **rejected with 422** rather than silently ignored. Job and company are distinct entities (PRD §11) and need their own endpoints; silently dropping the edit would leave a caller believing a job was renamed.
- **Search, filtering, sorting and pagination.** `applicationFiltersSchema` exists in the shared validation package but the list endpoint does not yet accept it. Architecture §28-§31 cover it; recorded as REC-0026.
- **No soft delete.** `DELETE` removes the row and cascades to its timeline, follow-ups and offers. Whether history should survive deletion is a product question that has not been asked.

## Authentication — IMPLEMENTED 2026-10-03

- Status: CONFIRMED by execution. PRD §35 DoD items **1** ("a user can securely create and access an account") is now **met**. Item **12** ("data is isolated between users") is **partially** met: the ownership boundary is enforced for `users` and covered by tests, but no user-owned feature tables exist yet to demonstrate it.
- Routes live (architecture §38): `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`, and `GET /auth/me`.
- `requireAuth` at `apps/api/src/middleware/auth.ts` **no longer returns 501**. It verifies an HS256 access token and attaches `userId`. The 501 stub is gone.
- Web: sign-in and registration pages, a route guard on `/dashboard`, a sign-out control, and the session in TanStack Query.

**Session model — owner decision, 2026-10-03.** Two stateless JWTs in httpOnly cookies: a **15-minute access token** and a **7-day refresh token**, each carrying a `kind` claim so neither can be used as the other, and a random `jti` so rotation produces a genuinely different token.

**The accepted trade-off, stated plainly:** sessions are **not server-side revocable**. `sessions` is not in the MVP schema, and `packages/database/prisma/schema.test.ts` asserts the exact model set to enforce D-0004. Logout clears the cookies, but a token already issued stays valid until it expires.

**Correction made in review, and it matters.** An earlier version of this entry claimed a stolen refresh token was "usable for up to 7 days". That was **wrong in the direction that matters**: refresh issued a fresh full 7-day token every time, so a holder could renew indefinitely and the real exposure was *unbounded*, not 7 days.

Refresh tokens now carry an **absolute session deadline** (`abs`), minted at sign-in and **carried forward unchanged** through every renewal, so no amount of renewing extends it. A token past its deadline is refused and the cookies are cleared. The ceiling is **30 days**, chosen to never interrupt a real user of a personal job-search tracker while still bounding a stolen credential. A refresh token with **no** `abs` claim is rejected rather than trusted.

**Deferred by owner decision, 2026-10-03 — not oversights:**

- **Password recovery (FR-AUTH-005).** Requires email delivery, and REC-0005 (deployment vendors) is undecided. Tracked as REC-0021.
- **Account settings (FR-AUTH-006).** Not started.
- **Rate limiting** ships for `/register` and `/login` only, in-memory and per-process. Counters reset on restart and are not shared across instances, so the effective limit multiplies if the API is scaled horizontally. Tracked as REC-0020.

Verified on 2026-10-01 by execution:

- `pnpm lint` — clean (ESLint 9 flat config; gate proven to fail on a seeded violation, then reverted)
- `pnpm typecheck` — clean, including `tests/tsconfig.json` for the Playwright specs
- `pnpm test` — **217 tests passing**: 7 types, 35 auth (13 password + 19 token + 3 dummy-hash), 28 validation, 31 database (17 schema scope + 7 integration + 7 root script wiring), 80 API (21 smoke/envelope/CORS/error/async/env + 33 auth route + 5 rate limiter + 22 application route), 36 React
- `npx playwright test` — **36 passing test instances** (18 cases × 2 projects) across desktop and 360px, in a real browser, covering a real auth journey
- `pnpm build` — both apps build; web 279 kB (90 kB gzip)
- `pnpm format:check` — **clean**; enforced in CI since 2026-10-02
- `pnpm audit` — **no known vulnerabilities**
- `pnpm db:migrate` — migration created and applied; `migrate status` reports the schema is up to date
- `pnpm db:seed` — idempotent, produces the documented counts
- Prisma client generation, `migrate status`, and `db:seed` all still work with the `deepmerge-ts` override in place
- API boots only when env is valid, and fails closed naming each missing variable

Accessibility verified in a real browser (Playwright, 24 test instances = 12 cases × 2 projects): landmarks present and unique, skip link focusable and ≥44px once revealed, every interactive control has an accessible name, text contrast ≥4.5:1 in **both** light and dark themes, no horizontal page scroll at 360px, and every pointer target ≥44px.

Two accessibility defects were found by these tests and fixed in `apps/web/src/layouts/app-layout.tsx`: the primary navigation link was 19px tall and the focused skip link was under 44px, both violating the 44px touch-target rule in `DESIGN.md` §11.

Consequence that agents must respect: a green build and 97 passing unit/integration tests (plus 24 Playwright test instances) describe the **foundation**, not the product. No user-facing capability exists. Do not describe a feature as working because the scaffold is healthy.

A note on counting: **24 is Playwright test *instances*, not assertions.** The browser suite has 12 `test()` cases run across 2 projects (desktop and 360px). Do not add the two suites into a single "assertion" total — they measure different things, and several tests each assert several conditions internally.

Re-verified 2026-10-02 by execution, with the database now actually running:

- `pnpm lint`, `pnpm typecheck`, and `pnpm build` are clean.
- `pnpm test` reports **217 passing and 0 skipped** with Docker Desktop running. Without a database it reports **155 passing and 62 skipped** — measured, not assumed, by running against an unreachable `DATABASE_URL`. The skipped set is **two** suites, not one: the 7 database integration tests *and* the 55 auth + application route tests, because both need a live database. **155 is not equivalent to 217**; the skipped tests are the ones covering the ownership boundary.
- Two failure modes were hit and fixed on 2026-10-02, both consequences of the directory rename rather than code defects, and both now documented in `README.md` § Troubleshooting: a stale `node_modules` whose junctions pointed at the old directory (`MODULE_NOT_FOUND` for `vitest`, fixed with `pnpm install --frozen-lockfile`), and a stale generated Prisma Client (`no exported member 'ApplicationStatus'`, fixed with `pnpm db:generate`). An agent starting work in a renamed checkout should expect both.
- `pnpm format:check` **now passes** and is enforced in CI. It previously failed on 50 pre-existing files; see REC-0011.
- **The cross-user isolation test actually executes now.** `packages/database/tests/integration.test.ts:145` (`scopes queries by userId so one user cannot read another's rows`) was previously in the skipped set. This is the single most relevant precondition for the auth module's ownership boundary, and it had no local coverage until 2026-10-02.

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
- Repository identity: the **GitHub repository is `ZenDevvv/tarn-app`**; the local folder is `tarn-app`.
  - Status: CONFIRMED
  - Evidence: `git remote -v` → `https://github.com/ZenDevvv/tarn-app.git`, confirmed via the GitHub API on 2026-10-01. Directory renamed from `applicant-tracking-system` to `tarn-app` on 2026-10-02; verified against the working tree and recorded in `.wwg/workspace/testing/verification-evidence.md` (VER-0004).
  - **The three-way name split is now RESOLVED.** The product name is `Tarn`; the repository and the local directory are both `tarn-app`. The retired third name is gone:

    | Name | Where | Is it the product name? |
    |---|---|---|
    | `Tarn` | Product name, used in code and UI | Yes |
    | `tarn-app` | GitHub repository **and** local directory | No |

  - The retired name `applicant-tracking-system` no longer names anything active. It survives only in four intentional places, and each is a deliberate reference to a **past** Compose project or volume rather than a live identifier:
    1. `docker-compose.yml` — in the comment explaining which pre-rename volume is not reused, and why it is not pinned.
    2. `README.md` § Troubleshooting — in the recovery procedure, which must name the legacy project (`docker compose -p applicant-tracking-system down`) and the legacy volume in order to migrate off them.
    3. Generated WWG reports — absolute paths recorded at generation time.
    4. This file, `terminology.md`, `D-0001`, and `AGENTS.md` — as the RETIRED record and the rule against reintroducing it.
  - It must not be used for anything new: not as a directory name, package name, service name, environment variable, or Compose project name.
  - Consequence: never infer the product name from the repository or folder name. Do not propagate `applicant-tracking-system` into new files, CI configuration, or documentation.
- **Compose project name is pinned to `tarn-app`** in `docker-compose.yml`.
  - Status: CONFIRMED
  - Evidence: `docker-compose.yml` line `name: tarn-app`; `docker compose config` validates (exit 0), 2026-10-02.
  - Rationale: Compose derives the project name from the containing directory, and the Postgres volume name derives from the project name, so a rename silently changes the volume and presents as "the database is gone". Pinning decouples both from the directory path.
  - **Known one-time consequence:** the pin does *not* preserve the volume across the 2026-10-02 rename itself. A volume created beforehand is named `applicant-tracking-system_tarn-postgres-data` and is not reused; the first `docker compose up` after the change starts from an empty volume. Accepted deliberately, because the local database holds only seeded development data that `pnpm db:deploy && pnpm db:seed` reproduces exactly. The alternative — pinning the volume name to the retired product name — would embed `applicant-tracking-system` in the repository permanently, which is the opposite of the rename's purpose. Declined; rationale recorded on pull request #35 and in `docker-compose.yml`.
  - Migration procedure for hand-created local records is documented in `README.md` § Troubleshooting, and is explicitly labelled **not executed** — Docker Desktop was not running when it was written.

- Repository visibility: **public**
  - Status: CONFIRMED
  - Evidence: GitHub API reports `visibility: PUBLIC`, `isPrivate: false`, 2026-10-01.
- Repository licence: **none — unlicensed, all rights reserved**
  - Status: CONFIRMED_BY_OWNER
  - Evidence: owner instruction "leave it public and unlicensed", 2026-10-01. `licenseInfo` is empty in the GitHub API response.
  - Note: public is **not** the same as open source. Without a licence nobody may legally reuse this code. This is a deliberate choice, not an omission.
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
packages/auth     Password hashing (scrypt) — DEVIATION, see below
tests/e2e         Playwright specs (authored, never executed)
.github/workflows GitHub Actions
```

**Deviation — `packages/auth` added.** Architecture §6 does not list it. Rationale: password hashing is needed by two workspaces (the API auth module and the development seed), and a shared package is the correct seam. It contains only `hashPassword`, `verifyPassword`, and `needsRehash`. Justified by a real requirement (auth is MVP scope, D-0002), consistent with architecture §92 rule 11. Amend architecture §6 to include it when that document is next revised.

**`packages/config` deliberately not created.** Shared config is covered by `tsconfig.base.json` inheritance, which removes the need. Same rule-11 reasoning. Add it only if a real need appears.

Frontend stack (CONFIRMED as plan, architecture §2.1) **[OBSERVED — react, react-router-dom, @tanstack/react-query, tailwindcss v4 installed]**:

TypeScript, React, Vite, Tailwind CSS v4, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, Recharts, React state; Zustand only if global client state becomes necessary. Not yet installed: shadcn/ui, React Hook Form, Recharts, Zustand — none are used yet.

Backend stack (CONFIRMED as plan, architecture §2.2) **[OBSERVED — express, zod, prisma installed]**:

Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL, JWT/session in httpOnly cookies, S3-compatible storage, Pino or Winston. Not yet installed: cookie signing beyond `cookie-parser`, structured logging, S3 storage, and real JWT verification.

Testing stack (CONFIRMED as plan, architecture §2.3) **[OBSERVED]**:

Vitest 5.0 across all six packages, React Testing Library + jsdom for components, Supertest for API tests, Playwright 1.63 configured with desktop and 360px projects. Playwright is installed and the suite passes against a real browser.

Tooling (CONFIRMED as plan, architecture §2.4) **[OBSERVED]**:

pnpm, TypeScript, ESLint 9 (flat config, enforced in CI), Prettier, Docker, Docker Compose, GitHub Actions (with a Postgres service and `migrate deploy`), Dependabot, GitHub dependency review. Not yet installed: Husky, lint-staged.

Dependency state **[OBSERVED]**: `pnpm audit` reports **no known vulnerabilities**. Two major upgrades were performed to achieve this — `react-router-dom` 6.30.6 → 7.18.4, and Vitest 3.2.7 → 5.0.3 — plus a `pnpm.overrides` entry for the high-severity `deepmerge-ts` advisory. A note worth keeping: Vitest appeared stuck on 3.2.7 through five upgrade attempts because the **root** `package.json` pinned it and overrode every per-package upgrade; only `pnpm why vitest` exposed it. In a pnpm workspace, a root-level pin wins.

Database (CONFIRMED, architecture §3.1) **[OBSERVED — migrated and verified]**:

**PostgreSQL 16** via docker compose, chosen over MongoDB because the domain is heavily relational. The first migration is committed and applied; local dev and CI both run against a real Postgres.

Planned data model (architecture §34–§35, PRD §11) **[OBSERVED and migrated]**:

Implemented and migrated: `User`, `Company`, `Job`, `Skill`, `JobSkill`, `Application`, `SavedJob`, `TimelineEvent`, `FollowUp`, `Offer`.
Deferred and absent by design (D-0004): `Interview`, `Contact`, `Resume`, `CoverLetter`, `Notification`, `UserSkill`, `ApplicationSkill`. Verified absent in the live database.

`packages/database/prisma/schema.test.ts` enforces this: it fails if a deferred table appears, if an MVP table is renamed or dropped, if the canonical enums change, if a user-owned table loses its `userId`, or if the architecture §78 indexes are removed.

`packages/database/tests/integration.test.ts` runs against a real database and covers referential integrity, cascade deletes, cross-user isolation, unique constraints, and password hashing at rest. It **skips loudly** (never silently passes) when no database is reachable.

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

This project is **a working authentication flow on a foundation, with no other product feature built**. Nothing here is production-ready, and the build passing is not a readiness signal.

Do not claim production readiness for:

- **The product as a whole.** The MVP Definition of Done (PRD §35) lists 14 criteria. **Two** are met at the API level: item 1 (account creation and access) and item 2 (create, edit, manage applications). Item 12 (data isolation) is met for applications. Items 3 and 4 (pipeline, detail view) are not, because there is no web UI and no Kanban board.
- **Session revocation.** Stateless tokens cannot be revoked server-side. A session is capped at 30 days and cannot be extended by renewal, but there is no kill switch for an individual session.
- **Rate limiting as a security control.** It is per-process and in-memory, so it resets on restart and does not survive horizontal scaling.
- **Password recovery.** Not implemented, deliberately.
- **Search, filtering, sorting, pagination.** The shared schemas exist; the applications list endpoint does not use them yet.
- **Company de-duplication under concurrency.** Two simultaneous `POST /applications` for the same employer can each create a company row, because `Company` has no uniqueness constraint on `(userId, name)`. Both rows belong to the same user, so nothing crosses an ownership boundary — it is untidy data, not a leak. Fixing it needs a unique index, which is a schema change to a governed MVP table. Recorded as REC-0028.
- Any performance, reliability, or accessibility conformance claim beyond what the browser suite asserts.

Authentication and the applications API **are** implemented and tested. That is a different statement from "ready for production", and both are recorded here so neither is overstated later.

Security posture observed in the scaffold:

- The API refuses to boot without `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, and `WEB_ORIGIN`, and names each missing variable (architecture §57). Verified by execution.
- Body size is capped at 1 MB and an oversized body returns 413 rather than 500.
- CORS echoes only configured origins and sets `Access-Control-Allow-Credentials`.
- Every request carries an `x-request-id` correlation header (architecture §54).
- Unhandled errors return a generic message; internals are logged, not returned (architecture §53).
- `notifications`, `interviews`, `contacts`, `resumes`, `cover_letters` tables do not exist, so there is no unaudited data surface for them.

Known scaffold-level risks:

- **Password hashing is scrypt — owner-confirmed.** Node's built-in `crypto.scrypt` at `N=32768, r=8, p=1`, 16-byte salt, 64-byte key, self-describing storage format. This replaced a `sha256:` placeholder that was never acceptable. Parameters are tunable in `packages/auth/src/password.ts`, and the format means they can change without invalidating existing hashes. See `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md`. An external security review before launch is still recommended — the owner's confirmation settles the algorithm choice, not the launch gate.
- The seed prints the test password to stdout. Acceptable for local development only; never run the seed against a shared environment.
- `apps/api` sets `trust proxy` to 1. That is correct behind a single known proxy and wrong behind multiple; revisit per environment (architecture §55).
- Playwright runs locally against the **system-installed** Microsoft Edge because the bundled Chromium download is blocked in this environment. CI uses the pinned bundled browser for reproducibility. A local `PW_CHANNEL=chrome` run is also supported. **Superseded 2026-10-02:** the earlier claim here that browser tests were "not yet wired into CI, because CI has never actually run" was false on both counts. A dedicated `e2e` job runs them in CI, and CI has run successfully on `main` repeatedly — most recently on the merges of pull requests #35 and #36. What remains true is narrower and is recorded in D-0008: the `e2e` job **runs and reports on every pull request but is not a required status check**, so a red browser test does not block a merge. See the branch-protection entries and `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`.
- `package.json#prisma` is deprecated in Prisma 6 and warns on every database command. It still works; migrate to `prisma.config.ts` before upgrading to Prisma 7.
- **A `pnpm.overrides` entry pins `deepmerge-ts` to `^8.0.2`** to clear a high-severity advisory in Prisma's dependency tree. Prisma client generation, `migrate status`, and `db:seed` were all re-verified to still work afterwards. Remove the override only once a Prisma upgrade resolves the advisory upstream. Dependabot is configured to ignore Prisma major bumps for the same reason.
- **Express 4 does not catch rejected promises from async handlers.** Every route handler must be wrapped in `asyncHandler` (`apps/api/src/middleware/async-handler.ts`) or its rejection becomes an unhandled promise rejection and the request hangs. This is not hypothetical — the auth route tests caught it immediately, with every 422 and 401 escaping instead of returning. Regression-tested in `app.test.ts`. Express 5 fixes this natively.
- **`jose` 6.2.12 was added** to `packages/auth` for JWT signing and verification. `pnpm audit` still reports no known vulnerabilities. Hand-rolling HMAC signing was rejected: JWT construction is security-critical and a library with test vectors is safer.
- **Local E2E is only trustworthy when port 5173 is free.** `playwright.config.ts` sets `reuseExistingServer: !CI`, so a local run adopts whatever app answers on that port. See REC-0019 — a different project on this machine caused 17 false failures.

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
- RESOLVED — Root `README.md` did not exist. A factual README now exists, documenting stack, commands, MVP scope, and the fact that no feature is implemented.
  - Status: RESOLVED
  - Evidence: `README.md` at repository root.
- RESOLVED — No `CHANGELOG.md`; no release memory existed. **`CHANGELOG.md` now exists at the repository root.**
  - Status: RESOLVED (executed 2026-10-02)
  - Evidence: `CHANGELOG.md`; `wwg changelog validate --target .` reports "CHANGELOG.md found: true" and "✓ Unreleased section present".
  - It records the foundation, design, delivery pipeline, verification, and the accepted limitations — with **no version number**, because nothing has ever been released, tagged, or deployed. The first release is planned as `0.1.0` and is gated on the first real user-facing feature.
  - **The `major` bump that `wwg changelog recommend-bump` keeps recommending is declined**, and the reasoning is written into `CHANGELOG.md` itself: the tool triggers on a "folder-contract signal" from the directory rename, but with zero released versions there is no compatibility contract to break, and a `1.0.0` would falsely imply maturity. The tool will keep flagging it on keyword matches. That is expected, not a regression.
  - Note on the tool's own output: its auto-generated "meaningful change groups" are generic WWG boilerplate that described none of this project's real commits, and it classified the design-system and CodeRabbit commits as "no meaningful change". The changelog was therefore **hand-authored from the actual git history**, not generated.
- RESOLVED — Design-system name `Marker` (DESIGN.md) vs product name `Tarn` (PRD §1.1). Previously three names coexisted; the product name is now Tarn and `Marker` is scoped to the design system only.
  - Status: RESOLVED
  - Evidence: `DESIGN.md` line 3 and the new Naming note; PRD §1.1.
  - Resolution: `Tarn` is the product name. `Marker` is the design-system name only. Never use `Marker` as a product name. See `.wwg/wiki/terminology.md`.
- RETIRED — "Job Application Tracker" as a product name.
  - Status: RETIRED
  - Evidence: superseded by Tarn on 2026-10-01 (PRD §1.1, §38).
  - Note: the two canonical source files keep their historical `job-application-tracker-*` filenames. Do not treat those filenames as a naming rule, and do not propagate the retired name into new files or user-facing strings.
- RESOLVED — The root `db:deploy` script was broken and CI hid it. **Fixed 2026-10-02.**
  - Status: RESOLVED
  - What was wrong: the root script read `pnpm --filter @tarn/database deploy`. `deploy` is a **built-in pnpm command**, so pnpm resolved its own `deploy` rather than the package script, and `pnpm db:deploy` failed with `ERR_PNPM_INVALID_DEPLOY_TARGET`. The documented volume-recovery procedure in `README.md` § Troubleshooting was therefore broken.
  - Why it survived: **both CI jobs invoke the command inline** (`pnpm --filter @tarn/database exec prisma migrate deploy`), which works. The inline form silently routed around the defect, so the repository script was never exercised by any gate.
  - Fix: `pnpm --filter @tarn/database run deploy`. The explicit `run` is required whenever the verb collides with a pnpm built-in — `deploy`, `install`, `add`, `remove`, `link`, `import`, `patch`, `why`.
  - Regression guard: `packages/database/prisma/scripts.test.ts` asserts the shape of every root `db:*` script. Verified by **reintroducing the broken form and confirming 2 assertions fail**, then restoring.
  - Scope check: `db:generate`, `db:migrate`, `db:seed`, and `db:studio` were each executed and all pass — `deploy` was the only collision. The guard covers the whole `db:*` family so a future rename cannot reintroduce it.
  - Lesson, and it is the **REC-0009 failure mode again**: a command was documented, reviewed by two AI passes and an owner sign-off, and never once executed. The generalisable rule — *a workaround in CI that exists for no stated reason is masking a defect at the source* — is now recorded in `.wwg/wiki/principles/plan-vs-implementation-truth.md`.
- RESOLVED — No ESLint config and no lint gate. `eslint.config.mjs` (ESLint 9 flat config) now enforces typescript-eslint recommended plus project rules including `no-explicit-any`; `pnpm lint` runs from the repo root and is a required CI step. The gate was proven to fail by seeding a deliberate `any` and an unused variable, then reverted.
  - Status: RESOLVED
  - Evidence: `eslint.config.mjs`; `.github/workflows/ci.yml` lint step.
- RESOLVED — The `sha256:` password-hash placeholder. Replaced with Node's built-in scrypt via `packages/auth`, covered by 13 unit tests and verified at rest in the seeded database. The algorithm choice is itself still open for owner sign-off — see D-0006.
  - Status: RESOLVED (algorithm pending sign-off)
  - Evidence: `packages/auth/src/password.ts`; `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md`.
- RESOLVED — No database-backed tests. `packages/database/tests/integration.test.ts` runs against real Postgres and covers cascades, cross-user isolation, unique constraints, and hash verification. It skips loudly, never silently, when no database is reachable. CI runs it against a Postgres service.
  - Status: RESOLVED
  - Evidence: `packages/database/tests/integration.test.ts`; `.github/workflows/ci.yml`.
- RESOLVED — Playwright could not run because the bundled Chromium download is blocked. The suite now drives the **system-installed Microsoft Edge** (and Chrome on request) via Playwright's `channel`, which needs no download. 24 test instances pass across desktop and 360px. CI keeps using the pinned bundled browser for reproducibility.
  - Status: RESOLVED
  - Evidence: `playwright.config.ts` (`PW_CHANNEL`); `tests/e2e/smoke.spec.ts`.
  - Two real accessibility defects were found this way and fixed: a 19px-tall nav link and an undersized focused skip link, both against the 44px rule in `DESIGN.md` §11.
- RESOLVED — Password hashing scheme. Owner confirmed scrypt. See `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md`.
  - Status: RESOLVED
  - Evidence: owner instruction "scrypt is confirmed", 2026-10-01; `packages/auth/src/password.ts`; 13 unit tests; verified at rest in the seeded row.
- RESOLVED — No dependency vulnerability scanning. Dependabot (weekly security + version updates, grouped), a lockfile-diff dependency review on every pull request, and a whole-tree `pnpm audit --audit-level=high` gate in CI. All free, all live.
  - Status: RESOLVED
  - Evidence: `.github/dependabot.yml`; `.github/workflows/dependency-review.yml`; audit step in `ci.yml`; `pnpm audit` reports **no known vulnerabilities**; both GitHub checks pass.
  - Found and fixed on first run: 1 high (`deepmerge-ts`, transitive via Prisma) and 4 moderate (`react-router` ×2, `vitest` ×2). All cleared via a `pnpm.overrides` entry and two major upgrades.
- RESOLVED — No git remote. The repository is published at **https://github.com/ZenDevvv/tarn-app**, public, with `main` tracking `origin/main`.
  - Status: RESOLVED
  - Evidence: `git remote -v`; GitHub API on 2026-10-01.
- RESOLVED — CI had never actually run. It has now. Both the `verify` job (lint, dependency audit, typecheck, tests, build — against a live Postgres service in CI) and the `Dependency Review` job pass on GitHub, and both are now required by branch protection.
  - Status: RESOLVED
  - Evidence: verified 2026-10-01 on real pull requests; both checks reported `pass` and gated a real merge.
- RESOLVED — Browser tests ran only locally. A dedicated `e2e` job now runs them in CI alongside `verify`.
  - Status: RESOLVED
  - Evidence: `.github/workflows/ci.yml`, `e2e` job.
  - The job sets `PW_CHANNEL: ''` to force the pinned bundled Chromium. Without this it would inherit the local default of `msedge`, which does not exist on the ubuntu runner. That is a real trap, and it is why the override is explicit in the job.
  - It installs Chromium with `--with-deps` for the Linux system libraries, applies migrations, and seeds reference data first.
  - Failure artefacts (screenshots, traces) upload as artifacts so a browser regression is diagnosable from the run page.
- RESOLVED — Node version was unpinned and inconsistent across three places: CI used 22, the local machine had 24, and `engines` claimed `>=20.11.0` — a floor never actually tested. Added `.nvmrc` containing `22`, pointed both CI jobs at it, and tightened `engines` to `>=22`.
  - Status: RESOLVED
  - Evidence: `.nvmrc`; both `actions/setup-node` steps use `node-version-file`; `package.json` engines.
- RESOLVED — Nothing enforced CI. `main` now has branch protection with **admin enforcement on**.
  - Status: RESOLVED
  - Evidence: applied and verified 2026-10-01 via the GitHub API.
  - Settings: required status checks are `verify`, `dependency-review`, `CodeRabbit` — **three, not four**; the `e2e` browser job is deliberately **not** required (owner decision 2026-10-02, see D-0008). **Strict mode** (the pull request branch must be up to date with the base branch before merging, and checks must pass on the latest commit SHA); pull request required with zero required approvals; `enforce_admins: true`; force pushes disabled; branch deletion disabled; conversation resolution required.
  - **Known limit, flagged by CodeRabbit:** with squash merge, the commit that lands on `main` is newly generated and CI never runs against it. Strict mode guarantees checks passed on the latest *pull request* commit, not on the squash result. If a guarantee on the merged SHA is wanted, use a merge commit or a post-merge re-run check instead of squash.
  - **Verified by testing, not assumption.** A direct push to `main` was rejected with `GH006: Protected branch update failed`. A real pull request went `BLOCKED` while CodeRabbit was still running, flipped to `CLEAN` once all three passed, and merged. That is the complete workflow proven end to end.
  - Owner chose admin enforcement knowingly. The first configuration deliberately set `enforce_admins: false` as a lockout safeguard; that made the gates advisory because the owner is the only admin, so it was changed to `true` on request.
  - Escape hatch if CodeRabbit ever fails to report: an admin can remove or edit the protection rule in repository settings or via the API. This is friction, not a permanent lockout.
  - Operational consequence: **no more direct pushes to `main`.** Every change needs a branch, a pull request, and three green checks. Squash merge is the path used so far.
- **`required_conversation_resolution` is enabled on `main`, and it is invisible in every checks view.** On PR #41 (2026-10-03) a pull request with all four checks green, a `success` combined status, and `mergeable: MERGEABLE` was still refused because review threads were unresolved. `mergeStateStatus` reported only `BLOCKED`, with no indication of why, and the REST merge endpoint returned `Not Found`.
  **How to diagnose it:** list unresolved review threads rather than re-running green checks. Each was resolved with a note recording what was fixed or why a finding was declined. Recorded as REC-0024.
- RESOLVED — CodeRabbit not installed. **Installed and verified working** on 2026-10-01. It reads `.coderabbit.yaml`, applies the `assertive` review profile, and reviews every pull request. Verified on a real pull request where all three checks passed: CodeRabbit, `verify`, and `Dependency Review`.
  - Status: RESOLVED
  - Evidence: pull request #29, closed after verification. CodeRabbit posted a configuration summary naming the repository config file and the ASSERTIVE profile.
  - **One config defect was found by CodeRabbit itself on its first run:** `prismaLint` is listed in CodeRabbit's schema reference but is not accepted by the current schema, producing a parsing warning on every review.
    - Status: **RESOLVED (executed 2026-10-02)** — this entry previously claimed the key was already removed and the warning confirmed gone; both were false. See the CORRECTION entry below.
    - Evidence: pull request #33 surfaced `Validation error: Unrecognized key: "prismaLint"` on a live review. `git log -S prismaLint -- .coderabbit.yaml` showed the key was introduced in `bdbd25a`, the file's first commit, and never removed. It was deleted from `.coderabbit.yaml` on 2026-10-02 and a note added in its place so it is not re-added.
    - Warning after removal: **observed gone.** A clean CodeRabbit run on pull request #34 (2026-10-02, after the removal) reports no `.coderabbit.yaml has unrecognized properties` warning and no `Unrecognized key`. Command and output recorded in `.wwg/workspace/testing/verification-evidence.md` (VER-0001). This is the verification the earlier close-out claimed but never performed.
  - Cost note: the free tier applies because the repository is public. CodeRabbit displayed "Plan: Advanced" in its run summary. Worth watching the billing page, since Advanced is a paid tier name in their public pricing.
  - Timing note: CodeRabbit took roughly three minutes to complete a review. With it required and strict mode on, expect a merge to wait for it.
- CORRECTION — a prior close-out recorded verification that was never performed.
  - Status: RESOLVED
  - Detected: 2026-10-02, on pull request #33.
  - What was claimed: that the `prismaLint` config defect had been removed and that "the warning is confirmed gone."
  - What was true: the key was still in `.coderabbit.yaml`, and the warning was live on every review. `git log -S` proved it had never been removed since the file's first commit.
  - Why it matters: this is a `CONFIRMED` claim in canonical truth that the working tree and the live platform both contradicted. It means at least one close-out asserted verification without running it. Any other "verified" or "confirmed gone" claim from that batch should be treated as unverified until re-checked by execution.
  - Rule reinforced: a claim of verification is itself a claim requiring evidence. Record the command and its output, not the conclusion. See REC-0009.
- RESOLVED — The `e2e` browser-test job was recorded as a required status check while the platform reported it absent. **Now decided: `e2e` stays advisory and non-required, by owner decision.**
  - Status: RESOLVED_DECIDED (2026-10-02)
  - What the platform reports: `required_status_checks.contexts` is `["verify", "dependency-review", "CodeRabbit"]` — `e2e` is absent. Re-verified live on 2026-10-02 and again on 2026-10-02 after PR #35 merged. Command and output in `.wwg/workspace/testing/verification-evidence.md` (VER-0003).
  - Decision: **leave it that way.** Owner judgement is that this is a personal MVP project where merge speed is worth more than gate strictness. Recorded in `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`. Recommendation **REC-0010** ("Decide whether the `e2e` browser-test job should be a required status check") is closed as **Deferred**, not dropped.
  - **The honest framing, so this is not misremembered later:** the `e2e` job **does run and report on every pull request**. The owner sees the browser and accessibility result each time. What was declined is only the ability to *refuse* a merge when it is red. This is "browser tests are advisory", not "browser tests are absent from CI".
  - Accepted trade-off: a browser regression can merge green if the owner does not notice the red result.
  - **Revisit trigger** — any one of these, and the decision should be reopened:
    1. The first real product UI ships (auth screens, applications list, Kanban board).
    2. The `e2e` suite grows beyond shell, dashboard-placeholder, and accessibility assertions.
    3. A browser regression reaches `main` that was not caught by reading the pull request.
  - Cost of reversing later is low: one API call adding the context to `required_status_checks`, then a pull request. There is no reason to pay it before the trigger fires.
  - What the decision does **not** change: `verify` (lint, dependency audit, typecheck, tests, build), `dependency-review`, and `CodeRabbit` all remain required, with strict mode and `enforce_admins: true`. Coverage is unchanged.
- RESOLVED — Independent human security review. **Consciously deferred** by the owner, not overlooked. Recorded so it is not rediscovered as an oversight.
  - Status: RESOLVED_DEFERRED
  - Evidence: owner instruction "independent human reviewer, not for now", 2026-10-01; `.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md`.
- SUPERSEDED — "No AI code reviewer on pull requests" (recorded when the repository had no git remote). Superseded by the resolved CodeRabbit entry above once the repository was published public and the app was installed. Retained as history so the sequence is not rewritten.
  - Status: SUPERSEDED
  - Evidence: replaced 2026-10-01. This entry previously claimed the repository had no git remote, which stopped being true on publication.
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
- Question: Should Husky and lint-staged be wired up now, or after the first feature?
  - Why it matters: pre-commit hooks stop broken work reaching main. CI already gates lint, typecheck, tests, and build, so hooks are a convenience rather than a safety net.
  - Evidence / uncertainty: architecture §2.4 lists both as recommended tooling.
- Question: Will the repository be public or private, and what AI reviewer should run on pull requests?
  - Resolved 2026-10-01: repository is **public**, reviewer is **CodeRabbit** on the free tier, installed and verified working.
- Question: When should the ownership boundary be reviewed by someone other than the implementing agent?
  - Why it matters: an independent human review of the authentication and data-access code was **consciously deferred** by the owner, not overlooked. The residual risk is concentrated in one property — a single missing `userId` filter on one endpoint would expose the whole database.
  - Evidence / uncertainty: mitigated by required cross-user isolation tests, not eliminated. Deterministic mitigations are in place: dependency scanning, lint, typecheck, 97 unit/integration tests, 24 browser tests.

Resolved on 2026-10-02:

6. Repository directory rename → **yes, done.** The directory is now `tarn-app`, matching the GitHub repository and the root `package.json`. It landed on pull request #35 together with the Compose project-name pin that protects the Postgres volume across the rename. See `VER-0004` and the Product Identity entry above.
   - The previous entry's cost estimate — "no remote or CI target exists yet, so renaming is still cheap" — was already false when written. The repository was published and branch protection applied on 2026-10-01, the day before.
   - Side effect accepted with it: the local Postgres volume is not carried across, and must be rebuilt with `pnpm db:deploy && pnpm db:seed`. See Product Identity and `README.md` § Troubleshooting.

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