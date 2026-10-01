# WWG Report Classification Review

## Summary

- Total report-like files: 49
- Promoted/canonical: 11
- Routine generated: 22
- Historical: 0
- Backups: 13
- External/human-facing: 0
- Ambiguous: 3
- Archive candidates: 0
- Move candidates: 0
- Ignore candidates: 35

## Policy Summary

`.wwg/reports/` is the canonical native/dogfood home for promoted WWG reports, agent handoffs, promoted audit evidence, maintenance reviews, and agent-readable reports. `.wwg/reports/tmp/` and `.wwg/reports/backups/` are transient/backup spaces and should stay ignored unless evidence is explicitly promoted.

Root `reports/` is retained for historical, release, package, external-upload, and human-facing reports. Root backups are not canonical truth unless evidence is promoted into a purpose-named report.

## Classified Reports

| Path | Category | Recommended Disposition | Commit? | Ignore? | Canonical? | Risk | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| .wwg/reports/adoption-audit.md | promoted-dogfood-report | promote | yes | no | yes | low | Purpose-named dogfood report appears promotable; add it to the report index if it is durable evidence. |
| .wwg/reports/adoption-regression-report.json | ambiguous-json | review | no | no | no | low | JSON report-like output is not promoted by default and needs explicit classification before retention. |
| .wwg/reports/adoption-regression-report.md | ambiguous | review | no | no | no | medium | Report-like file does not match a known report policy category. |
| .wwg/reports/backups/wwg.project.20261001T070320Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T070324Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T071017Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T071033Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T071040Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T071154Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T091230Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T091301Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T093343Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T093348Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T101325Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T103102Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/backups/wwg.project.20261001T105321Z.yaml | backup | ignore | no | yes | no | low | Backup reports are local/generated artifacts and should not become canonical truth in place. |
| .wwg/reports/context-skill-quality.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/context-skill-quality.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/generated-project-upgrade-review.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/generated-project-upgrade-review.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/readme-validation.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/README.md | promoted-dogfood-report | keep | yes | no | yes | low | Report is indexed as promoted dogfood/native evidence. |
| .wwg/reports/skill-cleanup-review.json | promoted-json | keep | yes | no | yes | low | JSON report is explicitly indexed as promoted machine-readable evidence. |
| .wwg/reports/skill-cleanup-review.md | maintenance-review-evidence | keep | yes | no | yes | low | Report is indexed as maintenance review evidence. |
| .wwg/reports/wwg-adoption-plan.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-adoption-plan.md | routine-generated-command-report | ignore | no | yes | no | low | Routine generated command report should stay ignored unless promoted. |
| .wwg/reports/wwg-adoption-report.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-adoption-report.md | routine-generated-command-report | ignore | no | yes | no | low | Routine generated command report should stay ignored unless promoted. |
| .wwg/reports/wwg-adoption-truth-handoff.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-agent-handoff.json | compatibility-json | keep | yes | no | yes | low | Handoff JSON is retained as compatibility machine-readable handoff evidence. |
| .wwg/reports/wwg-agent-handoff.md | agent-handoff | keep | yes | no | yes | low | Preferred generic Agent Handoff artifact. |
| .wwg/reports/wwg-audit-report.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-audit-report.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-doctor-report.json | promoted-json | keep | yes | no | yes | low | JSON report is explicitly indexed as promoted machine-readable evidence. |
| .wwg/reports/wwg-doctor-report.md | maintenance-review-evidence | keep | yes | no | yes | low | Report is indexed as maintenance review evidence. |
| .wwg/reports/wwg-existing-audit-report.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-existing-audit-report.md | routine-generated-command-report | ignore | no | yes | no | low | Routine generated command report should stay ignored unless promoted. |
| .wwg/reports/wwg-generate-governance-report.json | ambiguous-json | review | no | no | no | low | JSON report-like output is not promoted by default and needs explicit classification before retention. |
| .wwg/reports/wwg-generate-governance-report.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-handoff-to-codex.json | compatibility-json | keep | yes | no | yes | low | Handoff JSON is retained as compatibility machine-readable handoff evidence. |
| .wwg/reports/wwg-handoff-to-codex.md | compatibility-handoff | keep | yes | no | yes | low | Codex compatibility handoff artifact retained by policy. |
| .wwg/reports/wwg-maintenance-review.md | maintenance-review-evidence | keep | yes | no | yes | low | Report is indexed as maintenance review evidence. |
| .wwg/reports/wwg-migration-history.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-migration-history.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-upgrade-history.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-upgrade-history.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-upgrade-report.json | routine-generated-json | ignore | no | yes | no | low | Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence. |
| .wwg/reports/wwg-upgrade-report.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |
| .wwg/reports/wwg-validate-report.md | routine-generated-command-report | ignore | no | yes | no | low | Indexed routine report is generated output and should stay ignored unless promoted. |


## Promotion Candidates

- .wwg/reports/adoption-audit.md (promoted-dogfood-report, promote) - Purpose-named dogfood report appears promotable; add it to the report index if it is durable evidence.

## Archive Candidates

- None.

## Ignore Candidates

- .wwg/reports/backups/wwg.project.20261001T070320Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T070324Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T071017Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T071033Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T071040Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T071154Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T091230Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T091301Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T093343Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T093348Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T101325Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T103102Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/backups/wwg.project.20261001T105321Z.yaml (backup, ignore) - Backup reports are local/generated artifacts and should not become canonical truth in place.
- .wwg/reports/context-skill-quality.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/context-skill-quality.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/generated-project-upgrade-review.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/generated-project-upgrade-review.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/readme-validation.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-adoption-plan.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-adoption-plan.md (routine-generated-command-report, ignore) - Routine generated command report should stay ignored unless promoted.
- .wwg/reports/wwg-adoption-report.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-adoption-report.md (routine-generated-command-report, ignore) - Routine generated command report should stay ignored unless promoted.
- .wwg/reports/wwg-adoption-truth-handoff.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-audit-report.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-audit-report.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-existing-audit-report.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-existing-audit-report.md (routine-generated-command-report, ignore) - Routine generated command report should stay ignored unless promoted.
- .wwg/reports/wwg-generate-governance-report.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-migration-history.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-migration-history.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-upgrade-history.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-upgrade-history.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-upgrade-report.json (routine-generated-json, ignore) - Routine JSON reports are transient by default unless explicitly required by compatibility or release evidence.
- .wwg/reports/wwg-upgrade-report.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.
- .wwg/reports/wwg-validate-report.md (routine-generated-command-report, ignore) - Indexed routine report is generated output and should stay ignored unless promoted.

## Ambiguous / Needs Review

- .wwg/reports/adoption-regression-report.json (ambiguous-json, review) - JSON report-like output is not promoted by default and needs explicit classification before retention.
- .wwg/reports/adoption-regression-report.md (ambiguous, review) - Report-like file does not match a known report policy category.
- .wwg/reports/wwg-generate-governance-report.json (ambiguous-json, review) - JSON report-like output is not promoted by default and needs explicit classification before retention.

## Policy Findings

- INFO ambiguous-report-classification: Some report-like files need human classification. Recommendation: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.

## Suggested Next Actions

- Review ambiguous report files before promoting, archiving, or ignoring them.
- Keep movement, deletion, and archive application as explicit future actions.
- Promote only purpose-named Markdown reports with durable evidence, handoff context, maintenance findings, release/certification evidence, or external-upload material.
- Keep routine JSON, backups, and scratch reports ignored unless a documented compatibility or release workflow requires them.
