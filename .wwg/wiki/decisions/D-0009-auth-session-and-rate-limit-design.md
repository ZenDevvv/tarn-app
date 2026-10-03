---
type: decision-record
status: accepted
date: 2026-10-03
decider: owner
affects: [security, architecture, mvp-scope, schema, rate-limiting]
---

# D-0009 — Stateless sessions, deferred recovery, in-memory rate limiting

Status: ACCEPTED — owner-confirmed 2026-10-03
Date: 2026-10-03
Decided by: owner
Related: `.wwg/wiki/decisions/D-0002-mvp-authentication.md`, `D-0004-mvp-schema-scope.md`, `D-0006-password-hashing-scrypt.md`

---

## Context

Building the authentication module (PRD §7.1) required three choices that were not
settled by any existing decision, and each one either changes accepted scope or moves
the security posture. Under root `AGENTS.md`, authentication and authorization are
approval-gated, so all three were put to the owner before any code was written rather
than decided by the agent.

## The three decisions

### 1. Sessions are stateless JWTs — no `sessions` table

Two httpOnly cookies: a **15-minute access token** and a **7-day refresh token**, both
HS256, both carrying a `kind` claim and a random `jti`. Refresh tokens additionally
carry an **absolute session deadline** (`abs`), described below.

**Why this was a question at all.** The natural implementation of revocable sessions
is a `sessions` table. `packages/database/prisma/schema.test.ts` asserts the **exact**
10-model set and exact table list, because that test is how D-0004 MVP scope is
enforced. Adding `sessions` would have failed it. Changing that guard to accommodate a
convenience is precisely the kind of scope drift the guard exists to prevent, so it
needed an owner decision rather than an agent's convenience.

**The accepted cost, stated plainly and not softened anywhere:**

> **Sessions are not server-side revocable.** Logout clears the cookies. A token that
> has already been issued remains valid until it expires. There is no server-side
> kill switch for an individual session.

The short access-token life bounds the exposure for the token that is sent on every
request. The refresh token is the long-lived exposure.

**The absolute session deadline — added after review caught a real understatement.**
The original version of this record claimed a stolen refresh token was "usable for up
to 7 days". **That was wrong in the direction that matters.** Refresh issued a fresh
full 7-day token on every call, so a holder could renew indefinitely: the true
exposure was *unbounded*, not 7 days.

Refresh tokens now carry `abs`, minted once at sign-in and **carried forward
unchanged** through every renewal. A token past its deadline is refused and the
cookies cleared; a token with **no** `abs` claim is rejected rather than trusted, so
a token cannot sidestep the cap by omitting it. The ceiling is **30 days** — long
enough never to interrupt a real user of a personal job-search tracker, while still
bounding a stolen credential. Raising it needs no change to the signing code.

**Why it is not worse than it sounds:** the 15-minute access window means the common
case — a token observed in a log or proxy — expires quickly, and the 30-day ceiling
means even a stolen refresh token eventually dies.

**Why it is still a real risk:** within that window there is no way to terminate one
session without rotating `JWT_SECRET`, which signs out every user.

**The mitigation is already in place for the future.** Every token carries a unique
`jti`, so adding a `sessions` table later needs no change to the signing or
verification code — only a check on refresh, and a delete on logout. Tracked as
REC-0022.

### 2. Password recovery is deferred

PRD §7.1 words FR-AUTH-005 as "should", and architecture §38 says "Some routes may be
deferred for MVP".

**Rationale:** recovery requires an email delivery path, and no provider has been
chosen. REC-0005 (deployment vendors) is still open, so building recovery now would
pre-empt that decision. Shipping a stub mailer would create infrastructure that must not
reach a real deployment.

**Consequence, recorded so it is not lost:** while deferred, a user who forgets their
password has **no self-service recovery at all**. Acceptable while single-user and
in development; **not** acceptable at any public release. Tracked as REC-0021.

### 3. Rate limiting is hand-rolled and in-memory

PRD §32 and architecture §55 both list rate limiting. Owner chose a small in-memory
implementation over adding `express-rate-limit`, consistent with architecture §92 rule
11 — no infrastructure before a real requirement — and appropriate to a single-process
personal MVP.

Applied to `/register` (5 per 15 min) and `/login` (10 per 15 min, keyed by IP **and**
email so an attacker cannot lock a legitimate user out by hammering their address).

**The limitation is in the code's own header comment and in Project Truth, not buried:**
counters reset on restart, and they are **not shared across instances**, so the
effective limit multiplies by the instance count if the API is ever scaled
horizontally. Window and limit are constructor arguments, so swapping the backing store
does not touch call sites. Tracked as REC-0020, deliberately tied to REC-0005 — the
deployment decision is what would force this.

## Consequences

- `requireAuth` no longer returns 501. It verifies a real token and attaches `userId`.
  A valid signature is still **not** sufficient for authorization — every future
  feature route must additionally scope its query by `req.userId` (architecture §92
  rule 6).
- **Express 4 does not catch rejected promises from async handlers.** Every auth
  handler is wrapped in `asyncHandler`; without it, every 401 and 422 escaped as an
  unhandled rejection and the request hung. Found by the route tests, regression-tested.
- `jose` 6.2.12 was added to `packages/auth`. `pnpm audit` still reports no known
  vulnerabilities.
- Login answers **identically** for an unknown email and a wrong password, and spends
  the same time on both paths (a dummy scrypt verification), so the login form is not
  an account-existence oracle. Both properties are asserted by tests.
- PRD §35 DoD item 1 is met. Item 12 (data isolation) is **partially** met: the
  boundary is enforced for `users` and tested, but no user-owned feature tables exist
  yet to demonstrate it.

## What was deliberately NOT done

- **No `sessions` table**, despite it being the textbook answer. See decision 1.
- **No account settings (FR-AUTH-006).** Not started.
- **No AI, no email, no storage.** None are MVP scope.

## Do Not

- Do not describe sessions as "revocable" or "terminated". They are stateless.
- Do not treat password recovery as forgotten. It is a recorded deferral (REC-0021).
- Do not rely on the rate limiter after horizontal scaling without addressing REC-0020.
- Do not register a new Express route without `asyncHandler` — the failure is a hang,
  not an error response.
- Do not add `sessions` without a new owner decision amending D-0004 and updating the
  schema-scope test deliberately.