# Changelog

All notable changes to **Tarn** are recorded here.

This project uses [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions
and semantic versioning.

---

## Important: nothing has been released

**There is no released version of Tarn yet.** No version has been published, no tag
exists, and nothing has been deployed. The application has never been run by anyone
other than its author on a development machine.

Everything below sits under **Unreleased** for that reason. There is deliberately no
`0.1.0` section, because writing one would imply a release that does not exist.

**What exists today is a foundation, not a product.** The API exposes a single
health endpoint. There is no register, no sign-in, no applications list, no pipeline,
no timeline, and no dashboard beyond a placeholder. The numbers below describe
infrastructure and verification, **not user-facing capability**. See
`.wwg/wiki/project-truth.md` § Implementation Reality for the authoritative statement,
and note the honesty rule this project follows: a green build is not a readiness signal.

### A note on versioning, and a warning

WWG's changelog tooling currently **recommends a `major` version bump** for this
history, on the grounds that a "folder-contract signal" was detected. That
recommendation is **declined**, and the reasoning is recorded here so it is not
quietly applied later:

- A directory rename is not a breaking change to any consumer, because **there are no
  consumers**. Nothing is published, installed, or depended upon.
- Semantic versioning describes compatibility *between released versions*. With zero
  released versions, there is no compatibility contract to break.
- A `major` bump would also imply `1.0.0`, which would falsely signal maturity. The
  product has no features.

The first real version should be cut when there is something to run, and it should
almost certainly be `0.1.0` — under SemVer, the `0.y.z` range is initial development,
where anything may still change, which honestly signals "early, incomplete."

---

## Unreleased

### Added — product foundations

Nothing here is a user-facing feature. This is the groundwork the features will stand on.

- **Product identity settled.** The product is named **Tarn**. The working title
  "Job Application Tracker" is retired and must not reappear in code, files, or UI
  copy. The design system is separately named **Marker**; the two names are never
  interchangeable.
- **Monorepo foundation** on `pnpm` workspaces: a React + Vite + Tailwind CSS v4
  frontend, an Express backend, and shared packages for the database, validation,
  domain types, and password hashing.
- **Database created and migrated.** PostgreSQL 16 with a committed first migration
  covering the 10 MVP tables, plus a re-runnable seed that does not duplicate data.
  Tables belonging to later phases were confirmed *absent*, so their scope boundaries
  are enforced rather than assumed.
- **Password hashing** using Node's built-in scrypt, replacing an earlier placeholder
  that was never acceptable. The storage format is self-describing, so the cost
  parameters can be raised later without invalidating existing hashes.

### Added — design

- **Marker design system** established, with tokens, and the supporting design
  documentation. Contrast, focus behaviour, semantics, and 44px touch targets are
  specified rather than left to chance.

### Added — delivery pipeline

- **Continuous integration** running lint, dependency audit, type checking, tests, and
  a production build against a real PostgreSQL service, plus a separate browser-test
  job.
- **Dependency vulnerability scanning**, weekly update automation, and a pull-request
  dependency review that rejects newly introduced vulnerable packages. The scan found
  five real vulnerabilities on its first run, all of which were fixed.
- **AI code review** (CodeRabbit) on every pull request, and **branch protection** on
  `main` with strict mode and admin enforcement enabled. Direct pushes are rejected;
  every change arrives through a reviewed pull request.

### Added — verification

- **97 unit, integration, schema, and script tests** across six packages. Of those, **90
  run without a database and 7 are database integration tests that require one** — those 7
  cover referential integrity, cascade behaviour, unique constraints, and cross-user
  isolation, and they *skip loudly* rather than passing silently when no database is
  reachable. So a local run with Docker stopped reports 90 passing and 7 skipped. The
  97 figure is the full inventory, and is what CI observes against a real database.
- **24 browser and accessibility assertions** in a real browser, covering colour
  contrast in light and dark themes, focus order, 360px layout, and touch-target size.
  This suite found and fixed two genuine accessibility defects.
- **A regression guard for root script wiring.** The database commands are now asserted
  by test, after a documented command turned out to have been broken and never run.
- Browser tests run against the system browser locally, because the bundled download
  is frequently blocked on Windows, while CI uses a pinned browser for reproducible
  results.

### Changed

- **Node.js pinned to version 22** via `.nvmrc`, with CI and the declared engine range
  aligned to it. Previously three different versions were in play, including a floor
  that had never actually been tested.
- **Repository directory renamed** from `applicant-tracking-system` to `tarn-app`, so
  the checkout no longer carries a retired name. The container project name is now
  pinned in configuration so the local database volume survives future renames.
- **Formatting is now a gate.** Source formatting was already declared and documented but
  never checked, and the tree did not conform. It now conforms, and continuous
  integration enforces it.
- **Governance records corrected at the source.** Several internal reports and the
  project registry were found to state things that were untrue — including a claim
  that a configuration fix had been made and verified when it had not. The underlying
  causes were fixed rather than the reports being edited, so the errors do not return
  on the next regeneration.
- **An agent-conduct principle now covers documented commands.** A command described in
  the documentation is a claim requiring evidence, exactly like a claim of verification.
  An unexplained workaround in continuous integration is treated as a defect waiting at
  its source.

### Fixed

- **The database migration command did not work.** `pnpm db:deploy` — the command the
  documented volume-recovery procedure instructs a developer to run — failed every time,
  because the workspace filter resolved the verb as a package-manager command of the
  same name instead of running the script. It had never been executed by any check, so
  nothing reported it. Fixed, guarded by a test, and the whole command family verified.
- A configuration key rejected by the code review tool on every pull request, removed.
- Two accessibility defects: a navigation link below the minimum touch-target size,
  and a focused skip link that was too small to use.
- Two blocking pipeline defects that only surfaced after publishing the repository:
  automated update tooling proposing 22 upgrades at once, and a dependency-review
  failure caused by case-sensitive licence identifiers.

### Known limitations at this point

These are deliberate, accepted, or deferred — not oversights.

- **No product feature is implemented.** This is the central limitation.
- **Sign-in is not available and the API guard rejects every protected request** by
  design, so no protected route is reachable. Authentication is confirmed MVP scope and
  is the next piece of work.
- **Browser tests report but do not block a merge.** Accepted by the owner: the result
  is visible on every pull request, but a red result will not refuse the merge. The
  decision and the conditions that should reopen it are recorded in
  `.wwg/wiki/decisions/D-0008-browser-tests-advisory-not-blocking.md`.
- **An independent human security review is deferred**, by explicit decision. The
  residual risk is concentrated in one property: a single missing ownership filter on
  one endpoint would expose the whole database.
- **No deployment target is chosen**, so there is no deployment configuration and no
  production-readiness boundary.
- **The project is unlicensed** — public, but not open source. The project grants **no
  general reuse licence**, so default copyright applies: reuse requires the owner's
  permission, except where an exception such as fair use independently permits a
  particular use. This is a deliberate choice, not an oversight.

---

## How this file should be maintained

- Entries describe **outcomes**, not commits. The git history is the commit log; this
  file is for someone who wants to know what changed without reading diffs.
- Language should be readable by the project owner, not only by engineers.
- Do not create a version section until something is genuinely released and deployed.
  Do not invent a version number to make a tool happy.
- The first release will be `0.1.0`, and it will contain the first real feature.
