---
type: decision-record
status: accepted
date: 2026-10-04
decider: owner
affects: [api-contract, schema, product-scope, ownership]
---

# D-0010 — Applications are created with inline company and job

Status: ACCEPTED — owner-confirmed 2026-10-04
Date: 2026-10-04
Decided by: owner
Related: `D-0002-mvp-authentication.md`, `D-0004-mvp-schema-scope.md`, `D-0009-auth-session-and-rate-limit-design.md`

---

## Context

Building the applications module (PRD §7.3) required two decisions that no
existing record settles. Both change either the API contract or accepted schema
scope, so both went to the owner before any code was written.

## Decision 1 — Company and job are supplied inline

`POST /api/v1/applications` takes `company` and `job` objects, not an existing
`jobId`.

**Why this was contested.** `createApplicationSchema`, written during the
scaffold, took `jobId`. That contradicts two things:

- **Architecture §23** describes one `POST /applications` calling
  `companyRepository.findOrCreate`, then `jobRepository.create`, then
  `applicationRepository.create`, then `timelineRepository.create`.
- **PRD §7.3** lists company, position and platform as *required application
  information* — the user supplies them when logging an application.

The `jobId` contract would have meant creating a job first, then an application:
three requests to log one application, and a contract that contradicted the
architecture it was supposedly implementing.

**Consequences:**

- Company is **found-or-created by name, scoped to the owner.** There is no way
  to pass a `companyId`.
- Company, job, application and the first timeline event are created in one
  `prisma.$transaction` (architecture §24).
- The schema has **no `userId` field and no way to reference another user's
  company or job**. The owner always comes from the verified session. Two
  clients applying to the same employer get separate company rows — sharing one
  would expose one user's applications to the other through the relation.

## Decision 2 — The `APP-2026-0001` reference is deferred

PRD §7.3 asks for a human-readable application identifier. The schema has only a
cuid primary key.

**Why deferred rather than built.** Adding a column means changing a governed
MVP table *and* the schema-scope test that enforces D-0004 — the same blocker
that stopped the `sessions` table. It is also not in the PRD §35 Definition of
Done. The cuid id is used instead, and the gap is recorded as REC-0025 rather
than quietly forgotten.

## Consequences

- PRD §35 DoD item 2 is met at the API level. **There is still no web UI** — the
  dashboard remains the auth-guarded placeholder — so items 3 and 4 are not.
- `updateApplicationSchema` is **`.strict()`**, so a payload carrying `job` or
  `company` is rejected with 422 rather than silently ignored. Silently dropping
  it would leave a caller believing a job had been renamed. Job and company edits
  need their own endpoints (PRD §11: they are distinct entities).
- `GET /applications/:id/timeline` is an addition not listed in architecture §26.
  Both the create and status-change paths write timeline entries, and leaving
  them unreadable would make the feature unusable and untestable from outside.
- Search, filtering, sorting and pagination are **not** implemented even though
  `applicationFiltersSchema` exists (architecture §28-§31). Recorded as REC-0026.

## Addendum — 2026-10-04, after CodeRabbit review on PR #43

Two behaviours changed in review. Both were accepted as correct rather than
defended.

### `status` was removed from `updateApplicationSchema`

The schema accepted `status` on the general `PATCH /applications/:id`, and the
service wrote it **without** recording a timeline entry. So a client could send
`{"status": "OFFER"}` to the general PATCH, move the application, and leave no
history — bypassing the `/status` route that D-0010 and Project Truth describe as
the path that records every status change. That is a direct contradiction of the
"every status change is recorded" guarantee PRD §4.3 rests on.

Two ways out were considered:

- **Record a timeline event whenever `status` is set on the general PATCH.**
  Keeps a single endpoint for clients doing a whole-form save. But it leaves two
  routes doing the same thing, so the invariant now depends on both staying in
  step — and the same bug can be reintroduced on either.
- **Reject it.** One route changes status; it always records.

Rejected the first. The second is in place, and `.strict()` turns a stray `status`
into a visible 422 rather than an unrecorded change.

### A status update was escaping its transaction

`repo.updateApplication` used the global Prisma client even when called inside
`prisma.$transaction`, so the status change committed on its own and a failing
timeline insert could leave the status changed with no history — the same
guarantee, broken one layer down. It now takes an optional client and the
status-change path passes the transaction client.

### Also tightened

- `platform`, `status` and `priority` were widened to `string` and cast with
  `as never`, which bypasses Prisma's enum checking. They are now typed
  `JobPlatform`, `ApplicationStatus` and `ApplicationPriority`. `apps/api/src/**`
  forbids type assertions used to silence the compiler, and these were exactly
  that.
- A test that only asserted resulting ownership could not tell a rejected payload
  from a silently dropped one. It now asserts 422 and the error code, and a new
  test covers the `status` rejection.

### Accepted, not fixed — REC-0028

Company find-or-create is not atomic. Concurrent creates can each insert a
company row, because `Company` has no uniqueness constraint on
`(userId, name)`. Both rows carry the same `userId`, so no ownership boundary is
crossed — it is untidy data, not a leak. A unique index is a schema change to a
governed MVP table and so needs a new owner decision; a retry loop would be worse,
because with no constraint there is no conflict to detect.

## Do Not

- Do not add a `userId`, `companyId` or `jobId` field to the create schema.
  Every one of them is a way for a client to aim a write at someone else's data.
- Do not make `updateApplicationSchema` non-strict to "accept whatever the client
  sends". That reintroduces the silent-drop failure.
- Do not add `status` back to `updateApplicationSchema`. One route changes status
  and it always records history.
- Do not pass the global Prisma client to a write that must be atomic with another.
  `updateApplication` defaults to it for standalone edits; the status-change path
  must pass `tx`.
- Do not relax the schema-scope test to add the `APP-` reference without a new
  owner decision amending D-0004.
- Do not describe sessions as revocable, or the applications module as having a UI.
