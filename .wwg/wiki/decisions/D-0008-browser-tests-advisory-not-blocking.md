---
type: decision-record
status: accepted
date: 2026-10-02
decider: owner
affects: [ci, delivery-gate, pull-request-workflow, quality-versus-speed]
---

# Browser tests stay advisory, not merge-blocking

Status: ACCEPTED — owner-confirmed 2026-10-02
Date: 2026-10-02
Decided by: owner
Supersedes: nothing. Resolves the `CONFLICTING` entry in `.wwg/wiki/project-truth.md` and recommendation **REC-0010** ("Decide whether the `e2e` browser-test job should be a required status check").

---

## The decision

**The `e2e` job will remain a non-required status check.** A red browser test will
**not** block a merge. Branch protection is left exactly as it is.

## Why

Owner reasoning, in the owner's terms: this is a personal MVP project, time is
valued over gate strictness, and the current state is acceptable.

That is a sound engineering trade, not a compromise to be tolerated. The reason it
holds is worth stating precisely, because it is easy to misremember as "browser tests
are not being run":

**The `e2e` job already runs and reports on every pull request.** The owner sees the
browser and accessibility result every time. What is being declined is not the signal —
it is only the ability to *refuse* a merge when that signal is red.

| Capability | Current state |
|---|---|
| Browser tests run in CI | Yes, on every push and pull request |
| Browser result visible to the owner | Yes, on every pull request |
| Browser result can block a merge | **No — declined** |

So the setup is "browser tests are advisory", not "browser tests are absent". For a
solo owner who reads their own pull requests, that is usually the right default: the
human is already the gate.

## The trigger to revisit this

The decision is scoped to the current stage of the product, and the stage is what
makes it safe. It should be revisited when the browser suite starts covering real
product behaviour rather than scaffolding.

Revisit when **any** of these becomes true:

1. The first real product UI ships — auth screens, applications list, or the Kanban board.
2. The `e2e` suite grows past shell, dashboard-placeholder, and accessibility assertions.
3. A browser regression reaches `main` that the owner did not catch by reading.

Until then, a red `e2e` would almost certainly mean a genuine, visible breakage, and
the marginal value of automating the refusal is low.

Closing it later is cheap and reversible: one API call to add the context to
`required_status_checks`, then a pull request. There is no reason to pay that cost
before the trigger fires.

## TRIGGER FIRED — 2026-10-03. The decision still stands; owner review pending.

**Triggers 1 and 2 both fired** when the authentication module shipped:

1. **Auth screens are real product UI** — sign-in, registration, the dashboard guard,
   and the sign-out control.
2. **The suite grew past scaffolding.** It went from 12 shell/accessibility cases to
   **18 cases (36 instances)** that now cover a genuine journey: register, land on the
   dashboard, sign out, sign back in, reject a wrong password, and prove the dashboard
   is protected again.

**The decision has not been changed.** Branch protection is untouched, and `e2e`
remains advisory. Recording the trigger is not the same as acting on it — the owner
has not been asked yet, and this record must not be read as consent.

Why the change of stage is worth weighing rather than assuming:

- A browser regression can now be **silent and invisible on review**. A failed sign-in
  looks like a diff of form markup; nobody reads a CSS class change and notices the
  submit handler broke.
- The suite is slower now (it registers, signs in, and signs out), so the marginal wait
  before a merge is slightly higher.
- Against that: the owner is still the only reviewer, and the suite still *reports* on
  every pull request.

**The owner should confirm whether D-0008 still holds.** Tracked as **REC-0023**. If it
is reopened, the change is one API call plus a pull request — there is no technical
obstacle either way.

## What this decision does *not* mean

- It does **not** weaken the other gates. `verify` (lint, dependency audit, typecheck,
  tests, build), `dependency-review`, and `CodeRabbit` all remain required, with strict
  mode and admin enforcement on.
- It does **not** remove browser tests from CI. They still run and still report.
- It does **not** reduce test coverage. The browser suite — 36 instances as of
  2026-10-03 — still executes on every pull request.
- It is **not** a deferral of a known defect. Nothing is currently red.

## Provenance note

An agent raised this on 2026-10-02 as a `High` impact open question and listed it as
the first item to resolve, ranked above deployment vendors. That prioritisation was
wrong for this project at this stage and was corrected by the owner.

The underlying factual finding was and remains correct: `e2e` was recorded in
Project Truth as a required status check while the GitHub API reported it absent. What
changed is that the divergence is now **intentional and recorded**, rather than a
documentation error.

## Do Not

- Do not add `e2e` to `required_status_checks` without revisiting this record first.
- Do not describe the current setup as "browser tests are missing from CI". They run
  and report on every pull request; they are advisory.
- Do not treat a green `e2e` as a requirement for merge. It is not one.
- Do not delete this record because the gate looks incomplete. It is a decision, not an
  oversight.
