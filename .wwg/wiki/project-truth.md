# Project Truth

Adoption status: INFERRED_FROM_EXISTING_PROJECT
Status: Inferred from repository evidence. Requires human/agent review before becoming accepted project truth.
Truth confidence: LOW
Last adoption audit: 2026-10-01

This file was populated from existing code, documentation, package metadata, configuration, and observed implementation.

Items marked `INFERRED`, `NEEDS_CONFIRMATION`, `CONFLICTING`, or `STALE` should be reviewed before major future work.

If this file conflicts with lower-priority reports, generated notes, task files, or stale documentation, this file wins once confirmed.

Project Truth must not be silently overwritten. Requirement evolution is allowed when documented and accepted.

## Product Identity

- Product name: applicant-tracking-system
- Status: INFERRED
- Evidence: . (folder name)

## Product Category

- Category: Software project
- Status: NEEDS_CONFIRMATION
- Evidence: repository scan (not enough category-specific evidence)

## One-Line Description

- Description: applicant-tracking-system appears to be a software project.
- Status: INFERRED
- Evidence: . (folder name); repository scan (not enough category-specific evidence)

## Primary Users and Roles

- Role: NEEDS_CONFIRMATION
  - Status: NEEDS_CONFIRMATION
  - Evidence: README/source (no clear user roles detected)

## Canonical Scope

Currently includes:

- Feature: NEEDS_CONFIRMATION
  - Status: NEEDS_CONFIRMATION
  - Evidence: README/source (no feature headings or routes detected)

Currently does not include unless approved:

- Boundary: Production boundaries need owner confirmation
  - Status: NEEDS_CONFIRMATION
  - Evidence: repository scan (no explicit mock/demo/production boundary detected)

## Canonical Terminology

See `.wwg/wiki/terminology.md`.

Critical terms:

- Term: applicant
  - Meaning: Observed project term; confirm canonical meaning before broad use.
  - Status: NEEDS_CONFIRMATION
  - Evidence: package/name
- Term: system
  - Meaning: Observed project term; confirm canonical meaning before broad use.
  - Status: NEEDS_CONFIRMATION
  - Evidence: package/name
- Term: tracking
  - Meaning: Observed project term; confirm canonical meaning before broad use.
  - Status: NEEDS_CONFIRMATION
  - Evidence: package/name

## Architecture Truth

Accepted or observed architecture:

- Item: NEEDS_CONFIRMATION
  - Status: NEEDS_CONFIRMATION
  - Evidence: repository scan (architecture could not be inferred safely)

Do not introduce without approval:

- Backend/auth boundary not confirmed
  - Status: NEEDS_CONFIRMATION
  - Evidence: Existing project adoption audit
- Payment/billing behavior not confirmed
  - Status: NEEDS_CONFIRMATION
  - Evidence: Existing project adoption audit
- Deployment/runtime target not confirmed
  - Status: NEEDS_CONFIRMATION
  - Evidence: Existing project adoption audit

## Safety and Production Boundaries

Current boundaries:

- Boundary: Production boundaries need owner confirmation
  - Status: NEEDS_CONFIRMATION
  - Evidence: repository scan (no explicit mock/demo/production boundary detected)

Mock/demo-only areas:

- Area: No mock/demo-only area confirmed
  - Status: NEEDS_CONFIRMATION
  - Evidence: Lightweight audit did not confirm explicit mock/demo areas.

Do not claim production readiness for:

- Capability: No auth/security implementation detected
  - Status: NEEDS_CONFIRMATION
  - Evidence: repository scan (no auth/security indicators)
- Capability: No payments/billing implementation detected
  - Status: NEEDS_CONFIRMATION
  - Evidence: repository scan (no payment/billing indicators)

## Current Product Direction

Current direction:

- Direction: NEEDS_CONFIRMATION
  - Status: NEEDS_CONFIRMATION
  - Evidence: README/source (no feature headings or routes detected)

Avoid drifting into:

- Drift risk: missing tests/checks
  - Status: NEEDS_CONFIRMATION
  - Evidence: No test files were detected by lightweight scan.
- Drift risk: deployment/runtime
  - Status: NEEDS_CONFIRMATION
  - Evidence: No deployment config detected.

## Open Questions

- Question: Confirm product category.
  - Why it matters: Category affects profile selection, architecture defaults, and governance gates.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: Software project
- Question: Confirm primary users and role names.
  - Why it matters: Roles affect permissions, UX, terminology, and task routing.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: NEEDS_CONFIRMATION
- Question: Confirm persistence boundary.
  - Why it matters: Data ownership and migration policy depend on this.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: No persistence layer detected
- Question: Confirm auth/security boundary.
  - Why it matters: Auth and permissions changes are approval-sensitive.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: No auth/security implementation detected
- Question: Confirm payments/billing boundary.
  - Why it matters: Payments and billing are approval-sensitive.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: No payments/billing implementation detected
- Question: Confirm deployment/runtime boundary.
  - Why it matters: Operational readiness depends on deployment truth.
  - Evidence / uncertainty: NEEDS_CONFIRMATION: No deployment config detected
- Question: Confirm testing strategy.
  - Why it matters: WWG health depends on a known validation path.
  - Evidence / uncertainty: No test files detected.

## Update Rules

Update this file when:
- product category changes
- user roles change
- canonical terminology changes
- architecture boundaries change
- safety boundaries change
- production-readiness boundaries change
- major product decisions become accepted truth
- high-risk behavior, production claims, approval requirements, or verification expectations change

For adopted projects, do not treat inferred truth as final confirmed truth until reviewed.
