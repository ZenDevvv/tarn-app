# Current Task

Status: DONE — owner decision batch applied to truth and canonical documents.
Task mode: Existing Project Adoption (decision propagation)
Last updated: 2026-10-01

## Task Summary

- Status: DONE
- Task mode: Existing Project Adoption (decision propagation)
- User request:
  - Set the product name to "Tarn".
  - Decide MVP authentication.
  - Confirm pnpm.
  - Scope SavedJob, Skill, and Offer into MVP; defer Notification.
  - Resolve the `index.css` token-path conflict.
  - Update the existing docs as well as the WWG truth surfaces.

## Owner Decisions Recorded

| ID | Decision | Status |
|---|---|---|
| D-0001 | Product name is **Tarn**; "Job Application Tracker" retired | Accepted |
| D-0002 | **Authentication is in the MVP** (no-auth proposal raised then rejected) | Accepted |
| D-0003 | **pnpm** confirmed as package manager | Accepted |
| D-0004 | **`saved_jobs`, `skills`, `job_skills`, `offers` in MVP; `notifications` deferred to Phase 2** | Accepted |
| D-0005 | Move `index.css` → `apps/web/src/index.css` **at scaffold time**, not now | Accepted, pending execution |

Decision records live in `.wwg/wiki/decisions/`.

### Important reversal

D-0002 reversed within the same session. The owner first directed "let's make the first mvp with no auth", then answered the data-model fork with "lets just have the auth for the first mvp". **Authentication is MVP scope.** The original instruction is void; it is recorded in D-0002 only so a future reader of the chat log does not treat it as active.

## Canonical Documents Amended

Owner approved edits to the canonical docs (root `AGENTS.md` otherwise forbids WWG from rewriting them):

- `job-application-tracker-brd-prd.md` — §1 title, §1.1 product name, §1.2 summary, §6 Phase 1/2 scope, §37 phase matrix, §38 new Decision Log
- `job-application-tracker-project-architecture.md` — title, §1 overview, §5 pnpm confirmed, §6 structure (`tarn/`, `index.css`, `pnpm-lock.yaml`, token note), §35 MVP tables rewritten
- `DESIGN.md` — header product name, new Naming note, new Token file location note
- `index.css` — header comment (product name, scaffold note, `npm i` → `pnpm add -D`)
- `design-system.html` — `<title>` and lede

Diff footprint: 5 files, 66 insertions, 24 deletions. No application source was touched, because none exists.

## Truth Surfaces Updated

- `.wwg/wiki/project-truth.md` — product identity, auth model, MVP scope, notification boundary, skill scope split, pnpm, token conflict → `RESOLVED_PENDING_SCAFFOLD`, conflicts register, open questions
- `.wwg/wiki/terminology.md` — Naming Context table, phase-status markers on `SavedJob`/`Skill`/`Offer`/`Notification`, conflicts register now has resolutions, added two new conflicts
- `.wwg/wiki/decisions/` — 5 new decision records
- `.wwg/wiki/principles/plan-vs-implementation-truth.md` — risk 2 updated to reflect D-0005
- `.wwg/config/wwg.project.yaml` — canonical artifact map

## Naming Rules Now In Force

- Product name: **Tarn**, always capitalized.
- **Marker** is the design system name only; never a product name.
- "Job Application Tracker" is **retired**. It survives in exactly three places, all deliberate retirement notices: PRD §1.1, PRD §38 Decision Log, `DESIGN.md` Naming note.
- The `job-application-tracker-*.md` filenames are historical and are **not** a naming rule.
- The repository directory is still `applicant-tracking-system` — a recorded open question, not an oversight.

## Remaining Open Questions

1. Which deployment vendors are chosen (architecture §65 is recommendation only)?
2. Rename the repository directory from `applicant-tracking-system` to `tarn`?
3. What is the confirmed MVP testing/verification gate? See `.wwg/governance/test-enforcement.md`.

## Close-Out Notes

- Truth Alignment Status: GREEN. All five decisions propagated to both truth surfaces and canonical docs.
- Execution Gate: warn — still no implementation, so nothing is verifiable.
- Test / verification plan: unchanged; no executable path exists.
- Drift status: LOW. The `index.css` conflict is now a scheduled migration rather than an open defect.
- Adoption confidence: MEDIUM
- D-0005 is **accepted but not executed**. It discharges when the monorepo scaffold is created; the four close-out steps are listed in the decision record.
- New recommendations: none added to `.wwg/governance/recommendation-registry.md`. The three remaining questions are tracked here and in Project Truth.