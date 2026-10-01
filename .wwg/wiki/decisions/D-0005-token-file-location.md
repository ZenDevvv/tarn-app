---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [design-system, repository-structure, frontend]
---

# D-0005 — Move design tokens to apps/web/src/index.css at scaffold time

Status: ACCEPTED (not yet executed)
Date: 2026-10-01
Decided by: owner
Related: `.wwg/wiki/project-truth.md` (Known Conflicts and Drift Risks)

## Decision

Design tokens will live at `apps/web/src/index.css`, exactly as `DESIGN.md` §1 and architecture §6 state. The move happens as the **first step of the monorepo scaffold**, not before.

## Context

A `CONFLICTING` item was recorded during truth ingestion: `DESIGN.md` §1 and architecture §6 both name `apps/web/src/index.css` as the token path, but no `apps/` directory exists and the token file is currently `index.css` at the repository root. An agent reasoning from the architecture document alone would reference a nonexistent path and could misdiagnose the mismatch as a code defect.

## Why not immediately

The owner chose to record the decision and move at scaffold time rather than moving the file now. Creating `apps/web/src/index.css` in a repository with no application would produce a phantom directory tree that some tools and agents could misread as an existing app. The mismatch is better resolved by building the structure the file belongs in.

## Consequences

- Status in Project Truth moves from `CONFLICTING` to `RESOLVED_PENDING_SCAFFOLD`.
- `DESIGN.md` gained an explicit Token file location note stating that root `index.css` is the working token source until the scaffold lands.
- Architecture §6 gained a matching note, and now lists `index.css` inside `apps/web/src/`.
- `index.css` header comment notes that it is still at the root and will move.

## Close-Out Condition

This decision is not fully discharged until the scaffold exists. When the monorepo is created:

1. Move root `index.css` to `apps/web/src/index.css`.
2. Delete the root copy — do not leave two token files, which would create a worse conflict than the one being resolved.
3. Re-verify that `DESIGN.md` §1 and architecture §6 now match the working tree.
4. Update Project Truth to remove the `RESOLVED_PENDING_SCAFFOLD` item entirely.

## Do Not

- Do not create an empty `apps/web/src/` tree before the real scaffold.
- Do not maintain a root `index.css` alias or re-export after the move.
- Do not hard-code hex values in components as a workaround (DESIGN.md §1, and the UI/UX simplicity principle).