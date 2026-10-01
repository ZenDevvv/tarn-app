# Test Enforcement

Status: active
Last reviewed: 2026-10-01
Applies to: all work in this project

This governance file is required by root `AGENTS.md` and the WWG readiness model, but is not emitted by `wwg generate-governance` in WWG 0.6.6 (verified: `test-enforcement.md` is absent from the tool's `GOVERNANCE_OUTPUTS` list). It is authored here so readiness checks have a real policy to read. Do not expect regeneration to overwrite it.

## Current State

**A full verification path exists and runs.** As of 2026-10-01:

- Vitest 5.0 runs across all six workspace packages.
- **90 tests pass**: 7 types, 13 auth/password, 23 validation, 24 database (17 schema scope + 7 integration), 13 API, 10 React.
- **Playwright passes 24 assertions** across a desktop and a 360px project, in a real browser.
- `pnpm lint` is clean and gated in CI (ESLint 9 flat config).
- `pnpm typecheck` is clean, including `tests/tsconfig.json` for the Playwright specs.
- `pnpm build` succeeds for both apps.
- `pnpm audit` reports **no known vulnerabilities**.
- GitHub Actions runs install, `db:generate`, `migrate deploy`, lint, dependency audit, typecheck, test, and build against a Postgres service. A parallel `e2e` job installs Chromium and runs the browser suite. Dependabot opens weekly dependency PRs, and a lockfile-diff dependency review runs on every pull request.
- All four checks are required by branch protection on `main`, along with the CodeRabbit review, and admin enforcement is on.
- **The `e2e` job has a proven green run on GitHub** — 2m47s, running the 24 browser and accessibility assertions in a real browser engine against a real Postgres. `verify` runs in 52s.

Still absent:

- No API tests against a real database at the *route* level yet — the database integration tests cover the persistence layer, not HTTP handlers with auth.
- No React tests for real features, because no features exist.

Deliberately not installed:

- **Husky and lint-staged.** Measured on this repo: lint 2.9s, typecheck 5.9s, tests 6.9s, build 4.5s — a ~20s local gate. A pre-commit hook would save roughly the 2.9s it takes to run `pnpm lint` by hand, while the real wait is the CodeRabbit review at ~3 minutes, which no hook can pre-empt. The cost is a dependency, hook plumbing, and a new failure mode where broken tooling blocks all commits. Revisit if the repo grows past roughly 500 files or lint exceeds ~10s.
- **No AI code reviewer gap remains** — CodeRabbit is installed and required. See `.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md`.

## Dependency Scanning

Owner-confirmed and free. Three layers:

| Layer | Where | What it catches |
|---|---|---|
| Dependabot | `.github/dependabot.yml` | Known advisories, plus routine version bumps. Grouped so they do not flood the repo. Watches the GitHub Actions themselves too. |
| Dependency review | `.github/workflows/dependency-review.yml` | A pull request that *introduces* a vulnerable dependency. Fails at `moderate`. |
| Whole-tree audit | `pnpm audit --audit-level=high` in `ci.yml` | Anything already on the branch. |

Prisma major bumps are ignored by Dependabot on purpose: a Prisma major changes client generation and needs a manual migration.

**This is a required part of the gate.** If a fix would require removing a test or lowering a threshold to make `pnpm audit` pass, that is a scope decision for the owner, not something to quietly work around.

## Running the browser tests locally

`playwright install chromium` fails in this environment (the download is blocked). The suite therefore drives the **system-installed** Microsoft Edge by default:

```bash
npx playwright test                     # uses Edge
PW_CHANNEL=chrome npx playwright test   # use Chrome instead
PW_CHANNEL= npx playwright test         # require bundled Chromium
```

CI keeps the pinned bundled Chromium for reproducibility — do not switch CI to `channel`.

## Required Strategy Once Implementation Begins

Per `job-application-tracker-project-architecture.md` §62 and §63, the accepted test stack is:

| Layer | Tool | Scope | Status |
|---|---|---|---|
| Unit | Vitest | utilities, status transitions, analytics calculations, validation schemas, business-rule helpers | ✅ installed, 20 tests (types 7, auth 13) |
| Schema scope | Vitest | MVP table set, enums, ownership columns, required indexes | ✅ installed, 17 tests |
| Database integration | Vitest + Postgres | cascades, cross-user isolation, unique constraints, hash verification | ✅ installed, 7 tests, skips loudly without a DB |
| API | Vitest + Supertest | authentication, ownership validation, application CRUD, filters, status updates, timeline creation, follow-ups | ⚠️ 13 smoke/envelope/CORS/error tests. **No auth or CRUD route tests yet** — those arrive with the features. |
| React component | React Testing Library + jsdom | application form, filters, status display, loading/error states | ⚠️ installed, 10 tests covering the shell and dashboard placeholder only |
| End-to-End | Playwright | app shell, landmarks, focus order, contrast in both themes, 360px layout, 44px targets | ✅ **24 passing** across desktop + 360px. MVP journeys (register, login, create application, move status, follow-up, search/filter, logout) not written — those features do not exist yet. |

CI runs install, Prisma generate, `migrate deploy`, lint, dependency audit, typecheck, test, and build, plus a parallel `e2e` job that installs Chromium and runs the browser suite. All four are required by branch protection.

The `e2e` job sets `PW_CHANNEL: ''`. This matters: `playwright.config.ts` defaults to the system-installed browser for local convenience, and `msedge` does not exist on the ubuntu runner. Without the override the job would fail on browser launch rather than on anything meaningful.

## Two GitHub Actions pitfalls this repo has already hit

Both were found by running the workflow, not by reading it. They are recorded because the failure messages point somewhere unhelpful.

**A job-level `env:` block replaces the top-level one; it does not merge.** The `e2e` job needed one extra variable (`PW_CHANNEL`) alongside five inherited ones. Declaring a job-level `env` silently dropped the other five, and the job failed with `Environment variable not found: DATABASE_URL`. Repeating all the values literally in the job is the fix. Referencing them as `${DATABASE_URL}` does not work either — GitHub does not substitute inside an `env` block, so it resolves to a literal string.

**A workflow-level `services:` block produced runs GitHub would not dispatch.** Moving Postgres to workflow level yielded runs with zero jobs, no log, and `cannot be retried`. Reverting to per-job `services:` blocks worked immediately. The tidier arrangement is the broken one here, so the duplication stays and the reasoning is commented in the workflow file.

The general lesson: a pipeline that has never executed on the platform is not a verified pipeline. Both of these looked correct when written.

## Existing Regression Tests

Two bugs were found and fixed during the scaffold. Each has a regression test, per rule 2:

| Bug | Regression test |
|---|---|
| `app.use('/api/v1', health)` treated the 2-arity health handler as middleware, so **every** `/api/v1/*` request returned the health payload with 200 instead of 404 | `apps/api/src/app.test.ts` → "routing is not swallowed by the health route" |
| An oversized request body returned **500** instead of **413**, because the body-parser error fell through to the generic handler | `apps/api/src/app.test.ts` → "rejects an oversized JSON body with 413, not 500" |

`packages/database/prisma/schema.test.ts` is a standing scope guard rather than a bug regression: it fails if `notifications` or any other deferred table appears, if an MVP table is renamed, if a user-owned table loses `userId`, if the canonical enums drift, or if the §78 indexes are dropped.

`packages/database/tests/integration.test.ts` uses **top-level await** to probe the database before registering the suite. Note the pattern: Vitest collects suites synchronously, so an async wrapper around `describe` does not work. When no database is reachable the suite is registered as `describe.skip` and prints a loud warning — never a silent pass.

## Accessibility Defects Found By These Tests

Running the browser suite immediately paid for itself. Two real violations of the 44px touch-target rule in `DESIGN.md` §11 were found and fixed in `apps/web/src/layouts/app-layout.tsx`:

| Defect | Fix |
|---|---|
| Primary navigation link was 67×19px | Added `inline-flex min-h-11 items-center` — 44px tall, no visual change |
| Focused skip link was under 44px | Added `focus:min-h-11`; it now grows when revealed |

A process note worth keeping: the first version of the touch-target test **logged** undersized targets instead of failing, on the assumption that inline links were exempt. That reasoning silenced a real defect in the project's own navigation. `DESIGN.md` §11 states a flat 44px minimum with no exemption, so the test now fails instead. The only exclusion is elements clipped to 1×1 by `sr-only`, which are not pointer-reachable while hidden — and the skip link is asserted separately in its focused state.

## Enforcement Rules

1. **Meaningful feature behavior requires meaningful tests.** A feature is not done without a test that would fail if the behavior broke.
2. **Bug fixes require regression tests** whenever practical. If a regression test is genuinely impractical, the omission must be documented with a reason in the close-out.
3. **Removed or weakened tests must be flagged explicitly** in the close-out. Silent test deletion or weakening is not acceptable.
4. **Security and ownership behavior requires explicit tests.** Any change touching authentication, authorization, or the ownership boundary (architecture §36, PRD §33) must have tests that attempt cross-user access and prove it is rejected. This area is approval-sensitive — see `.wwg/governance/human-approval-matrix.md`.
5. **Accessibility is verified, not assumed.** Every UI change is checked at 360px width, in light and dark, keyboard-only, per `.wwg/wiki/principles/accessibility-principles.md`. Where no automated tooling exists yet, this is recorded as manual evidence in `.wwg/workspace/testing/manual-verification-evidence.json`.
6. **No test may be weakened to make a suite pass.** A failing test is a finding, not an obstacle.

## Evidence Rules

- Record executable evidence as the command and its result (e.g. `pnpm vitest run` → pass/fail counts).
- Record manual evidence in `.wwg/workspace/testing/manual-verification-evidence.json`; do not claim manual verification as automated coverage.
- Candidate-only evidence (a proposed test not yet written) must stay labeled as a candidate in `.wwg/workspace/testing/regression-candidate-review.md` and must never be reported as coverage.
- `.wwg/workspace/testing/manual-verification-checklist.md` and `.wwg/workspace/testing/non-technical-regression-checklist.md` are the human-facing checklists.

## Current WWG Regression Posture

As of 2026-10-01:

- Regression baseline: present
- Executable tests: **90 unit/integration + 24 browser = 114 assertions**
- Database migration: committed and applied; verified table set matches the MVP scope exactly
- Open gaps: no auth or CRUD route tests (those features do not exist yet); no Husky/lint-staged
- The WWG-generated regression gap list predates all of this and does not reflect the current tests. Regenerate with `wwg adopt refresh-regression` or `wwg maintain`.

## Related Truths

- `.wwg/wiki/project-truth.md` — "Implementation Reality", "Safety and Production Boundaries"
- `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md` — hashing scheme awaiting sign-off
- `.wwg/wiki/principles/plan-vs-implementation-truth.md`

## Related Truths

- `.wwg/wiki/project-truth.md` — "Implementation Reality", "Known Conflicts and Drift Risks"
- `.wwg/wiki/principles/plan-vs-implementation-truth.md`
- `job-application-tracker-project-architecture.md` §62, §63
- `.wwg/governance/test-plan.md`, `.wwg/governance/quality-gates.md`, `.wwg/governance/regression-guardrail-catalog.md`
- `.wwg/workspace/testing/`