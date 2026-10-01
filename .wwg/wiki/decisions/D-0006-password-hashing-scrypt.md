---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner-confirmed
affects: [security, authentication, architecture, dependencies]
ratified: 2026-10-01
---

# Password hashing uses Node's built-in scrypt

Status: **ACCEPTED — owner-confirmed 2026-10-01**
Date: 2026-10-01
Decided by: owner ("scrypt is confirmed")
Proposed by: agent, 2026-10-01
Still recommended: an external security review before launch
Related: `.wwg/wiki/project-truth.md` (Safety and Production Boundaries), `packages/auth/src/password.ts`

## Decision

Passwords are hashed with Node's built-in `crypto.scrypt` at `N=32768, r=8, p=1`, with a 64-byte random salt and a 64-byte derived key.

Stored format is self-describing:

```
scrypt$<N>$<r>$<p>$<salt-b64>$<hash-b64>
```

## Why this needed sign-off

Password hashing is an approval-sensitive security decision under root `AGENTS.md`. The owner asked for the `sha256:` gap to be closed; **which** scheme to close it with was not specified. The agent chose and flagged it rather than burying it. The owner has since confirmed: **"scrypt is confirmed"**.

## Why scrypt

- **No new dependency.** scrypt ships with Node (architecture §92 rule 11: do not introduce infrastructure until a real requirement exists — the platform already provides this one). Adding bcrypt or Argon2 means adding a dependency and, for Argon2, a native build.
- Memory-hard, in the same family as bcrypt and Argon2id.
- Resists GPU and ASIC attacks better than iterated fast digests.

## Honest tradeoffs

| Consideration | Detail |
|---|---|
| Not bcrypt/Argon2id | scrypt is respectable but Argon2id is the current first choice for new systems. This is a defensible choice, not the best available one. |
| Slower per hash | ~50–100 ms at these parameters, versus ~10 ms for bcrypt cost 12. Irrelevant at this product's scale; it would matter for a large user base. |
| Parameter tuning | `N=32768, r=8, p=1` sits near Node's defaults. A security review may want these raised. |
| No pepper | No server-side pepper is used. A pepper would need careful secret management and adds a failure mode if lost. |
| No per-user rate limiting on verify | Not implemented here — it belongs to the auth route, not the hasher. |

## Migration safety

Because the stored format is self-describing:

- Cost parameters can be raised later without invalidating existing hashes.
- `needsRehash()` reports whether a stored hash is below current policy, so an upgrade can happen on next successful login.
- Switching to Argon2id means changing `hashPassword` and `verifyPassword` only. Those are the two functions in `packages/auth`; nothing else in the codebase touches hashing.

## What was verified

- 13 unit tests in `packages/auth/src/password.test.ts`: format, salting, correct/incorrect password, case sensitivity, malformed and forged hashes, and out-of-range cost parameters returning `false` rather than throwing or hanging.
- Verified at rest: the seeded user's `passwordHash` begins with `scrypt$` and no longer contains the `sha256:` marker.
- Verified in `packages/database/tests/integration.test.ts` that a real persisted hash verifies the correct password and rejects the wrong one.

## Options that were considered and rejected

1. **Argon2id** via `@node-rs/argon2` or `argon2`. Stronger on paper; rejected because it adds a dependency and a native build step for no benefit at this scale (architecture §92 rule 11).
2. **bcrypt** via `bcryptjs`. Most widely deployed; rejected because it is weaker against GPU attacks than scrypt, and pure-JS bcrypt is slow.
3. **Keeping scrypt and raising cost parameters after a security review** — remains open; parameters are tunable in one place.

Migration remains cheap if this is ever revisited: the stored format is self-describing, and switching algorithm means changing `hashPassword` and `verifyPassword` only.

## Do Not

- Do not revert to a bare fast digest. That was the original defect.
- Do not store plaintext, log passwords, or put `JWT_SECRET` in the seed.
- Do not change cost parameters without re-running `packages/auth` tests and noting the change here.