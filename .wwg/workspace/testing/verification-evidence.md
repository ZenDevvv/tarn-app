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

**Claim.** `.wwg/wiki/project-truth.md` records the required status
checks as `verify`, `e2e`, `dependency-review`, `CodeRabbit`. `e2e` is
not among them.

**Evidence level.** Confirmed.

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
was observed `pass` on pull requests #33 and #34. It is simply not in
`contexts`, so a red `e2e` would not block a merge.

### Missing evidence

None for the claim. The *intent* is unknown: whether `e2e` was meant to
be required and the configuration was missed, or whether the exclusion
was deliberate. That is an owner decision.

### Recommendation

Do not assume the delivery gate covers browser tests. Record as
`CONFLICTING` in Project Truth and decide explicitly. See REC-0010.

### Follow-up

REC-0010, before the auth module lands.