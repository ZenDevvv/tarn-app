---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [mvp-scope, data-model, architecture]
---

# D-0004 — MVP schema scope: SavedJob, Skill, and Offer in; Notification out

Status: ACCEPTED
Date: 2026-10-01
Decided by: owner
Related: `.wwg/wiki/project-truth.md` (Canonical Scope, Planned data model)

## Decision

**In MVP:** `saved_jobs`, `skills`, `job_skills`, `offers`.
**Deferred to Phase 2:** `notifications`.

## Context

PRD §6 and architecture §35 disagreed in emphasis about what belongs in the MVP. Saved jobs and offer management were listed as Phase 2 in the PRD §37 matrix, while architecture §35 placed `offers` in the "then add, in later phases" group and `notifications` alongside it. This was recorded as `NEEDS_CONFIRMATION` because schema scope drives the first migration.

## MVP tables (authoritative)

Per architecture §35 as amended:

```text
users
companies
jobs
skills
job_skills
applications
saved_jobs
timeline_events
follow_ups
offers
```

## Later phases

```text
interviews
contacts
resumes
cover_letters
notifications
```

## The Skill Scope Split

This decision splits two things that were previously conflated:

- The **Skill entity** (`skills`, `job_skills`) ships in MVP, so a user can capture and store required skills against a job.
- AI **skill extraction** and **skill matching** remain Phase 3 (PRD §8.2).

Do not build an AI call into the MVP skill path. The MVP skill UI is manual entry and storage only. This preserves architecture §92 rule 9 — AI stays optional and isolated from core workflows.

## Notification Boundary (explicit)

`notifications` is deferred. MVP must contain:

- No notification table.
- No delivery channel (no email, push, in-app bell, or webhook).
- No notification UI, preferences screen, or unread count.
- No scheduled job that generates notifications.

Follow-up **dates** are MVP (`follow_ups`). Follow-up **notifications** are not. Do not let the phrase "follow-up reminders" pull notification work into MVP scope.

## Consequences

- PRD §6 Phase 1 and Phase 2 lists amended.
- PRD §37 matrix amended: Saved Jobs, Offer Management, and Skills (capture) moved into the MVP column; Skill Extraction & Matching became an explicit Phase 3 row; Notifications remains Phase 2.
- Architecture §35 MVP table list rewritten with an amendment note.
- `.wwg/wiki/terminology.md` retains the `Notification` canonical term with its Phase 2 status.

## Do Not

- Do not create the `notifications` table "just in case" — architecture §92 rule 11 forbids speculative infrastructure.
- Do not ship notification UI in MVP.
- Do not read "Skills in MVP" as "AI skill matching in MVP".