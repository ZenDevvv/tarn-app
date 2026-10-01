# Context and Skill Markdown Quality Report

## Executive Summary

Validation status: WARN.

Checked 25 Markdown file(s), with 0 error(s), 40 warning(s), and 30 suggestion(s).

## Overall Status

- Status: warn
- Metadata policy: Option C: Skill Registry metadata is canonical; skill files may include lightweight metadata when beneficial, and package-side skills do not require frontmatter.
- Style warnings do not fail validation by default.
- WWG/Vorter runtime boundary findings are treated as errors when they make direct runtime-action claims.

## Files Checked

- .wwg/governance/drift-guard.md
- .wwg/governance/regression-gaps.md
- .wwg/governance/regression-manifest.md
- .wwg/governance/rule-traceability.md
- .wwg/governance/truth-capture.md
- .wwg/reports/adoption-audit.md
- .wwg/reports/adoption-regression-report.md
- .wwg/reports/skill-cleanup-review.md
- .wwg/reports/wwg-adoption-plan.md
- .wwg/reports/wwg-adoption-report.md
- .wwg/reports/wwg-adoption-truth-handoff.md
- .wwg/reports/wwg-existing-audit-report.md
- .wwg/reports/wwg-maintenance-review.md
- .wwg/reports/wwg-validate-report.md
- .wwg/wiki/principles/README.md
- .wwg/wiki/project-truth.md
- .wwg/wiki/terminology.md
- .wwg/workspace/current-task.md
- .wwg/workspace/testing/manual-verification-checklist.md
- .wwg/workspace/testing/non-technical-regression-checklist.md
- .wwg/workspace/testing/regression-candidate-review.md
- AGENTS.md
- DESIGN.md
- job-application-tracker-brd-prd.md
- job-application-tracker-project-architecture.md

## Classification Summary

| File type | Count |
|---|---:|
| context | 3 |
| skill | 0 |
| governance | 5 |
| report | 9 |
| public_doc | 0 |
| agent_instruction | 1 |
| changelog_governance | 0 |
| changelog_or_release_note | 0 |
| design_contract | 0 |
| template | 0 |
| unknown | 7 |

## Errors

- None.

## Warnings

- WARNING governance-contract-missing-sections (.wwg/governance/drift-guard.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/drift-guard.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/regression-gaps.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/regression-gaps.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/regression-manifest.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/regression-manifest.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/rule-traceability.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/rule-traceability.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/truth-capture.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/truth-capture.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING report-contract-missing-sections (.wwg/reports/adoption-audit.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/adoption-regression-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/skill-cleanup-review.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-plan.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-truth-handoff.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-existing-audit-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-maintenance-review.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-validate-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING context-contract-missing-sections (.wwg/wiki/principles/README.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.
- WARNING context-contract-missing-sections (.wwg/wiki/project-truth.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.
- WARNING context-contract-missing-sections (.wwg/wiki/terminology.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.
- WARNING agent-instruction-contract-missing-sections (AGENTS.md) [Required Reading, Operating Rules]: Agent Instruction is missing contract section(s): Required Reading, Operating Rules. Recommendation: Add the missing active instruction section or link to the canonical source.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:262) [FR-AUTH-001 — User Registration]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:299) [Dashboard Metrics]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:340) [Required Application Information]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:385) [Columns]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:410) [Sections]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:505) [Follow-Up Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:538) [Saved Job Information]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:567) [Company Information]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:611) [Contact Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:631) [Interview Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:671) [Preparation Sections]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:690) [Resume Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:717) [Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:735) [Information]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:791) [Core Metrics]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:859) [Offer Fields]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.
- WARNING markdown-skipped-heading-level (job-application-tracker-brd-prd.md:1546) [Product Metrics]: Heading level jumps from H1 to H3. Recommendation: Use sequential heading levels so agents can parse document structure reliably.

## Suggestions

- SUGGESTION markdown-possible-stale-current-language (.wwg/governance/drift-guard.md:51): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-repeated-heading (.wwg/reports/adoption-audit.md:77) [Inferred Truth]: Heading 'Inferred Truth' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (.wwg/reports/adoption-audit.md:86) [Open Questions]: Heading 'Open Questions' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-possible-vague-pronouns (.wwg/reports/adoption-regression-report.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- SUGGESTION markdown-repeated-heading (.wwg/reports/wwg-existing-audit-report.md:81) [Inferred Truth]: Heading 'Inferred Truth' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (.wwg/reports/wwg-existing-audit-report.md:90) [Open Questions]: Heading 'Open Questions' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-possible-vague-pronouns (.wwg/reports/wwg-maintenance-review.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- SUGGESTION markdown-possible-stale-current-language (AGENTS.md:60): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-vague-pronouns (DESIGN.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- SUGGESTION markdown-repeated-heading (job-application-tracker-brd-prd.md:1785) [Mitigation]: Heading 'Mitigation' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-brd-prd.md:1800) [Mitigation]: Heading 'Mitigation' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-brd-prd.md:1806) [Mitigation]: Heading 'Mitigation' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-brd-prd.md:1812) [Mitigation]: Heading 'Mitigation' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-empty-section (job-application-tracker-brd-prd.md:258) [7. Functional Requirements]: Section '7. Functional Requirements' is empty. Recommendation: Fill the section or state 'Not applicable' with a short reason.
- SUGGESTION markdown-possible-vague-pronouns (job-application-tracker-brd-prd.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-brd-prd.md:177): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-brd-prd.md:198): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-brd-prd.md:208): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-brd-prd.md:217): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-brd-prd.md:786): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-repeated-heading (job-application-tracker-project-architecture.md:2097) [Frontend]: Heading 'Frontend' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-project-architecture.md:2103) [Backend]: Heading 'Backend' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-project-architecture.md:2788) [Frontend]: Heading 'Frontend' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-project-architecture.md:2802) [Backend]: Heading 'Backend' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (job-application-tracker-project-architecture.md:2818) [Storage]: Heading 'Storage' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-project-architecture.md:233): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-project-architecture.md:248): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-project-architecture.md:1376): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-project-architecture.md:1386): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- SUGGESTION markdown-possible-stale-current-language (job-application-tracker-project-architecture.md:1398): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.

## Skill Contract Findings

- None.

## Context Contract Findings

- WARNING context-contract-missing-sections (.wwg/wiki/principles/README.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.
- WARNING context-contract-missing-sections (.wwg/wiki/project-truth.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.
- WARNING context-contract-missing-sections (.wwg/wiki/terminology.md) [Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References]: Context is missing contract section(s): Purpose, Scope, Current State, Canonical Terms, Decisions, Constraints, References. Recommendation: Add the missing context section or mark it explicitly not applicable.

## Governance Findings

- WARNING governance-contract-missing-sections (.wwg/governance/drift-guard.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/drift-guard.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- SUGGESTION markdown-possible-stale-current-language (.wwg/governance/drift-guard.md:51): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.
- WARNING governance-contract-missing-sections (.wwg/governance/regression-gaps.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/regression-gaps.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/regression-manifest.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/regression-manifest.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/rule-traceability.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/rule-traceability.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.
- WARNING governance-contract-missing-sections (.wwg/governance/truth-capture.md) [Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References]: Governance is missing contract section(s): Purpose, Applies To, Rules, Enforcement, Reports / Artifacts, References. Recommendation: Add the missing governance section or mark it explicitly not applicable.
- WARNING governance-rules-missing-structure (.wwg/governance/truth-capture.md) [Must, Must Not, Prefer, Avoid]: Governance file is missing rule structure section(s): Must, Must Not, Prefer, Avoid. Recommendation: Use Must / Must Not / Prefer / Avoid for enforceable governance rules.

## Report Findings

- WARNING report-contract-missing-sections (.wwg/reports/adoption-audit.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- SUGGESTION markdown-repeated-heading (.wwg/reports/adoption-audit.md:77) [Inferred Truth]: Heading 'Inferred Truth' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (.wwg/reports/adoption-audit.md:86) [Open Questions]: Heading 'Open Questions' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- WARNING report-contract-missing-sections (.wwg/reports/adoption-regression-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- SUGGESTION markdown-possible-vague-pronouns (.wwg/reports/adoption-regression-report.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- WARNING report-contract-missing-sections (.wwg/reports/skill-cleanup-review.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-plan.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-adoption-truth-handoff.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-existing-audit-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- SUGGESTION markdown-repeated-heading (.wwg/reports/wwg-existing-audit-report.md:81) [Inferred Truth]: Heading 'Inferred Truth' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- SUGGESTION markdown-repeated-heading (.wwg/reports/wwg-existing-audit-report.md:90) [Open Questions]: Heading 'Open Questions' repeats at the same level. Recommendation: Rename repeated headings or add a qualifier when repeated sections could confuse agents.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-maintenance-review.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.
- SUGGESTION markdown-possible-vague-pronouns (.wwg/reports/wwg-maintenance-review.md): File has many pronouns that may be ambiguous for agents. Recommendation: Replace ambiguous pronouns with explicit nouns where references may be unclear.
- WARNING report-contract-missing-sections (.wwg/reports/wwg-validate-report.md) [Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed]: Report is missing contract section(s): Outcome, Evidence, Validation, Risks, Next Action, Detailed Notes, Files Changed or Files Reviewed. Recommendation: Add missing report sections in future reports or mark sections explicitly not applicable.

## Public-Doc Findings

- None.

## Agent-Instruction Findings

- WARNING agent-instruction-contract-missing-sections (AGENTS.md) [Required Reading, Operating Rules]: Agent Instruction is missing contract section(s): Required Reading, Operating Rules. Recommendation: Add the missing active instruction section or link to the canonical source.
- SUGGESTION markdown-possible-stale-current-language (AGENTS.md:60): Stable or active file contains phase/pass/temporary language. Recommendation: Route history to reports, changelog, roadmap, or dated history docs unless the file is intentionally historical.

## Changelog-Governance Findings

- None.

## Vorter Boundary Findings

- None.

## Recommended Next Pass

- Pass E should compact active context and AGENTS.md using these findings, without weakening safety-critical governance.
