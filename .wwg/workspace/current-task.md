# Current Task

Status: DONE — branch protection enforced on main, workflow proven end to end.
Task mode: Existing Project Adoption (continued) → delivery governance
Instance type: existing-project (adopted; this work continues the adoption lifecycle)
Last updated: 2026-10-01

## Task Summary

- Status: DONE
- User request: "proceed with the branch protection"

## What was applied to `main`

| Setting | Value | Why |
|---|---|---|
| Required status checks | `verify`, `dependency-review`, `CodeRabbit` | Every gate must be green before merge |
| Strict mode | on | The branch must be up to date, so the commit that merges is the one that passed — not an older passing commit |
| Pull request required | yes, 0 approvals | Forces the PR workflow so CodeRabbit actually sees every change |
| `enforce_admins` | **true** | Makes the gates bind the owner too |
| Force pushes | disabled | No rewriting published history |
| Branch deletion | disabled | `main` cannot be deleted |
| Conversation resolution | required | No merging with unresolved review threads |

## Verified by testing, not assumption

1. **Direct push rejected.** Attempted a commit straight to `main`; GitHub refused with `GH006: Protected branch update failed`, and `main` was confirmed unmoved via the API.
2. **The gate actually blocks.** On a real pull request the merge state was `BLOCKED` while CodeRabbit was still reviewing, then flipped to `CLEAN` only after all three checks passed.
3. **The merge went through.** Squash-merged once green, and `main` advanced.

That is the complete path proven: branch → pull request → three checks → merge.

## One thing that did not go as planned

The **first** protection configuration set `enforce_admins: false`, deliberately, as a safeguard so the owner could never be locked out of their own repository.

Testing showed that made the gates **advisory rather than enforcing**: the owner is the sole admin, so a direct push still succeeded, with GitHub printing the warning messages but allowing it anyway.

That was reported to the owner with a choice, and they chose to be bound too. `enforce_admins` is now `true`.

Escape hatch if CodeRabbit ever fails to report a status: an admin can edit or remove the protection rule in repository settings or via the API. This is friction, not a permanent lockout.

## Operational consequences to expect

- **No more direct pushes to `main`.** Every change needs a branch and a pull request.
- **Expect to wait.** CodeRabbit took roughly three minutes per review, and strict mode means a new push to an open pull request invalidates the checks and requires a re-run.
- **Squash merge leaves a gap.** The commit landing on `main` is newly generated and never had CI run against it. Strict mode guarantees the checks passed on the latest pull request commit. Use a merge commit, or add a post-merge re-run, if that guarantee matters. (Found by CodeRabbit, not by me.)
- Squash merge is the path used so far, which keeps history readable.

## Truth Surfaces Updated

- `.wwg/wiki/project-truth.md` — branch protection recorded as resolved, with the test evidence and the `enforce_admins` history
- `.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md` — CI checks now required
- `README.md` — a short note describing the protected workflow
- `.wwg/workspace/current-task.md`

## Remaining Open Questions

1. Which deployment vendors?
2. Rename the local folder `applicant-tracking-system` to something matching the product? (The GitHub repo is `tarn-app`, the product is `Tarn`.)
3. Husky and lint-staged, now that merges are gated? Lower value now that CI blocks bad merges.
4. When to get an external security review — still deferred, not forgotten.

## Close-Out Notes

- Truth Alignment Status: GREEN
- Execution Gate: pass — verified on the real platform, not locally
- Drift status: LOW
- Implementation confidence: HIGH for foundation, data layer, and delivery pipeline; **ZERO for product features**
- New recommendations: none added to the recommendation registry