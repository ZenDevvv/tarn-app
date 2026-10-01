---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [ci, security, dependencies, pull-request-workflow]
---

# Code review on pull requests, and dependency scanning

Status: ACCEPTED — owner-confirmed 2026-10-01
Date: 2026-10-01
Decided by: owner

## Three separate decisions

The owner asked about three distinct things. They are recorded separately because they have different costs and different review cadences.

| Decision | Outcome |
|---|---|
| Automated dependency scanning in CI | **Confirmed and implemented.** Free. Running on GitHub. |
| Independent human code reviewer | **Consciously deferred.** Not "pending" — a decision not to do it now. |
| AI code reviewer on every pull request | **CodeRabbit, free tier.** Repository is public, so the free tier applies. Config committed; only the GitHub App install remains. |

---

## 1. Dependency scanning — implemented

Owner instruction: "dependency scanning to CI is confirmed."

### What was added

| File | Purpose | Cost |
|---|---|---|
| `.github/dependabot.yml` | Weekly security updates and version bumps, grouped so they do not flood the repo. Also watches the GitHub Actions themselves. | Free |
| `.github/workflows/dependency-review.yml` | Blocks a pull request that introduces a known-vulnerable dependency. Reviews only the lockfile diff. Fails at `moderate` and above. | Free |
| `pnpm audit --audit-level=high` step in `ci.yml` | Whole-tree scan on every push. | Free |

Prisma major bumps are explicitly ignored by Dependabot, because a Prisma major changes client generation and requires a manual migration. That is a deliberate exclusion, not an oversight.

### It found real vulnerabilities immediately

On the very first run, before any of this was committed:

| Severity | Package | Issue | Fix applied |
|---|---|---|---|
| **HIGH** | `deepmerge-ts` (transitive, via Prisma) | Stack exhaustion merging recursive object graphs | `pnpm.overrides` forcing `^8.0.2` |
| MODERATE | `react-router` | Open redirect via `Link` / `useNavigate` | Upgraded `react-router-dom` 6.30.6 → 7.18.4 |
| MODERATE | `react-router` | Constructor injection via `deserializeErrors()` in SSR hydration | Same upgrade |
| MODERATE | `vitest`, `@vitest/mocker` | Path traversal / arbitrary file read | Upgraded Vitest 3.2.7 → 5.0.3 |

**Current state: `pnpm audit` reports no known vulnerabilities.**

### Two things worth noting about that fix

**The React Router upgrade was a major version bump.** The v7 `future` flags were removed because v7 behaviour is now the default. Both React test files and the browser suite were re-run to confirm nothing broke.

**Vitest stayed at 3.2.7 despite being upgraded five times.** The root `package.json` pinned `vitest: ^3.2.7`, which overrode every per-package upgrade. Only `pnpm why vitest` exposed it. This is exactly the kind of thing dependency automation catches and manual upgrades miss.

**The `deepmerge-ts` override was verified against reality**, not assumed: Prisma client generation, `migrate status`, and `db:seed` were all re-run afterwards and still work.

---

## 2. Independent human reviewer — consciously deferred

Owner instruction: "independent human reviewer, not for now."

This is a **decision**, not an open question. Recorded so it is not rediscovered as if it were an oversight.

### What is being skipped

A person who did not write the code reads the authentication flow, authorization checks, input validation, secrets handling, and file upload handling.

### Why the deferral is proportionate

- This is a personal tool with one role and no admin accounts.
- There is no money to steal and no meaningful attacker incentive.
- A formal penetration test is wildly disproportionate here.

### What this deferral does *not* cover

Deferred is not the same as dismissed. The following remain genuinely unreviewed, and every one of them is an implementation task rather than a process:

| Unreviewed item | Where it belongs |
|---|---|
| scrypt cost parameters | `packages/auth/src/password.ts` |
| Cookie flags (`httpOnly`, `secure`, `sameSite`) | The auth module, not yet built |
| Login rate limiting | The auth module |
| CSRF strategy | Never decided |
| `trust proxy` value (currently a hardcoded `1`) | `apps/api/src/app.ts` |

The highest-value item here is not a review at all — it is automated dependency scanning, which is now implemented and already found five real vulnerabilities.

### Note on provenance

An agent previously raised "external security review" as an open question. **The owner's documents never mention it** — a search of the requirements doc, architecture doc, and design doc for "security review", "penetration test", "threat model", "security audit", and "vulnerability" returns zero matches. The concept came from general industry practice, not from this project's requirements. It is recorded here on that basis.

---

## 3. AI code reviewer on every pull request

Owner instruction: "I want to set up an AI code reviewer for every PR this project will make… thinking of CodeRabbit but I haven't researched the costing yet, looking for free since this is a just a personal project but still should follow standards."

### The finding that changes the plan

**CodeRabbit's generous free tier is for public repositories only.**

| Repository type | CodeRabbit free tier |
|---|---|
| **Public / open source** | Free, unlimited repositories, full review features |
| **Private** | Free tier gives **PR summarisation only** — not line-by-line review — at reduced rate limits |
| **Private, full review** | $24 per developer per month (annual) or $30 month-to-month |

This repository is a personal job-search tracker with no git remote configured. It is almost certainly going to be private. **If it stays private, CodeRabbit's free tier will not give real code review** — only summaries. That is the crux of the pricing question, and it has not been decided yet.

### The genuinely free option for a private repository

| Tool | Cost | Trade-off |
|---|---|---|
| **PR-Agent** (Apache-2.0, community-owned) | **Free forever.** Runs as a GitHub Action. | Needs an LLM endpoint. Works with a free-tier model, or a local Ollama model — but a local model needs a self-hosted runner, which is not free. |
| **Qodo Merge** (hosted) | Free tier: 75 PR reviews per month for private repos. | Hosted and zero-setup. |
| **CodeRabbit** (private) | $24/month for real review. | Best-in-class quality and recall. |
| **GitHub Copilot code review** | Needs a paid Copilot plan. | Bundled with a broader assistant. |

**Note on CodeQL:** it is *not* free for private repositories. It requires GitHub Advanced Security on private repos. The `dependency-review` action used above **is** free on private repositories, which is why it was chosen instead.

### Recommended default for this project

Given "free" is the constraint and the repository is likely private:

1. **Start with Qodo Merge's free tier** (75 reviews/month, zero setup, private-repo support). It is the lowest-friction path to *actually having* AI review rather than nothing.
2. **Move to PR-Agent self-hosted** if the volume limit becomes a problem, or if you want no third-party dependency at all.
3. **CodeRabbit at $24/month** if you later want the highest-quality review and would rather pay than maintain a self-hosted tool.

### The one question blocking installation

The repository has **no git remote configured**:

```
$ git remote -v
(no output)
```

Installing any of these requires a GitHub remote, because all of them install as a GitHub App or read pull requests from GitHub. So this decision can be recorded now but **cannot be installed yet**.

Two things are needed:

1. **Create the GitHub repository and add the remote.** I will not create a remote or publish anything without explicit instruction — root `AGENTS.md` treats publishing as approval-gated.
2. **Confirm public or private.** This single answer decides whether CodeRabbit is free or $24/month.

### Outcome: published public, CodeRabbit confirmed

The owner resolved this on 2026-10-01: publish **public** and **unlicensed**, and use **CodeRabbit**. Because the repository is public, CodeRabbit's free tier applies in full — no cost.

The repository is live at **https://github.com/ZenDevvv/tarn-app**.

**Installed and verified 2026-10-01.** Verified on a real pull request: CodeRabbit posted a configuration summary naming the repository's `.coderabbit.yaml` and reporting the ASSERTIVE review profile, and all three repository checks passed — CodeRabbit, `verify`, and `Dependency Review`.

CodeRabbit found a defect in its own input on the first run: `prismaLint` is listed in CodeRabbit's published schema reference but is **not accepted** by the current schema, so it produced `Validation error: Unrecognized key: "prismaLint"` on every review. Removed, and the warning was confirmed gone on a follow-up run. Prisma schema rules remain enforced through the `packages/database/prisma/**` path instructions instead.

Worth noting as a general lesson: **the configuration reference is not a schema guarantee.** A key can be documented and still be rejected. Only running the tool proved it.

**Licence:** the owner chose to stay unlicensed. Public is not open source; without a licence nobody may legally reuse the code. Recorded as a deliberate choice, not an omission.

**Cost watch item:** CodeRabbit's run summary displayed `Plan: Advanced`. Advanced is a paid tier name in CodeRabbit's public pricing (~$90 per developer per month). The usage here is the free public-repository tier, so no charge is expected — but the owner should confirm on CodeRabbit's billing page that nothing is being invoiced.

### Two bugs this uncovered on the first real run

Publishing immediately exposed problems that were invisible while everything ran locally:

1. **Dependabot opened 22 pull requests in under a minute**, including TypeScript 5 → 7, Vite 6 → 8, `@types/node` 22 → 26, Zod 3 → 4, Prisma 6 → 7, and three GitHub Actions majors at once. Root cause: `update-types` placed **inside** a `groups` block controls only how updates are bundled, not whether a major is proposed. The cap must sit on the update entry. Fixed by moving `update-types: [minor, patch]` to every entry, including the `github-actions` ecosystem which had been missed. All 22 pull requests were closed with an explanation.

2. **Dependency Review failed on every pull request** with `Invalid license(s) in allow-licenses`, because SPDX identifiers are **case-sensitive** — `mit` and `bsd-2-clause` are rejected where `MIT` and `BSD-2-Clause` are required. After correcting the casing a second error appeared: the repository's dependency graph was disabled, so the action refused to run at all. Enabled via `PUT /repos/ZenDevvv/tarn-app/vulnerability-alerts`. Both checks now pass.

Neither bug could have been found without publishing. The lesson is recorded: a pipeline that has never run on the hosting platform is not a verified pipeline.

### What is already in place regardless of the tool

Whatever AI reviewer is chosen, the deterministic gates already exist and do not depend on it:

| Gate | Status |
|---|---|
| Lint | Running in CI, proven to fail on violations |
| Type check | Running in CI |
| Unit and integration tests | 90 passing in CI |
| Build | Running in CI |
| Dependency audit | Running in CI, zero vulnerabilities |
| Dependency review on pull requests | Running in CI |
| Browser tests | 24 passing, **not** in CI |

So the project already follows review standards without an AI reviewer. An AI reviewer adds judgement and pattern-spotting, not coverage.

---

## Do Not

- Do not treat the AI reviewer as a replacement for the deterministic gates. It is an additional signal.
- Do not enable a CodeRabbit-style bot to auto-approve or auto-merge.
- Do not assume a green AI review means the code is correct.
- Do not let a reviewer commit secrets to the repository as part of a suggested fix. The existing secret-handling tests cover this.
- Do not create a git remote or publish this repository without explicit owner instruction.
- Do not store an LLM API key in `.env` and commit it. Use GitHub Actions secrets.