# Current Task

Status: DONE — dependency scanning live, review policy documented.
Task mode: Existing Project Adoption (continued) → security and pull-request policy
Instance type: existing-project (adopted; this work continues the adoption lifecycle)
Last updated: 2026-10-01

## Task Summary

- Status: DONE
- User requests:
  1. "dependency scanning to CI is confirmed"
  2. "independent human reviewer, not for now" — document it
  3. "I want to set up an AI code reviewer for every PR… thinking of CodeRabbit but I haven't researched the costing yet, looking for free"

## 1. Dependency scanning — implemented

Three free layers, all running:

| File | Purpose |
|---|---|
| `.github/dependabot.yml` | Weekly security + version updates, grouped; also watches the GitHub Actions. Prisma majors held back deliberately. |
| `.github/workflows/dependency-review.yml` | Blocks a PR that introduces a vulnerable dependency; fails at moderate. |
| `pnpm audit --audit-level=high` in `ci.yml` | Whole-tree scan on every push. |

### It found real vulnerabilities on its first run

| Severity | Package | Fix |
|---|---|---|
| **HIGH** | `deepmerge-ts` (transitive via Prisma) | `pnpm.overrides` forcing `^8.0.2` |
| MODERATE | `react-router` ×2 | Upgraded `react-router-dom` 6.30.6 → 7.18.4 |
| MODERATE | `vitest`, `@vitest/mocker` | Upgraded Vitest 3.2.7 → 5.0.3 |

**`pnpm audit` now reports no known vulnerabilities.** Prisma generation, `migrate status`, and `db:seed` were all re-verified after the override.

### A workspace trap worth remembering

Vitest appeared stuck on 3.2.7 through **five** upgrade attempts. Cause: the **root** `package.json` pinned `vitest: ^3.2.7`, and a root-level pin overrides every per-package upgrade in a pnpm workspace. Only `pnpm why vitest` exposed it. Recorded in Project Truth so it is not rediscovered.

## 2. Independent human reviewer — consciously deferred

Recorded as a **decision**, not an open question, so it is not rediscovered as an oversight. Rationale and the list of what the deferral does *not* cover are in `.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md`.

Also corrected: the earlier "external security review" framing did not come from this project's documents. A search of the requirements doc, architecture doc, and design doc for "security review", "penetration test", "threat model", "security audit", and "vulnerability" returns **zero matches**. It was general industry practice, not a project requirement.

## 3. AI code reviewer — documented, blocked on one question

### The finding that changes the plan

**CodeRabbit's free tier gives full review on PUBLIC repositories only.** On a private repository the free tier provides PR summarisation only, not line-by-line review. Real review on a private repo is **$24/month**.

This is a personal job-search tracker with no git remote. It is very likely to be private — so the free tier probably will not deliver what you want.

### Options for a private repository

| Option | Cost | Note |
|---|---|---|
| **Qodo Merge** (hosted) | Free, 75 PR reviews/month | Zero setup. Lowest-friction path to *actually having* review. |
| **PR-Agent** (self-hosted) | Free forever | Needs an LLM endpoint; a local model needs a self-hosted runner. |
| **CodeRabbit** | $24/month | Highest quality; free only if the repo goes public. |
| GitHub Copilot review | Needs paid Copilot | Bundled with a broader assistant. |

Note: **CodeQL is not free on private repos** — it needs GitHub Advanced Security. The dependency review action used instead *is* free on private repos, which is why it was chosen.

### Blocked because there is no remote

```
$ git remote -v
(no output)
```

Every one of these installs as a GitHub App or reads pull requests from GitHub. I will not create a remote or publish anything without explicit instruction — root `AGENTS.md` treats publishing as approval-gated.

**Recommended default given "free": start with Qodo Merge's free tier.** Move to PR-Agent if the volume limit bites, or CodeRabbit if you later want the best quality and would rather pay than self-host.

## Verification

| Gate | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean |
| `pnpm audit --audit-level=high` | **no known vulnerabilities** |
| `pnpm test` | 90 passing |
| `pnpm build` | both apps green |
| `npx playwright test` | 24 passing (desktop + 360px, real browser) |
| Prisma generate / migrate status / seed | all still work with the override |
| `wwg validate` | PASS |

## Truth Surfaces Updated

- `.wwg/wiki/decisions/D-0007-code-review-and-dependency-scanning.md` — new; all three decisions
- `.wwg/wiki/project-truth.md` — dependency state, three new conflict-register entries, corrected risk list, updated open questions
- `.wwg/governance/test-enforcement.md` — dependency scanning made part of the required gate
- `README.md` — quality gates table and audit command
- `.github/dependabot.yml`, `.github/workflows/dependency-review.yml`, `.github/workflows/ci.yml`, `package.json`

## Open Questions

1. **Create the GitHub remote?** Publishing is approval-gated; not done.
2. **Public or private?** This single answer decides CodeRabbit free vs $24/month.
3. Which deployment vendors?
4. Rename the repository directory `applicant-tracking-system` to `tarn`?
5. Husky and lint-staged now or later?

## Next Step

Still the authentication module — MVP scope, and the next step in the architecture document's build order.

## Close-Out Notes

- Truth Alignment Status: GREEN
- Execution Gate: pass — 114 assertions green, zero known vulnerabilities
- Drift status: LOW
- Implementation confidence: HIGH for foundation and data layer, **ZERO for product features**
- New recommendations: none added to the recommendation registry