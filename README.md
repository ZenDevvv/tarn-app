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
| Testing | Vitest, React Testing Library, Playwright |
| Tooling | pnpm workspaces, ESLint, Prettier, Docker, GitHub Actions |

The design system is **Marker** (see `DESIGN.md` and `design-system.html`).
The product is **Tarn**. They are not the same thing.

## Requirements

- Node.js 22 (see `.nvmrc` — CI uses the same pinned version)
- pnpm 9.15.4 (`npm i -g pnpm@9.15.4`)
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
| `pnpm test` | 90 unit and integration tests (83 without a running database — see Troubleshooting) |
| `pnpm build` | both apps compile |
| Playwright job | 24 browser and accessibility assertions in a real engine |

All four of these must pass, along with the CodeRabbit review, before `main` accepts a merge.

Dependabot opens weekly dependency pull requests, grouped so they stay readable. Major bumps are held back deliberately — upgrading across a major is manual work, not something that arrives unannounced on a Monday. Prisma majors specifically need a client-generation migration.

### Running the browser tests locally

`npx playwright test` adds colour-contrast, focus-order, 360px layout, and 44px touch-target assertions that jsdom cannot perform.

It uses your installed Microsoft Edge by default, since the bundled Chromium download is often blocked on Windows. Set `PW_CHANNEL=chrome` for Chrome, or `PW_CHANNEL=` to use the bundled browser.

CI always uses the pinned bundled Chromium so results stay reproducible.

### Troubleshooting

**`pnpm test` reports `MODULE_NOT_FOUND` for `vitest` in every package.**
Moving or renaming the repository directory breaks every `node_modules`
symlink, because pnpm stores absolute paths inside them. Reinstall to relink:

```bash
pnpm install --frozen-lockfile
```

**`pnpm typecheck` reports `has no exported member 'ApplicationStatus'`.**
The generated Prisma Client is stale or was never generated. Fix with
`pnpm db:generate`. This also needs re-running after any change to
`packages/database/prisma/schema.prisma`.

**`pnpm test` shows 83 passing instead of 90, with 7 skipped.**
PostgreSQL is not reachable. The 7 skipped tests are the database integration
tests in `packages/database/tests/integration.test.ts`, and they skip loudly
rather than passing silently. Start it with `docker compose up -d` and re-run.
Do not treat the 83-test result as equivalent to the 90-test result — the
skipped tests are the ones covering referential integrity, cascade deletes,
and cross-user isolation.

**The database looks empty after renaming or moving the repository.**
The Compose project name is now pinned to `tarn-app` in `docker-compose.yml`,
so the volume name no longer follows the directory. A volume created before
2026-10-02 was named `applicant-tracking-system_tarn-postgres-data` and is
**not** reused.

Rebuild from the committed migration and the idempotent seed:

```bash
pnpm db:deploy && pnpm db:seed
```

Be clear about what that does and does not do: it initialises a new volume.
It does **not** transfer records out of the old one, so anything you created
by hand in the old database is not carried over. The seeded development data
is reproduced exactly, so a database that only ever held seed data needs
nothing else.

If you did create records by hand and want to keep them, dump the old database
**before** the first `docker compose up` under the new name. With the old stack
still running, from a shell that has `pg_dump` on PATH:

```bash
PGPASSWORD=tarn pg_dump -h localhost -U tarn -d tarn --data-only > tarn-data.sql
```

`--data-only` is deliberate. A default dump carries schema too, and replaying
schema on top of a migrated database raises errors that `psql` would otherwise
walk straight past.

Now stop the old stack before starting the new one. It holds both the
`tarn-postgres` container name and port 5432, so the new project cannot bind
while the old container is up. Name the legacy project explicitly — plain
`docker compose down` would use the new `name: tarn-app` and leave the old
container running:

```bash
docker compose -p applicant-tracking-system down   # named volumes are kept
docker compose up -d
pnpm db:deploy
PGPASSWORD=tarn psql -h localhost -U tarn -d tarn -v ON_ERROR_STOP=1 -f tarn-data.sql
```

`pnpm db:deploy` and the `psql` line must target the same database, so this
assumes your `.env` still holds the local Compose `DATABASE_URL`
(`postgresql://tarn:tarn@localhost:5432/tarn`). If you have pointed it
elsewhere, substitute that host, port, and database in the `psql` command too.

`ON_ERROR_STOP=1` aborts on the first error instead of continuing past it, so a
bad replay fails loudly rather than leaving a half-restored database. Check
row counts before you trust the result.

The old volume is not deleted by any of this. It simply stops being used, and
becomes garbage you can remove once the new database checks out. `docker volume
ls` will show both.

> Not executed: Docker Desktop was not running when this section was written,
> so the two commands above are reasoned from the standard `pg_dump`/`psql`
> contract rather than observed. Try them on a scratch database before relying
> on them with data you care about.

## Layout

```text
apps/
  web/            React frontend
  api/            Express API (modular monolith)
packages/
  auth/           password hashing (scrypt)
  database/       Prisma schema, migrations, seed, client
  validation/     shared Zod schemas
  types/          shared domain types
tests/e2e/        Playwright browser and accessibility specs
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

