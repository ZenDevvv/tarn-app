---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [design-system, repository-structure, frontend]
executed: 2026-10-01
---

# D-0005 — Move design tokens to apps/web/src/index.css at scaffold time

Status: ACCEPTED — **EXECUTED 2026-10-01**
Date: 2026-10-01
Decided by: owner
Executed: 2026-10-01, as step one of the monorepo scaffold
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

## Close-Out Condition — SATISFIED

All four steps completed on 2026-10-01:

1. ✅ Moved root `index.css` to `apps/web/src/index.css`.
2. ✅ Deleted the root copy — `git mv` semantics, so no duplicate token source exists.
3. ✅ Verified `DESIGN.md` §1 and architecture §6 now match the working tree.
4. ✅ Project Truth updated; the item moved from `RESOLVED_PENDING_SCAFFOLD` to `RESOLVED`.

Verified by execution: `pnpm build` in `apps/web` resolves `@import "tailwindcss"` from the new location and emits `dist/assets/index-*.css`.

## Post-Execution Facts

- Tailwind CSS v4 and `@tailwindcss/vite` were installed, because the token file uses v4 syntax (`@import "tailwindcss"`, `@custom-variant dark`). `vite.config.ts` now registers the `@tailwindcss/vite` plugin.
- `tw-animate-css`, `@fontsource-variable/bricolage-grotesque`, and `@fontsource-variable/instrument-sans` were installed because `index.css` imports them.
- The file header now records the move so a future reader does not re-litigate the path.

## Do Not

- Do not reintroduce a root `index.css` or a re-export of one.
- Do not hard-code hex values in components as a workaround (DESIGN.md §1, and the UI/UX simplicity principle).