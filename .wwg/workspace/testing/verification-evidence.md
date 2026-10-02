# Verification Evidence — 2026-10-02

Human-authored evidence records, kept outside the generated
`manual-verification-evidence.json` so that a `wwg maintain` run cannot
overwrite them.

Format follows `.wwg/governance/evidence-standards.md`: claim, evidence
level, supporting evidence, missing evidence, recommendation, follow-up.

---

## VER-0001 — CodeRabbit config validation warning is gone after removing `prismaLint`

**Claim.** `.coderabbit.yaml` no longer produces a configuration
validation error on a CodeRabbit run, after deleting the rejected
`prismaLint` key.

**Evidence level.** Confirmed, **sampled**. This rests on a negative
observation — the absence of a warning — corroborated by a positive
parse of the config file. See "Missing evidence".

### Supporting evidence

Recorded on pull request #34, commit `75f3995`, branch
`fix/coderabbit-prismalint-config`.

**Before** — the warning was present and reproducible. Observed on pull
request #33 and again on the first review of #34:

```
### `.coderabbit.yaml` has unrecognized properties
CodeRabbit is using all valid settings from your configuration.
Unrecognized properties (listed below) have been ignored and may indicate
typos or deprecated fields that can be removed.
...
Validation error: Unrecognized key: "prismaLint"
```

**Change** — commit `4a5ab4d` deleted the key:

```bash
git log -S prismaLint -- .coderabbit.yaml
# bdbd25a ci: add CodeRabbit review configuration      <- introduced
# (only one commit: introduced, never removed, until 4a5ab4d deleted it)
```

**After** — re-run at `2026-10-01T17:22:52Z` on pull request #34,
scanning **all three** comment surfaces rather than the PR summary alone
(`gh pr view --comments` can omit inline review comments, which is a real
limitation — flagged by CodeRabbit on this PR):

```powershell
$all = @()
foreach ($e in @('issues/34/comments','pulls/34/reviews','pulls/34/comments')) {
  $all += (gh api "repos/ZenDevvv/tarn-app/$e" --paginate --jq '.[].body' | Out-String)
}
$joined = $all -join "`n"
foreach ($pat in @('has unrecognized properties','Validation error: Unrecognized key','Unrecognized key:')) {
  ([regex]::Matches($joined, [regex]::Escape($pat))).Count
}
```

Output:

```
'has unrecognized properties'    -> 0 occurrence(s)
'Validation error: Unrecognized key' -> 0 occurrence(s)
'Unrecognized key:'              -> 0 occurrence(s)
bodies scanned: 3
```

A broader case-insensitive search for `unrecognized|prismaLint` across
those surfaces returns matches, but every one is **narrative** — CodeRabbit
and my own PR description *describing* the removal. None is the validation
notice itself, confirmed by the zero counts above.

Also confirmed by parsing the config directly, proving the key is gone
from the file itself rather than merely unreported:

```powershell
pnpm dlx js-yaml@4 .coderabbit.yaml
# parsed as valid YAML/JSON; `prismaLint present: NO`
```

The local parse is the **positive** evidence. The comment-surface scan is
corroborating.

### Missing evidence

- The comment scan is still a negative observation. It cannot rule out
  CodeRabbit suppressing the notice for an unrelated reason, such as a
  rendering or caching change on GitHub's side.
- Not checked: whether the warning would reappear on a cold run or in a
  different repository.
- Not checked: whether any *other* unrecognized key exists that
  CodeRabbit did not surface in this run.

### Recommendation

Treat as resolved. If the warning reappears on a later review, treat that
as new evidence and reopen rather than assuming this record is stale.

### Follow-up

None required. The key is removed, the file parses, and a note in
`.coderabbit.yaml` warns against re-adding it without checking the
schema first.

---

## VER-0002 — `prismaLint` was never removed before 2026-10-02

**Claim.** A 2026-10-01 close-out recorded that the `prismaLint` key had
been removed and that "the warning is confirmed gone". Both statements
were false.

**Evidence level.** Confirmed.

### Supporting evidence

```bash
git log -S prismaLint -- .coderabbit.yaml
# bdbd25a ci: add CodeRabbit review configuration
```

Exactly one commit. `bdbd25a` is the commit that *created*
`.coderabbit.yaml`, so the key was present from the file's first commit
and was never removed. Combined with VER-0001's "before" evidence — the
warning live on pull request #33 — this refutes the original claim.

Corroborated by the fact that `.wwg/wiki/project-truth.md` and
`.wwg/wiki/decisions/D-0007` both carried the false claim as
`CONFIRMED` / verified while the key remained in the working tree.

### Missing evidence

None for the refutation. Whether *other* claims in that same 2026-10-01
close-out batch were similarly unverified is **not established** — that
is the open scope of REC-0009.

### Recommendation

Treat any "verified" or "confirmed gone" claim from the 2026-10-01 batch
as unverified until re-checked by execution. See REC-0009.

### Follow-up

REC-0009, to audit the rest of that batch.

---

## VER-0003 — `e2e` is not a required status check on `main`

**Historical claim (as first recorded).** `.wwg/wiki/project-truth.md` recorded
the required status checks as `verify`, `e2e`, `dependency-review`, `CodeRabbit`.
`e2e` was not among them. That was a documentation error, not a policy.

**Current policy, after the owner decided it.** `verify`, `dependency-review`,
and `CodeRabbit` are required. The `e2e` browser-test job **runs and reports on
every pull request** but is **not** required for merge. That is now intentional
policy, recorded in `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`.

The distinction is load-bearing: the first version of this record could be read as
"the required check is missing", which is true. It must not be read as "browser
tests are absent from CI", which is false.

**Evidence level.** Confirmed for the platform state. The *policy* is an owner
decision, not an execution finding.

### Supporting evidence

```bash
gh api repos/ZenDevvv/tarn-app/branches/main/protection --jq '{contexts: .required_status_checks.contexts, strict: .required_status_checks.strict, conversations: .required_conversation_resolution.enabled, approvals: .required_pull_request_reviews.required_approving_review_count}'
```

```json
{
  "approvals": 0,
  "contexts": ["verify", "dependency-review", "CodeRabbit"],
  "conversations": true,
  "strict": true
}
```

The `e2e` job does run on every pull request and reports a result — it
was observed `pass` on pull requests #33, #34, #35, and #36. It is simply
not in `contexts`, so a red `e2e` does not block a merge.

Re-queried after pull request #35 merged, confirming the state was unchanged
and not a transient:

```bash
gh api repos/ZenDevvv/tarn-app/branches/main/protection --jq '.required_status_checks.contexts'
# ["verify","dependency-review","CodeRabbit"]
```

### Missing evidence

None for the platform state.

The *intent* was unknown when this record was first written. It has since been
resolved: the owner decided the exclusion is deliberate, for a personal MVP
project where merge speed outweighs gate strictness. See D-0008, which also
records the three conditions that should reopen the question.

### Recommendation

Resolved. Do not assume the delivery gate covers browser tests — that remains
true — but the reason is now a recorded decision rather than a documentation
error. **REC-0010** ("Decide whether the `e2e` browser-test job should be a
required status check") is closed as **Deferred**, with revisit triggers, not
dropped. The related registry-drift item **REC-0013** ("`wwg.project.yaml`
`required_checks` still listed `e2e`") is closed as **Done**.

### Follow-up

None. Reopen only on a D-0008 revisit trigger: the first real product UI
shipping, the `e2e` suite growing past scaffolding, or a browser regression
reaching `main` unnoticed.

---

## VER-0004 — The repository directory was renamed, and two silent failures came with it

**Claim.** The local checkout directory was renamed from
`applicant-tracking-system` to `tarn-app`. Canonical truth still described the
old name, and the rename had broken the local toolchain in two ways that
produce misleading errors.

**Evidence level.** Confirmed for the directory rename and the two
breakages. **Not confirmed** for the Compose volume behaviour, which requires
a running Docker daemon.

### Supporting evidence

The directory itself, observed 2026-10-02:

```text
working directory: C:\Users\Zen\Desktop\MY PROJECTS\tarn-app
```

The compensating commit that the rename required existed on a branch with
**no open pull request** — one commit ahead of `origin/main`, never merged:

```bash
git log origin/main..HEAD --oneline
# 35ccdad chore(docker): pin the compose project name to the directory
gh pr list --state open
# (no pull requests)
```

**Breakage 1 — every pnpm junction pointed at the old path.** pnpm stores
absolute paths inside `node_modules` symlinks, so moving the directory
invalidates all of them. The symptom is a `MODULE_NOT_FOUND` in *every*
workspace, which reads like a broken lockfile or a bad install rather than a
moved folder:

```
packages/types test: Error: Cannot find module
  'C:\Users\Zen\Desktop\MY PROJECTS\tarn-app\packages\types\node_modules\vitest\vitest.mjs'
```

The junction target proves the cause:

```powershell
Get-Item packages\types\node_modules\vitest |
  Select-Object -ExpandProperty Target
# ...\applicant-tracking-system\node_modules\.pnpm\vitest@5.0.3_...\node_modules\vitest
```

Fixed with `pnpm install --frozen-lockfile`. The lockfile was not modified.

**Breakage 2 — the generated Prisma Client was stale.** After the reinstall,
typecheck failed with errors that name real enums:

```
packages/database/prisma/seed.ts(13,29): error TS2305:
  Module '"@prisma/client"' has no exported member 'ApplicationStatus'.
```

This is a misleading error: the enums exist in the schema, but the client had
not been generated for the new location. Fixed with `pnpm db:generate`.

**After both fixes, verified on 2026-10-02:**

```text
pnpm lint       clean
pnpm typecheck  clean, all 6 workspaces
pnpm build      web built
docker compose config --quiet   exit 0
```

### The Compose pin, and the claim it does not support

`docker-compose.yml` now sets `name: tarn-app`. The original commit message
and comment claimed the volume name "does not change when the repository
directory is renamed". **That is false for this rename.** Compose derives the
project name from the containing directory, and the volume name from the
project name, so the volume for the pre-rename checkout is
`applicant-tracking-system_tarn-postgres-data` and will not be reused. The pin
protects *future* renames only.

CodeRabbit raised this independently as a Major data-integrity finding on
pull request #35, and proposed pinning the volume name to
`applicant-tracking-system_tarn-postgres-data`.

**Why that suggestion was declined.** The local database holds only seeded
development data, which `pnpm db:deploy && pnpm db:seed` reproduces exactly;
both are idempotent. Pinning the volume name to the retired product name would
embed `applicant-tracking-system` in the repository permanently, which is the
opposite of what the rename was for. The trade-off is recorded in
`docker-compose.yml` and in Project Truth.

CodeRabbit then found three further defects in the recovery procedure written
in response, all of which were real and are now fixed: a default `pg_dump`
carries schema and would replay on top of a migrated database and partially
fail; the old stack must be stopped with an explicit
`-p applicant-tracking-system` because plain `docker compose down` would use
the new name and leave the port bound; and `pg_dump`/`psql` must be pointed at
the same database `pnpm db:deploy` reads from `.env`.

### Missing evidence

- **Docker Desktop was not running.** `docker compose up`, the volume reuse
  behaviour, and the `pg_dump`/`psql` recovery commands were **not executed**.
  They are reasoned from documented behaviour, not observed. The recovery
  procedure in `README.md` carries an explicit "not executed" note for this
  reason. Verify on a scratch database before relying on it.
- The 7 database integration tests **skipped** rather than passed, so the
  cross-user isolation coverage that the auth module depends on is currently
  unverified on this machine.
- Whether any *other* absolute path is baked into the local environment (for
  example Playwright's browser registry, or `.env`) was not audited.

### Recommendation

Treat `pnpm install --frozen-lockfile` and `pnpm db:generate` as the first two
commands after moving or renaming a checkout, before diagnosing anything else.
Both errors are loud but misleading.

### Follow-up

REC-0006 (directory rename) — Done. REC-0011 (`format:check` not enforced in
CI, fails on 50 files) — **Done 2026-10-02**, see VER-0006.

---

## VER-0005 — `pnpm db:deploy` was broken; fixed and now regression-guarded

**Claim.** The root `pnpm db:deploy` script is broken and was never exercised by
any gate. Fixed on 2026-10-02, with a test that fails if it regresses.

**Evidence level.** Confirmed by execution, including a deliberate
reintroduction of the defect.

### Supporting evidence

The root script read:

```json
"db:deploy": "pnpm --filter @tarn/database deploy"
```

`deploy` is a **built-in pnpm command**. Without an explicit `run`, pnpm
resolves its own `deploy` and never invokes the package script:

```text
$ pnpm db:deploy
ERR_PNPM_INVALID_DEPLOY_TARGET  This command requires one parameter
```

**Why it survived two review rounds and an owner sign-off.** No gate ran it.
Both CI jobs apply migrations with an inline
`pnpm --filter @tarn/database exec prisma migrate deploy`, which works. The
inline form silently routed around the defect, so the repository script was
never executed by anything. The comment above the CI step already said "Use
`db:deploy`", which made the divergence look like an oversight rather than the
symptom it was.

**Fix and proof.** Changed to `pnpm --filter @tarn/database run deploy`:

```text
$ pnpm db:deploy
All migrations have been successfully applied.
```

**Scope check — the sibling scripts were each executed, not assumed:**

| Script | Result |
|---|---|
| `db:generate` | pass |
| `db:migrate` | pass |
| `db:deploy` | failed before the fix, passes after |
| `db:seed` | pass, and idempotent across three consecutive runs |
| `db:studio` | launches (interactive; not script-verified) |

`deploy` was the only collision. `generate`, `migrate`, `seed`, and `studio` are
not pnpm built-ins.

**Regression guard proven to fail on the defect.**
`packages/database/prisma/scripts.test.ts` was added, then the broken form was
reintroduced to confirm the test is not vacuous:

```text
AssertionError: expected [ 'deploy', 'install', 'add', …(5) ] to not include 'deploy'
AssertionError: expected 'pnpm --filter @tarn/database deploy'
                to be 'pnpm --filter @tarn/database run deploy'
 Tests  2 failed | 5 passed (7)
```

The broken form was then reverted and the full suite re-run green.

### Missing evidence

- The test asserts the **script string**, not the command's behaviour. It
  prevents this specific wiring defect; it does not prove migrations apply. CI
  covers that.
- `db:studio` is interactive and was not verified beyond launching.

### Recommendation

Treat any root script that delegates through `pnpm --filter` as suspect if the
verb matches a pnpm built-in. The collision set is `deploy`, `install`, `add`,
`remove`, `link`, `import`, `patch`, `why`.

### Follow-up

REC-0016 — Done. REC-0017 — Proposed (the unexplained inline CI workaround).

---

## VER-0006 — The formatting gate is clean and the database tests actually run

**Claim.** `pnpm format:check` passes and is enforced in CI; the 7 database
integration tests execute rather than skip.

**Evidence level.** Confirmed by execution.

### Supporting evidence

**Database up, full suite:**

```text
$ docker compose up -d
$ pnpm db:deploy     All migrations have been successfully applied.
$ pnpm db:seed       Seed complete.
$ pnpm test
  types        7 passed
  auth        13 passed
  validation  23 passed
  database    31 passed   (17 schema scope + 7 integration + 7 script wiring)
  api         13 passed
  web         10 passed
                    97 passed, 0 skipped
```

The cross-user isolation test at
`packages/database/tests/integration.test.ts:145` — `scopes queries by userId
so one user cannot read another's rows` — is inside that 7. It was previously in
the skipped set, which meant the ownership boundary the auth module depends on
had **no local coverage at all**.

**Formatting:** all 50 files were reformatted — pure line-width reflow, 169
added / 139 removed, **zero deletions or renames**, confirmed by
`git status --porcelain` showing no `D` or `R` entries. `pnpm format:check` now
reports `All matched files use Prettier code style!`, and a `Check formatting`
step was added to the `verify` job.

**Every gate re-run after the reformat**, because a mass reformat is exactly the
kind of change that breaks something quietly:

| Gate | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean, 6 workspaces |
| `pnpm test` | 97 passed, 0 skipped |
| `pnpm build` | both apps build |
| `pnpm format:check` | clean |
| `pnpm exec playwright test` | 24 passed |

### Supporting evidence — REC-0009 re-audit

The REC-0009 audit asked whether other "confirmed" claims from the 2026-10-01
close-out batch were true. Each was re-checked by execution rather than by
reading the file that made the claim:

| Claim | Method | Result |
|---|---|---|
| `prismaLint` key removed | `Select-String .coderabbit.yaml` | gone; only the explanatory comment remains |
| `e2e` not a required check | `gh api .../branches/main/protection` | `["verify","dependency-review","CodeRabbit"]` |
| `enforce_admins` on | same call | `true` |
| No known vulnerabilities | `pnpm audit --audit-level=high` | `No known vulnerabilities found` |
| Node pinned in one place | `.nvmrc` + `engines` + CI | `.nvmrc` = `22`, `engines` = `>=22`, 2 CI steps use `node-version-file` |
| Exactly the 10 MVP tables | `\dt` in Postgres | all 10 present; `notifications`, `interviews`, `contacts`, `resumes`, `cover_letters` absent |
| Password is scrypt at rest | `SELECT left("passwordHash", 7) FROM users` | `scrypt$` |
| Seed counts | row counts after three seed runs | 1 user, 2 companies, 2 jobs, 3 applications, 1 offer — unchanged |

**No false claim was found in this batch.** That is a positive result, and it is
recorded as one rather than left implied.

### Missing evidence

- The seed password is printed to stdout by design. Accepted for local
  development; never run against a shared environment.
- `format:check` enforces source formatting only. `.wwg/` and `*.md` are in
  `.prettierignore`, so documentation formatting is not gated.

### Recommendation

`pnpm test` is only meaningful with Docker running. Treat the skipped count as a
failure signal, not a pass — this is already how `README.md` § Troubleshooting
frames it, and that framing is now accurate at 97/90.

### Follow-up

REC-0011 — Done. REC-0009 — audited, no further false claims found.

---

## VER-0007 — Local E2E failed against a foreign app; Tarn's suite is green

**Claim.** A local `pnpm exec playwright test` run reported **17 failures**,
which looked like a serious regression in the shell and accessibility work. It
was not. Tarn's suite passes; the run had adopted another project's dev server.

**Evidence level.** Confirmed by execution, and disproved by direct inspection.

### What happened

`playwright.config.ts` sets `baseURL: http://localhost:5173` and
`reuseExistingServer: !process.env.CI`. On this machine **another project** was
already listening on 5173:

```text
Get-CimInstance Win32_Process -Filter "ProcessId=34528"
node "...\MY PROJECTS\test\test-project2\apps\web\node_modules\..\vite\bin\vite.js"

Invoke-WebRequest http://localhost:5173
<title>Tracker - Personal Job Application Tracker</title>
```

Playwright adopted it and ran the Tarn suite against `test-project2`.

### Why it was almost certainly missed

The failures were **specific and plausible**, not obviously nonsense:

```text
expect(locator('main')).toHaveCount(...) failed
contrast below 4.5:1 in dark mode:
  [{"text":"Demo user: mika@example.com / password12","ratio":3.496}]
Test timeout of 30000ms exceeded.
```

`mika@example.com` appears **nowhere in this repository** — `grep` across the
tree returned no matches. That single check is what distinguished "Tarn is
broken" from "Tarn was never loaded".

### Proof that Tarn is fine

A throwaway config on ports 5199/4099 with `reuseExistingServer: false`:

```text
24 passed (29.2s)
```

The temporary config was deleted afterwards; no Tarn file was changed.

### Missing evidence

- The other project's dev server was **left running**. It is not Tarn's and
  killing it was not this task's call.
- Consequently `pnpm exec playwright test` **cannot be trusted on this machine
  until port 5173 is free**. A green local run would be equally untrustworthy,
  since a foreign server could satisfy the assertions by coincidence.

### Recommendation

Local E2E needs a guard before it can be relied on for feature work. The cheapest
correct fix is to assert the app on the port is Tarn — request the root and fail
fast with an explicit message — rather than letting 17 confusing assertions fail.
Recorded as **REC-0019** for an owner decision, because the alternatives
(claiming the port, or moving to a dedicated E2E port) both change the local
developer workflow.

CI is unaffected: it sets `CI=true`, so `reuseExistingServer` is `false` and the
job always starts its own server.

### Follow-up

REC-0019 — Proposed.
