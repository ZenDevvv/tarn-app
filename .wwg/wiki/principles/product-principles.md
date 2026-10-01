---
type: principle-brief
status: active
mutability: high-friction
scope: product
last_reviewed: 2026-10-01
---

# Product Principles: Simple First, Next Action Driven, User in Control

Provenance: ingested verbatim from `job-application-tracker-brd-prd.md` §4 "Product Principles", which the PRD (§38) declares to be the product source of truth. These are not agent inventions.

## Principle

Six principles govern product decisions, in this order of precedence when they conflict:

1. **Simple First** — adding an application must require minimal effort.
2. **Next Action Driven** — every active application must make the user's next action clear.
3. **Historical Context** — important changes must be preserved through an application timeline.
4. **User Control** — automation and AI assist the user rather than make irreversible decisions.
5. **Searchable** — all application information must be easy to find.
6. **Scalable** — the initial architecture must support future integrations and automation without requiring a complete rewrite.

## Why It Matters

The named business problem is that job seekers lose track of fragmented application state across spreadsheets, bookmarks, notes, emails, and calendars (PRD §2.1). Too much manual entry is product Risk 1 (PRD §34). Every principle above is a mitigation for that failure mode: Simple First and Next Action Driven reduce entry and ambiguity; Historical Context and Searchable preserve what was already entered; User Control keeps the user the decision-maker; Scalable keeps a fix from requiring a rewrite later.

Feature Overload is product Risk 2. These principles are also the scope control: when a new idea serves none of the six, it is out of scope.

## Applies To

- Feature scoping and MVP decisions
- UX and information architecture
- Any proposal involving AI, automation, or integrations
- Copy and onboarding decisions

## Agent Guidance

- Before accepting a new feature, name which principle it serves. If none, it is out of scope.
- "Simple First" is a hard test on data entry: if adding one application requires more than a handful of fields, the design is wrong. Optional fields stay optional.
- "Next Action Driven" means every active application resolves to one concrete action. If a screen leaves the user asking "what do I do now?", the screen is incomplete.
- "User Control" is the governing rule for all AI and automation work. AI output must be editable, must be visibly presented as generated assistance, and must never make or imply a hiring decision. Never build automatic application submission, automatic recruiter outreach, or any irreversible agent action.
- "Scalable" justifies modularity for future integrations, but it never justifies speculative infrastructure. See the architecture restraint principle.
- When principles appear to conflict, prefer the earlier principle in the list.

## Non-Goals

- These principles do not justify removing capability that the PRD explicitly scopes. Simplicity is about entry cost and clarity, not about cutting required features.
- "Scalable" does not mean "build for scale now". It means avoid choices that a future integration cannot grow out of.
- "User Control" does not mean "never automate". It means automation acts with explicit user action and stays reversible.

## Related Truths

- `.wwg/wiki/project-truth.md` — "Product Principles", "Current Product Direction", "Canonical Scope"
- `job-application-tracker-brd-prd.md` §2.4 (Non-Goals), §4, §34 (Product Risks), §36
- `DESIGN.md` §2 — the same philosophy expressed visually