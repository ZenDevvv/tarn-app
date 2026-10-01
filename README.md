# Tarn

A personal job-search tracker. Keep applications, job descriptions, companies,
interviews, resumes, follow-ups, and offers in one place instead of scattered
spreadsheets, bookmarks, notes, emails, and calendars.

Tarn is a full-stack TypeScript modular monolith.

## Status

**Scaffolded. No feature is implemented yet.**

The repository foundation exists: monorepo, apps, shared packages, database
schema, validation, and CI. There is no working application — authentication,
applications, pipeline, dashboard, and the rest are still to be built.

Canonical truth lives in [`.wwg/wiki/project-truth.md`](.wwg/wiki/project-truth.md),
which records what is confirmed, what is only a plan, and what is still an open
owner question. Read it before assuming any capability exists.

## Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (end to end) |
| Frontend | React, Vite, Tailwind CSS v4, React Router, TanStack Query |
| Backend | Node.js, Express, Zod |
| Database | PostgreSQL, Prisma |
| Testing | Vitest, React Testing Library, Playwright (planned) |
| Tooling | pnpm workspaces, ESLint, Prettier, Docker, GitHub Actions |

The design system is **Marker** (see `DESIGN.md` and `design-system.html`).
The product is **Tarn**. They are not the same thing.

## Requirements

- Node.js >= 20.11 (developed on 24.x)
- pnpm 9 (`npm i -g pnpm@9.15.4`, or `corepack enable pnpm`)
- Docker, for local PostgreSQL

## Getting started

```bash
pnpm install
docker compose up -d          # PostgreSQL on localhost:5432
cp .env.example .env          # then fill in JWT_SECRET and COOKIE_SECRET
pnpm db:generate              # generate Prisma Client
pnpm db:migrate               # create and apply the first migration
pnpm db:seed                  # optional sample data
pnpm dev                      # web on :5173, api on :4000
```

Health check: <http://localhost:4000/api/v1/health>

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | run web and api together |
| `pnpm build` | build both apps |
| `pnpm typecheck` | type-check every package |
| `pnpm test` | unit, validation, schema-scope, and API tests |
| `pnpm lint` | lint |
| `pnpm format` | format sources |
| `pnpm audit` | check dependencies for known vulnerabilities |
| `pnpm db:generate` | generate Prisma Client |
| `pnpm db:migrate` | create and apply a dev migration |
| `pnpm db:deploy` | apply migrations (production) |
| `pnpm db:seed` | load sample data |
| `pnpm db:studio` | Prisma Studio |
| `npx playwright test` | browser and accessibility tests |

## Quality gates

Everything below runs in GitHub Actions on every push:

| Gate | What it enforces |
|---|---|
| `pnpm lint` | ESLint 9, including no `any` and no unused values |
| `pnpm audit --audit-level=high` | no known high-severity dependency vulnerabilities |
| dependency review | a PR cannot introduce a vulnerable dependency |
| `pnpm typecheck` | types across all six packages |
| `pnpm test` | 90 unit and integration tests |
| `pnpm build` | both apps compile |

Dependabot opens weekly dependency pull requests, grouped so they stay readable. Prisma major bumps are held back deliberately — they change client generation and need a manual migration.

Locally, `npx playwright test` adds 24 browser assertions covering landmarks, focus order, colour contrast in both themes, 360px layout, and 44px touch targets. It drives your installed Microsoft Edge by default; set `PW_CHANNEL=chrome` to use Chrome instead.

## Layout

```text
apps/
  web/            React frontend
  api/            Express API (modular monolith)
packages/
  database/       Prisma schema, migrations, seed, client
  validation/     shared Zod schemas
  types/          shared domain types
tests/e2e/        Playwright (planned)
```

Backend layering is fixed: Route → Middleware → Controller → Service → Repository.
Business logic does not live in route files, and Prisma is never called from the
frontend.

## MVP scope

Ships in the first release: authentication, applications, companies, jobs,
timeline, follow-ups, dashboard, analytics, search and filters, saved jobs,
offers, and skill capture.

Not in the first release: interviews, contacts, resumes, cover letters,
notifications, and all AI features. See
[`.wwg/wiki/decisions/D-0004-mvp-schema-scope.md`](.wwg/wiki/decisions/D-0004-mvp-schema-scope.md).

`notifications` in particular must not appear in the schema — there is a test
that fails if it does.

## Documentation

| Document | Purpose |
|---|---|
| `job-application-tracker-brd-prd.md` | product requirements (source of truth for what the product does) |
| `job-application-tracker-project-architecture.md` | technical architecture (source of truth for code) |
| `DESIGN.md` | UI and design rules |
| `design-system.html` | live design-system reference |

The two long-form documents keep historical `job-application-tracker-*`
filenames. The product is named Tarn; see
[`.wwg/wiki/decisions/D-0001-product-name-tarn.md`](.wwg/wiki/decisions/D-0001-product-name-tarn.md).

## Working with agents

Read `AGENTS.md` first, then `.wwg/wiki/project-truth.md`. Governed truth,
decisions, and principles live under `.wwg/`.
## Branch protection

\main\ is protected. Every change arrives through a pull request where CI, the dependency review, and CodeRabbit must all pass. Direct pushes and force pushes are rejected.

