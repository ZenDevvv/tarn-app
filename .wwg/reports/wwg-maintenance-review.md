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
- Persona terminology introduced admin without canonical terminology update.
- Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
- Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.

## Recommended Next Step

Stop implementation and resolve the truth conflict, regression, or verification gap before continuing.

## Recommended Natural Prompt

Tell the agent: "Treat this as a regression or quality gap. Add or update meaningful tests, document the issue, and repair the implementation."

## Backup CLI

wwg regression-check

## Summary

- Total findings: 17
- Critical: 0
- High: 0
- Medium: 1
- Low: 4
- Info: 12
- Safe-to-apply recommendations: 0
- Requires-user-confirmation: 12
- Archive candidates: 0
- Merge candidates: 3
- Rename candidates: 7
- Stale context candidates: 3
- Drift Score: 8/10
- Truth Alignment Status: Critical Alignment Break
- Interpretation: Drift Score 8/10 indicates a critical conflict, regression, missing verification, or high-risk change that needs planning/reconciliation before more implementation.

## Scope

- Target path: .
- Timestamp: 2026-10-02T05:41:29.049Z
- Command: `wwg maintain --target C:\Users\Zen\Desktop\MY PROJECTS\tarn-app`
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

- fragmented-guidance: 3
- generated-artifact-freshness: 3
- naming-drift: 7
- regression-governance: 1
- report-policy-drift: 1
- truth-loop-drift: 2

## Truth Alignment Findings

- Level: RED / Critical Alignment Break
- Execution Gate: stop / Stop
- Drift Score: 8/10
- Interpretation: Drift Score 8/10 indicates a critical conflict, regression, missing verification, or high-risk change that needs planning/reconciliation before more implementation.

Category findings:
- Requirement Evolution: none detected.
- Undocumented Requirement Change: none detected.
- Documentation Lag:
  - Recent reports suggest documentation lag or stale context that may need Project Truth synchronization.
  - Low-severity findings are present; review alongside Truth Alignment Status instead of treating them as harmful drift by default.
- Implementation Drift: none detected.
- Regression / Quality Drift:
  - Governance, audit, report, history, or regression evidence appears to be removed without documented approval.
- Terminology Drift:
  - Persona terminology introduced admin without canonical terminology update.

## Continuous Maintenance Awareness Findings

These findings are signals agents should notice during ordinary truth-loop work and either fix when directly related or record for follow-up.

- LOW Expected context or readiness artifact is missing (.wwg/workspace/context/project-context.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Expected context or readiness artifact is missing (.wwg/workspace/skills/skill-index.md): This pass reports missing artifacts only; generation or handoff refresh should be explicit.
- LOW Changelog project memory is missing (CHANGELOG.md): Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating or applying changelog history.
- LOW README front door needs governance review (README.md): Run `wwg readme preview --target .` and `wwg readme route-docs --target . --dry-run`.
- INFO Potential fragmented guidance: readiness (.wwg/governance/operational-readiness-review.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Potential fragmented guidance: principles (.wwg/governance/recommendation-policy.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Potential fragmented guidance: handoff (.wwg/governance/tooling-known-issues.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.
- INFO Skill Manifest is not generated (.wwg/config/skill-manifest.yaml): Run `wwg refresh-skills --target .` when governed project skill state should be refreshed.
- INFO Report policy drift: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.

## Explicit Maintenance Review Findings

These findings were produced by the explicit `wwg maintain` review. They are recommendations, not automatic cleanup actions or audit/validate hard failures.

- fragmented-guidance: 3
- generated-artifact-freshness: 3
- naming-drift: 7
- regression-governance: 1
- report-policy-drift: 1
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
| .wwg/governance/tooling-known-issues.md | fragmented-guidance | Potential fragmented guidance: handoff | merge | medium | no | yes | This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance. |
| .wwg/config/skill-manifest.yaml | generated-artifact-freshness | Skill Manifest is not generated | refresh | low | no | no | Run `wwg refresh-skills --target .` when governed project skill state should be refreshed. |
| .wwg/wiki/decisions/D-0001-product-name-tarn.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0002-mvp-authentication.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0003-package-manager-pnpm.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0004-mvp-schema-scope.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0005-token-file-location.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0006-password-hashing-scrypt.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
| .wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md | naming-drift | WWG-owned file is not lowercase kebab-case | rename-candidate | medium | no | yes | Naming changes should be reviewed for links, registry references, generated markers, and historical context. |
|  | report-policy-drift | Report policy drift | review | low | no | yes | Run `wwg reports --target .` and review the Ambiguous / Needs Review section. |


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

## Naming Drift

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
- INFO Potential fragmented guidance: handoff (.wwg/governance/tooling-known-issues.md): This is a consolidation candidate only; template, dogfood, docs, and compatibility boundaries must be reviewed before merging guidance.

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
- Total recommendations: 13

### By Status

| Status | Count |
|---|---:|
| Proposed | 11 |
| Done | 2 |

### By Impact

| Impact | Count |
|---|---:|
| High | 3 |
| Medium | 6 |
| Low | 4 |

### By Type

| Type | Count |
|---|---:|
| Documentation | 1 |
| Governance | 8 |
| Product | 1 |
| Tooling | 3 |

### Items Needing Review

| ID | Name | Status | Impact | Review By | Suggested Action |
|---|---|---|---|---|---|
| REC-0001 | Replace the placeholder registry row with real entries | Done | Low | 2026-10-02 | Review recommendation |
| REC-0003 | Close `gap-uncovered-behavior-payment-behavior` as not applicable | Proposed | Low | 2026-10-02 | Review recommendation |
| REC-0005 | Decide the deployment vendors | Proposed | High | 2026-10-02 | Review for promotion |
| REC-0006 | Rename the local directory from `applicant-tracking-system` to `tarn-app` | Done | Medium | 2026-10-02 | Review recommendation |
| REC-0007 | Add a CHANGELOG.md | Proposed | Low | 2026-10-02 | Review recommendation |
| REC-0008 | Amend architecture §6 to include `packages/auth` | Proposed | Low | 2026-10-02 | Review recommendation |
| REC-0009 | Re-verify the unproven "confirmed" claims from the 2026-10-01 close-out batch | Proposed | High | 2026-10-02 | Review for promotion |
| REC-0010 | Decide whether `e2e` should be a required status check | Proposed | High | 2026-10-02 | Review for promotion |
| REC-0011 | `pnpm format:check` fails on 50 files and is not enforced in CI | Proposed | Medium | 2026-10-02 | Review recommendation |
| REC-0012 | `wwg.project.yaml` registers six artifact paths that do not exist | Proposed | Medium | 2026-10-02 | Review recommendation |
| REC-0013 | `wwg.project.yaml` `required_checks` still lists `e2e` | Proposed | Medium | 2026-10-02 | Review recommendation |

### High-Impact Open Recommendations

| ID | Name | Status | Impact | Owner | Suggested Timing |
|---|---|---|---|---|---|
| REC-0005 | Decide the deployment vendors | Proposed | High | Zen | Before any deployment or file-upload work |
| REC-0009 | Re-verify the unproven "confirmed" claims from the 2026-10-01 close-out batch | Proposed | High | Zen | Before the auth module, while the claim is still cheap to audit |
| REC-0010 | Decide whether `e2e` should be a required status check | Proposed | High | Zen | Before the auth module, so the gate is trustworthy while features land |

### Stale Review By Items

No stale Review By items found.

### Parsing Warnings

- Row 26 has unknown effort: Low.
- Row 28 has unknown effort: Low.
- Row 31 has unknown effort: Low.
- Row 32 has unknown effort: Low.
- Row 33 has unknown effort: Low.
- Row 34 has unknown effort: Low.
- Row 35 has unknown effort: Low.
- Row 36 has unknown effort: Low.
- Row 37 has unknown effort: Low.
- Row 38 has unknown effort: Low.

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

Added by hand on 2026-10-02. `wwg maintain` does not emit this section, but
`wwg validate` requires it (WKG-TOOL-001), so it must be re-applied after every
`wwg maintain` run that overwrites this file. The field labels below are fixed by
`wwg validate`; renaming them reintroduces
`wwg-report-truth-sync-fields-missing`.

- Task mode: existing-project adoption (continued) — governance/report refresh and truth synchronization
- New truth detected: YES — the repository directory was renamed to `tarn-app`, and the Compose project name is now pinned
- Wiki updated: YES — `.wwg/wiki/project-truth.md`, `.wwg/wiki/terminology.md`, `.wwg/wiki/decisions/D-0001-product-name-tarn.md`
- Workspace updated: YES — `.wwg/workspace/current-task.md`, `.wwg/workspace/testing/verification-evidence.md` (VER-0004 added)
- Governance review completed: YES — `.wwg/governance/recommendation-registry.md` (REC-0006 closed; REC-0011…REC-0014 added), `.wwg/config/wwg.project.yaml`, `AGENTS.md`
- Drift status: LOW
- Canonical files changed:
  - `.wwg/wiki/project-truth.md`
  - `.wwg/wiki/terminology.md`
  - `.wwg/wiki/decisions/D-0001-product-name-tarn.md`
  - `.wwg/config/wwg.project.yaml`
  - `AGENTS.md`
  - `README.md`
  - `docker-compose.yml`
- Implementation discoveries synced:
  - Renaming a checkout breaks every pnpm `node_modules` junction (`MODULE_NOT_FOUND` for `vitest`); fixed with `pnpm install --frozen-lockfile`.
  - It also leaves the generated Prisma Client stale (`no exported member 'ApplicationStatus'`); fixed with `pnpm db:generate`.
  - Both are now documented in `README.md` § Troubleshooting.
  - `pnpm test` reports 83 passing and 7 skipped without a reachable database, not 90. The skipped tests are the cross-user isolation coverage.
  - `pnpm format:check` fails on 50 pre-existing files and is not enforced by CI.
- Remaining stale context:
  - REC-0010 — `e2e` is still not a required status check; needs an owner decision.
  - REC-0005 — deployment vendors undecided.
  - REC-0007 — no `CHANGELOG.md`.
  - REC-0011 — format gate not enforced and currently failing.
  - REC-0012, REC-0013 — registry pointers and the divergent `required_checks` claim.
  - REC-0014 — this report's two false positives, below.
  - The 7 database integration tests have not executed locally; Docker Desktop was not running.

### Do not trust this report's own execution gate

The header above says `Truth Alignment Status: RED / Critical Alignment Break` and
`EXECUTION GATE: Stop` while the body reports Critical 0 and High 0. That gate is
driven by heuristics, not by a real conflict, and on 2026-10-02 it named two findings
that are both false:

- "Persona terminology introduced admin without canonical terminology update" — the
  word *admin* comes from `enforce_admins` in branch protection, meaning a **GitHub
  repository admin**, not a product persona. Project Truth explicitly records admin as
  *not* a product role.
- "Governance, audit, report, history, or regression evidence appears to be removed
  without documented approval" — nothing was deleted. `git status --porcelain` showed
  no `D` or `R` entries; all changed files were modifications. The heuristic fired on
  the removal of YAML *pointer keys* naming files that never existed.

Recorded as REC-0004 and REC-0014. Use `wwg validate` as the trustworthy signal.


