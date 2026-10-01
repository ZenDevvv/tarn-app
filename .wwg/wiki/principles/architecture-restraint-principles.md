---
type: principle-brief
status: active
mutability: high-friction
scope: architecture
last_reviewed: 2026-10-01
---

# Architecture Restraint: Modular Monolith, Lazy Infrastructure

Provenance: ingested verbatim from `job-application-tracker-project-architecture.md` §4 "Architectural Style" and §92 "Architecture Rules". The architecture document is the source of truth for technical decisions per the source-of-truth order in `DESIGN.md`.

## Principle

**Do not introduce infrastructure until a real requirement exists.**

Start from a modular monolith: one API runtime, one database, modules that each own their business logic. Prefer simple, testable modules over abstraction-heavy architecture.

## Why It Matters

The product is a solo-project personal tool that must ship an MVP. Microservices, Kubernetes, and message brokers add operational cost and failure modes with zero current benefit. Conversely, a modular monolith preserves the seams that a later split would need, so this is not short-sightedness — it is the option that stays cheap while the requirements are still cheap to change.

## Hard Rules

These are copied from architecture §92 and are binding:

1. Do not place Prisma calls directly in React.
2. Do not place core business logic in Express route files.
3. Do not use TanStack Query for local UI state.
4. Do not duplicate server state in Zustand.
5. Validate all external input server-side.
6. Enforce user ownership on every protected resource.
7. Use database transactions for multi-entity operations.
8. Keep generic UI components separate from domain components.
9. Keep AI optional and isolated from core workflows.
10. Keep external automation outside the primary request path.
11. Do not introduce infrastructure until a real requirement exists.
12. Prefer simple, testable modules over abstraction-heavy architecture.

Explicitly not needed initially (architecture §4): Kafka, RabbitMQ, Kubernetes, service mesh, multiple databases, independent microservices.

## Applies To

- Backend module and route design
- Frontend state management
- Any dependency, service, or infrastructure proposal
- AI feature work
- Integration work

## Agent Guidance

- When a proposal adds a service, queue, cache, or second database, ask which current requirement demands it. If the answer is a hypothetical Phase 3 or Phase 4 need, decline it and record the idea for later.
- Rule 1 and rule 2 together mean the layering is fixed: Route → Middleware → Controller → Service → Repository. Business logic lives in services, persistence in repositories, and Prisma never reaches a React component.
- Rule 3 vs rule 4 is the single most common state-management mistake here. Server state belongs to TanStack Query; local UI state belongs to React state; Zustand is a last resort and must never mirror server data.
- Rule 9 means an AI feature may never sit in the path of a core workflow. If an AI provider is down, applications must still be creatable, movable, and searchable.
- Rule 10 means scheduled and integration work (n8n, email parsing, calendar sync) runs outside the primary request path, with idempotency (architecture §69).
- Rule 6 is a security rule, not a style rule, and is treated as approval-sensitive. See the ownership boundary in Project Truth.
- Keep validation in the shared `packages/validation` schemas (Zod) so client and server agree, but always re-validate server-side.

## Non-Goals

- This principle does not forbid refactoring when a real requirement appears. It forbids doing so speculatively.
- "Modular monolith" does not mean "one giant module". Module boundaries by domain are expected.
- It does not mean skipping tests or type safety in the name of simplicity.

## Related Truths

- `job-application-tracker-project-architecture.md` §4, §19–§24, §85, §92
- `.wwg/wiki/project-truth.md` — "Architecture Truth", "Architecture rules"
- `.wwg/wiki/terminology.md` — `Modular Monolith`, `Feature Module`, `Server State`, `Local UI State`, `Global Client State`, `Transaction Boundary`, `Idempotency`
- `.wwg/wiki/principles/product-principles.md` (Simple First, Scalable)