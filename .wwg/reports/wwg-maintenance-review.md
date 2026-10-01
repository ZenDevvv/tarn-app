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

- Total findings: 18
- Critical: 0
- High: 0
- Medium: 1
- Low: 4
- Info: 13
- Safe-to-apply recommendations: 0
- Requires-user-confirmation: 13
- Archive candidates: 0
- Merge candidates: 2
- Rename candidates: 7
- Stale context candidates: 3
- Drift Score: 6/10
- Truth Alignment Status: Critical Alignment Break
- Interpretation: Drift Score 6/10 indicates a critical conflict, regression, missing verification, or high-risk change that needs planning/reconciliation before more implementation.

## Scope

- Target path: .
- Timestamp: 2026-10-01T16:25:13.285Z
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
- naming-drift: 8
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
- LOW Changelog project memory is missing (CHANGELOG.md): Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history.
- LOW README front door needs governance review (README.md): Run `wwg readme preview --target .` and `wwg readme route-docs --target . --dry-run`.
- INFO Potential fragmented guidance: readiness (.wwg/governance/operational-readiness-review.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Potential fragmented guidance: principles (.wwg/governance/recommendation-policy.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Skill Manifest is not generated (.wwg/config/skill-manifest.yaml): Run `wwg refresh-skills --target .` when governed project skill state should be refreshed.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Explicit Maintenance Review Findings

These findings were produced by the explicit `wwg maintain` review. They are recommendations, not automatic cleanup actions or audit/validate hard failures.

- fragmented-guidance: 2
- generated-artifact-freshness: 3
- naming-drift: 8
- regression-governance: 1
- report-policy-drift: 2
- truth-loop-drift: 2

## Recommended Create/Edit/Merge/Move/Rename/Archive/Ignore/Delete/Keep Actions

| Path | Category | Issue | Recommended Action | Risk | Can Apply Safely? | Needs User Confirmation? | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| .wwg/workspace/testing/regression-candidate-review.md | regression-governance | Regression candidates need confirmation evidence | review | low | no | yes | Review `.wwg/workspace/testing/regression-candidate-review.md` and record explicit manual/process, executable, or waiver evidence in `.wwg/workspace/testing/manual-verification-evidence.json`. |
| .wwg/workspace/context/project-context.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| .wwg/workspace/skills/skill-index.md | generated-artifact-freshness | Expected context or readiness artifact is missing | refresh | low | no | no | This pass reports missing artifacts only; generation or handoff refresh should be explicit. |
| CHANGELOG.md | truth-loop-drift | Changelog project memory is missing | create | low | no | no | Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history. |
| README.md | truth-loop-drift | README front door needs governance review | review | low | no | no | Run `wwg readme preview --target .` and `wwg readme route-docs --target . --dry-run`. |
| .wwg/governance/operational-readiness-review.md | fragmented-guidance | Potential fragmented guidance: readiness | merge | medium | no | yes | This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance. |
| .wwg/governance/recommendation-policy.md | fragmented-guidance | Potential fragmented guidance: principles | merge | medium | no | yes | This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance. |
| .wwg/config/skill-manifest.yaml | generated-artifact-freshness | Skill Manifest is not generated | refresh | low | no | no | Run `wwg refresh-skills --target .` when governed project skill state should be refreshed. |
| .wwg/reports/adoption-audit.md | naming-drift | Report filename has unclear purpose suffix | review | low | no | yes | Ambiguous report names should be indexed or renamed only through a deliberate report policy pass. |
| .wwg/wiki/decisions/D-0001-product-name-tarn.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0002-mvp-authentication.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0003-package-manager-pnpm.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0004-mvp-schema-scope.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0005-token-file-location.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0006-password-hashing-scrypt.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
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

- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- INFO Ambiguous JSON reports need classification (.wwg/reports/adoption-regression-report.json): JSON reports are not promoted by default; classify as compatibility JSON, promoted JSON, routine generated JSON, transient JSON, or ambiguous JSON before committing policy decisions.

## Naming Drift

- INFO Report filename has unclear purpose suffix (.wwg/reports/adoption-audit.md): Ambiguous report names should be indexed or renamed only through a deliberate report policy pass.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0001-product-name-tarn.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0002-mvp-authentication.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0003-package-manager-pnpm.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0004-mvp-schema-scope.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0005-token-file-location.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.
- INFO WWG-owned file is not lowercase kebab-case (.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md): Naming changes should be reviewed for links, registry references, generated markers, and historical context.

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
- LOW README front door needs governance review (README.md): Run `wwg readme preview --target .` and `wwg readme route-docs --target . --dry-run`.
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

- [ ] Changelog missing (missing)
  - Reason: Package, product, or git history signals make release memory relevant.
  - Agent action: Prepare or review release narrative before treating changelog wording as final.
  - CLI support: `wwg changelog generate --from-git --weekly --dry-run`
  - Evidence: `CHANGELOG.md`
- [ ] Infrastructure readiness not checked (available)
  - Reason: Build, deploy, env, or infrastructure indicators were detected.
  - Agent action: Inspect infrastructure readiness before deployment-related work.
  - CLI support: `wwg infra check`
  - Evidence: `package.json scripts`, `.env`, `.env.example`, `docker-compose.yml`, `.github/workflows`
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

## WWG Truth Synchronization

> Remediation note: this section is applied manually because `wwg maintain` in WWG 0.6.6 does not emit it, yet `wwg validate` requires it on any report that claims readiness or completion. See `.wwg/governance/tooling-known-issues.md` (issue WWG-TOOL-001). Re-apply this section after every `wwg maintain` run.

- Task mode: Docs-only / governance-only — stale WWG report refresh. No application source was touched.
- New truth detected: NO — Project Truth was already accurate. The defect was in generated reports and the project registry lagging behind it, not in the truth itself.
- Wiki updated: NO — no product identity, scope, architecture, or boundary changed. `.wwg/wiki/project-truth.md` was verified against the working tree and required no change.
- Workspace updated: YES — `.wwg/workspace/current-task.md` rewritten to record this pass.
- Governance review completed: YES
- Drift status: LOW — two findings were genuinely fixed (`gitignore-policy-drift` cleared, false "README front door is missing" finding corrected to "needs governance review"). The remaining findings are report-bookkeeping heuristics, not truth conflicts.
- Canonical files changed:
  - `.wwg/config/wwg.project.yaml` — corrected four stale fields at the source so future regenerations are right: `design_tokens` pointed at root `index.css` instead of `apps/web/src/index.css`; `node_requirement` said `>=20.11.0` against an actual `engines` of `>=22`; removed three `reports.*` keys pointing at artifacts that were never written; added repository, auth-status, and delivery-pipeline facts so the handoff generator stops emitting "Not published".
  - `.wwg/governance/recommendation-registry.md` — removed the templated `REC-0001` placeholder that made the registry look populated while `wwg maintain` counted zero recommendations; added eight real entries.
  - `.wwg/governance/regression-gaps.md` — human note added outside the generated block.
  - `.wwg/reports/README.md` — corrected the index, which listed six artifact groups that do not exist.
  - `.gitignore` — added a narrow `.wwg/reports/backups/` rule.
- Implementation discoveries synced:
  - **The handoff reports said "Not published" and "Project: TBD" because they were generated before the registry knew the product name.** Root cause was the registry, not the generator. Fixing `wwg.project.yaml` fixes every future regeneration; hand-editing the report prose would have hidden it and returned on the next run.
  - **`wwg maintain` reports `RED / Critical Alignment Break` with `EXECUTION GATE: Stop` while simultaneously reporting Critical 0, High 0, Warnings 1, Advisory 17.** The score is driven by "Documentation Lag" and "Regression / Quality Drift" heuristics about artifact registration. An agent obeying the gate literally would halt all implementation over report bookkeeping. Logged as REC-0004; not treated as a real truth conflict.
  - **`regression-gaps.md` is written once during adoption and no later command refreshes it.** It still asserts "No existing tests" against a repository with 90 unit/integration and 24 browser assertions. It cannot be regenerated away, so it is documented in a human note rather than edited inside the generated block.
  - **`wwg reports` classified the adoption regression baseline as "ambiguous"** despite `AGENTS.md` and `regression-gaps.md` both citing it as the source baseline. Classified as promoted in the registry.
  - `pnpm test` re-verified on 2026-10-02: **90 passing**, matching Project Truth exactly.
- Remaining stale context:
  - **7 regression gaps remain open** and are recorded in the human note on `regression-gaps.md`. Four are genuinely open, one is superseded, one is partially covered, and one (`payment`) is not applicable to a project with no payment surface.
  - **Squash-merge CI gap, unchanged and still unrecorded as a regression gap.** Branch protection uses squash merge, so the commit landing on `main` is newly generated and CI never runs against it. Strict mode guarantees checks passed on the latest *pull request* commit only. Known limit, flagged by CodeRabbit, recorded in Project Truth.
  - `CHANGELOG.md` still missing (REC-0007).
  - Deployment vendors undecided (REC-0005); directory rename undecided (REC-0006).
  - No auth or CRUD route tests exist, because no product feature exists. This report remains point-in-time evidence — re-run `wwg maintain --target .` after further truth changes rather than treating it as current state, then re-apply this section.
