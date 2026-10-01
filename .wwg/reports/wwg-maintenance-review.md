# WWG Maintenance Review

WWG STATUS: Mild Truth Drift
Truth Alignment Status: YELLOW / Mild Truth Drift
EXECUTION GATE: Warn

## Plain-English Summary

Recent work introduced small assumptions, terminology changes, or documentation lag that may not yet be reflected in Project Truth.

Recommended decision:
Accept as New Truth

Why:
- Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
- Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.

## Recommended Next Step

Review and sync Project Truth only if the change was intentional.

## Recommended Natural Prompt

Tell the agent: "Accept this as an intentional requirement change and sync Project Truth, terminology, and requirements docs with the latest implementation and reports."

## Backup CLI

wwg update-truth

## Summary

- Total findings: 16
- Critical: 0
- High: 0
- Medium: 3
- Low: 8
- Info: 5
- Safe-to-apply recommendations: 1
- Requires-user-confirmation: 6
- Archive candidates: 0
- Merge candidates: 0
- Rename candidates: 0
- Stale context candidates: 4
- Drift Score: 2/10
- Truth Alignment Status: Mild Truth Drift
- Interpretation: Drift Score 2/10 does not necessarily mean the project is wrong. It reflects requirement evolution or documentation lag that should be reviewed.

## Scope

- Target path: .
- Timestamp: 2026-10-01T06:59:37.003Z
- Command: `wwg maintain --target C:\Users\Zen\Desktop\MY PROJECTS\applicant-tracking-system`
- Dry-run status: true
- Safety: no deletes, moves, archives, renames, broad rewrites, or apply behavior were performed.

## Report Currency

This maintenance report is point-in-time evidence for the target path above. Findings are current as of the timestamp above. Do not read older maintain or doctor reports as current state without checking newer handoff, validation, upgrade, doctor, or maintenance artifacts.

Historical reports are preserved by policy and are not deleted automatically. If a later artifact created a missing handoff, refreshed validation, or completed an upgrade, that newer artifact supersedes the earlier missing-artifact finding.

## Maintenance Model

WWG maintenance has two forms:

1. Continuous Maintenance Awareness: Agents must notice and record maintenance drift during normal truth-loop work.
2. Explicit Maintenance Review: `wwg maintain --target <path>` generates a structured report of maintenance findings and recommendations.

WWG is self-maintaining by doctrine, and maintainable by command.

The truth loop is continuous. The maintenance review is explicit.

## How to Use This Review

This review is advisory and non-destructive.

Use it to decide which recommendations should become:

- immediate edits
- future prompts
- archive/move/rename candidates
- user-confirmation items
- safe generated-section updates
- ignored findings

## Findings by Category

- generated-artifact-freshness: 4
- handoff-readiness: 3
- naming-drift: 2
- registry-compatibility: 1
- regression-governance: 1
- report-policy-drift: 3
- truth-loop-drift: 2

## Truth Alignment Findings

- Level: YELLOW / Mild Truth Drift
- Execution Gate: warn / Warn
- Drift Score: 2/10
- Interpretation: Drift Score 2/10 does not necessarily mean the project is wrong. It reflects requirement evolution or documentation lag that should be reviewed.

Category findings:
- Requirement Evolution: none detected.
- Undocumented Requirement Change: none detected.
- Documentation Lag:
  - Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
  - Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.
- Implementation Drift: none detected.
- Regression / Quality Drift: none detected.
- Terminology Drift: none detected.

## Continuous Maintenance Awareness Findings

These findings are signals agents should notice during ordinary truth-loop work and either fix when directly related or record for follow-up.

- LOW Expected context or readiness artifact is missing (.wwg/governance/quality-gates.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/context/project-context.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/skills/skill-index.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Report policy drift (.wwg/reports/README.md): Create `.wwg/reports/README.md` with `wwg doctor --apply`, or add it during project initialization before claiming report-policy readiness.
- LOW Changelog project memory is missing (CHANGELOG.md): Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history.
- LOW README front door is missing (README.md): Run `wwg readme generate --target . --dry-run` before creating README.md.
- INFO Skill Manifest is not generated (.wwg/config/skill-manifest.yaml): Run `wwg refresh-skills --target .` when governed project skill state should be refreshed.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Explicit Maintenance Review Findings

These findings were produced by the explicit `wwg maintain` review. They are recommendations, not automatic cleanup actions or audit/validate hard failures.

- generated-artifact-freshness: 4
- handoff-readiness: 3
- naming-drift: 2
- registry-compatibility: 1
- regression-governance: 1
- report-policy-drift: 3
- truth-loop-drift: 2

## Recommended Create/Edit/Merge/Move/Rename/Archive/Ignore/Delete/Keep Actions

| Path | Category | Issue | Recommended Action | Risk | Can Apply Safely? | Needs User Confirmation? | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| .wwg/reports/wwg-agent-handoff.md | handoff-readiness | Expected context or readiness artifact is missing | create | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/reports/wwg-agent-handoff.md | handoff-readiness | Generic Agent Handoff is missing | create | low | no | no | Run `wwg brief --target .` when ready; maintain only reports the readiness gap. |
| .wwg/workspace/testing/regression-candidate-review.md | regression-governance | Regression candidates need confirmation evidence | review | low | no | yes | Review `.wwg/workspace/testing/regression-candidate-review.md` and record explicit manual/process, executable, or waiver evidence in `.wwg/workspace/testing/manual-verification-evidence.json`. |
| .wwg/governance/quality-gates.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/workspace/context/project-context.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/workspace/skills/skill-index.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/reports/wwg-handoff-to-codex.md | handoff-readiness | Codex compatibility handoff is missing | create | low | no | no | Codex compatibility should be preserved until a deliberate default-agent or deprecation pass changes that policy. |
| .wwg/config/wwg.project.yaml | registry-compatibility | Registry missing generic handoff.agent_report | edit | low | no | yes | `handoff.agent_report` is preferred for new code while `handoff.codex_report` remains compatibility metadata. |
| .wwg/reports/README.md | report-policy-drift | Report policy drift | create | low | yes | no | Create `.wwg/reports/README.md` with `wwg doctor --apply`, or add it during project initialization before claiming report-policy readiness. |
| CHANGELOG.md | truth-loop-drift | Changelog project memory is missing | create | low | no | no | Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history. |
| README.md | truth-loop-drift | README front door is missing | create | low | no | no | Run `wwg readme generate --target . --dry-run` before creating README.md. |
| .wwg/config/skill-manifest.yaml | generated-artifact-freshness | Skill Manifest is not generated | refresh | low | no | no | Run `wwg refresh-skills --target .` when governed project skill state should be refreshed. |
| .wwg/reports/adoption-audit.md | naming-drift | Report filename has unclear purpose suffix | review | low | no | yes | Ambiguous report names should be indexed or renamed only through a deliberate report policy pass. |
| .wwg/reports/context-skill-quality.md | naming-drift | Report filename has unclear purpose suffix | review | low | no | yes | Ambiguous report names should be indexed or renamed only through a deliberate report policy pass. |
|  | report-policy-drift | Report policy drift | review | low | no | yes | Run `wwg reports --target .` and review the Ambiguous / Needs Review section. |
| .wwg/reports/adoption-regression-report.json | report-policy-drift | Ambiguous JSON reports need classification | review | low | no | yes | JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions. |


## Agent-Brand Drift

- None detected.

Allowlisted references:

- None.

## Stable Docs Phase Pollution

- None detected.

Allowlisted historical references:

- None.

## Report Policy Review

- LOW Report policy drift (.wwg/reports/README.md): Create `.wwg/reports/README.md` with `wwg doctor --apply`, or add it during project initialization before claiming report-policy readiness.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Naming Drift

- INFO Report filename has unclear purpose suffix (.wwg/reports/adoption-audit.md): Ambiguous report names should be indexed or renamed only through a deliberate report policy pass.
- INFO Report filename has unclear purpose suffix (.wwg/reports/context-skill-quality.md): Ambiguous report names should be indexed or renamed only through a deliberate report policy pass.

## Context and Skill Freshness

- LOW Expected context or readiness artifact is missing (.wwg/governance/quality-gates.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/context/project-context.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/skills/skill-index.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- INFO Skill Manifest is not generated (.wwg/config/skill-manifest.yaml): Run `wwg refresh-skills --target .` when governed project skill state should be refreshed.

## Governed Skill State

- Skill manifest: not present
- Runtime activation: not performed by WWG; future Vorter responsibility.

## Legacy Copied Skill Cleanup Review

- Report: .wwg/reports/skill-cleanup-review.md
- JSON: .wwg/reports/skill-cleanup-review.json
- Mode: review
- No files removed: yes
- Files removed: 0
- Manifest updated: no
- Review candidates: 0
- Cleanup applied: 0
- Preserved protected: 0
- Reference-only: 6
- Already clean: 5
- Manual review required: 0
- Preserve required: 0
- Needs manual review: 0
- Already reference-only: 6
- Not applicable: 5
- Recommendation: Cleanup is not required now.
- Apply mode: available through explicit `--apply-skill-cleanup`.

## Principle and Truth Loop Review

- LOW Changelog project memory is missing (CHANGELOG.md): Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history.
- LOW README front door is missing (README.md): Run `wwg readme generate --target . --dry-run` before creating README.md.

## Handoff and Registry Readiness

- MEDIUM Expected context or readiness artifact is missing (.wwg/reports/wwg-agent-handoff.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- MEDIUM Generic Agent Handoff is missing (.wwg/reports/wwg-agent-handoff.md): Run `wwg brief --target .` when ready; maintain only reports the readiness gap.
- LOW Codex compatibility handoff is missing (.wwg/reports/wwg-handoff-to-codex.md): Codex compatibility should be preserved until a deliberate default-agent or deprecation pass changes that policy.
- LOW Registry missing generic handoff.agent_report (.wwg/config/wwg.project.yaml): `handoff.agent_report` is preferred for new code while `handoff.codex_report` remains compatibility metadata.

## WWG Readiness

Must Have items are required for agent-safe operation. Other Features are recommendations, not automatic authorization to expand task scope.

### Must Have

- [x] WWG workspace present (present)
  - Evidence: `.wwg`
- [x] Project config present (present)
  - Evidence: `.wwg/config/wwg.project.yaml`
- [x] Project Truth present (present)
  - Evidence: `.wwg/wiki/project-truth.md`
- [x] Terminology present (present)
  - Evidence: `.wwg/wiki/terminology.md`
- [x] Principles README present (present)
  - Evidence: `.wwg/wiki/principles/README.md`
- [x] Workspace current task present (present)
  - Evidence: `.wwg/workspace/current-task.md`
- [x] Governance drift guard present (present)
  - Evidence: `.wwg/governance/drift-guard.md`
- [ ] Recommendation Registry present (missing)
  - Agent action: Complete the missing WWG-owned structure before relying on the project as agent-ready.
  - CLI support: `wwg generate-governance`
  - Evidence: `.wwg/governance/recommendation-registry.md`
- [x] Reports directory present (present)
  - Evidence: `.wwg/reports`
- [x] Root AGENTS.md present (present)
  - Evidence: `AGENTS.md`
- [ ] Test enforcement governance present (missing)
  - Agent action: Complete the missing WWG-owned structure before relying on the project as agent-ready.
  - CLI support: `wwg generate-governance`
  - Evidence: `.wwg/governance/test-enforcement.md`
- [ ] Regression guardrail governance present (missing)
  - Agent action: Complete the missing WWG-owned structure before relying on the project as agent-ready.
  - CLI support: `wwg generate-governance`
  - Evidence: `.wwg/governance/regression-guardrail-catalog.md`
- [x] Validation report present (present)
  - Evidence: `.wwg/reports/wwg-validate-report.md`
- [ ] Audit can run (available)
  - Reason: Run audit when structural or governance confidence matters.
  - CLI support: `wwg audit`
  - Evidence: `.wwg/reports/wwg-audit-report.md`
- [ ] Agent handoff present (missing)
  - Reason: No agent handoff report was detected.
  - Agent action: Generate or request an agent brief before implementation work.
  - CLI support: `wwg brief`
  - Evidence: `.wwg/reports/wwg-agent-handoff.md`, `.wwg/reports/wwg-handoff-to-codex.md`
- [x] Adoption regression baseline present (present)
  - Evidence: `.wwg/governance/regression-manifest.md`, `.wwg/governance/regression-manifest.json`

### Other Features

- [ ] README missing (missing)
  - Reason: The project front door is not present.
  - Agent action: Prepare a README handoff or reviewed scaffold; do not invent final README prose.
  - CLI support: `wwg readme generate --dry-run`
  - Evidence: `README.md`
- [ ] Changelog missing (missing)
  - Reason: Package, product, or git history signals make release memory relevant.
  - Agent action: Prepare or review release narrative before treating changelog wording as final.
  - CLI support: `wwg changelog generate --from-git --weekly --dry-run`
  - Evidence: `CHANGELOG.md`
- [ ] GitHub publishing readiness not checked (available)
  - Reason: Git or GitHub context exists.
  - Agent action: Do not publish without explicit approval; review readiness and secret safety first.
  - CLI support: `wwg publish github --dry-run`
  - Evidence: `.git`, `.github`, `package.json repository`
- [ ] Doctor/self-heal available for repairable issues (available)
  - Reason: Repairable WWG-owned issues were detected by the current command.
  - Agent action: Use doctor for deterministic WWG-owned repair; keep semantic truth review-only.
  - CLI support: `wwg doctor --apply`

### Recommended Next

- [ ] Complete Must Have readiness first (available)
  - Reason: 4 Must Have item(s) are missing.
  - Agent action: Do not treat Other Features as blockers until Must Have readiness is clear.
  - CLI support: `wwg maintain`

Agents should follow Must Have items first. Missing Other Features are not blockers unless the current task depends on them.

## Regression Governance Readiness

- Regression baseline: present
- CI readiness: partial
- Open regression gaps: 7 (0 critical, 0 high)
- Traceability: 0 covered, 0 partial, 0 uncovered, 0 unknown
- Safe report-first candidates: 10 (not counted as coverage)
- Regression candidates: 10 total, 10 proposed, 0 confirmed, 0 waived
- Manual evidence confirmed: 0
- Executable evidence detected: 0
- Candidate-only evidence: 10
- Proposed executable tests: 0 (0 eligible to apply, 0 blocked/unsafe)
- Recommended action: Review `.wwg/workspace/testing/regression-candidate-review.md` and confirm candidates with manual/process or executable evidence before claiming coverage.
- Warnings: 7 open regression gap(s) remain.

## Recommendation Registry Review

- Registry found: No
- Policy found: No
- Suggested action: run or re-run governance generation to restore `.wwg/governance/recommendation-registry.md`.

## Follow-Up Modes

- Update truth/governance now
- Create a cleanup prompt
- Archive/move only after approval
- Ignore as intentional
- Convert into a principle/governance rule

## Suggested Next Actions

- Review `.wwg/workspace/testing/regression-candidate-review.md` and confirm candidates with manual/process or executable evidence before claiming coverage.
- Review medium-or-higher findings before treating the project as freshly maintained.
- Review `.wwg/reports/skill-cleanup-review.md` before applying legacy copied compatibility-domain cleanup.
- Keep all archive, move, rename, delete, and merge recommendations manual unless a dedicated explicit apply flag exists for that workflow.
- Run `wwg reports --target .` before any report archive or promotion work.
- Run `wwg brief --target .` if generic or compatibility agent brief readiness is missing.
- Refresh Workspace/Governance outputs only through explicit generation or refresh commands.
