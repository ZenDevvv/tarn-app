# WWG Adoption Audit

## Audit Summary

- Target: C:\Users\Zen\Desktop\MY PROJECTS\applicant-tracking-system
- Date: 2026-10-01
- Recommended adoption mode: infer
- Adoption readiness score: 29 / 100
- Confidence: LOW
- Command: `wwg audit --existing`

## Evidence Reviewed

- README/docs: DESIGN.md, governance/README.md, reports/README.md, wiki/principles/README.md
- Package/config files: None detected
- Source folders: None detected
- Tests: None detected
- Deployment/config: None detected
- Existing agent/context files: .wwg/changelog/config.yml, .wwg/changelog/state.json, .wwg/readme/config.yml, .wwg/readme/state.json, AGENTS.md

## Observed Reality

- Product/app identity: CONFIRMED - applicant-tracking-system Evidence: . (folder name)
- Product category: NEEDS_CONFIRMATION - Software project Evidence: repository scan (not enough category-specific evidence)
- Tech stack: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: package/config (no known stack metadata detected)
- Runtime/build tools: NEEDS_CONFIRMATION - No package scripts detected Evidence: package.json (package scripts not found)
- Main entry points: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: source scan (no conventional entry point detected)
- Main implemented features: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: README/source (no feature headings or routes detected)
- User roles/surfaces: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: README/source (no clear user roles detected)
- Data persistence: NEEDS_CONFIRMATION - No persistence layer detected Evidence: repository scan (no database/schema/migration indicators)
- Auth/security: CONFIRMED - governance/security-review.md Evidence: governance/security-review.md (auth/security indicator)
- Payments/billing: NEEDS_CONFIRMATION - No payments/billing implementation detected Evidence: repository scan (no payment/billing indicators)
- Deployment/runtime: NEEDS_CONFIRMATION - No deployment config detected Evidence: repository scan (no Docker/Vercel/Netlify/GitHub Actions config detected)

## Inferred Truth

- Product identity: INFERRED - applicant-tracking-system Evidence: . (folder name)
- Product category: NEEDS_CONFIRMATION - Software project Evidence: repository scan (not enough category-specific evidence)
- Primary users: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: README/source (no clear user roles detected)
- Core features: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: README/source (no feature headings or routes detected)
- Architecture: NEEDS_CONFIRMATION - NEEDS_CONFIRMATION Evidence: repository scan (architecture could not be inferred safely)
- Safety/production boundaries: NEEDS_CONFIRMATION - Production boundaries need owner confirmation Evidence: repository scan (no explicit mock/demo/production boundary detected)

## Conflicts and Drift Risks

- README vs code: CONFIRMED - No direct issue detected by lightweight audit.
- UI/copy vs implementation: CONFIRMED - No direct issue detected by lightweight audit.
- package metadata vs actual stack: CONFIRMED - No direct issue detected by lightweight audit.
- mock/demo vs production claims: CONFIRMED - No direct issue detected by lightweight audit.
- terminology drift: CONFIRMED - No direct issue detected by lightweight audit.
- stale/generated files: CONFIRMED - No direct issue detected by lightweight audit.
- missing tests/checks: NEEDS_CONFIRMATION - No test files were detected by lightweight scan. Recommendation: Confirm testing strategy or add baseline checks.

## Open Questions

- Confirm product category. Why: Category affects profile selection, architecture defaults, and governance gates. Evidence: NEEDS_CONFIRMATION: Software project
- Confirm primary users and role names. Why: Roles affect permissions, UX, terminology, and task routing. Evidence: NEEDS_CONFIRMATION: NEEDS_CONFIRMATION
- Confirm persistence boundary. Why: Data ownership and migration policy depend on this. Evidence: NEEDS_CONFIRMATION: No persistence layer detected
- Confirm payments/billing boundary. Why: Payments and billing are approval-sensitive. Evidence: NEEDS_CONFIRMATION: No payments/billing implementation detected
- Confirm deployment/runtime boundary. Why: Operational readiness depends on deployment truth. Evidence: NEEDS_CONFIRMATION: No deployment config detected
- Confirm testing strategy. Why: WWG health depends on a known validation path. Evidence: No test files detected.

## Recommended Adoption Plan

- Recommended mode: infer
- Files WWG should create/update: `.wwg/wiki/project-truth.md`, `.wwg/wiki/terminology.md`, `.wwg/wiki/principles/README.md`, `.wwg/workspace/current-task.md`, `.wwg/governance/truth-capture.md`, `.wwg/governance/drift-guard.md`, `.wwg/reports/adoption-audit.md`, `AGENTS.md`.
- Follow-up actions: confirm inferred truth, resolve conflicts, answer open questions, and run `wwg validate --target <project>`.

Labels used: CONFIRMED, INFERRED, NEEDS_CONFIRMATION, CONFLICTING, STALE.


## Legacy Registry Mapping Summary

Detected 26 artifact(s). Registry-first mode: conservative.

## Observed Facts

- Observed facts are listed in the audit sections above and are backed by README/docs, package/config, source, test, deployment, and agent/context evidence.

## Inferred Truth

- Inferred truth is labeled above and should be reviewed before it becomes confirmed canonical truth.

## Conflicts

- missing tests/checks: NEEDS_CONFIRMATION - No test files were detected by lightweight scan.
- deployment/runtime: NEEDS_CONFIRMATION - No deployment config detected.

## Open Questions

- Confirm product category. Evidence: NEEDS_CONFIRMATION: Software project
- Confirm primary users and role names. Evidence: NEEDS_CONFIRMATION: NEEDS_CONFIRMATION
- Confirm persistence boundary. Evidence: NEEDS_CONFIRMATION: No persistence layer detected
- Confirm payments/billing boundary. Evidence: NEEDS_CONFIRMATION: No payments/billing implementation detected
- Confirm deployment/runtime boundary. Evidence: NEEDS_CONFIRMATION: No deployment config detected
- Confirm testing strategy. Evidence: No test files detected.

## Recommended Follow-Up

- Run `wwg adopt --mode infer --target <project>` to populate initial WWG truth from evidence.
- Review `.wwg/wiki/project-truth.md` before treating inferred truth as confirmed.

Reports are reference history. `.wwg/wiki/project-truth.md` is the canonical current truth once reviewed and maintained.

## Adoption Readiness Score

Score: 40 / 105

### Strengths

- Root AGENTS.md exists
- Canonical context candidates detected
- Governance or operations assets detected

### Gaps

- No maintenance matrix detected

### Scoring Categories

| Category | Score | Reason |
|---|---:|---|
| agent instructions | 10 / 10 | Root agent policy exists. |
| canonical context | 10 / 10 | Context candidates detected. |
| maintenance matrix | 0 / 10 | No maintenance matrix detected. |
| governance assets | 10 / 10 | Governance or operations assets detected. |
| skills/prompts | 0 / 5 | No skills or prompts detected. |
| public surface/discovery | 5 / 5 | Public surface or discovery assets detected. |
| project structure clarity | 0 / 10 | No major implementation boundary detected. |
| readme/docs quality | 0 / 10 | README/docs not detected. |
| tests/checks | 0 / 10 | No tests/specs detected. |
| deployment config | 0 / 10 | Deployment config not detected. |
| entry point clarity | 0 / 5 | No conventional entry points detected. |
| mock vs production boundaries | 0 / 5 | No explicit mock/demo boundary signals detected. |
| registry/readiness | 5 / 5 | WWG registry exists. |

### Recommended Adoption Mode

conservative

## Command

`wwg audit --existing`

## Repository Type Detected

wwg-native-project

## Existing Artifacts Detected

| Existing artifact | Classification | Suggested WWG role | Confidence |
|---|---|---|---|
| .wwg/changelog/config.yml | public surface | public_surface_updates | medium |
| .wwg/changelog/state.json | public surface | public_surface_updates | medium |
| AGENTS.md | root agent policy | root_agents | high |
| DESIGN.md | design source | design_context | high |
| governance | governance root | quality_gates | medium |
| governance/audit-log.md | governance artifact | audit_log | medium |
| governance/context-drift-detection.md | canonical context | project_master_context | medium |
| governance/quality-gates.md | governance artifact | quality_gates | medium |
| governance/regression-gaps.json | governance artifact | regression_guardrails | medium |
| governance/regression-gaps.md | governance artifact | regression_guardrails | medium |
| governance/regression-guardrail-catalog.md | governance artifact | regression_guardrails | medium |
| governance/regression-manifest.json | governance artifact | regression_guardrails | medium |
| governance/regression-manifest.md | governance artifact | regression_guardrails | medium |
| governance/release-checklist.md | governance artifact | release_checklist | medium |
| governance/security-review.md | governance artifact | quality_gates | medium |
| governance/test-plan.md | governance artifact | test_plan | medium |
| reports | governance root | reference_history | medium |
| reports/adoption-regression-report.json | governance artifact | regression_guardrails | medium |
| reports/adoption-regression-report.md | governance artifact | regression_guardrails | medium |
| reports/context-skill-quality.md | canonical context | project_master_context | medium |
| wiki | context root | project_master_context | medium |
| workspace/testing/manual-verification-checklist.md | governance artifact | test_plan | medium |
| workspace/testing/manual-verification-evidence.json | governance artifact | test_plan | medium |
| workspace/testing/non-technical-regression-checklist.md | governance artifact | regression_guardrails | medium |
| workspace/testing/regression-candidate-review.json | governance artifact | regression_guardrails | medium |
| workspace/testing/regression-candidate-review.md | governance artifact | regression_guardrails | medium |

## Findings by Evidence Level

### confirmed

- INFO governance-detected: evidence=confirmed risk=low Detected 19 governance artifact(s). Recommendation: Reuse and register existing governance artifacts.
- INFO mapping-design_context (DESIGN.md): evidence=confirmed risk=low Detected candidate for design_context. Recommendation: Register DESIGN.md as design_context; do not duplicate it.
- INFO mapping-project_master_context (governance/context-drift-detection.md): evidence=confirmed risk=low Detected candidate for project_master_context. Recommendation: Register governance/context-drift-detection.md as project_master_context; do not duplicate it.
- INFO mapping-root_agents (AGENTS.md): evidence=confirmed risk=low Detected candidate for root_agents. Recommendation: Register AGENTS.md as root_agents; do not duplicate it.
- INFO public-surface-artifact (.wwg/changelog/config.yml): evidence=confirmed risk=low Public surface or discovery artifact detected. Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- INFO public-surface-artifact (.wwg/changelog/state.json): evidence=confirmed risk=low Public surface or discovery artifact detected. Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- INFO public-surface-detected: evidence=confirmed risk=low Detected 2 public surface/public discovery artifact(s). Recommendation: Map existing public discovery sources before proposing new ones.
- INFO root-agents-detected (AGENTS.md): evidence=confirmed risk=low Root agent instructions were detected. Recommendation: Map this file as canonical_artifacts.root_agents.

### likely

- MEDIUM recommended-changelog (CHANGELOG.md): evidence=likely risk=medium Recommended artifact is not currently mapped or detected. Recommendation: Create only in a later explicit adoption/init phase.
- MEDIUM recommended-maintenance_matrix (docs/ai-context/context-maintenance-matrix.md): evidence=likely risk=medium Recommended artifact is not currently mapped or detected. Recommendation: Create only in a later explicit adoption/init phase.
- MEDIUM recommended-public_discovery_context (docs/ai-context/public-discovery-context.md): evidence=likely risk=medium Recommended artifact is not currently mapped or detected. Recommendation: Create only in a later explicit adoption/init phase.

### hypotheses

- No findings.

### unknowns/gaps

- No findings.

## Suggested WWG Mappings

- root_agents: AGENTS.md
- project_master_context: governance/context-drift-detection.md
- design_context: DESIGN.md

## Recommended Artifacts

- changelog: CHANGELOG.md
- maintenance_matrix: docs/ai-context/context-maintenance-matrix.md
- public_discovery_context: docs/ai-context/public-discovery-context.md

## Changelog

- Found: no
- Last version: none detected
- Last date: none detected
- Unreleased present: no
- Weekly cadence detected: no
- Recommended next patch: 0.0.1
- Recommended action: Create a preview first with `wwg changelog generate --target . --from-git --weekly --dry-run`.
- Risk: low: missing project memory should be introduced through dry-run preview first.

## Scoped AGENTS.md Recommendations

### Recommended

- None.

### Not Recommended / Cross-Cutting

| Path | Reason |
|---|---|
| auth | not-recommended: Authentication is usually cross-cutting; keep policy in canonical context unless ownership is isolated. |
| billing | not-recommended: Billing is approval-sensitive and cross-cutting; use governance and canonical context first. |
| shared | not-recommended: Shared code affects multiple owners; scoped instructions can conflict with broader truth. |
| features/* | not-recommended: Feature folders are often too narrow; prefer the maintenance matrix for routing. |

## Missing WWG Artifacts

- changelog
- maintenance_matrix
- public_discovery_context

## Public Surface Findings

- INFO public-surface-detected: evidence=confirmed risk=low Detected 2 public surface/public discovery artifact(s). Recommendation: Map existing public discovery sources before proposing new ones.

## Governance Findings

- INFO governance-detected: evidence=confirmed risk=low Detected 19 governance artifact(s). Recommendation: Reuse and register existing governance artifacts.

## Adoption Risk Classification

| Risk | Path | Message | Recommendation |
|---|---|---|---|
| low | wwg.project.yaml | Create or safe-merge a WWG-owned project registry. | Allowed in conservative apply. |
| low | reports | Create audit, adoption plan, adoption report, JSON reports, and registry backups. | Allowed in conservative apply. |
| medium | n/a | Add missing WWG index or generated context files. | Defer until a later explicit init or adoption expansion phase. |
| high | n/a | Move docs, rewrite AGENTS.md, or reorganize context structure. | Do not perform in Phase 2B conservative apply. |
| approval-gated | n/a | Change production config, compliance-sensitive docs, public customer notices, permissions, security, data deletion, or migrations. | Require explicit approval and evidence-backed plan. |

## Recommended Adoption Mode

conservative

## Recommended Next Command

`wwg adopt --mode conservative --dry-run`
