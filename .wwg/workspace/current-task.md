# Current Task

Status: DONE — scrypt confirmed, Playwright gap closed, truth re-synced.
Task mode: Existing Project Adoption (continued) → decision ratification and verification closure
Instance type: existing-project (adopted; this work continues the adoption lifecycle)
Last updated: 2026-10-01

## Task Summary

- Status: DONE
- User requests:
  1. "scrypt is confirmed"
  2. "what to do with the playwright gap?"
  3. Report scope and docs by name rather than by reference number.

## 1. Password hashing confirmed

The scrypt decision is now **accepted**, not proposed. Owner instruction recorded as "scrypt is confirmed" (2026-10-01).

Decision record: `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md`, status `accepted`, ratified 2026-10-01.

What was settled: Node's built-in `crypto.scrypt` at `N=32768, r=8, p=1`, 16-byte salt, 64-byte key, self-describing `scrypt$N$r$p$salt$hash` storage format, in `packages/auth/src/password.ts`.

What remains open but is *not* blocked by this: an external security review before launch. The owner's confirmation settles the algorithm, not the launch gate. Scrypt cost parameters and cookie settings have not been independently reviewed.

## 2. Playwright gap — solved, not just explained

The bundled Chromium download is blocked in this environment. Rather than accept an unverified accessibility story, the suite now drives the **system-installed browser**:

- `playwright.config.ts` uses Playwright's `channel` option, defaulting to `msedge` (Microsoft Edge, present on all Windows machines).
- `PW_CHANNEL=chrome` switches to Chrome. `PW_CHANNEL=` (empty) falls back to bundled Chromium.
- **CI deliberately keeps the pinned bundled Chromium** for reproducibility — noted in the config so nobody "helpfully" switches it.

Result: **24 assertions passing** across a desktop project and a 360px project, in a real browser.

Verified in-browser: landmarks present and unique, skip link focusable and ≥44px once revealed, every interactive control has an accessible name, text contrast ≥4.5:1 in **both light and dark themes**, no horizontal page scroll at 360px, every pointer target ≥44px, and the frontend reaches the API.

### Two real defects found and fixed

Both in `apps/web/src/layouts/app-layout.tsx`, both against the 44px touch-target rule in `DESIGN.md` §11:

1. The primary navigation link measured **67×19px**.
2. The skip link, once focused, was under 44px.

Fixes: `inline-flex min-h-11 items-center` on the nav link (44px tall, no visual change) and `focus:min-h-11` on the skip link.

### A process failure worth recording

The first version of the touch-target test **logged** undersized targets instead of failing, reasoning that "inline links are exempt". That reasoning silenced a genuine violation in the project's own navigation. The design doc states a flat 44px minimum with no exemption, so the test now fails. The only exclusion is elements clipped to 1×1 by `sr-only`, which are not pointer-reachable while hidden — and the skip link is asserted separately in its focused state. Written up in `.wwg/governance/test-enforcement.md` so it is not repeated.

Also fixed: an ambiguous locator (`getByText('Tarn')` also matched "Connected to **tarn**-api") — now `exact: true`.

## 3. Reference style

Owner feedback: reference scope and documents **by name**, not by number — "§90 Step 3" and "D-0002" were not resolvable without looking them up.

Applied from now on in conversation and in docs I author:

| Instead of | Say |
|---|---|
| §90 Step 3 | the authentication step in the architecture document's build order |
| D-0002 | the decision that authentication is in the MVP |
| §35 | the MVP database tables section of the architecture document |
| §11 of DESIGN.md | the accessibility section of the design document |
| D-0004 | the MVP schema scope decision |

Decision-record **filenames remain self-describing** (for example `D-0006-password-hashing-scrypt.md`) because a stable identifier is genuinely useful for cross-referencing. The number is always paired with the plain-language subject, never used alone.

## Verification

| Gate | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean, including Playwright specs |
| `pnpm test` | **90 passing** |
| `npx playwright test` | **24 passing** (desktop + 360px, real browser) |
| `pnpm build` | both apps green |
| `wwg validate` | PASS |

## Truth Surfaces Updated

- `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md` — accepted, with rejected alternatives recorded
- `.wwg/wiki/project-truth.md` — hashing confirmed; Playwright moved from OPEN to RESOLVED; browser accessibility results recorded; two accessibility defects logged; open questions rewritten
- `.wwg/governance/test-enforcement.md` — 24 browser assertions, local browser instructions, the test-integrity failure written up
- `.wwg/workspace/current-task.md`, `.wwg/reports/wwg-maintenance-review.md`, `.wwg/config/wwg.project.yaml`

## Remaining Open Questions

1. When should an external security review happen? Not blocking the algorithm, but it is a launch gate.
2. Which deployment vendors?
3. Rename the repository directory `applicant-tracking-system` to `tarn`?
4. Husky and lint-staged now, or after the first feature?

## Next Step

**Authentication** — the next step in the architecture document's build order, and MVP scope under the decision that authentication belongs in the MVP. It needs an auth module under `apps/api/src/modules/auth/` following the fixed Route → Controller → Service → Repository layering, real cookie-based sessions replacing the current 501 stub, ownership enforcement, and cross-user access tests.

## Close-Out Notes

- Truth Alignment Status: GREEN
- Execution Gate: pass — 114 assertions green, every previously open gap closed
- Drift status: LOW
- Implementation confidence: HIGH for foundation and data layer, **ZERO for product features**
- New recommendations: none added to the recommendation registry

## Step 2 — Database migration

- Started Postgres 16 via `docker compose up -d`; healthy in 5s.
- Created and applied migration `20261001095704_init_mvp_schema`, committed at `packages/database/prisma/migrations/`.
- Seeded and verified: 1 user, 2 companies, 2 jobs, 2 skills, 2 job_skills, 3 applications, 2 timeline events, 2 follow-ups, 1 saved job, 1 offer. Seed re-run is idempotent.
- Verified table set in the live database equals the 10 MVP tables, and that `notifications`, `interviews`, `contacts`, `resumes`, `cover_letters` do not exist.

## Gaps Addressed

| Gap | Resolution |
|---|---|
| No migration applied | Migration created, committed, applied, verified against live Postgres |
| Seed used `sha256:` placeholder | Replaced with Node's built-in **scrypt** (`N=32768, r=8, p=1`) in a new `packages/auth`. 13 unit tests. Verified at rest in the seeded row. Recorded as **D-0006, proposed, awaiting owner sign-off** because the algorithm choice is security-sensitive. |
| No ESLint config, no lint gate | `eslint.config.mjs` (ESLint 9 flat config). `pnpm lint` from root, required CI step. Gate proven to fail by seeding an `any` and an unused var, then reverted. |
| No DB-backed tests | `packages/database/tests/integration.test.ts` — cascades, cross-user isolation, unique constraints, hash verification. Skips **loudly**, never silently. Wired into CI via a Postgres service. |
| No React component tests | React Testing Library + jsdom. 10 tests on the shell and dashboard placeholder, asserting landmarks, skip link, accessible names, `aria-live="polite"`, and no exclamation marks in copy. |
| No Playwright | Config + smoke/accessibility spec authored with desktop and 360px projects. **Never executed** — the Chromium download is blocked in this environment. Recorded as OPEN, not as passing. |
| Prisma could not see root `.env` | Added `dotenv-cli`; db and test scripts load `../../.env`. Verified it tolerates a missing file, so CI (env from the workflow) works. |

## New problems found and fixed

1. **Duplicate Vite install.** Vitest 2 pulled Vite 5 while the web app used Vite 6, so `vite.config.ts` failed to typecheck with an unreadable overload error spanning three nested type trees. Fixed by upgrading Vitest 2.1.9 → 3.2.7 across all packages, which removes the duplicate.
2. **My own password module was wrong.** First attempt wrapped async scrypt in a busy-wait spin loop to fake a synchronous API. Rewritten as honest `async` functions.
3. **My own integration test was wrong.** I used an async wrapper around `describe`, which Vitest cannot collect, plus a `resports` typo. Rewritten using top-level await to probe the DB, then `describe` or `describe.skip`.
4. **`v7_startTransition` is not in the router's option type.** `createBrowserRouter` types against `@remix-run/router`'s `FutureConfig`, which lacks that flag in this version. Only `v7_relativeSplatPath` is set.

## Deviations From The Architecture Document

| Deviation | Reason |
|---|---|
| `packages/auth` added (not in §6) | Password hashing is needed by two workspaces. Justified by a real requirement. Flagged for §6 amendment. |
| `packages/config` still not created | `tsconfig.base.json` inheritance covers it; rule 11. |
| Husky / lint-staged not installed | Not needed until there are commits worth guarding. |
| Express 4, not 5 | Stability; the architecture doc names neither. |
| Vitest 3.2, not 2.x | Required to deduplicate Vite and keep `vite.config.ts` type-safe. |

## Verification (executed)

| Gate | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean, including `tests/tsconfig.json` |
| `pnpm test` | **90 passing** — 7 types, 13 auth, 23 validation, 24 database, 13 API, 10 React |
| `pnpm build` | both apps green |
| `pnpm db:migrate` | migration applied |
| `pnpm db:seed` | idempotent, documented counts |
| Live table audit | exactly the 10 MVP tables, 0 deferred |

## Truth Surfaces Updated

- `.wwg/wiki/project-truth.md` — Implementation Reality (migration + verification), architecture `[OBSERVED]` markers, `packages/auth` deviation, real scaffold risks, 6 conflict-register entries added or resolved
- `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md` — new, proposed, awaiting sign-off
- `.wwg/governance/test-enforcement.md` — real test counts, per-layer status, regression register, top-level-await pattern, Vitest-3 note
- `.wwg/reports/wwg-maintenance-review.md` — truth-sync block
- `.wwg/config/wwg.project.yaml` — implementation status, verification commands, test count, workspace layout

## Remaining Open Questions

1. **Ratify or replace D-0006** — scrypt vs Argon2id vs bcrypt. Security decision, needs your call.
2. Playwright has never run. Get the browser downloaded and get one green run before claiming any accessibility conformance.
3. Which deployment vendors?
4. Rename the repository directory `applicant-tracking-system` → `tarn`?
5. Husky / lint-staged — now or after the first feature?

## Close-Out Notes

- Truth Alignment Status: GREEN
- Execution Gate: pass — all gates green, migration applied and verified
- Drift status: LOW
- Implementation confidence: HIGH for the foundation and data layer, **ZERO for product features** — none exist
- New recommendations: none added to `.wwg/governance/recommendation-registry.md`

## Next Step

Architecture §90 Step 3 is **authentication**, which is MVP scope under D-0002 and must not be deferred. It needs: a password hashing decision ratified (D-0006), an auth module under `apps/api/src/modules/auth/` following Route → Controller → Service → Repository, real cookie-based sessions, ownership enforcement replacing the 501 stub, and cross-user access tests per `.wwg/governance/test-enforcement.md` rule 4.

## What Was Built

Repository foundation per architecture §5, §6 and §90 Step 1, plus D-0003 and D-0005.

```text
pnpm-workspace.yaml, package.json (pnpm 9.15.4), tsconfig.base.json
apps/web          React + Vite + Tailwind v4 + Router + TanStack Query
apps/api          Express + Zod, health route only
packages/database Prisma schema (10 MVP tables), client, idempotent seed
packages/validation  shared Zod schemas
packages/types       shared domain types + API envelope
.github/workflows/ci.yml
docker-compose.yml (Postgres only), .env.example, .gitignore, README.md
.prettierrc.json, .prettierignore, .editorconfig
```

D-0005 executed: `index.css` moved from the repository root to `apps/web/src/index.css`, root copy deleted. `DESIGN.md` §1 and architecture §6 now match the tree.

## Verification (executed, not assumed)

| Check | Result |
|---|---|
| `pnpm install` | 416 packages resolved, `pnpm-lock.yaml` written |
| `pnpm typecheck` | clean across 5 packages |
| `pnpm test` | **60 passing** — 7 types, 17 schema scope, 23 validation, 13 API |
| `pnpm build` | both apps build; web 251 kB (81 kB gzip) |
| `prisma validate` + `migrate diff` | schema generates valid DDL; exactly the 10 MVP tables, zero deferred |
| API boot, no env | fails closed, naming all 4 missing variables |
| API boot, valid env | listens; `/api/v1/health` → 200; `/api/v1/nope` → 404 error envelope |

Not verified: no migration was applied, because the Docker daemon was not running on this machine.

## Bugs Found and Fixed

Three real defects, each now covered by a regression test:

1. **Routing swallowed.** `app.use('/api/v1', health)` treated the 2-arity health handler as middleware, so every `/api/v1/*` request returned the health payload with 200. Found by live curl. Fixed with `app.get`. Regression test: `apps/api/src/app.test.ts` → "routing is not swallowed by the health route".
2. **Oversized body returned 500.** Body-parser errors fell through to the generic handler. Fixed with an explicit branch → 413. Regression test: same file → "rejects an oversized JSON body with 413, not 500".
3. **Helpful error copy was being lost.** `z.string().cuid({ message })` only overrides the format error, so a *missing* cuid field reported Zod's default "Required", violating DESIGN.md §12. Fixed with a `cuidField()` helper. Caught by a test, not by review.

Also fixed before scaffolding: D-0004 had left three contradictions in the architecture doc (§61 seed listed interviews, §87 listed Saved Jobs and Offers as Phase 2, §88 listed `skills`/`job_skills` as Phase 3). All three amended to match D-0004.

## Deviations From The Architecture Document

| Deviation | Reason |
|---|---|
| `packages/config` not created | Shared config is covered by `tsconfig.base.json` inheritance. Architecture §92 rule 11: no speculative infrastructure. Add it if a real need appears. |
| ESLint config not written | Flagged as an open question rather than guessed at. `pnpm lint` currently enforces nothing — recorded as a real gap, not hidden. |
| No Husky / lint-staged | Not needed until there are commits worth guarding. |
| `apps/api` uses Express 4, not 5 | Stability choice; the architecture doc names neither version. |
| Seed uses `sha256:` placeholder hashing | The scaffold must not invent a password hashing scheme. **Must be replaced before real auth ships** — recorded as an open question. |

## Truth Surfaces Updated

- `.wwg/wiki/project-truth.md` — Implementation Reality rewritten (plan → observed), architecture items marked `[OBSERVED]`, new scaffold-level security risks, conflicts resolved, new open questions
- `.wwg/wiki/decisions/D-0005-token-file-location.md` — marked executed, four close-out steps satisfied
- `.wwg/governance/test-enforcement.md` — current state rewritten with real numbers, regression-test table, per-layer status
- `.wwg/reports/wwg-maintenance-review.md` — truth-sync block updated
- `.wwg/config/wwg.project.yaml` — `implementation_status` updated

## Remaining Open Questions

1. Which deployment vendors are chosen?
2. Rename the repository directory `applicant-tracking-system` → `tarn`? Cheapest now — no git remote or CI target exists yet.
3. What password hashing scheme replaces the `sha256:` seed placeholder?
4. Wire up ESLint and Husky now, or after the first feature?

## Close-Out Notes

- Truth Alignment Status: GREEN
- Execution Gate: pass — scaffold verified by execution
- Test / verification plan: 60 executable tests; `pnpm typecheck`, `pnpm test`, `pnpm build` are the gate
- Drift status: LOW
- Implementation confidence: HIGH for the foundation, **ZERO for product features** — none exist
- New recommendations: none added to `.wwg/governance/recommendation-registry.md`

## Next Step

Architecture §90 Step 2 is the database migration. That needs Docker running:

```bash
docker compose up -d
pnpm db:migrate
pnpm db:seed
```

Then Step 3 is authentication (D-0002), which is MVP scope and must not be deferred.