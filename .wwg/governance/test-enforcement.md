# Test Enforcement

Status: active
Last reviewed: 2026-10-01
Applies to: all work in this project

This governance file is required by root `AGENTS.md` and the WWG readiness model, but is not emitted by `wwg generate-governance` in WWG 0.6.6 (verified: `test-enforcement.md` is absent from the tool's `GOVERNANCE_OUTPUTS` list). It is authored here so readiness checks have a real policy to read. Do not expect regeneration to overwrite it.

## Current State

**A runnable test path now exists.** As of the 2026-10-01 scaffold:

- Vitest is installed at the workspace root and runs across all packages.
- 60 tests pass: 7 (`@tarn/types`), 17 (`@tarn/database` schema scope), 23 (`@tarn/validation`), 13 (`@tarn/api`).
- `pnpm typecheck` is clean across all five workspace packages.
- `pnpm build` succeeds for both apps.
- GitHub Actions runs install, `db:generate`, typecheck, test, and build.

Still absent:

- No React component tests (React Testing Library not installed).
- No Playwright E2E.
- No database-backed API tests — the current API suite injects env and does not touch Postgres.
- **No ESLint config**, so `pnpm lint` enforces nothing and CI has no lint gate.
- No migration has been applied, so no test has run against a real database.

## Required Strategy Once Implementation Begins

Per `job-application-tracker-project-architecture.md` §62 and §63, the accepted test stack is:

| Layer | Tool | Scope | Status |
|---|---|---|---|
| Unit | Vitest | utilities, status transitions, analytics calculations, validation schemas, business-rule helpers | ✅ installed, 30 tests |
| Schema scope | Vitest | MVP table set, enums, ownership columns, required indexes | ✅ installed, 17 tests |
| API | Vitest + Supertest | authentication, ownership validation, application CRUD, filters, status updates, timeline creation, follow-ups | ⚠️ Supertest installed; only smoke/envelope/CORS/error tests exist (13). No DB-backed CRUD or auth tests yet. |
| React component | React Testing Library | application form, filters, status display, loading/error states, interactive components | ❌ not installed |
| End-to-End | Playwright | register, login, create application, update application, move status, create follow-up, search/filter, logout | ❌ not installed |

CI (GitHub Actions) runs install, Prisma generate, typecheck, test, and build. Playwright E2E is intentionally excluded for now (architecture §63). Lint is **not** enforced because no ESLint config exists.

## Existing Regression Tests

Two bugs were found and fixed during the scaffold. Each has a regression test, per rule 2:

| Bug | Regression test |
|---|---|
| `app.use('/api/v1', health)` treated the 2-arity health handler as middleware, so **every** `/api/v1/*` request returned the health payload with 200 instead of 404 | `apps/api/src/app.test.ts` → "routing is not swallowed by the health route" |
| An oversized request body returned **500** instead of **413**, because the body-parser error fell through to the generic handler | `apps/api/src/app.test.ts` → "rejects an oversized JSON body with 413, not 500" |

`packages/database/prisma/schema.test.ts` is a standing scope guard rather than a bug regression: it fails if `notifications` or any other deferred table appears, if an MVP table is renamed, if a user-owned table loses `userId`, if the canonical enums drift, or if the §78 indexes are dropped.

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

As of 2026-10-01, after the scaffold:

- Regression baseline: present
- Executable tests: 60 passing across 4 packages
- Open regression gaps: the WWG-generated gap list predates the scaffold and does not yet reflect the new test files. Re-run `wwg adopt refresh-regression` or `wwg maintain` to regenerate it.
- Manual evidence confirmed: 0 for application behaviour (there is no application behaviour yet)
- Known gaps: no DB-backed tests, no React tests, no E2E, no lint gate

## Related Truths

- `.wwg/wiki/project-truth.md` — "Implementation Reality", "Known Conflicts and Drift Risks"
- `.wwg/wiki/principles/plan-vs-implementation-truth.md`
- `job-application-tracker-project-architecture.md` §62, §63
- `.wwg/governance/test-plan.md`, `.wwg/governance/quality-gates.md`, `.wwg/governance/regression-guardrail-catalog.md`
- `.wwg/workspace/testing/`