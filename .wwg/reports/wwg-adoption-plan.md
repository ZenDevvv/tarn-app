# WWG Adoption Plan

## Summary

Conservative adoption should register existing artifacts before creating new WWG folders.

## Recommended Mode

conservative

## Existing Artifacts to Reuse

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
| wiki/decisions | ADR directory | reference_history | medium |
| wiki/decisions/D-0001-product-name-tarn.md | decision history | reference_history | medium |
| wiki/decisions/D-0002-mvp-authentication.md | decision history | reference_history | medium |
| wiki/decisions/D-0003-package-manager-pnpm.md | decision history | reference_history | medium |
| wiki/decisions/D-0004-mvp-schema-scope.md | decision history | reference_history | medium |
| wiki/decisions/D-0005-token-file-location.md | decision history | reference_history | medium |
| wiki/decisions/D-0006-password-hashing-scrypt.md | decision history | reference_history | medium |
| wiki/decisions/D-0007-code-review-and-dependency-scanning.md | decision history | reference_history | medium |
| workspace/testing/manual-verification-checklist.md | governance artifact | test_plan | medium |
| workspace/testing/manual-verification-evidence.json | governance artifact | test_plan | medium |
| workspace/testing/non-technical-regression-checklist.md | governance artifact | regression_guardrails | medium |
| workspace/testing/regression-candidate-review.json | governance artifact | regression_guardrails | medium |
| workspace/testing/regression-candidate-review.md | governance artifact | regression_guardrails | medium |

## Artifacts to Register

- root_agents: AGENTS.md
- project_master_context: governance/context-drift-detection.md
- design_context: DESIGN.md

## Recommended Artifacts for Later Phases

- changelog: CHANGELOG.md
- maintenance_matrix: docs/ai-context/context-maintenance-matrix.md
- public_discovery_context: docs/ai-context/public-discovery-context.md

## Artifacts to Create Later

- wiki/workspace/governance native folders only after a later explicit command exists
- scoped AGENTS.md files only after local ownership is confirmed and a future flag permits creation

## Files Not to Duplicate

- .wwg/changelog/config.yml
- .wwg/changelog/state.json
- AGENTS.md
- DESIGN.md
- governance
- governance/audit-log.md
- governance/context-drift-detection.md
- governance/quality-gates.md
- governance/regression-gaps.json
- governance/regression-gaps.md
- governance/regression-guardrail-catalog.md
- governance/regression-manifest.json
- governance/regression-manifest.md
- governance/release-checklist.md
- governance/security-review.md
- governance/test-plan.md
- reports
- reports/adoption-regression-report.json
- reports/adoption-regression-report.md
- reports/context-skill-quality.md
- wiki
- wiki/decisions
- wiki/decisions/D-0001-product-name-tarn.md
- wiki/decisions/D-0002-mvp-authentication.md
- wiki/decisions/D-0003-package-manager-pnpm.md
- wiki/decisions/D-0004-mvp-schema-scope.md
- wiki/decisions/D-0005-token-file-location.md
- wiki/decisions/D-0006-password-hashing-scrypt.md
- wiki/decisions/D-0007-code-review-and-dependency-scanning.md
- workspace/testing/manual-verification-checklist.md
- workspace/testing/manual-verification-evidence.json
- workspace/testing/non-technical-regression-checklist.md
- workspace/testing/regression-candidate-review.json
- workspace/testing/regression-candidate-review.md

## Changelog

- Found: no
- Last version: none detected
- Last date: none detected
- Unreleased present: no
- Weekly cadence detected: no
- Recommended next patch: 0.0.1
- Recommended action: Create a preview first with `wwg changelog generate --target . --from-git --weekly --dry-run`.
- Risk: low: missing project memory should be introduced through dry-run preview first.

## Suggested wwg.project.yaml

```yaml
wwg:
  instance_type: existing-project
  template_version: 0.6.6
  adoption_mode: conservative
  created_by: wwg-cli
  created_at: 2026-10-01
  last_updated_at: 2026-10-01
  registry_owner: wwg
  registry_update_policy: safe_merge
layers:
  wiki:
    root: wiki
    strategy: mapped-existing
  workspace:
    root: .
    strategy: mapped-existing
  governance:
    root: governance
    strategy: mapped-existing
canonical_artifacts:
  root_agents: AGENTS.md
  project_master_context: governance/context-drift-detection.md
  design_context: DESIGN.md
recommended_artifacts:
  changelog: CHANGELOG.md
  maintenance_matrix: docs/ai-context/context-maintenance-matrix.md
  public_discovery_context: docs/ai-context/public-discovery-context.md
scoped_agents: []
reports:
  adoption_audit: reports/wwg-existing-audit-report.md
  adoption_audit_json: reports/wwg-existing-audit-report.json
  adoption_plan: reports/wwg-adoption-plan.md
  adoption_plan_json: reports/wwg-adoption-plan.json
  adoption_report: reports/wwg-adoption-report.md
  adoption_report_json: reports/wwg-adoption-report.json
```

## Risk Classification

| Risk | Path | Message | Recommendation |
|---|---|---|---|
| low | wwg.project.yaml | Create or safe-merge a WWG-owned project registry. | Allowed in conservative apply. |
| low | reports | Create audit, adoption plan, adoption report, JSON reports, and registry backups. | Allowed in conservative apply. |
| medium | n/a | Add missing WWG index or generated context files. | Defer until a later explicit init or adoption expansion phase. |
| high | n/a | Move docs, rewrite AGENTS.md, or reorganize context structure. | Do not perform in Phase 2B conservative apply. |
| approval-gated | n/a | Change production config, compliance-sensitive docs, public customer notices, permissions, security, data deletion, or migrations. | Require explicit approval and evidence-backed plan. |

## Rollback Guidance

- Conservative apply creates or safe-merges only `wwg.project.yaml` and WWG reports.
- If an existing registry is updated, a backup is written under `reports/backups/` first.
- Revert by restoring the backup over `wwg.project.yaml` or deleting newly created WWG reports and registry files.

## Next Steps

- wwg adopt --mode conservative --dry-run
