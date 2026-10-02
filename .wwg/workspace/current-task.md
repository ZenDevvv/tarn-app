# Current Task

Status: DONE — pre-auth cleanup complete. PR #38 merged (the `db:deploy` fix, the format gate, and the count corrections). A follow-up branch fixes the platform-dependent format gate (REC-0018).
Task mode: Existing Project Adoption (continued) → bug fix + tooling cleanup + truth synchronization. Mixed. No product feature was started.
Instance type: existing-project (adopted)
Adoption status: ADOPTED_FROM_EXISTING_PROJECT
Last updated: 2026-10-03

## Task Summary

- Status: DONE
- User request: "docker desktop is open. finish everything that needs to be done so that we can proceed to the auth feature"

## What this task found

The stated goal was to clear the pre-auth gates. Doing that surfaced **a broken
documented command that had never been executed**, which is the more important
outcome.

`pnpm db:deploy` — the command the `README.md` volume-recovery procedure tells a
developer to run — was broken from the day it was written:

```text
$ pnpm db:deploy
ERR_PNPM_INVALID_DEPLOY_TARGET  This command requires one parameter
```

The root script read `pnpm --filter @tarn/database deploy`. `deploy` is a
**built-in pnpm command**, so pnpm ran its own `deploy` and never invoked the
package script.

**Why it survived two AI review rounds and an owner sign-off.** No gate ran it.
Both CI jobs apply migrations inline
(`pnpm --filter @tarn/database exec prisma migrate deploy`), which works — so the
inline form silently routed around the defect permanently. The comment above the
CI step already said "Use `db:deploy`", which made the divergence look like an
oversight rather than the symptom it was.

This is the **REC-0009 failure mode recurring**, and the third instance of the
same shape: a claim of verification where no verification ran.

## What changed

| File | Change |
|---|---|
| `package.json` | `db:deploy` → `pnpm --filter @tarn/database run deploy` |
| `packages/database/prisma/scripts.test.ts` | **New.** 7 tests asserting the shape of every root `db:*` script |
| `.github/workflows/ci.yml` | Added a `Check formatting` step; documented the inline-workaround trap above the migration step |
| 50 source files | Prettier reformatted (REC-0011) |
| `README.md` | Corrected the gate count ("all four" → three named checks), corrected test counts 83/90 → 90/97, added a troubleshooting entry for the `pnpm --filter` collision, fixed a mangled `\main\` line |
| `.wwg/wiki/project-truth.md` | Test counts, the re-verification block, and a new RESOLVED entry for the `db:deploy` defect |
| `.wwg/wiki/principles/plan-vs-implementation-truth.md` | New section: the verification gap, and why a documented command is itself a claim requiring evidence |
| `.wwg/governance/recommendation-registry.md` | REC-0009 → Done (audited), REC-0011 → Done, REC-0016 → Done (new), REC-0017 → Proposed (new) |
| `.wwg/governance/test-enforcement.md` | Counts, the new test layer, and the "gate must exercise the documented entry point" rule |
| `.wwg/workspace/testing/verification-evidence.md` | VER-0005, VER-0006 |

## Verified by execution, not assumption

Every gate was re-run **after** the 50-file reformat, because a mass reformat is
exactly the change that breaks something quietly:

| Gate | Result |
|---|---|
| `docker compose up -d` | healthy |
| `pnpm db:deploy` | migrations applied — **failed before the fix** |
| `pnpm db:seed` ×3 | idempotent, counts unchanged |
| `pnpm lint` | clean |
| `pnpm format:check` | **clean** (was failing on 50 files) |
| `pnpm typecheck` | clean, 6 workspaces |
| `pnpm test` | **97 passed, 0 skipped** (was 83 passed, 7 skipped) |
| `pnpm build` | both apps build |
| `pnpm exec playwright test` | 24 passed |
| `pnpm audit --audit-level=high` | no known vulnerabilities |

The regression test was **proven non-vacuous**: the broken form was reintroduced,
2 assertions failed, then it was reverted and the suite re-run green.

## The precondition that is now actually met

VER-0004 recorded this as missing evidence:

> The 7 database integration tests **skipped** rather than passed, so the
> cross-user isolation coverage that the auth module depends on is currently
> unverified on this machine.

**That gap is closed.** `packages/database/tests/integration.test.ts:145` —
`scopes queries by userId so one user cannot read another's rows` — now
executes. Until today the ownership boundary the auth module must implement had
**no local coverage at all**.

## REC-0009 audit — no further false claims

Each "confirmed" claim from the 2026-10-01 close-out was re-checked **by
execution, not by re-reading the file that made the claim**:

| Claim | Method | Result |
|---|---|---|
| `prismaLint` removed | `Select-String .coderabbit.yaml` | gone; only the explanatory comment remains |
| `e2e` not required | `gh api .../branches/main/protection` | `["verify","dependency-review","CodeRabbit"]` |
| `enforce_admins` on | same call | `true` |
| No known vulnerabilities | `pnpm audit --audit-level=high` | none found |
| Node pinned in one place | `.nvmrc` + `engines` + CI | `22`, `>=22`, 2 steps use `node-version-file` |
| Exactly 10 MVP tables | `\dt` in Postgres | all 10 present, all 5 deferred absent |
| Password scrypt at rest | `SELECT left("passwordHash", 7) FROM users` | `scrypt$` |
| Seed counts | row counts after 3 runs | 1 user, 2 companies, 2 jobs, 3 applications, 1 offer |

**No false claim found in that batch.** Recorded as a positive result rather than
left implied.

## Deliberately declined

- **Changing CI to call `pnpm db:deploy` now that it works.** The inline form is
  correct and currently green. Switching would put an unverified change in the
  same commit as the fix, for no benefit yet. Logged as **REC-0017** with the
  reasoning, so the next agent does not "simplify" CI into the broken shape.
- **Reformatting `.wwg/` and `*.md`.** Both are in `.prettierignore`.
  Reformatting governed documentation would produce an enormous diff against
  files whose line breaks carry meaning, for no functional gain.

## Next task — awaiting owner signal

**The authentication module.** Nothing has changed here; it remains the next
step, and architecture §90 places it directly after the database.

Requires: real session/JWT issue and verify, httpOnly cookie handling,
`POST /register` / `login` / `logout`, and replacing the 501 guard at
`apps/api/src/middleware/auth.ts:18` with real verification plus the `userId`
ownership filter. D-0002 confirms auth is MVP scope, not a deferral.

**Both preconditions are now met.** The database runs, the ownership-boundary
test executes, and every documented command has been run at least once.

---

### A third defect, found while verifying the PR — REC-0018

After PR #38 merged, `pnpm format:check` **failed locally on 51 files** despite
being green in CI. Not a regression from the merge — the merge merely exposed
it, because a checkout re-materialises files.

The cause: `.prettierrc.json` sets `endOfLine: "lf"` and the new CI gate
enforces it, but the repository had **no `.gitattributes`**, so `core.autocrlf`
rewrote LF to CRLF on every Windows checkout. Reproduced against an all-green
`main` in a scratch clone: 145 CRLF line endings in a single file, and
`prettier --check` rejecting it.

**No tracked blob was ever wrong.** That is exactly why CI was green and only
fresh Windows clones failed — the gate was measuring the contributor's platform
rather than the code. Fixed by adding `.gitattributes` with `* text=auto eol=lf`,
which is a checkout-time fix, so the commit diff is one file.

Verified by **cloning fresh and re-testing**: 0 CRLF pairs, `prettier --check`
passes. The lesson — a gate that disagrees across platforms is a repository
defect, not a broken environment — is now in
`.wwg/wiki/principles/plan-vs-implementation-truth.md`.

**Operational gap caught in review.** CodeRabbit correctly pointed out that
Git applies `eol` rules only when copying files out of the index, so an
**existing** checkout is not fixed by pulling `.gitattributes`. I hit this
first-hand — my own working tree needed a forced re-checkout before
`format:check` passed. The README now documents the two-command recovery
(`git add --renormalize .` then `git checkout -- .`) with a warning that the
second discards uncommitted changes. A fresh clone needs neither.

This is the strongest argument in the project for treating "green in CI" as one
data point rather than as verification.

## Prior task record - directory rename (2026-10-02, merged as PR #35)

**Everything below this line describes the previous task, not the current one.**
It is retained as history, not as instructions. The 83/90 test figures, the
"not executing" precondition, and the REC-0011/REC-0015 statuses in it are all
superseded by the sections above. Do not act on it without reading the current
task first.

## Why this ran

A progress scan found the delivered pipeline healthy and the product features entirely
unbuilt, and it also found that the repository directory had been renamed on disk
without any of the compensating work landing:

- The rename commit sat on a branch with **no open pull request** — one commit ahead
  of `origin/main`, never reviewed, never merged.
- Canonical truth still described the old directory name in five places, including an
  `AGENTS.md` header and a `CONFIRMED_STALE` entry in Project Truth.
- The rename had silently broken the local toolchain in two ways, and **Project Truth
  did not record either**.

## Root cause, not symptom

The rename was performed as a filesystem operation. A rename is not self-contained: the
Compose project name derives from the directory, the Postgres volume name derives from
the Compose project name, and pnpm writes absolute paths into every `node_modules`
junction. The directory changed; none of its dependents were updated.

This is the same shape of defect the previous task fixed in the registry: the visible
symptom (stale reports, a dangling branch) was downstream of a source that was never
updated.

## What changed

**Merged — PR #35** (`chore/rename-folder-to-tarn-app` → `main`, squash):

- `docker-compose.yml` — pinned `name: tarn-app` so the Compose project and the
  Postgres volume no longer follow the directory path.
- `README.md` — corrected two stale claims (Playwright described as "planned" in two
  places; `packages/auth` missing from the layout), the `pnpm test` count, and added a
  Troubleshooting section covering the two failures a moved checkout actually causes.

**Truth synchronized in the same change**, as `AGENTS.md` requires:

| File | Change |
|---|---|
| `.wwg/wiki/project-truth.md` | Repository identity → `CONFIRMED`; added the Compose pin and its one-time volume consequence; moved the directory question out of "Still open" into a resolved block; recorded the 83-vs-90 test distinction and both rename failure modes |
| `.wwg/wiki/terminology.md` | `applicant-tracking-system` → RETIRED directory name; added a rule against reintroducing it; conflict row RESOLVED |
| `.wwg/wiki/decisions/D-0001-product-name-tarn.md` | Superseded the stale directory claim; added a naming rule for the retired directory name |
| `AGENTS.md` | Header now reads `Tarn (repository and directory: tarn-app)` |
| `.wwg/config/wwg.project.yaml` | Recorded the directory, the observed required checks, the 83/90 split, the unenforced format gate; removed four registry pointers to files that do not exist |
| `.wwg/governance/recommendation-registry.md` | REC-0006 → Done; added REC-0011 … REC-0014 |
| `.wwg/workspace/testing/verification-evidence.md` | Added VER-0004 |
| `.wwg/reports/*` | Regenerated via `wwg validate` and `wwg maintain` |

## Verified by execution, not assumption

- `pnpm lint` — clean.
- `pnpm typecheck` — clean, all 6 workspaces.
- `pnpm build` — web built.
- `pnpm test` — **83 passing, 7 skipped** (see the caveat below).
- `docker compose config --quiet` — exit 0.
- `wwg validate --target .` — **0 critical, 0 high, 0 medium, 0 low, 11 info**.
- `wwg maintain --target .` — Critical 0, High 0, Warnings 1, Advisory 16.
- `wwg.project.yaml` — parses; `handoff` restored after I removed it by mistake, and
  the four absent-artifact pointers confirmed gone.
- `git status --porcelain` — **no `D` or `R` entries.** Nothing was deleted or renamed;
  all 15 changed files are modifications. This refutes the maintenance report's
  "evidence appears to be removed" claim (REC-0014).
- PR #35: `verify`, `e2e`, `dependency-review`, and `CodeRabbit` all green; merged.

## The 83-vs-90 caveat, stated plainly

> **Superseded 2026-10-02.** The figures are now 97 passing / 90 without a
> database. The reasoning below still holds and is why `README.md` §
> Troubleshooting frames a skip count as a failure signal.

Docker Desktop was not running, so the 7 database integration tests **skipped loudly**
rather than passing. 90 is the correct count with a live database and is what CI
observes. **Do not treat 83 as equivalent to 90.** The skipped tests are the ones
covering referential integrity, cascade deletes, and cross-user isolation — the exact
property the next task depends on.

## New findings

- **CodeRabbit found four real defects in the recovery procedure I wrote in response to
  its first finding**, across rounds 2 to 5 of its review: a default `pg_dump` carries schema
  and would replay on top of a migrated database and partially fail; plain
  `docker compose down` would use the new project name and leave port 5432 bound; and
  the `psql` target had to match the `DATABASE_URL` that `pnpm db:deploy` reads. All
  four are fixed. The assertive review profile is doing real work.
- **The commit message and file comment claimed the pin preserves the volume "when the
  repository directory is renamed". That was false for this rename** — it protects
  future renames only. CodeRabbit caught the same thing independently as a Major
  data-integrity finding. Corrected in the file, the commit, and Project Truth. This is
  the REC-0009 failure mode again: a claim of verification that was never verified.
- **`wwg maintain` still reports `RED / Critical Alignment Break` / `EXECUTION GATE: Stop`
  on a tree with 0 critical, 0 high, and no deletions**, and now names two specific
  false positives (REC-0014): the word *admin* in `enforce_admins`, which means a
  **GitHub repository admin** and not a product persona; and "evidence removed", fired
  by deleting YAML pointer keys that named files which never existed.
- `pnpm format:check` **fails on 50 pre-existing files and is not enforced by CI**
  (REC-0011). Not fixed here — reformatting 50 files does not belong in this change.

## Deliberately declined

- **CodeRabbit's suggested fix** for the volume: pin the volume name to
  `applicant-tracking-system_tarn-postgres-data`. It would preserve the old volume, but
  it permanently embeds the retired product name in the repository, which is the
  opposite of what the rename was for. The local database holds only seeded data that
  `pnpm db:deploy && pnpm db:seed` reproduces exactly. Declined, with the trade-off
  recorded in `docker-compose.yml` and Project Truth so the next agent sees the
  reasoning rather than re-litigating it.

## Next task — awaiting owner signal

**The authentication module.** Not started, by explicit instruction. It is the only
thing between the scaffold and any reachable protected route, and architecture §90
places it directly after the database.

Requires: real session/JWT issue and verify, httpOnly cookie handling,
`POST /register` / `login` / `logout`, and replacing the 501 guard at
`apps/api/src/middleware/auth.ts:18` with real verification plus the `userId` ownership
filter. D-0002 confirms auth is MVP scope, not a deferral.

**Before starting:** start Docker Desktop and confirm the 7 database integration tests
actually run. They are the main deterministic mitigation for the ownership boundary,
and right now they are not executing.

> **Superseded 2026-10-02.** Docker is now running and all 7 tests execute. See
> "The precondition that is now actually met" above.

## Incident — CodeRabbit rate limit blocked the merge

While landing this change, the merge became unmergeable for a reason unrelated to its
content. Worth recording, because the failure is silent and looks like a policy problem.

Sequence, on pull request #35:

1. CodeRabbit's free tier allows 10 included reviews per hour. **Five automatic review
   rounds** were used between 05:04 and 05:51 UTC, because each round surfaced real
   defects that had to be fixed and re-reviewed.
2. On the final force-push, CodeRabbit reported **"Review paused"**, and the required
   `CodeRabbit` context then sat at `pending` ("Review in progress") for over 25 minutes.
3. `gh pr checks` still displayed `CodeRabbit pass` from the *previous* commit, which is
   misleading. Two separate traps, both hit here:
   - `gh pr checks` reports the newest known result for a context, not the result for
     the head SHA, so the pull request looks green while the gate is unsatisfied.
   - **CodeRabbit publishes a commit _status_, not a check run.** So
     `gh api .../commits/<sha>/check-runs` does not list it *at all*, and the correct
     conclusion is not "the check is missing" but "you are querying the wrong endpoint".
     My first reading of that empty list was wrong, and had to be corrected.
4. The authoritative signal is the combined status:

   ```bash
   gh api repos/ZenDevvv/tarn-app/commits/<sha>/status --jq '.state, (.statuses[] | .context)'
   # pending
   # CodeRabbit
   ```

5. Because `CodeRabbit` is a **required** status check, `mergeStateStatus` reported
   `BLOCKED` and the merge was refused.

The trap: `gh pr checks` shows a stale `pass` from an earlier commit, so the PR looks
green while the gate is unsatisfied. Trust the check runs on the head SHA, not the
summary table.

Resolution taken: **waited for the hourly allowance to reset rather than bypassing the
gate.** Project Truth records an administrator escape hatch for exactly the case where
CodeRabbit fails to report, but `--admin` would land a change with no AI review after
`enforce_admins: true` was deliberately chosen. Not used without an explicit owner
decision. Recorded as REC-0015.

## Remaining Open Questions

1. ~~Should `e2e` be a required status check?~~ **DECIDED 2026-10-02 — no.**
   Recommendation **REC-0010** ("Decide whether the `e2e` browser-test job should be a
   required status check") is closed as **Deferred**. Owner judgement: personal MVP
   project, merge speed is worth more than gate strictness. Recorded in
   `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`, which also lists
   the three conditions that should reopen it (first real product UI, `e2e` suite growing
   past scaffolding, or a browser regression reaching `main` unnoticed). The related
   registry-drift item **REC-0013** ("`wwg.project.yaml` `required_checks` still listed
   `e2e`") is closed as **Done**.
2. Which deployment vendors? **REC-0005** — "Decide the deployment vendors" (architecture
   §65 recommends Vercel / Railway-or-Render / Neon-or-Supabase / Cloudflare R2; none
   chosen, no deploy config exists).
3. Husky and lint-staged, now that merges are gated? Lower value now that CI blocks.
4. When to get an external security review — still deferred, not forgotten.
5. ~~`CHANGELOG.md` — none exists.~~ **DONE 2026-10-02.** `CHANGELOG.md` created at the
   repository root, hand-authored from the real git history, with **no version number**
   because nothing has been released, tagged, or deployed. `wwg changelog validate`
   confirms "CHANGELOG.md found: true" and "Unreleased section present". **REC-0007**
   ("Add a CHANGELOG.md") → *Done*. **REC-0012** (registry paths pointing at files that
   never existed) → *Done* for the resolvable part; the three `docs/ai-context/`
   recommendations stay unregistered because that directory has never existed.
6. **CodeRabbit review throughput, and what is actually known about it.** PR #35 consumed
   **five automatic review rounds** (05:04–05:51 UTC) plus one manual
   `@coderabbitai review` re-review, because each round surfaced a real defect that had
   to be fixed and re-reviewed. On the sixth push the required `CodeRabbit` status sat
   `pending` for over 25 minutes and the merge was blocked.
   **What is observed, not assumed:** CodeRabbit's own review body on PR #35
   (submitted 2026-10-02T05:04:23Z) stated verbatim:

   > **Plan**: Advanced
   > **Included review availability:** This review used your included allowance. Your
   > plan provides up to 10 included reviews per hour; 9 remain after this review.

   Two caveats, so this is not over-read. The counter is **not** a reliable predictor:
   it reported 9 remaining after the first review, four more reviews then succeeded, and
   the sixth still paused — so the pause happened with allowance apparently unspent. And
   the applicable entitlement is genuinely ambiguous, because that same review labelled
   the plan `Advanced`, which is a *paid* tier name in CodeRabbit's public pricing. The
   public free tier is expected to apply (D-0007), but the repository does not document
   the entitlement, so **treat 10/hour as a figure the tool printed, not a verified
   allowance**. The owner should confirm on CodeRabbit's billing page that nothing is
   being invoiced — the same cost watch item D-0007 already raises.
   **REC-0015** — "A required CodeRabbit review can sit pending indefinitely, and the
   obvious diagnostic endpoint does not show it".

## Close-Out Notes

- Truth Alignment Status: YELLOW — Project Truth was **changed** to match the working
  tree, and the change is deliberate and evidence-backed, not a silent overwrite.
  The `e2e` entry that was previously `CONFLICTING` has since been decided and
  corrected — see D-0008. Two `STALE` items remain genuinely unresolved.
- Execution Gate: pass for this task, **but do not rely on the maintenance report's own
  `Stop` gate** — see REC-0004 and REC-0014. `wwg validate` is the trustworthy signal
  and it is clean.
- Drift status: LOW
- Implementation confidence: HIGH for foundation, data layer, and delivery pipeline;
  **ZERO for product features** — unchanged by this task, which touched no application
  source.
- New recommendations: **five added** (REC-0011 … REC-0015). REC-0006 closed as Done.
  None are promoted into active work.
- **Later the same day — one more recommendation closed, not added.** The owner decided
  that the `e2e` browser-test job stays advisory rather than becoming a required status
  check, for a personal MVP where merge speed outweighs gate strictness. That closes
  **REC-0010** ("Decide whether the `e2e` browser-test job should be a required status
  check") as **Deferred** rather than leaving it `Proposed`, and closes **REC-0013**
  ("`wwg.project.yaml` `required_checks` still listed `e2e`") as **Done**. The decision
  and its three revisit triggers are recorded in a new decision record,
  `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`. The `CONFLICTING`
  entry in Project Truth and the stale four-check list in the branch-protection entry are
  both corrected. No CI or branch-protection configuration was changed.

- **Then, at the owner's request: `CHANGELOG.md` added before any feature work.** The
  owner asked for release memory to exist before the auth module starts, which is the
  right order — it means the first real feature lands in a file that already says
  plainly that no feature has shipped yet.
  The file is **hand-authored, not generated.** `wwg changelog generate --from-git
  --weekly --dry-run` was run first and its output was rejected on quality grounds: it
  filed the real commits as generic "Improved governance guidance" boilerplate, and
  classified both the design-system commit and the CodeRabbit configuration commit as
  "No meaningful user, owner, governance, or agent-facing change detected". Generating
  from that would have produced a changelog describing nothing that happened.
  One format detail worth keeping: `wwg` matches the unreleased heading with
  `/^##\s+Unreleased(?:\s+-\s+YYYY-MM-DD)?$/`, so the conventional Keep-a-Changelog
  `## [Unreleased]` is **not recognised**. The heading must be unbracketed.
  The `major` version bump the tooling recommends is **declined**, with the reasoning
  recorded in `CHANGELOG.md` and in the project registry. The tool triggers on a
  "folder-contract signal" from the directory rename, but there are zero released
  versions, so there is no compatibility contract to break, and `1.0.0` would falsely
  imply a finished product. **The tool will keep recommending `major` on keyword
  matches — that is expected and must not be "fixed".**
- Files changed: 15, all modifications. No application source file was modified.
