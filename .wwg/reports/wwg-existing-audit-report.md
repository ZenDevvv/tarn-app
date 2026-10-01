# WWG Adoption Audit

## Audit Summary

- Target: C:\Users\Zen\Desktop\MY PROJECTS\applicant-tracking-system
- Date: 2026-10-01
- Recommended adoption mode: infer
- Adoption readiness score: 94 / 100
- Confidence: HIGH
- Command: `wwg audit --existing`

## Evidence Reviewed

- README/docs: DESIGN.md, README.md, governance/README.md, reports/README.md, wiki/principles/README.md
- Package/config files: apps/api/package.json, apps/web/package.json, package.json, packages/auth/package.json, packages/database/package.json, packages/types/package.json, packages/validation/package.json, pnpm-workspace.yaml
- Source folders: apps, apps/api, apps/api/src, apps/api/src/config, apps/api/src/middleware, apps/api/src/routes, apps/api/src/types, apps/web, apps/web/public, apps/web/src, apps/web/src/app, apps/web/src/components, apps/web/src/components/ui, apps/web/src/features, apps/web/src/hooks, apps/web/src/layouts, apps/web/src/lib, apps/web/src/routes, apps/web/src/test, apps/web/src/types, apps/web/src/utils, packages, packages/auth, packages/auth/src, packages/database, packages/database/prisma, packages/database/prisma/migrations, packages/database/prisma/migrations/20261001095704_init_mvp_schema, packages/database/src, packages/database/tests
- Tests: apps/api/src/app.test.ts, apps/web/src/layouts/app-layout.test.tsx, apps/web/src/routes/dashboard-page.test.tsx, apps/web/src/test/setup.ts, packages/auth/src/password.test.ts, packages/database/prisma/schema.test.ts, packages/database/tests/integration.test.ts, packages/types/src/index.test.ts, packages/validation/src/index.test.ts, tests/e2e/smoke.spec.ts, tests/tsconfig.json
- Deployment/config: .github/workflows/ci.yml, docker-compose.yml
- Existing agent/context files: .wwg/changelog/config.yml, .wwg/changelog/state.json, .wwg/readme/config.yml, .wwg/readme/state.json, AGENTS.md

## Observed Reality

- Product/app identity: CONFIRMED - tarn Evidence: package.json (package name)
- Product category: INFERRED - Web3 eCommerce prototype Evidence: README/source (Web3, commerce, cart/checkout, or crypto wallet terms detected)
- Tech stack: CONFIRMED - typescript Evidence: package/config (dependencies and config files)
- Runtime/build tools: CONFIRMED - dev, build, typecheck, typecheck:e2e, lint, lint:fix, test, test:e2e, db:generate, db:migrate, db:deploy, db:seed, db:studio, format, format:check Evidence: package.json (scripts)
- Main entry points: CONFIRMED - apps/api/src/app.ts, apps/api/src/server.ts, apps/web/src/main.tsx, packages/auth/src/index.ts, packages/types/src/index.ts, packages/validation/src/index.ts Evidence: apps/api/src/app.ts (entry point candidate); apps/api/src/server.ts (entry point candidate); apps/web/src/main.tsx (entry point candidate); packages/auth/src/index.ts (entry point candidate); packages/types/src/index.ts (entry point candidate); packages/validation/src/index.ts (entry point candidate)
- Main implemented features: INFERRED - Status, Stack, Requirements, Getting started, Layout, MVP scope, Documentation, Working with agents Evidence: README.md (README headings or route files)
- User roles/surfaces: INFERRED - user, owner, agent, developer Evidence: README/source (role-like terms detected)
- Data persistence: CONFIRMED - packages/database/package.json, packages/database/prisma/migrations/20261001095704_init_mvp_schema/migration.sql, packages/database/prisma/migrations/migration_lock.toml, packages/database/prisma/schema.prisma, packages/database/prisma/schema.test.ts, packages/database/prisma/seed.ts, packages/database/src/client.ts, packages/database/tests/integration.test.ts Evidence: packages/database/package.json (persistence indicator)
- Auth/security: CONFIRMED - apps/api/src/middleware/auth.ts, apps/api/src/middleware/error-handler.ts, apps/api/src/middleware/request-id.ts, governance/security-review.md, packages/auth/package.json, packages/auth/src/index.ts, packages/auth/src/password.test.ts, packages/auth/src/password.ts Evidence: apps/api/src/middleware/auth.ts (auth/security indicator)
- Payments/billing: NEEDS_CONFIRMATION - No payments/billing implementation detected Evidence: repository scan (no payment/billing indicators)
- Deployment/runtime: CONFIRMED - .github/workflows/ci.yml, docker-compose.yml Evidence: .github/workflows/ci.yml (deployment config); docker-compose.yml (deployment config)

## Inferred Truth

- Product identity: INFERRED - tarn Evidence: package.json (package name)
- Product category: INFERRED - Web3 eCommerce prototype Evidence: README/source (Web3, commerce, cart/checkout, or crypto wallet terms detected)
- Primary users: INFERRED - user, owner, agent, developer Evidence: README/source (role-like terms detected)
- Core features: INFERRED - Status, Stack, Requirements, Getting started, Layout, MVP scope, Documentation, Working with agents Evidence: README.md (README headings or route files)
- Architecture: INFERRED - source folders: apps, apps/api, apps/api/src, apps/api/src/config, apps/api/src/middleware, apps/api/src/routes, apps/api/src/types, apps/web; package-managed runtime Evidence: source/config (folders and package metadata)
- Safety/production boundaries: INFERRED - mock/demo crypto checkout and stablecoin wallet boundary, mock/demo behavior mentioned Evidence: README/source/package (safety boundary indicators)

## Conflicts and Drift Risks

- README vs code: CONFIRMED - No direct issue detected by lightweight audit.
- UI/copy vs implementation: CONFIRMED - No direct issue detected by lightweight audit.
- package metadata vs actual stack: CONFIRMED - No direct issue detected by lightweight audit.
- mock/demo vs production claims: CONFLICTING - Mock/demo and production/live language both appear in scanned text. Recommendation: Separate demo boundaries from production claims in project truth and public docs.
- terminology drift: CONFIRMED - No direct issue detected by lightweight audit.
- stale/generated files: CONFIRMED - No direct issue detected by lightweight audit.
- missing tests/checks: CONFIRMED - No direct issue detected by lightweight audit.

## Open Questions

- Confirm product category. Why: Category affects profile selection, architecture defaults, and governance gates. Evidence: INFERRED: Web3 eCommerce prototype
- Confirm primary users and role names. Why: Roles affect permissions, UX, terminology, and task routing. Evidence: INFERRED: user, owner, agent, developer
- Confirm payments/billing boundary. Why: Payments and billing are approval-sensitive. Evidence: NEEDS_CONFIRMATION: No payments/billing implementation detected

## Recommended Adoption Plan

- Recommended mode: infer
- Files WWG should create/update: `.wwg/wiki/project-truth.md`, `.wwg/wiki/terminology.md`, `.wwg/wiki/principles/README.md`, `.wwg/workspace/current-task.md`, `.wwg/governance/truth-capture.md`, `.wwg/governance/drift-guard.md`, `.wwg/reports/adoption-audit.md`, `AGENTS.md`.
- Follow-up actions: confirm inferred truth, resolve conflicts, answer open questions, and run `wwg validate --target <project>`.

Labels used: CONFIRMED, INFERRED, NEEDS_CONFIRMATION, CONFLICTING, STALE.


## Legacy Registry Mapping Summary

Detected 44 artifact(s). Registry-first mode: conservative.

## Observed Facts

- Observed facts are listed in the audit sections above and are backed by README/docs, package/config, source, test, deployment, and agent/context evidence.

## Inferred Truth

- Inferred truth is labeled above and should be reviewed before it becomes confirmed canonical truth.

## Conflicts

- mock/demo vs production claims: CONFLICTING - Mock/demo and production/live language both appear in scanned text.

## Open Questions

- Confirm product category. Evidence: INFERRED: Web3 eCommerce prototype
- Confirm primary users and role names. Evidence: INFERRED: user, owner, agent, developer
- Confirm payments/billing boundary. Evidence: NEEDS_CONFIRMATION: No payments/billing implementation detected

## Recommended Follow-Up

- Run `wwg adopt --mode infer --target <project>` to populate initial WWG truth from evidence.
- Review `.wwg/wiki/project-truth.md` before treating inferred truth as confirmed.

Reports are reference history. `.wwg/wiki/project-truth.md` is the canonical current truth once reviewed and maintained.

## Adoption Readiness Score

Score: 85 / 105

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
| project structure clarity | 10 / 10 | Implementation boundaries detected. |
| readme/docs quality | 10 / 10 | README or docs exist for product reality. |
| tests/checks | 10 / 10 | Tests or specs detected. |
| deployment config | 10 / 10 | Deployment/runtime config detected. |
| entry point clarity | 5 / 5 | Conventional entry points detected. |
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
| .github/workflows | project structure | runtime_context | medium |
| .github/workflows | project structure | impact_zone | medium |
| .wwg/changelog/config.yml | public surface | public_surface_updates | medium |
| .wwg/changelog/state.json | public surface | public_surface_updates | medium |
| AGENTS.md | root agent policy | root_agents | high |
| apps | project structure | impact_zone | medium |
| apps/api | project structure | impact_zone | medium |
| apps/web | project structure | impact_zone | medium |
| DESIGN.md | design source | design_context | high |
| docker-compose.yml | runtime structure | runtime_context | medium |
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
| packages | project structure | impact_zone | medium |
| packages/auth | project structure | impact_zone | medium |
| packages/database | project structure | impact_zone | medium |
| packages/types | project structure | impact_zone | medium |
| packages/validation | project structure | impact_zone | medium |
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
- LOW scoped-agents-recommended (apps/api/AGENTS.md): evidence=likely risk=medium Scoped AGENTS.md candidate has a clean local ownership boundary. Recommendation: Recommend only; do not auto-create during Phase 2B.
- LOW scoped-agents-recommended (apps/web/AGENTS.md): evidence=likely risk=medium Scoped AGENTS.md candidate has a clean local ownership boundary. Recommendation: Recommend only; do not auto-create during Phase 2B.

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

| Path | Reason |
|---|---|
| apps/api/AGENTS.md | recommended: apps/api has a clean local ownership boundary. |
| apps/web/AGENTS.md | recommended: apps/web has a clean local ownership boundary. |

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
