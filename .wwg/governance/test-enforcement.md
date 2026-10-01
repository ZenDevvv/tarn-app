# Test Enforcement

Status: active
Last reviewed: 2026-10-01
Applies to: all work in this project

This governance file is required by root `AGENTS.md` and the WWG readiness model, but is not emitted by `wwg generate-governance` in WWG 0.6.6 (verified: `test-enforcement.md` is absent from the tool's `GOVERNANCE_OUTPUTS` list). It is authored here so readiness checks have a real policy to read. Do not expect regeneration to overwrite it.

## Current State

**No test infrastructure exists.** This repository contains documentation and design assets only. There is no `package.json`, no test runner, no CI workflow, and no `apps/` or `packages/` tree.

Consequently:

- There are zero executable tests.
- There is no runnable verification path (no `pnpm test`, no `npm test`, no `vitest`, no `playwright`).
- WWG's automated regression gates cannot execute. All current regression evidence is manual or candidate-only.

This is acceptable **at documentation stage** and is recorded as `NEEDS_CONFIRMATION` in `.wwg/wiki/project-truth.md`. It stops being acceptable the moment application code lands.

## Required Strategy Once Implementation Begins

Per `job-application-tracker-project-architecture.md` §62 and §63, the accepted test stack is:

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | utilities, status transitions, analytics calculations, validation schemas, business-rule helpers |
| API | Vitest + Supertest | authentication, ownership validation, application CRUD, filters, status updates, timeline creation, follow-ups |
| React component | React Testing Library | application form, filters, status display, loading/error states, interactive components |
| End-to-End | Playwright | register, login, create application, update application, move status, create follow-up, search/filter, logout |

CI (GitHub Actions) is planned to run: install dependencies, type check, lint, unit tests, build frontend, build backend, API tests. Playwright E2E is optional at first.

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

- Regression baseline: present (`.wwg/governance/regression-manifest.md`)
- Open regression gaps: 7 (0 critical, 0 high)
- Traceability: 0 covered, 0 partial, 0 uncovered, 0 unknown — because no code exists to trace
- Regression candidates: 10 proposed, 0 confirmed, 0 waived
- Executable evidence detected: 0

## Related Truths

- `.wwg/wiki/project-truth.md` — "Implementation Reality", "Known Conflicts and Drift Risks"
- `.wwg/wiki/principles/plan-vs-implementation-truth.md`
- `job-application-tracker-project-architecture.md` §62, §63
- `.wwg/governance/test-plan.md`, `.wwg/governance/quality-gates.md`, `.wwg/governance/regression-guardrail-catalog.md`
- `.wwg/workspace/testing/`