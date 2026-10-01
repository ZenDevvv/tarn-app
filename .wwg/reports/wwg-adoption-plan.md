# WWG Adoption Plan

## Summary

Conservative adoption should register existing artifacts before creating new WWG folders.

## Recommended Mode

new

## Existing Artifacts to Reuse

| Existing artifact | Classification | Suggested WWG role | Confidence |
|---|---|---|---|
| DESIGN.md | design source | design_context | high |

## Artifacts to Register

- design_context: DESIGN.md

## Recommended Artifacts for Later Phases

- project_registry: wwg.project.yaml
- changelog: CHANGELOG.md
- project_master_context: docs/ai-context/project-context.md
- maintenance_matrix: docs/ai-context/context-maintenance-matrix.md
- evidence_standards: governance/evidence-standards.md
- public_discovery_context: docs/ai-context/public-discovery-context.md

## Artifacts to Create Later

- wiki/workspace/governance native folders only after a later explicit command exists
- scoped AGENTS.md files only after local ownership is confirmed and a future flag permits creation

## Files Not to Duplicate

- DESIGN.md

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
    root: .
    strategy: mapped-existing
  workspace:
    root: .
    strategy: mapped-existing
  governance:
    root: reports
    strategy: mapped-existing
canonical_artifacts:
  design_context: DESIGN.md
recommended_artifacts:
  project_registry: wwg.project.yaml
  changelog: CHANGELOG.md
  project_master_context: docs/ai-context/project-context.md
  maintenance_matrix: docs/ai-context/context-maintenance-matrix.md
  evidence_standards: governance/evidence-standards.md
  public_discovery_context: docs/ai-context/public-discovery-context.md
scoped_agents: []
reports:
  adoption_audit: reports/wwg-existing-audit-report.md
  adoption_audit_json: reports/wwg-existing-audit-report.json
  adoption_plan: reports/wwg-adoption-plan.md
  adoption_plan_json: reports/wwg-adoption-plan.json
  adoption_report: reports/wwg-adoption-report.md
  adoption_report_json: reports/wwg-adoption-report.json
  adoption_regression_baseline: .wwg/reports/adoption-regression-report.md
  adoption_regression_baseline_json: .wwg/reports/adoption-regression-report.json
  regression_manifest: .wwg/governance/regression-manifest.md
  regression_manifest_json: .wwg/governance/regression-manifest.json
  regression_gaps: .wwg/governance/regression-gaps.md
  regression_gaps_json: .wwg/governance/regression-gaps.json
  rule_traceability: .wwg/governance/rule-traceability.md
  rule_traceability_json: .wwg/governance/rule-traceability.json
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

- wwg init
