---
type: decision-record
status: accepted
date: 2026-10-01
decider: owner
affects: [product-identity, terminology, positioning]
---

# D-0001 — Product name is Tarn

Status: ACCEPTED
Date: 2026-10-01
Decided by: owner
Supersedes: nothing
Related: `.wwg/wiki/project-truth.md` (Product Identity), `.wwg/wiki/terminology.md` (Naming Context)

## Decision

The product is named **Tarn**. The former name "Job Application Tracker" is **retired** and must not be used as the product name.

## Context

PRD §1.1 previously carried "Job Application Tracker" as an explicitly provisional working title, with the note that "the final product name can be decided separately". The name was unresolved at WWG truth-ingestion time and recorded as `NEEDS_CONFIRMATION`.

## Rationale

Owner decision. No further rationale was recorded.

## Consequences

- PRD §1.1 now states Tarn as the product name; PRD §1.2, §31 (long-term vision), and the §999 save-to copy were updated.
- `job-application-tracker-project-architecture.md` title and overview updated.
- `DESIGN.md` header, `index.css` header comment, and `design-system.html` title and lede updated.
- "Job Application Tracker" now survives in exactly three places, all intentional retirement notices: PRD §1.1, PRD §38 Decision Log, and the `DESIGN.md` Naming note.
- The repository directory is still `applicant-tracking-system`. This mismatch is now a recorded open question, not an unnoticed inconsistency.

## Naming Rules

| Rule | Detail |
|---|---|
| Canonical product name | `Tarn`, always capitalized |
| Retired | "Job Application Tracker" — never in new files, components, packages, or user-facing strings |
| Design system name | `Marker` — never a product name |
| Never | Use `Tarn` as a design-system or component-library name |
| Historical filenames | `job-application-tracker-brd-prd.md` and `job-application-tracker-project-architecture.md` keep their names. These are historical and are **not** a naming rule. Do not propagate the prefix into new files. |

## Ambiguity Note

"Tarn" is also ordinary English (a patina on metal, and the verb). Where the bare word could be misread, use a noun phrase — "the Tarn app", "Tarn's dashboard". This is a copy guideline, not a renaming trigger.

## Files Changed

- `job-application-tracker-brd-prd.md` (§1, §1.1, §1.2, §38)
- `job-application-tracker-project-architecture.md` (title, §1)
- `DESIGN.md` (header, Naming note)
- `index.css` (header comment)
- `design-system.html` (title, lede)
- `.wwg/wiki/project-truth.md`, `.wwg/wiki/terminology.md`