# WWG Doctor Report

## Summary

Generated at: 2026-10-01T10:13:25.087Z
Mode: existing-adopted-project
Apply mode: true
Registry present: true

## Report Currency

This doctor report is a point-in-time diagnostic for the target path below. Findings are current as of the generated timestamp. Older doctor or maintain reports remain historical evidence and may be superseded by newer handoff, validation, upgrade, or doctor artifacts.

## Repair Result

- Repaired/refreshed WWG-owned generated surfaces: .wwg/config/wwg.project.yaml, .wwg/reports/backups/wwg.project.20261001T101325Z.yaml, .wwg/reports/readme-validation.md, .wwg/reports/wwg-agent-handoff.json, .wwg/reports/wwg-agent-handoff.md, .wwg/reports/wwg-handoff-to-codex.json, .wwg/reports/wwg-handoff-to-codex.md
- Did not repair semantic project truth: Project Truth, Terminology, Drift Guard meaning, accepted decisions, principles meaning, current task meaning, runtime evidence, and runtime skill activation remain review-only.
- Review-only or candidate/optional findings remaining: 47
- Skipped/already-current surfaces: .wwg/reports/README.md
- Validate after doctor: pass (expected to pass)

## Remaining Findings by User Action

### Auto-fixable
These are deterministic WWG-owned gaps that doctor can repair without rewriting semantic project truth.
Next command: `wwg doctor --apply`
- MEDIUM registry-report-missing (.wwg/reports/wwg-generate-workspace-report.md): Registry references missing report generate_workspace.
- MEDIUM registry-report-missing (.wwg/reports/wwg-refresh-context-report.md): Registry references missing report refresh_context.
- MEDIUM registry-report-missing (.wwg/reports/wwg-refresh-skills-report.md): Registry references missing report refresh_skills.
- MEDIUM registry-report-missing (.wwg/reports/wwg-generate-workspace-report.md): Registry references missing report generate_workspace.
- MEDIUM registry-report-missing (.wwg/reports/wwg-refresh-context-report.md): Registry references missing report refresh_context.
- MEDIUM registry-report-missing (.wwg/reports/wwg-refresh-skills-report.md): Registry references missing report refresh_skills.

### Review Required
These findings touch project meaning, governance, principles, or selected profile expectations.
Next command: `wwg audit --upgrade-candidates`
- MEDIUM recommended-changelog (CHANGELOG.md): Recommended artifact is not currently mapped or detected.
- MEDIUM recommended-maintenance_matrix (docs/ai-context/context-maintenance-matrix.md): Recommended artifact is not currently mapped or detected.
- MEDIUM recommended-public_discovery_context (docs/ai-context/public-discovery-context.md): Recommended artifact is not currently mapped or detected.
- LOW canonical-context-policy-missing (wiki-template/base/09-agent-context/canonical-context-policy.md): Expected policy or coverage artifact is missing.
- LOW changelog-missing (CHANGELOG.md): CHANGELOG.md is missing, so project memory and release subtext are not yet first-class.
- LOW evidence-standards-missing (governance-template/base/evidence-standards.md): Expected policy or coverage artifact is missing.
- LOW generated-output-missing (.wwg/workspace/context/project-context.md): Expected generated output is missing after WWG init/generation.
- LOW generated-output-missing (.wwg/workspace/skills/skill-index.md): Expected generated output is missing after WWG init/generation.
- LOW maintenance-matrix-missing (wiki-template/base/12-maintenance/context-maintenance-matrix.md): Maintenance matrix artifact is missing.
- LOW maintenance-matrix-missing (workspace-template/base/context/context-maintenance-matrix.md): Maintenance matrix artifact is missing.
- LOW maintenance-matrix-missing (.wwg/wiki/12-maintenance/self-maintenance-loop.md): Maintenance matrix artifact is missing.
- LOW public-discovery-review-missing (governance-template/base/public-discovery-review.md): Expected policy or coverage artifact is missing.
- LOW readme-agent-routing-missing (README.md): WWG is present but README.md does not route agents to AGENTS.md and .wwg context.
- LOW runtime-monitoring-missing (wiki-template/base/08-operations/monitoring.md): Expected policy or coverage artifact is missing.
- LOW scoped-agents-recommended (apps/api/AGENTS.md): Scoped AGENTS.md candidate has a clean local ownership boundary.
- LOW scoped-agents-recommended (apps/web/AGENTS.md): Scoped AGENTS.md candidate has a clean local ownership boundary.
- LOW truth-conflict-policy-missing (governance-template/base/truth-conflict-resolution.md): Expected policy or coverage artifact is missing.
- LOW readme-section-missing (README.md): README is missing expected front-door section: Install.
- LOW readme-section-missing (README.md): README is missing expected front-door section: Current Status.
- LOW readme-section-missing (README.md): README is missing expected front-door section: License.
- ... 21 more.

### Candidate-only Warning
These warnings describe candidate handoff metadata only. WWG did not activate runtime skills.
Next: No action required unless adopting runtime skills through Vorter.
- INFO runtime-skill-candidates-not-generated (.wwg/reports/runtime-skill-candidates.json): Runtime skill candidate contract: not generated.
- INFO runtime-skill-candidates-not-generated (.wwg/reports/runtime-skill-candidates.json): Runtime skill candidate contract: not generated.

### Optional Check
These are supporting or advisory checks, not core WWG readiness blockers unless the current task depends on them.
Next: Review only when this optional surface is in scope.
- LOW gitignore-native-report-backups-missing (.gitignore): Report policy expects `.wwg/reports/backups/` to be ignored.
- LOW public-surface-review-missing (governance-template/base/public-surface-review.md): Expected policy or coverage artifact is missing.
- LOW gitignore-native-report-backups-missing (.gitignore): Report policy expects `.wwg/reports/backups/` to be ignored.
- LOW public-surface-review-missing (governance-template/base/public-surface-review.md): Expected policy or coverage artifact is missing.

### Info
Passing or informational validation evidence.
Next: No command required.
- INFO doctor-native-generation-skipped: Adopted existing projects stay registry-backed; doctor did not force native Workspace/Governance generation.
- INFO agent-ready-artifacts-present: Agent-ready structure and evidence reports are present.
- INFO ambiguous-report-classification: Some report-like files need human classification.
- INFO candidate-principle-like-content (AGENTS.md): Potential principle-like content was found outside the principles folder.
- INFO duplicate-concepts-clear: No duplicate concept hints detected beyond normal WWG structure.
- INFO generated-markers-balanced: Generated marker pairs are balanced where present.
- INFO governance-detected: Detected 19 governance artifact(s).
- INFO json-schemas-parse: Parsed and compiled 0 JSON schema file(s).
- INFO maintenance-review-recommended: This project shows maintenance drift signals. Run `wwg maintain --target <path>` to generate a structured maintenance review.
- INFO mapping-design_context (DESIGN.md): Detected candidate for design_context.
- INFO mapping-project_master_context (governance/context-drift-detection.md): Detected candidate for project_master_context.
- INFO mapping-root_agents (AGENTS.md): Detected candidate for root_agents.
- INFO markdown-readable: Markdown files are non-empty and readable.
- INFO principle-files-present (.wwg/wiki/principles): Principle-like files found: 5.
- INFO project-registry-valid (.wwg/config/wwg.project.yaml): WWG project registry parses and matches the registry schema.
- INFO public-surface-artifact (.wwg/changelog/config.yml): Public surface or discovery artifact detected.
- INFO public-surface-artifact (.wwg/changelog/state.json): Public surface or discovery artifact detected.
- INFO public-surface-detected: Detected 2 public surface/public discovery artifact(s).
- INFO readme-detected (README.md): README.md was detected at 117 lines.
- INFO recommendation-governance-present (.wwg/governance/recommendation-registry.md): Recommendation capture is available through the Governance registry and policy.
- ... 82 more.

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
- [ ] Doctor/self-heal available for repairable issues (available)
  - Reason: Repairable WWG-owned issues were detected by the current command.
  - Agent action: Use doctor for deterministic WWG-owned repair; keep semantic truth review-only.
  - CLI support: `wwg doctor --apply`
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

## Command

`wwg doctor --apply`

## Target

.

## Steps

- warn: audit - Audited ..
- pass: upgrade-apply - Upgrade apply 0.6.6 -> 0.6.6.
- pass: report-index - .wwg/reports/README.md report index already present.
- pass: validate - Validated C:\Users\Zen\Desktop\MY PROJECTS\applicant-tracking-system.
- warn: readme-validate - README validation warn.
- pass: handoff - Agent handoff report written.
- warn: audit-final - Audited ..

## Files Created

- None.

## Files Updated

- .wwg/config/wwg.project.yaml
- .wwg/reports/backups/wwg.project.20261001T101325Z.yaml
- .wwg/reports/readme-validation.md
- .wwg/reports/wwg-agent-handoff.json
- .wwg/reports/wwg-agent-handoff.md
- .wwg/reports/wwg-handoff-to-codex.json
- .wwg/reports/wwg-handoff-to-codex.md

## Files Skipped

- .wwg/reports/README.md

## Reports

- .wwg/reports/context-skill-quality.json
- .wwg/reports/context-skill-quality.md
- .wwg/reports/readme-validation.md
- .wwg/reports/wwg-agent-handoff.json
- .wwg/reports/wwg-agent-handoff.md
- .wwg/reports/wwg-handoff-to-codex.json
- .wwg/reports/wwg-handoff-to-codex.md
- reports/wwg-audit-report.json
- reports/wwg-audit-report.md
- reports/wwg-doctor-report.json
- reports/wwg-doctor-report.md
- reports/wwg-existing-audit-report.md
- reports/wwg-upgrade-report.json
- reports/wwg-upgrade-report.md
- reports/wwg-validate-report.md

## Findings

- info: doctor-native-generation-skipped - Adopted existing projects stay registry-backed; doctor did not force native Workspace/Governance generation. Recommendation: Use explicit generation only after promoting the project to WWG-native structure.
- medium: recommended-changelog - Recommended artifact is not currently mapped or detected. (CHANGELOG.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: recommended-maintenance_matrix - Recommended artifact is not currently mapped or detected. (docs/ai-context/context-maintenance-matrix.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: recommended-public_discovery_context - Recommended artifact is not currently mapped or detected. (docs/ai-context/public-discovery-context.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: registry-report-missing - Registry references missing report generate_workspace. (.wwg/reports/wwg-generate-workspace-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- medium: registry-report-missing - Registry references missing report refresh_context. (.wwg/reports/wwg-refresh-context-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- medium: registry-report-missing - Registry references missing report refresh_skills. (.wwg/reports/wwg-refresh-skills-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- low: canonical-context-policy-missing - Expected policy or coverage artifact is missing. (wiki-template/base/09-agent-context/canonical-context-policy.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: changelog-missing - CHANGELOG.md is missing, so project memory and release subtext are not yet first-class. (CHANGELOG.md) Recommendation: Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating one.
- low: evidence-standards-missing - Expected policy or coverage artifact is missing. (governance-template/base/evidence-standards.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: generated-output-missing - Expected generated output is missing after WWG init/generation. (.wwg/workspace/context/project-context.md) Recommendation: Run the relevant generate or refresh command.
- low: generated-output-missing - Expected generated output is missing after WWG init/generation. (.wwg/workspace/skills/skill-index.md) Recommendation: Run the relevant generate or refresh command.
- low: gitignore-native-report-backups-missing - Report policy expects `.wwg/reports/backups/` to be ignored. (.gitignore) Recommendation: Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (wiki-template/base/12-maintenance/context-maintenance-matrix.md) Recommendation: Add matrix coverage when this layer exists.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (workspace-template/base/context/context-maintenance-matrix.md) Recommendation: Add matrix coverage when this layer exists.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (.wwg/wiki/12-maintenance/self-maintenance-loop.md) Recommendation: Add matrix coverage when this layer exists.
- low: public-discovery-review-missing - Expected policy or coverage artifact is missing. (governance-template/base/public-discovery-review.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: public-surface-review-missing - Expected policy or coverage artifact is missing. (governance-template/base/public-surface-review.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: readme-agent-routing-missing - WWG is present but README.md does not route agents to AGENTS.md and .wwg context. (README.md) Recommendation: Add a short For Agents section.
- low: runtime-monitoring-missing - Expected policy or coverage artifact is missing. (wiki-template/base/08-operations/monitoring.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: scoped-agents-recommended - Scoped AGENTS.md candidate has a clean local ownership boundary. (apps/api/AGENTS.md) Recommendation: Recommend only; do not auto-create during Phase 2B.
- low: scoped-agents-recommended - Scoped AGENTS.md candidate has a clean local ownership boundary. (apps/web/AGENTS.md) Recommendation: Recommend only; do not auto-create during Phase 2B.
- low: truth-conflict-policy-missing - Expected policy or coverage artifact is missing. (governance-template/base/truth-conflict-resolution.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- info: agent-ready-artifacts-present - Agent-ready structure and evidence reports are present. Recommendation: No action required.
- info: ambiguous-report-classification - Some report-like files need human classification. Recommendation: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- info: candidate-principle-like-content - Potential principle-like content was found outside the principles folder. (AGENTS.md) Recommendation: Review whether this durable guidance should become a candidate Principle Brief; do not treat this as a critical error.
- info: duplicate-concepts-clear - No duplicate concept hints detected beyond normal WWG structure. Recommendation: No action required.
- info: generated-markers-balanced - Generated marker pairs are balanced where present. Recommendation: Review and document the appropriate next step.
- info: governance-detected - Detected 19 governance artifact(s). Recommendation: Reuse and register existing governance artifacts.
- info: json-schemas-parse - Parsed and compiled 0 JSON schema file(s). Recommendation: Review and document the appropriate next step.
- info: maintenance-review-recommended - This project shows maintenance drift signals. Run `wwg maintain --target <path>` to generate a structured maintenance review. Recommendation: Run `wwg maintain --target .` for a non-destructive maintenance recommendation report.
- info: mapping-design_context - Detected candidate for design_context. (DESIGN.md) Recommendation: Register DESIGN.md as design_context; do not duplicate it.
- info: mapping-project_master_context - Detected candidate for project_master_context. (governance/context-drift-detection.md) Recommendation: Register governance/context-drift-detection.md as project_master_context; do not duplicate it.
- info: mapping-root_agents - Detected candidate for root_agents. (AGENTS.md) Recommendation: Register AGENTS.md as root_agents; do not duplicate it.
- info: markdown-readable - Markdown files are non-empty and readable. Recommendation: Review and document the appropriate next step.
- info: principle-files-present - Principle-like files found: 5. (.wwg/wiki/principles) Recommendation: Add Principle Briefs only when durable guidance is explicit.
- info: project-registry-valid - WWG project registry parses and matches the registry schema. (.wwg/config/wwg.project.yaml) Recommendation: Review and document the appropriate next step.
- info: public-surface-artifact - Public surface or discovery artifact detected. (.wwg/changelog/config.yml) Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- info: public-surface-artifact - Public surface or discovery artifact detected. (.wwg/changelog/state.json) Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- info: public-surface-detected - Detected 2 public surface/public discovery artifact(s). Recommendation: Map existing public discovery sources before proposing new ones.
- info: readme-detected - README.md was detected at 117 lines. (README.md) Recommendation: Validate it with `wwg readme validate --target .`.
- info: recommendation-governance-present - Recommendation capture is available through the Governance registry and policy. (.wwg/governance/recommendation-registry.md) Recommendation: Use the registry for useful future work discovered by agents, audits, maintenance runs, or closeouts; do not promote recommendations automatically.
- info: root-agents-detected - Root agent instructions were detected. (AGENTS.md) Recommendation: Map this file as canonical_artifacts.root_agents.
- info: runtime-skill-candidates-not-generated - Runtime skill candidate contract: not generated. (.wwg/reports/runtime-skill-candidates.json) Recommendation: No action required. Candidate artifacts are optional and absence is valid.
- info: skill-manifest-absent - Skill Manifest is not present. This remains valid for backward compatibility. (.wwg/config/skill-manifest.yaml) Recommendation: Run `wwg refresh-skills --target .` when you want WWG to generate project skill state.
- info: structure-present - Expected structure is present for existing-adopted-project. Recommendation: No action required.
- info: template-boundary-scope-skipped - Template asset boundary checks apply only to WWG template repositories. Recommendation: No action required.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (governance/regression-guardrail-catalog.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/context-skill-quality.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/context-skill-quality.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-agent-handoff.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-agent-handoff.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-audit-report.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-audit-report.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-doctor-report.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-doctor-report.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-handoff-to-codex.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-handoff-to-codex.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: wwg-principles-valid - Principles folder and lightweight Principle Brief checks passed. Recommendation: Review and document the appropriate next step.
- info: yaml-files-parse - Parsed 1 YAML file(s). Recommendation: Review and document the appropriate next step.
- info: json-schemas-parse - Parsed and compiled 0 JSON schema file(s).
- info: yaml-files-parse - Parsed 1 YAML file(s).
- info: project-registry-valid - WWG project registry parses and matches the registry schema. (.wwg/config/wwg.project.yaml)
- info: profile-skill-recommendations-valid - Validated skill recommendation metadata for 0 profile file(s). Recommendation: Keep profile skill recommendations advisory until manifest generation and runtime activation are implemented.
- info: required-directories-present - Required directories exist for wwg-native-project.
- info: wwg-operating-loop-present - WWG operating loop files and AGENTS signals are present.
- info: wwg-principles-valid - Principles folder and lightweight Principle Brief checks passed.
- info: generated-markers-balanced - Generated marker pairs are balanced where present.
- info: markdown-readable - Markdown files are non-empty and readable.
- info: ambiguous-report-classification - Some report-like files need human classification. Recommendation: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- info: gitignore-native-report-backups-missing - Report policy expects `.wwg/reports/backups/` to be ignored. (.gitignore) Recommendation: Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`.
- info: markdown-contract-quality-report-generated - Markdown contract quality report completed with 109 warning(s) and 99 suggestion(s). (reports/context-skill-quality.md) Recommendation: Review `.wwg/reports/context-skill-quality.md` during focused documentation remediation.
- low: readme-section-missing - README is missing expected front-door section: Install. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-section-missing - README is missing expected front-door section: Current Status. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-section-missing - README is missing expected front-door section: License. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-section-missing - README is missing expected front-door section: For Agents. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-section-missing - README is missing expected front-door section: What It Is. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-section-missing - README is missing expected front-door section: Why It Exists. (README.md) Recommendation: Add a concise section or route readers to the matching docs page.
- low: readme-status-stale - Package version 0.0.0 is not mentioned in README status. (README.md) Recommendation: Review Current Status and version wording.
- info: handoff-input-missing - .wwg/config/intake.answers.yaml was not available for the handoff report. (.wwg/config/intake.answers.yaml) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/config/skill-manifest.yaml was not available for the handoff report. (.wwg/config/skill-manifest.yaml) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/reports/truth-reconciliation-candidates.json was not available for the handoff report. (.wwg/reports/truth-reconciliation-candidates.json) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/reports/truth-reconciliation-candidates.md was not available for the handoff report. (.wwg/reports/truth-reconciliation-candidates.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/reports/wwg-infra-check-report.md was not available for the handoff report. (.wwg/reports/wwg-infra-check-report.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/reports/wwg-sources-report.md was not available for the handoff report. (.wwg/reports/wwg-sources-report.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/reports/wwg-upgrade-plan.md was not available for the handoff report. (.wwg/reports/wwg-upgrade-plan.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/01-sources/source-index.json was not available for the handoff report. (.wwg/wiki/01-sources/source-index.json) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/01-sources/source-index.md was not available for the handoff report. (.wwg/wiki/01-sources/source-index.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/02-project/project-brief.md was not available for the handoff report. (.wwg/wiki/02-project/project-brief.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/03-requirements/functional-requirements.md was not available for the handoff report. (.wwg/wiki/03-requirements/functional-requirements.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/05-architecture/deployment-model.md was not available for the handoff report. (.wwg/wiki/05-architecture/deployment-model.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/07-ux/design-preferences.md was not available for the handoff report. (.wwg/wiki/07-ux/design-preferences.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/07-ux/screens.md was not available for the handoff report. (.wwg/wiki/07-ux/screens.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/11-synthesis/open-questions.md was not available for the handoff report. (.wwg/wiki/11-synthesis/open-questions.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - .wwg/wiki/11-synthesis/planning-summary.md was not available for the handoff report. (.wwg/wiki/11-synthesis/planning-summary.md) Recommendation: Leave as an open question until planning truth exists.
- info: handoff-input-missing - intake answers was not available for the handoff report. (intake answers) Recommendation: Leave as an open question until planning truth exists.
- medium: recommended-changelog - Recommended artifact is not currently mapped or detected. (CHANGELOG.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: recommended-maintenance_matrix - Recommended artifact is not currently mapped or detected. (docs/ai-context/context-maintenance-matrix.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: recommended-public_discovery_context - Recommended artifact is not currently mapped or detected. (docs/ai-context/public-discovery-context.md) Recommendation: Create only in a later explicit adoption/init phase.
- medium: registry-report-missing - Registry references missing report generate_workspace. (.wwg/reports/wwg-generate-workspace-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- medium: registry-report-missing - Registry references missing report refresh_context. (.wwg/reports/wwg-refresh-context-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- medium: registry-report-missing - Registry references missing report refresh_skills. (.wwg/reports/wwg-refresh-skills-report.md) Recommendation: Run the related command or remove the stale report reference through a safe registry update.
- low: canonical-context-policy-missing - Expected policy or coverage artifact is missing. (wiki-template/base/09-agent-context/canonical-context-policy.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: changelog-missing - CHANGELOG.md is missing, so project memory and release subtext are not yet first-class. (CHANGELOG.md) Recommendation: Run `wwg changelog generate --target . --from-git --weekly --dry-run` before creating one.
- low: evidence-standards-missing - Expected policy or coverage artifact is missing. (governance-template/base/evidence-standards.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: generated-output-missing - Expected generated output is missing after WWG init/generation. (.wwg/workspace/context/project-context.md) Recommendation: Run the relevant generate or refresh command.
- low: generated-output-missing - Expected generated output is missing after WWG init/generation. (.wwg/workspace/skills/skill-index.md) Recommendation: Run the relevant generate or refresh command.
- low: gitignore-native-report-backups-missing - Report policy expects `.wwg/reports/backups/` to be ignored. (.gitignore) Recommendation: Add a narrow ignore rule for `.wwg/reports/backups/` or `.wwg/.gitignore` `reports/backups/`.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (wiki-template/base/12-maintenance/context-maintenance-matrix.md) Recommendation: Add matrix coverage when this layer exists.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (workspace-template/base/context/context-maintenance-matrix.md) Recommendation: Add matrix coverage when this layer exists.
- low: maintenance-matrix-missing - Maintenance matrix artifact is missing. (.wwg/wiki/12-maintenance/self-maintenance-loop.md) Recommendation: Add matrix coverage when this layer exists.
- low: public-discovery-review-missing - Expected policy or coverage artifact is missing. (governance-template/base/public-discovery-review.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: public-surface-review-missing - Expected policy or coverage artifact is missing. (governance-template/base/public-surface-review.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: readme-agent-routing-missing - WWG is present but README.md does not route agents to AGENTS.md and .wwg context. (README.md) Recommendation: Add a short For Agents section.
- low: runtime-monitoring-missing - Expected policy or coverage artifact is missing. (wiki-template/base/08-operations/monitoring.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- low: scoped-agents-recommended - Scoped AGENTS.md candidate has a clean local ownership boundary. (apps/api/AGENTS.md) Recommendation: Recommend only; do not auto-create during Phase 2B.
- low: scoped-agents-recommended - Scoped AGENTS.md candidate has a clean local ownership boundary. (apps/web/AGENTS.md) Recommendation: Recommend only; do not auto-create during Phase 2B.
- low: truth-conflict-policy-missing - Expected policy or coverage artifact is missing. (governance-template/base/truth-conflict-resolution.md) Recommendation: Restore the policy artifact or document an equivalent canonical source.
- info: agent-ready-artifacts-present - Agent-ready structure and evidence reports are present. Recommendation: No action required.
- info: ambiguous-report-classification - Some report-like files need human classification. Recommendation: Run `wwg reports --target .` and review the Ambiguous / Needs Review section.
- info: candidate-principle-like-content - Potential principle-like content was found outside the principles folder. (AGENTS.md) Recommendation: Review whether this durable guidance should become a candidate Principle Brief; do not treat this as a critical error.
- info: duplicate-concepts-clear - No duplicate concept hints detected beyond normal WWG structure. Recommendation: No action required.
- info: generated-markers-balanced - Generated marker pairs are balanced where present. Recommendation: Review and document the appropriate next step.
- info: governance-detected - Detected 19 governance artifact(s). Recommendation: Reuse and register existing governance artifacts.
- info: json-schemas-parse - Parsed and compiled 0 JSON schema file(s). Recommendation: Review and document the appropriate next step.
- info: maintenance-review-recommended - This project shows maintenance drift signals. Run `wwg maintain --target <path>` to generate a structured maintenance review. Recommendation: Run `wwg maintain --target .` for a non-destructive maintenance recommendation report.
- info: mapping-design_context - Detected candidate for design_context. (DESIGN.md) Recommendation: Register DESIGN.md as design_context; do not duplicate it.
- info: mapping-project_master_context - Detected candidate for project_master_context. (governance/context-drift-detection.md) Recommendation: Register governance/context-drift-detection.md as project_master_context; do not duplicate it.
- info: mapping-root_agents - Detected candidate for root_agents. (AGENTS.md) Recommendation: Register AGENTS.md as root_agents; do not duplicate it.
- info: markdown-readable - Markdown files are non-empty and readable. Recommendation: Review and document the appropriate next step.
- info: principle-files-present - Principle-like files found: 5. (.wwg/wiki/principles) Recommendation: Add Principle Briefs only when durable guidance is explicit.
- info: project-registry-valid - WWG project registry parses and matches the registry schema. (.wwg/config/wwg.project.yaml) Recommendation: Review and document the appropriate next step.
- info: public-surface-artifact - Public surface or discovery artifact detected. (.wwg/changelog/config.yml) Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- info: public-surface-artifact - Public surface or discovery artifact detected. (.wwg/changelog/state.json) Recommendation: Treat public/trust messaging changes as approval-gated when content is customer-facing.
- info: public-surface-detected - Detected 2 public surface/public discovery artifact(s). Recommendation: Map existing public discovery sources before proposing new ones.
- info: readme-detected - README.md was detected at 117 lines. (README.md) Recommendation: Validate it with `wwg readme validate --target .`.
- info: recommendation-governance-present - Recommendation capture is available through the Governance registry and policy. (.wwg/governance/recommendation-registry.md) Recommendation: Use the registry for useful future work discovered by agents, audits, maintenance runs, or closeouts; do not promote recommendations automatically.
- info: root-agents-detected - Root agent instructions were detected. (AGENTS.md) Recommendation: Map this file as canonical_artifacts.root_agents.
- info: runtime-skill-candidates-not-generated - Runtime skill candidate contract: not generated. (.wwg/reports/runtime-skill-candidates.json) Recommendation: No action required. Candidate artifacts are optional and absence is valid.
- info: skill-manifest-absent - Skill Manifest is not present. This remains valid for backward compatibility. (.wwg/config/skill-manifest.yaml) Recommendation: Run `wwg refresh-skills --target .` when you want WWG to generate project skill state.
- info: structure-present - Expected structure is present for existing-adopted-project. Recommendation: No action required.
- info: template-boundary-scope-skipped - Template asset boundary checks apply only to WWG template repositories. Recommendation: No action required.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (governance/regression-guardrail-catalog.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/context-skill-quality.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/context-skill-quality.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-agent-handoff.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-agent-handoff.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-audit-report.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-audit-report.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-doctor-report.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-doctor-report.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-handoff-to-codex.json) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: todo-fixme-tbd-detected - TODO/FIXME/TBD marker detected. (reports/wwg-handoff-to-codex.md) Recommendation: Confirm whether this is intentional tracked work or convert it into a report/follow-up.
- info: wwg-principles-valid - Principles folder and lightweight Principle Brief checks passed. Recommendation: Review and document the appropriate next step.
- info: yaml-files-parse - Parsed 1 YAML file(s). Recommendation: Review and document the appropriate next step.

## WWG Truth Synchronization

- Task mode: doctor repair
- New truth detected: NO
- Wiki updated: NO / N/A
- Workspace updated: YES
- Governance review completed: YES
- Drift status: LOW
- Canonical files changed:
  - None; doctor repairs generated WWG surfaces only and does not rewrite semantic Wiki truth.
- Implementation discoveries synced:
  - None; report output remains evidence only until separately accepted.
- Remaining stale context:
  - Review doctor findings above.
- Generated By: WWG
- Generated At: 2026-10-01T10:13:25.087Z
- Canonical Truth Impact: none; report evidence does not rewrite `.wwg/wiki`.
- Requires Review: review findings or candidates before promoting any semantic truth.
- Vorter runtime evidence accepted as WWG truth: NO


## Next Recommended Commands

- Open the target folder in your IDE.
- Start your chosen coding agent with the prompt from .wwg/reports/wwg-agent-handoff.md.
