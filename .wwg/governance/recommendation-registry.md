# WWG Recommendation Registry

This registry captures useful future work discovered by agents, humans, audits, reviews, maintenance runs, retrospectives, and implementation closeouts.

Recommendations are not project truth until accepted.
Recommendations are not active work until promoted into the workspace backlog, current task, proposal, issue, or implementation plan.
Agents may add recommendations, but they must not treat recommendations as authorization to expand scope.

## Status Lifecycle

| Status | Meaning |
|---|---|
| Proposed | Captured but not reviewed |
| Accepted | Reviewed and considered useful future work |
| Promoted | Moved into backlog, proposal, issue, or current task |
| In Progress | Actively being worked on |
| Done | Completed and reconciled into relevant WWG files |
| Deferred | Useful, but intentionally postponed |
| Rejected | Reviewed and intentionally declined |
| Superseded | Replaced by another recommendation |

## Recommendation Registry

| ID | Name | Type | Source | Reason | Suggested Timing | Impact | Effort | Risk If Ignored | Status | Owner | Created | Review By | Links |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REC-0001 | Replace the placeholder registry row with real entries | Governance | Agent report-refresh closeout, 2026-10-02 | The registry shipped with a single templated example row, so `wwg maintain` reported "Total recommendations: 0" while the file looked populated. An agent scanning it could mistake the placeholder for real captured work. | Done 2026-10-02 | Low | Low | Recommendation capture stays cosmetic and real findings go untracked | Done | Zen | 2026-10-02 | 2026-10-02 | This table |
| REC-0002 | `regression-gaps.md` cannot be regenerated, so its stale block persists | Tooling | Agent report-refresh closeout, 2026-10-02 | The file is written once during `wwg adopt` and no later command refreshes it. It still claims "No existing tests" against a repo with 114 automated assertions. Documented in a human note outside the generated block, but the stale text is permanent until tooling changes. | Before the auth module lands, so the baseline is honest before coverage is claimed | Medium | Medium | Future agents read a gap list that contradicts reality and either over- or under-build verification | Proposed | Zen | 2026-10-02 | 2026-10-02 | `.wwg/governance/regression-gaps.md`; WWG-TOOL-005 |
| REC-0003 | Close `gap-uncovered-behavior-payment-behavior` as not applicable | Governance | `wwg reports` / maintenance review, 2026-10-02 | This project has no payment surface. PRD §2.4 and the canonical scope exclude billing. Leaving a payment regression gap open invites a future agent to build payment coverage for a feature that is explicitly out of scope. | Next governance pass | Low | Low | Scope creep toward billing, or permanent noise in the gap list | Proposed | Zen | 2026-10-02 | 2026-10-02 | `job-application-tracker-brd-prd.md` §2.4 |
| REC-0004 | `wwg maintain` reports RED / "Stop" with 0 critical and 0 high findings | Tooling | Agent report-refresh closeout, 2026-10-02 | The console summary reports Critical 0, High 0, Warnings 1, Advisory 17, yet the report header and the Truth Alignment section both say `RED / Critical Alignment Break` with `EXECUTION GATE: Stop`. An agent obeying the gate literally would halt all implementation over advisory findings about report bookkeeping. The score is driven by "Documentation Lag" and "Regression / Quality Drift" heuristics about artifact registration, not by any real conflict. | Investigate before relying on the execution gate | Medium | Medium | Agents either falsely block work, or learn to ignore a gate that sometimes means something real | Proposed | Zen | 2026-10-02 | 2026-10-02 | `.wwg/reports/wwg-maintenance-review.md` |
| REC-0005 | Decide the deployment vendors | Product | Carried forward from current-task.md, 2026-10-01 | Architecture §65 recommends Vercel / Railway-or-Render / Neon-or-Supabase / Cloudflare R2. None chosen, no deploy config exists. Blocks the operational-readiness boundary and file-storage design. | Before any deployment or file-upload work | High | Medium | Storage and secrets design get built on an unconfirmed assumption | Proposed | Zen | 2026-10-02 | 2026-10-02 | `job-application-tracker-project-architecture.md` §65 |
| REC-0006 | Rename the local directory from `applicant-tracking-system` to `tarn` | Governance | Carried forward from current-task.md, 2026-10-01 | The folder still carries the **retired** product name while the repo is `tarn-app` and the root `package.json` is `tarn`. Branch protection and CI now exist, so the cost of renaming has already gone up. | Owner decision; cheap now, expensive after more tooling depends on the path | Medium | Low | Retired name gets resurrected by tooling; recurring source of confusion | Proposed | Zen | 2026-10-02 | 2026-10-02 | `.wwg/wiki/project-truth.md` Product Identity |
| REC-0007 | Add a CHANGELOG.md | Governance | `wwg status` / `wwg maintain`, 2026-10-02 | Repeatedly flagged as a missing truth-loop artifact. Acceptable pre-release since nothing is versioned or deployed, but the git history now spans a full foundation plus a delivery pipeline. | First tagged release | Low | Low | No release memory; hard to reconstruct what shipped when | Proposed | Zen | 2026-10-02 | 2026-10-02 | `wwg changelog generate --from-git --weekly --dry-run` |
| REC-0008 | Amend architecture §6 to include `packages/auth` | Documentation | Recorded deviation in project-truth.md, 2026-10-01 | `packages/auth` is a real, justified deviation from the documented repository structure. It is recorded as a deviation in Project Truth but the source architecture document was never amended, so the two still disagree. | Next architecture revision | Low | Low | An agent trusting architecture §6 over Project Truth rebuilds the wrong structure | Proposed | Zen | 2026-10-02 | 2026-10-02 | `job-application-tracker-project-architecture.md` §6 |
| REC-0009 | Re-verify the unproven "confirmed" claims from the 2026-10-01 close-out batch | Governance | Found on PR #33, 2026-10-02 | Project Truth claimed the `prismaLint` config defect was "removed, and the warning is confirmed gone". It was never removed — `git log -S` proved it existed since the file's first commit — and the warning was live. A `CONFIRMED` claim in canonical truth was contradicted by both the working tree and the live platform. | Before the auth module, while the claim is still cheap to audit | High | Low | Other "verified" claims from that batch are silently unverified, and agents inherit false confidence about what was actually tested | Proposed | Zen | 2026-10-02 | 2026-10-02 | `.wwg/wiki/project-truth.md` CORRECTION entry; `.coderabbit.yaml` |
| REC-0010 | Decide whether `e2e` should be a required status check | Governance | Found on PR #34, 2026-10-02 | Project Truth records the required checks as `verify`, `e2e`, `dependency-review`, `CodeRabbit`. The GitHub API reports `required_status_checks.contexts` as `["verify", "dependency-review", "CodeRabbit"]` — `e2e` is absent. The browser-test job runs and reports, but a red `e2e` does not block a merge, so a browser regression can merge green. | Before the auth module, so the gate is trustworthy while features land | High | Low | Browser regressions merge undetected; the delivery gate is weaker than believed | Proposed | Zen | 2026-10-02 | 2026-10-02 | `.wwg/wiki/project-truth.md` CONFLICTING entry; GitHub branch protection |

## Entry Guidance

Each recommendation should answer:

- What is being recommended?
- Why was it discovered?
- What evidence supports it?
- When should it be revisited?
- What is the risk if ignored?
- Should it become a backlog item, proposal, ADR, regression test, documentation update, or governance rule?

## Promotion Rule

A recommendation may only become active work when it is explicitly promoted into one of the following:

- `.wwg/workspace/current-task.md`
- a backlog or planning artifact
- a proposal under `docs/proposals` or `.wwg/proposals` if present
- an issue tracker item
- an implementation prompt
- an accepted governance rule
- a regression test plan
