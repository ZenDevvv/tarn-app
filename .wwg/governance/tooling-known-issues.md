# Tooling Known Issues

Status: active
Last reviewed: 2026-10-02
Applies to: WWG 0.6.6 (`@homedesk/wwg`)

Recorded defects: WWG-TOOL-001 (open), WWG-TOOL-002 (resolved locally), WWG-TOOL-003 (open), WWG-TOOL-004 (open), WWG-TOOL-005 (open), WWG-TOOL-006 (open).

Human-authored governance note. This file is **not** emitted by `wwg generate-governance`, so regeneration will not overwrite it. It records defects in the WWG tooling itself that this project must work around, so agents do not rediscover them each session or misdiagnose them as project drift.

---

## WWG-TOOL-001 — `wwg maintain` emits a report that `wwg validate` rejects

**Severity:** high — it makes `wwg validate` exit non-zero on a clean project.

**Symptom**

`wwg validate` reports:

```
✕ WWG operating loop files are present and actionable
  HIGH wwg-report-truth-sync-fields-missing (reports/wwg-maintenance-review.md)
```

**Root cause**

`wwg validate` (`dist/cli/commands/validate.js`, function `hasTruthSynchronizationFields`) requires any file under `.wwg/reports/` that matches `/ready for codex|complete|completed|done/i` to contain all ten of these strings:

`WWG Truth Synchronization` · `Task mode` · `New truth detected` · `Wiki updated` · `Workspace updated` · `Governance review completed` · `Drift status` · `Canonical files changed` · `Implementation discoveries synced` · `Remaining stale context`

`wwg maintain` does not emit that section. The maintenance report contains the word "complete" (for example "Complete the missing WWG-owned structure"), which trips the readiness-claim check.

**Workaround (current procedure)**

After every `wwg maintain --target .` run, append a `## WWG Truth Synchronization` section to `.wwg/reports/wwg-maintenance-review.md` before running `wwg validate`. A ready-to-adapt section currently lives in that report and includes all ten required fields.

**Verification**

```powershell
wwg validate --target .
```

Expected: `Validation  pass`, High findings `0`.

**Do not** respond to this finding by deleting the maintenance report, or by ignoring a failing validate. The finding is a true positive about the report's completeness, not a false positive to suppress.

**Status:** open, upstream bug. Re-check after any `@homedesk/wwg` upgrade.

---

## WWG-TOOL-002 — `test-enforcement.md` is required but never generated

**Severity:** medium — it blocks a Must Have readiness item.

**Symptom**

`wwg status`, `wwg doctor`, and `wwg maintain` report:

```
✕ Test enforcement governance present -> wwg generate-governance
```

Running `wwg generate-governance` does **not** create the file.

**Root cause**

`test-enforcement.md` is listed in the WWG `AGENTS.md` template and checked by the readiness model, but it is **absent from the `GOVERNANCE_OUTPUTS` array** in `dist/cli/commands/generation.js` in v0.6.6. The readiness model requires a file the generator will never write.

**Workaround (current state)**

`.wwg/governance/test-enforcement.md` is authored and maintained by hand in this project. It is not in `GOVERNANCE_OUTPUTS`, so `wwg generate-governance` and `wwg doctor --apply` leave it intact — verified after both were run.

**Status:** resolved locally by hand-authored file. Re-check after any upgrade; if a future version emits the file, review the generated content against the hand-authored policy before adopting it.

---

## WWG-TOOL-003 — Adoption scan ignores non-`README` product documents

**Severity:** high — it silently produced an empty Project Truth.

**Symptom**

`wwg adopt --mode infer --apply` reported success with an adoption readiness score of 23/100 and confidence LOW, having read only `DESIGN.md` and the repository folder name. It did **not** read `job-application-tracker-brd-prd.md` (1377 lines) or `job-application-tracker-project-architecture.md` (2273 lines), both sitting in the same folder. The resulting Project Truth contained 29 `NEEDS_CONFIRMATION` items, 7 `INFERRED`, and 0 `CONFIRMED`, and listed "Source folders: None detected".

**Root cause**

The adoption audit is a lightweight heuristic scan. It has no option to supply an explicit evidence scope — `wwg adopt` exposes only `--mode`, `--target`, `--agent`, `--dry-run`, `--apply`, `--force`, and `--write-registry`. There is no flag to point it at specific documents.

**Workaround (current procedure)**

Do not rely on `wwg adopt` alone to capture truth from a documentation-heavy repository. After adopting, agents must manually ingest the authoritative documents into `.wwg/wiki/project-truth.md` and `.wwg/wiki/terminology.md`, citing `file + section` for each accepted claim. This was done on 2026-10-01 and is recorded in `.wwg/workspace/current-task.md`.

**Detection heuristic**

Treat adoption as suspect when the audit reports low confidence and produces zero `CONFIRMED` items while large Markdown files exist in the repository root. Compare audit "Evidence Reviewed" against an actual `Get-ChildItem` listing.

**Status:** open, upstream limitation.

---

## WWG-TOOL-004 — Stale validate report can contradict a live run

**Severity:** low — misleading evidence.

**Symptom**

`.wwg/reports/wwg-validate-report.md` read `Overall status: PASS` while a live `wwg validate --target .` run exited non-zero with a HIGH finding. The on-disk report had been written by an earlier command (`wwg adopt --apply`) and was not refreshed by later state changes.

**Workaround**

Always re-run `wwg validate --target .` and read the live exit code rather than trusting the stored report. Note that `wwg adopt` can write a validate report describing the adopt command, not a full validation.

**Status:** open, upstream behavior. Read live output, not stored reports.

---

## WWG-TOOL-005 — `wwg brief` ignores `product.*` in the project registry, so handoffs report "TBD" and "Not published"

**Severity:** medium — it makes the agent handoff contradict settled project truth.

**Symptom**

`.wwg/reports/wwg-agent-handoff.md` and `wwg-handoff-to-codex.md` emitted:

```
## GitHub Repository
Not published.

## Project Summary
- Project: TBD
- Summary: TBD
- Status: TBD
```

…along with `Users and Roles: TBD`, `MVP Features: TBD`, `Pages / Screens: TBD`,
`Architecture and Hosting Preferences: TBD`, and `Design Preferences: TBD` — while
`.wwg/wiki/project-truth.md` had all of it as CONFIRMED and the repository was in fact
published at `ZenDevvv/tarn-app`.

**Root cause**

`wwg brief` does not read the `product:` key this project uses. In
`dist/core/agent-handoff.js` (v0.6.6):

- `projectSummary()` reads `registry.project.name`, `registry.project.description`,
  `registry.project.status` — then falls back to `intake.answers.yaml`.
- `githubRepoFromRegistry()` reads `registry.github.repository`, then
  `registry.reports.github_repo` — then returns the literal `"Not published."`.

`.wwg/config/wwg.project.yaml` defined `product.name: Tarn` and a `product.*` block, which
no code path consults. `.wwg/config/intake.answers.yaml` did not exist, so every fallback
resolved to `TBD`.

**Workaround (current procedure)**

Two changes, both applied 2026-10-02:

1. `.wwg/config/wwg.project.yaml` gained a `github:` block with `repository`.
2. `.wwg/config/intake.answers.yaml` was authored with `app_name`, `app_summary`, `status`,
   `users`, `roles`, `mvp_features`, `core_features`, `pages`, `hosting`, `design_style`,
   and `open_questions`. These values are restatements of Project Truth with evidence
   cited in-file, not new decisions.

Recognised answer keys, from `dist/core/agent-handoff.js`:
`app_name`, `app_summary`, `status`, `users`, `roles`, `mvp_features`, `core_features`,
`pages`, `hosting`, `design_style`, `design_tone`, `open_questions`.

Values render as: arrays are joined with `", "`; a plain string is used verbatim.

**Do not** fix this by hand-editing the generated handoff prose. The next `wwg brief` run
overwrites it. Fix the registry or the intake answers.

**Status:** open, upstream schema mismatch. Re-check after any `@homedesk/wwg` upgrade — if
a future version reads `product.*`, reconcile the two representations rather than keeping
both.

---

## WWG-TOOL-006 — `wwg maintain` can report a `Stop` execution gate with zero critical findings

**Severity:** medium — an agent obeying the gate literally halts all work.

**Symptom**

`.wwg/reports/wwg-maintenance-review.md` reported all of the following **simultaneously**:

```
WWG STATUS: Critical Alignment Break
Truth Alignment Status: RED / Critical Alignment Break
EXECUTION GATE: Stop

- Critical: 0
- High: 0
- Medium: 1
- Warnings 1  (console)
- Advisory 17 (console)
```

**Root cause**

The Drift Score (6/10) that feeds the alignment level is computed from heuristic
categories, including `Documentation Lag` and `Regression / Quality Drift`. The latter
fires on "governance, audit, report, history, or regression evidence appears to be removed
without documented approval" — which triggers on ordinary artifact-registration bookkeeping
and did not correspond to any actual removal or truth conflict.

**Workaround (current procedure)**

Read the finding counts and the per-finding tables, not the header block. Treat a
`Stop` gate as advisory when Critical and High are both 0 and the named categories are
report-bookkeeping. Logged as REC-0004.

**Do not** resolve this by editing the header to a lower severity. That would falsify
generated evidence. Record the discrepancy instead, as REC-0004 does.

**Status:** open, upstream behavior.