# WWG Maintenance Review

WWG STATUS: Critical Alignment Break
Truth Alignment Status: RED / Critical Alignment Break
EXECUTION GATE: Stop

## Plain-English Summary

A recent change appears to conflict with Project Truth, reintroduce a regression, weaken required verification, or touch a high-risk area without proper documentation.

Recommended decision:
Regression / Quality Repair

Why:
- Governance, audit, report, history, or regression evidence appears to be removed without documented approval.
- Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
- Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.

## Recommended Next Step

Stop implementation and resolve the truth conflict, regression, or verification gap before continuing.

## Recommended Natural Prompt

Tell the agent: "Treat this as a regression or quality gap. Add or update meaningful tests, document the issue, and repair the implementation."

## Backup CLI

wwg regression-check

## Summary

- Total findings: 12
- Critical: 0
- High: 0
- Medium: 1
- Low: 5
- Info: 6
- Safe-to-apply recommendations: 0
- Requires-user-confirmation: 7
- Archive candidates: 0
- Merge candidates: 2
- Rename candidates: 0
- Stale context candidates: 3
- Drift Score: 6/10
- Truth Alignment Status: Critical Alignment Break
- Interpretation: Drift Score 6/10 indicates a critical conflict, regression, missing verification, or high-risk change that needs planning/reconciliation before more implementation.

## Scope

- Target path: .
- Timestamp: 2026-10-01T07:10:44.955Z
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

- fragmented-guidance: 2
- generated-artifact-freshness: 3
- gitignore-policy-drift: 1
- naming-drift: 1
- regression-governance: 1
- report-policy-drift: 2
- truth-loop-drift: 2

## Truth Alignment Findings

- Level: RED / Critical Alignment Break
- Execution Gate: stop / Stop
- Drift Score: 6/10
- Interpretation: Drift Score 6/10 indicates a critical conflict, regression, missing verification, or high-risk change that needs planning/reconciliation before more implementation.

Category findings:
- Requirement Evolution: none detected.
- Undocumented Requirement Change: none detected.
- Documentation Lag:
  - Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
  - Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.
- Implementation Drift: none detected.
- Regression / Quality Drift:
  - Governance, audit, report, history, or regression evidence appears to be removed without documented approval.
- Terminology Drift: none detected.

## Continuous Maintenance Awareness Findings

These findings are signals agents should notice during ordinary truth-loop work and either fix when directly related or record for follow-up.

- LOW Expected context or readiness artifact is missing (.wwg/workspace/context/project-context.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/skills/skill-index.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Report policy drift (.gitignore): Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`.
- LOW Changelog project memory is missing (CHANGELOG.md): Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history.
- LOW README front door is missing (README.md): Run `wwg readme generate --target . --dry-run` before creating README.md.
- INFO Potential fragmented guidance: readiness (.wwg/governance/operational-readiness-review.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Potential fragmented guidance: principles (.wwg/governance/recommendation-policy.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Skill Manifest is not generated (.wwg/config/skill-manifest.yaml): Run `wwg refresh-skills --target .` when governed project skill state should be refreshed.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Explicit Maintenance Review Findings

These findings were produced by the explicit `wwg maintain` review. They are recommendations, not automatic cleanup actions or audit/validate hard failures.

- fragmented-guidance: 2
- generated-artifact-freshness: 3
- gitignore-policy-drift: 1
- naming-drift: 1
- regression-governance: 1
- report-policy-drift: 2
- truth-loop-drift: 2

## Recommended Create/Edit/Merge/Move/Rename/Archive/Ignore/Delete/Keep Actions

| Path | Category | Issue | Recommended Action | Risk | Can Apply Safely? | Needs User Confirmation? | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| .wwg/workspace/testing/regression-candidate-review.md | regression-governance | Regression candidates need confirmation evidence | review | low | no | yes | Review `.wwg/workspace/testing/regression-candidate-review.md` and record explicit manual/process, executable, or waiver evidence in `.wwg/workspace/testing/manual-verification-evidence.json`. |
| .wwg/workspace/context/project-context.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/workspace/skills/skill-index.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .gitignore | gitignore-policy-drift | Report policy drift | review | low | no | yes | Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`. |
| CHANGELOG.md | truth-loop-drift | Changelog project memory is missing | create | low | no | no | Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history. |
| README.md | truth-loop-drift | README front door is missing | create | low | no | no | Run `wwg readme generate --target . --dry-run` before creating README.md. |
| .wwg/governance/operational-readiness-review.md | fragmented-guidance | Potential fragmented guidance: readiness | merge | medium | no | yes | This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance. |
| .wwg/governance/recommendation-policy.md | fragmented-guidance | Potential fragmented guidance: principles | merge | medium | no | yes | This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance. |
| .wwg/config/skill-manifest.yaml | generated-artifact-freshness | Skill Manifest is not generated | refresh | low | no | no | Run `wwg refresh-skills --target .` when governed project skill state should be refreshed. |
| .wwg/reports/adoption-audit.md | naming-drift | Report filename has unclear purpose suffix | review | low | no | yes | Ambiguous report names should be indexed or renamed only through a deliberate report policy pass. |
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

- LOW Report policy drift (.gitignore): Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Naming Drift

- INFO Report filename has unclear purpose suffix (.wwg/reports/adoption-audit.md): Ambiguous report names should be indexed or renamed only through a deliberate report policy pass.

## Context and Skill Freshness

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
- INFO Potential fragmented guidance: readiness (.wwg/governance/operational-readiness-review.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Potential fragmented guidance: principles (.wwg/governance/recommendation-policy.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.

## Handoff and Registry Readiness

- None detected.

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
- [x] Recommendation Registry present (present)
  - Evidence: `.wwg/governance/recommendation-registry.md`
- [x] Reports directory present (present)
  - Evidence: `.wwg/reports`
- [x] Root AGENTS.md present (present)
  - Evidence: `AGENTS.md`
- [x] Test enforcement governance present (present)
  - Evidence: `.wwg/governance/test-enforcement.md`
- [x] Regression guardrail governance present (present)
  - Evidence: `.wwg/governance/regression-guardrail-catalog.md`
- [x] Validation report present (present)
  - Evidence: `.wwg/reports/wwg-validate-report.md`
- [x] Audit report present (present)
  - Evidence: `.wwg/reports/wwg-audit-report.md`
- [x] Agent handoff present (present)
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
- [ ] Current version, optional candidate review (available)
  - Reason: Workspace is current. Optional semantic/candidate review artifacts exist; run only if adopting candidate surfaces.
  - Agent action: Treat candidate/review artifacts as optional review surfaces unless the user asks to promote them.
  - CLI support: `wwg audit --upgrade-candidates`
  - Evidence: `.wwg/reports/generated-project-upgrade-review.md`

### Recommended Next

- [ ] Review relevant Other Features (available)
  - Reason: Only detected gaps or context-relevant actions are shown.
  - Agent action: Treat recommendations as scoped support, not permission to expand the current task.
  - CLI support: `wwg brief`

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

- Registry found: Yes
- Policy found: Yes
- Total recommendations: 0

### By Status

No recommendations found.

### By Impact

No recommendations found.

### By Type

No recommendations found.

### Items Needing Review

No items needing review found.

### High-Impact Open Recommendations

No high-impact open recommendations found.

### Stale Review By Items

No stale Review By items found.

### Parsing Warnings

- None.

### Suggested Actions

- Review Proposed recommendations before planning.
- Promote accepted work into Workspace or issue tracker only when intentionally approved.
- Add owners for Accepted or Promoted items.
- Revisit stale Review By dates.
- Keep recommendations in Governance until promoted.

- Automation: maintain summarized the registry only; it did not promote, implement, or rewrite recommendations.

## WWG Truth Synchronization

> Remediation note: this section is applied manually because `wwg maintain` in WWG 0.6.6 does not emit it, yet `wwg validate` requires it on any report that claims readiness or completion. See `.wwg/governance/tooling-known-issues.md` (issue WWG-TOOL-001). Re-apply this section after every `wwg maintain` run.

- Task mode: Existing Project Adoption (continued) — decision ratification and verification closure
- New truth detected: YES
- Wiki updated: YES
- Workspace updated: YES
- Governance review completed: YES
- Drift status: LOW — the scrypt decision was ratified by the owner and the last open verification gap (Playwright) was closed by driving the system-installed browser. Every previously flagged gap is now either resolved or explicitly recorded as still open.
- Canonical files changed:
  - `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md` — status `proposed` → `accepted`, owner confirmation recorded, rejected alternatives written up.
  - `.wwg/wiki/project-truth.md` — hashing confirmed; Playwright moved from OPEN to RESOLVED; browser accessibility results recorded; two accessibility defects logged.
  - `.wwg/governance/test-enforcement.md` — 24 browser assertions, local browser instructions, and the test-integrity failure written up.
  - `.wwg/workspace/current-task.md`, `.wwg/config/wwg.project.yaml` updated.
- Implementation discoveries synced:
  - **Playwright now runs.** The bundled Chromium download is blocked in this environment, so the suite drives the system-installed Microsoft Edge via Playwright's `channel` option. 24 assertions pass across a desktop and a 360px project. CI keeps the pinned bundled browser for reproducibility.
  - **Two real accessibility defects were found by running those tests**, both against the 44px touch-target rule in the accessibility section of the design document: the primary navigation link measured 67×19px, and the focused skip link was under 44px. Both fixed in `apps/web/src/layouts/app-layout.tsx`.
  - **A test-integrity failure occurred and is recorded.** The first touch-target test logged undersized targets instead of failing, on the assumption that inline links were exempt. That silenced a genuine defect in the project's own navigation. The test now fails; the only exclusion is elements clipped to 1×1 by `sr-only`.
  - Contrast is verified at 4.5:1 or better in both light and dark themes, in a real browser.
- Remaining stale context:
  - Four owner questions remain open: external security review timing, deployment vendors, repository directory rename, and Husky/lint-staged wiring.
  - The owner's confirmation of scrypt settles the algorithm choice but **not** the launch security gate. An external review has not taken place.
  - No auth or CRUD route tests exist, because no features exist.
  - The WWG regression gap list predates all of this; regenerate with `wwg adopt refresh-regression`.
  - This report remains point-in-time evidence. Re-run `wwg maintain --target .` after further truth changes rather than treating it as current state, then re-apply this section.

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
