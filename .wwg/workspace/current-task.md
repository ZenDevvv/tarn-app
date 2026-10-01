# Current Task

Status: DONE — monorepo scaffolded and verified.
Task mode: Existing Project Adoption → Meaningful feature (implementation — repository foundation)
Instance type: existing-project (adopted; this work continues the adoption lifecycle)
Last updated: 2026-10-01

## Task Summary

- Status: DONE
- Task mode: Existing Project Adoption (continued) — Meaningful feature, repository foundation
- Instance type: `existing-project`. This repository was adopted into WWG rather than created by it. The scaffold task below is the first **implementation** task in that adopted project, so adoption context still governs it: truth lives in `.wwg/wiki/`, decisions in `.wwg/wiki/decisions/`, and the canonical product documents remain authoritative for product meaning.
- User request: "proceed to scaffold the monorepo"
- Preceding adoption work: truth ingestion of the PRD, architecture doc and DESIGN.md (2026-10-01), then the owner decision batch D-0001…D-0005 (2026-10-01).

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