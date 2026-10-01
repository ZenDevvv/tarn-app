---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [tooling, architecture, ci]
---

# D-0003 — pnpm is the package manager

Status: ACCEPTED
Date: 2026-10-01
Decided by: owner
Related: `.wwg/wiki/project-truth.md` (Architecture Truth)

## Decision

**pnpm** is the package manager for the Tarn monorepo. This is a confirmed decision, not a recommendation.

## Context

Architecture §5 previously said "Recommended package manager: pnpm workspaces". Nothing was installed, so the choice was unconfirmed and recorded as `NEEDS_CONFIRMATION`.

## Consequences

- Architecture §5 amended: the wording is now declarative, with the requirement spelled out.
- The root must contain `pnpm-workspace.yaml`.
- Root `package.json` must pin `packageManager` (for example `"packageManager": "pnpm@<version>"`) so the toolchain is reproducible.
- Commit `pnpm-lock.yaml`. **Do not** commit `package-lock.json` or `yarn.lock`.
- CI (architecture §63) installs with `pnpm install --frozen-lockfile`.
- All dependency examples in project documents use `pnpm`, never `npm i` or `yarn add`. The `index.css` header comment was corrected from `npm i` to `pnpm add -D` under this decision.

## Do Not

- Do not introduce npm or yarn lockfiles, including as an accident of running the wrong command locally.
- Do not add a second package manager for a single package.
- Do not use `npm` in documentation examples; it contradicts this decision and DESIGN.md's toolchain intent.