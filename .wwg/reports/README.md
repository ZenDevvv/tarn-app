# WWG Reports

This directory holds WWG-native reports, agent handoffs, validation receipts, maintenance reviews, and generated command evidence for this workspace.

Reports are point-in-time evidence. Canonical project truth lives in `.wwg/wiki/`, active work lives in `.wwg/workspace/`, and governance rules live in `.wwg/governance/`. Newer handoff, validation, upgrade, doctor, or maintenance artifacts may supersede older findings.

## Agent Handoffs

- `wwg-agent-handoff.md`
- `wwg-agent-handoff.json`
- `wwg-handoff-to-codex.md`
- `wwg-handoff-to-codex.json`

## Maintenance

- `wwg-maintenance-review.md`
- `wwg-doctor-report.md`
- `wwg-doctor-report.json`
- `skill-cleanup-review.md`
- `skill-cleanup-review.json`
- `wwg-report-classification-review.md`

## Promoted Evidence

- `adoption-audit.md` — adoption scan, kept as durable evidence
- `adoption-regression-report.md` / `.json` — the adoption regression **baseline**.
  Cited by `AGENTS.md` and `.wwg/governance/regression-gaps.md`; treated as promoted,
  not ambiguous. See the classification note in `.wwg/config/wwg.project.yaml`.

## Routine Generated Reports

Present in this directory:

- `wwg-validate-report.md`
- `context-skill-quality.md` / `.json`
- `wwg-audit-report.md` / `.json`
- `wwg-existing-audit-report.md` / `.json`
- `wwg-adoption-plan.md` / `.json`
- `wwg-adoption-report.md` / `.json`
- `wwg-adoption-truth-handoff.md`
- `wwg-generate-governance-report.md` / `.json`
- `wwg-upgrade-report.md` / `.json`
- `wwg-upgrade-history.md` / `.json`
- `wwg-migration-history.md` / `.json`
- `generated-project-upgrade-review.md` / `.json`
- `readme-validation.md`

Not present, despite previously being listed here or in the registry. Do not assume they
exist; regenerate with the owning command first.

- `runtime-skill-candidates.*` — never generated; Skill Manifest is absent
- `wwg-lint-report.*`, `wwg-init-report.*` — never run in this project
- `wwg-refresh-context-report.md`, `wwg-refresh-skills-report.md` — registry entries for
  these were removed on 2026-10-02 because the files were never written
- `changelog-*.*` — no `CHANGELOG.md` exists yet (REC-0007)

## Backups

- `.wwg/reports/backups/**`

Timestamped `wwg.project.yaml` backups written by WWG on registry changes. These are
transient working copies, **not** evidence. They are untracked and gitignored as of
2026-10-02 (`.gitignore`); the 13 pre-existing files remain on disk and in history.

Backups and routine generated reports are not canonical truth by themselves. Promote durable evidence through a purpose-named report or by updating canonical WWG truth surfaces.

## Known contradictions in this directory

- **Do not trust `wwg-maintenance-review.md` as a gate.** As of 2026-10-02 it reports
  `RED / Critical Alignment Break` with `EXECUTION GATE: Stop` while simultaneously
  reporting Critical 0, High 0. The drift score is driven by report-bookkeeping
  heuristics, not a real truth conflict. Logged as REC-0004. Read the finding counts,
  not the header.
- **Do not trust `wwg-validate-report.md` without re-running.** WWG-TOOL-004: a stored
  validate report can describe a different command than the one that last ran. Always
  run `wwg validate --target .` and read the live exit code.
- **After every `wwg maintain` run**, re-apply the `## WWG Truth Synchronization`
  section to `wwg-maintenance-review.md` or `wwg validate` fails. See WWG-TOOL-001.

