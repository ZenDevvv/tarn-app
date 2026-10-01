# Test Enforcement

Status: active
Last reviewed: 2026-10-01
Applies to: all work in this project

This governance file is required by root `AGENTS.md` and the WWG readiness model, but is not emitted by `wwg generate-governance` in WWG 0.6.6 (verified: `test-enforcement.md` is absent from the tool's `GOVERNANCE_OUTPUTS` list). It is authored here so readiness checks have a real policy to read. Do not expect regeneration to overwrite it.

## Current State

**A full verification path exists and runs.** As of 2026-10-01:

- Vitest 3.2 runs across all six workspace packages.
- **90 tests pass**: 7 types, 13 auth/password, 23 validation, 24 database (17 schema scope + 7 integration), 13 API, 10 React.
- **Playwright passes 24 assertions** across a desktop and a 360px project, in a real browser.
- `pnpm lint` is clean and gated in CI (ESLint 9 flat config).
- `pnpm typecheck` is clean, including `tests/tsconfig.json` for the Playwright specs.
- `pnpm build` succeeds for both apps.
- GitHub Actions runs install, `db:generate`, `migrate deploy`, lint, typecheck, test, and build against a Postgres service.

Still absent:

- No API tests against a real database at the *route* level yet — the database integration tests cover the persistence layer, not HTTP handlers with auth.
- No React tests for real features, because no features exist.
- Husky / lint-staged not installed.

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

CI (GitHub Actions) runs install, Prisma generate, `migrate deploy`, lint, typecheck, test, and build. Playwright is intentionally excluded (architecture §63) but the specs exist and type-check.

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