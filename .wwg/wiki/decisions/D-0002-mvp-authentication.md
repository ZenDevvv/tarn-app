---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [security, architecture, mvp-scope, approval-boundary]
---

# D-0002 — Authentication is in the MVP

Status: ACCEPTED
Date: 2026-10-01
Decided by: owner
Decision path: **reversed during the same session**
Related: `.wwg/wiki/project-truth.md` (Primary Users and Roles, Canonical Scope, Safety and Production Boundaries)

## Decision

**Authentication ships in the MVP.** A proposal to build the first MVP with no authentication was raised on 2026-10-01 and then **rejected by the owner**.

Concretely, MVP includes:

- User registration, login, logout, session management, password recovery, and account settings (PRD §7.1, FR-AUTH-001…006).
- JWT/session in httpOnly cookies (architecture §2.2).
- A `users` table in the **first** migration (architecture §35).
- Server-side authorization on every protected resource (PRD §10.2, architecture §39, architecture §92 rule 6).
- Server-side ownership validation: a user must never reach another user's data by manipulating IDs or API requests (PRD §32, §33, architecture §36).

## Decision History

This is recorded carefully because it reversed within one session.

1. The owner initially directed: "let's make the first mvp with no auth".
2. That instruction triggered a safety-gate pause, because it contradicted accepted Project Truth: PRD §35 item 1 ("A user can securely create and access an account") and item 12 ("Data is isolated between users") are MVP Definition of Done criteria, and PRD §2.4/§3 assume an authenticated user.
3. A data-model fork was put to the owner — keep a `users` table with a seeded single user, or drop the entity entirely.
4. The owner answered: **"lets just have the auth for the first mvp"**.

The reversal supersedes the original instruction. **Authentication is MVP scope.** Anyone reading the earlier instruction in a chat log or handoff must treat it as void.

## Why This Is Recorded as a Safety-Relevant Decision

Authentication and authorization are approval-sensitive boundaries under root `AGENTS.md`. Dropping them from MVP would have:

- Made PRD §35 items 1 and 12 unreachable, requiring an explicit DoD amendment.
- Weakened the ownership boundary, which is the project's primary data-isolation guarantee (PRD §32–§33).
- Created a schema fork: either a `users` table seeded with one row, or removal of `User` and a rewrite of every foreign key and query when auth later arrives.

The owner chose the option that preserves all three. The data-model fork is therefore **moot** — the `users` table is in the first migration.

## Consequences

- PRD §7.1, §10.2, §32, §33, §35, and the §37 matrix are unchanged and now authoritative. They were already correct; no amendment was needed.
- Architecture §35 gained a note stating that `users` and the §36 ownership boundary are required from the first migration and are not deferrable.
- `.wwg/wiki/project-truth.md` records the rejected proposal so a future agent does not re-litigate it or read the original instruction as still active.
- The ownership boundary stays an approval-gated area: see `.wwg/governance/human-approval-matrix.md`.
- Cross-user access attempts are a **required** test case under `.wwg/governance/test-enforcement.md` rule 4.

## Do Not

- Do not treat MVP as a single-user, no-login, or "local only" product.
- Do not defer `users` or the ownership boundary to a later phase.
- Do not reintroduce the no-auth proposal without a new owner decision recorded here.
- Do not weaken ownership checks to simplify MVP implementation.