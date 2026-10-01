---
type: principle-brief
status: active
mutability: high-friction
scope: accessibility
last_reviewed: 2026-10-01
---

# Accessibility Is Required, Not Optional

Provenance: ingested from `DESIGN.md` §11 "Accessibility (required, not optional)" and `job-application-tracker-brd-prd.md` §10.6 "Accessibility". Accessibility is named as a Non-Functional Requirement in the PRD, so this is product requirement, not agent preference.

## Principle

Accessibility is a release requirement of this product, not a follow-up enhancement. Every UI change must satisfy the baseline below before it is considered done.

## Why It Matters

The product is used repeatedly under stress — a job seeker checking interview schedules and follow-ups, often on a phone, often in a hurry. Keyboard-only and screen-reader access is not a nice-to-have for a tool like this, and the PRD has already committed to it as a Non-Functional Requirement (§10.6), which makes regressions a requirement violation rather than a quality nit.

## Baseline

- Text contrast **4.5:1** minimum. Control edges and meaningful graphics **3:1**. Check **both** light and dark themes.
- Visible focus on **every** interactive element. Never `outline-none` without a replacement.
- Semantic HTML: `<button>`, `<a>`, `<nav>`, `<main>`, `<table>`, real `<label for>`.
- Every icon-only button has an `aria-label`.
- Dialogs trap focus and return it on close (use the shadcn/Radix primitives).
- Dynamic updates (status moved, toast, timeline add) go through `aria-live="polite"`.
- Touch targets **44px minimum**.
- Test every new component at **360px** width, in light and dark, with keyboard only.

PRD §10.6 additionally names: keyboard navigation, semantic HTML, accessible forms, appropriate labels, focus states, sufficient contrast, and screen-reader-friendly controls.

## Applies To

- Every component and layout
- Forms and validation messaging
- Dialogs, menus, and toasts
- Status display (see the shape-over-color rule in the UI/UX simplicity principle)
- Responsive behavior on small screens

## Agent Guidance

- Run the 360px / light / dark / keyboard-only check as part of finishing any component, not as a later QA pass. `DESIGN.md` §15 is an explicit pre-finish checklist.
- Because status is shown as shape, always pair the Stage Ring with a visible text label. Shape-only status would fail this principle.
- Error messages must be programmatically associated with their field (`aria-describedby`) so a screen-reader user learns what happened, consistent with the copy rule that errors state what happened and what to do.
- Prefer the shadcn/Radix primitives for dialogs and menus rather than hand-rolling focus trapping.
- If an accessibility target is ever ambiguous, do not silently downgrade it. Record it as an open question in Project Truth.

## Non-Goals

- This is a floor, not a ceiling. Meeting it does not justify claiming full WCAG conformance; do not claim conformance levels that have not been audited.
- It does not require accessibility tooling to be added as a dependency; it requires the behaviors above.

## Related Truths

- `job-application-tracker-brd-prd.md` §10.6, §10.5
- `DESIGN.md` §11, §13, §15
- `.wwg/wiki/project-truth.md` — "Do not claim production readiness for" (accessibility conformance is specified, not implemented)
- `.wwg/wiki/principles/ui-ux-simplicity-principles.md`