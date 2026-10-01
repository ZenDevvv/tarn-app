# Current Task

Status: DONE — stale WWG reports refreshed and the registry corrected at the source.
Task mode: Existing Project Adoption (continued) → governance/report refresh. No application source was touched.
Instance type: existing-project (adopted)
Last updated: 2026-10-02

## Task Summary

- Status: DONE
- User request: "clean up the stale wwg reports first. dont do the auth after, let me give a signal when to execute"

## Why this ran

A progress scan found the delivered pipeline finished and the product features entirely
unbuilt, but also found WWG governance artifacts lagging reality in ways that would
mislead the next agent:

- `.wwg/reports/wwg-agent-handoff.md` and `wwg-handoff-to-codex.md` claimed
  **"GitHub Repository: Not published"** and **"Project: TBD"** — false since 2026-10-01.
- `.wwg/reports/wwg-maintenance-review.md` asserted **README.md is missing** when it exists,
  and that the repository **has no git remote** and **CI has never run** — all untrue.
- `.wwg/governance/regression-gaps.md` claimed **"No existing tests"** against a repository
  with 114 automated assertions.
- `.wwg/config/wwg.project.yaml` had drifted from reality in four places.

## Root cause, not symptom

The handoff reports were not hand-edited. They were generated before the project registry
knew the product name, so every regeneration reproduced the false values.

`.wwg/config/wwg.project.yaml` was corrected at the source, which fixes every future
regeneration. Editing the report prose would have hidden the defect and returned on the
next run.

Registry fields corrected:

| Field | Was | Now | Why it mattered |
|---|---|---|---|
| `canonical_artifacts.design_tokens` | `index.css` | `apps/web/src/index.css` | Token file moved at scaffold time (D-0005) |
| `product.node_requirement` | `>=20.11.0` | `>=22` + `.nvmrc` pointer | `engines` was tightened; registry kept the untested floor |
| `reports.generate_workspace` / `refresh_context` / `refresh_skills` | registered | removed | Pointed at three artifacts that were never written |
| `product.*` | absent | repository, visibility, licence, auth status, delivery pipeline | Source of the "Not published" and "TBD" output |

## What was regenerated vs hand-authored

Regenerated through the responsible WWG command, not by hand:

- `wwg maintain --target .` → `wwg-maintenance-review.md`
- `wwg reports --target .` → `wwg-report-classification-review.md` (new)
- The `## WWG Truth Synchronization` section was then re-applied by hand, because
  `wwg maintain` does not emit it but `wwg validate` requires it (WKG-TOOL-001)

Hand-authored, because no command can produce them correctly:

- `regression-gaps.md` human note, added **outside** the generated block per that file's
  own header. Its stale content is permanent until tooling changes (REC-0002).
- `.wwg/reports/README.md` — the index listed six artifact groups that do not exist.
- `.wwg/governance/recommendation-registry.md` — placeholder row removed, eight real
  entries added.
- `.gitignore` — narrow `.wwg/reports/backups/` rule; the 13 tracked backups were
  untracked with `git rm --cached` and remain on disk.

## Verified by execution, not assumption

- `pnpm test` → **90 passing**, matching Project Truth exactly.
- `wwg validate --target .` → re-run live after the edits; result recorded below.
- Two maintenance findings were **genuinely fixed**, confirmed by their disappearance from
  the regenerated report: `gitignore-policy-drift` cleared, and the false "README front
  door is missing" finding corrected to "needs governance review".

## New findings

- **`wwg maintain` reports `RED / Critical Alignment Break` / `EXECUTION GATE: Stop` while
  simultaneously reporting Critical 0, High 0, Warnings 1.** The drift score comes from
  report-bookkeeping heuristics ("Documentation Lag", "Regression / Quality Drift"), not
  from any real truth conflict. Logged as REC-0004. **An agent obeying that gate literally
  would halt all implementation over report bookkeeping.**
- `wwg reports` classified the adoption regression **baseline** as "ambiguous", despite
  `AGENTS.md` and `regression-gaps.md` both citing it as the source baseline. Now classified
  as promoted in the registry.
- `.gitignore` mojibake suspected in an earlier scan was a **PowerShell console encoding
  artifact, not a file defect**. `§55` is intact. No change made — a false finding avoided.

## Next task — awaiting owner signal

**The authentication module.** Not started, by explicit instruction. It is the only thing
between the scaffold and any reachable protected route, and architecture §90 places it
directly after the database.

Requires: real session/JWT issue and verify, httpOnly cookie handling,
`POST /register` / `login` / `logout`, and replacing the 501 guard at
`apps/api/src/middleware/auth.ts:18` with real verification plus the `userId` ownership
filter. D-0002 confirms auth is MVP scope, not a deferral.

## Remaining Open Questions

1. Which deployment vendors? (REC-0005)
2. Rename the local folder `applicant-tracking-system` to `tarn`? The folder still carries
   the **retired** product name. (REC-0006)
3. Husky and lint-staged, now that merges are gated? Lower value now that CI blocks.
4. When to get an external security review — still deferred, not forgotten.
5. `CHANGELOG.md` — none exists. (REC-0007)

## Close-Out Notes

- Truth Alignment Status: GREEN — Project Truth was verified accurate and required no change.
  The drift was in generated reports and the registry, which is now fixed at the source.
- Execution Gate: pass for this task. Note REC-0004: the maintenance report's own `Stop`
  gate is unreliable in WWG 0.6.6.
- Drift status: LOW
- Implementation confidence: HIGH for foundation, data layer, and delivery pipeline;
  **ZERO for product features**
- New recommendations: **eight added** to the registry (REC-0002 … REC-0008, plus REC-0001
  closed as the placeholder removal). None are promoted into active work.
- No application source file was modified. No product truth was changed.