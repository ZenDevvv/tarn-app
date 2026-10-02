---
type: principle-brief
status: active
mutability: high-friction
scope: agent-conduct
last_reviewed: 2026-10-02
---

# Never Present Planned Work as Implemented

Provenance: established during WWG truth ingestion on 2026-10-01, after the initial adoption audit inferred truth from the repository folder name while `job-application-tracker-brd-prd.md` and `job-application-tracker-project-architecture.md` sat unread in the same folder. This is the failure mode that principle exists to prevent.

## Principle

This project is **documentation-stage**. Its architecture document is unusually detailed and reads like a description of an existing system. It is not. It is a plan.

Agents must always distinguish three states and never collapse them:

| State | Meaning | How to label it |
|---|---|---|
| **Observed** | Verified in the working tree or in runtime evidence | `CONFIRMED` with `file + line` or command evidence |
| **Accepted plan** | Written down in an authoritative project doc, not yet built | `CONFIRMED_AS_PLAN` |
| **Inferred** | Agent reasoning, not stated anywhere | `INFERRED` |
| **Unresolved** | Genuinely unknown, needs an owner decision | `NEEDS_CONFIRMATION` |

## Why It Matters

Three concrete risks:

1. **Capability overstatement.** Writing "the app uses TanStack Query" when nothing is implemented produces reports, handoffs, and status output that lie to the owner.
2. **Path hallucination.** The architecture document names `apps/web/src/index.css` and `DESIGN.md` §1 repeats it as a hard rule. That file does not exist; `index.css` is at the repository root. An agent reasoning from the doc alone will reference a nonexistent path and treat the conflict as a code bug. The path is now confirmed as correct by `.wwg/wiki/decisions/D-0005-token-file-location.md`, and the move is scheduled for the scaffold — so the mismatch is a *pending migration*, not an error to fix or a doc to distrust.
3. **False readiness.** `wwg status` and readiness reports can show green checks that reflect WWG *structure*, not product *capability*. "WWG structure present" is not "MVP is working".

## The verification gap: documentation is not evidence of execution

A fourth risk emerged on 2026-10-02 and is now part of this principle.

A root command, `pnpm db:deploy`, was documented in `README.md` § Troubleshooting
as part of the volume-recovery procedure. It was **broken from the day it was
written** — `pnpm --filter @tarn/database deploy` resolves to pnpm's own
built-in `deploy` command, not the package script, so the command failed with
`ERR_PNPM_INVALID_DEPLOY_TARGET`. It survived two AI review rounds and an owner
sign-off because **no gate ever executed it**. Both CI jobs invoke the
equivalent command inline, which works, and so routed around the defect
permanently.

The generalisable rules:

1. **A documented command is a claim requiring evidence, exactly like a
   "verified" claim.** If `README.md` says `pnpm X` works, run `pnpm X` before
   trusting the sentence. Do not infer that a script works because its
   surrounding prose is confident.
2. **An unexplained workaround in CI is masking a defect at the source.** When
   CI runs a command inline instead of calling the script that exists for the
   purpose, ask why. If nobody can say, the script is suspect — do not "clean it
   up" to match the inline form. Fix the script and make CI call it, so the next
   real break is visible.
3. **Prefer exercising the real entry point.** A gate that calls a different
   path than the one documented gives green status for something nobody uses.

## Applies To

- Project Truth and Terminology updates
- Status, readiness, and handoff reporting
- Code generation and file references
- Any statement about what the product does, supports, or is ready for
- Any command, script, or procedure this project documents as working

## Agent Guidance

- Before asserting a fact about this project, ask: **did I observe this, or did I only read it planned?** If the evidence is a doc, the label is `CONFIRMED_AS_PLAN`.
- When citing a file path from a project document, verify the path exists before acting on it. Report the mismatch as `CONFLICTING` in Project Truth rather than silently following the doc or silently following the tree.
- Never write that a feature "works", "is implemented", "is production-ready", or "ships". Use "is specified", "is planned", or "is in scope".
- The MVP Definition of Done (PRD §35) lists 14 criteria. Until application source code exists, **none** are met. Do not report MVP progress against that list as if it were being tracked.
- Keep the "Implementation Reality" section of Project Truth current. The moment `apps/` exists, that section must change and planned architecture should be re-evaluated against observed architecture.
- Prefer citing `file + section` over citing a file generally, so a later reader can verify the claim.

## Non-Goals

- This does not mean being pessimistic or refusing to plan. Planning is exactly what this project is doing now.
- It does not mean treating documentation as low-value. Here, the documents *are* the product artifact; they are simply not running software.
- It does not mean distrusting the docs. They are authoritative for intent; they are not evidence of runtime state.

## Related Truths

- `.wwg/wiki/project-truth.md` — "Source-of-Truth Order", "Implementation Reality", "Safety and Production Boundaries", "Known Conflicts and Drift Risks"
- `.wwg/wiki/decisions/D-0005-token-file-location.md` — the confirmed token-path migration
- `.wwg/wiki/decisions/D-0006-password-hashing-scrypt.md` — a place where the owner settled a choice that agents should not have settled alone
- `.wwg/wiki/project-truth.md` CORRECTION entry — the `prismaLint` claim that was recorded as verified and never verified
- `.wwg/governance/recommendation-registry.md` REC-0009 — re-audit the unproven claims from the 2026-10-01 close-out batch
- `job-application-tracker-brd-prd.md` §35 (MVP Definition of Done), §38 (Document Status and Decision Log)
- `job-application-tracker-project-architecture.md` §90 (Suggested Build Order)
- `.wwg/governance/evidence-standards.md`
- `.wwg/governance/operational-readiness-review.md`