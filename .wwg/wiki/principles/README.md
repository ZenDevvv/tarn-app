# Principles

This folder contains durable Principle Briefs for this project.

Principles explain how agents should reason about product direction, architecture, governance, positioning, UX, and long-term design choices.

Principles are not the same as project truth.

- Use `../project-truth.md` for canonical facts.
- Use `../terminology.md` for official names and definitions.
- Use `../decisions/` for specific decisions and rationale.
- Use `../../workspace/` for current task state.
- Use `../../governance/` for enforcement rules, drift checks, and validation behavior.

Recommended default frontmatter for active Principle Briefs:

```yaml
---
type: principle-brief
status: active
mutability: high-friction
scope: ""
last_reviewed: YYYY-MM-DD
---
```

Principles are high-friction mutable guidance. Agents may update them when a user explicitly identifies something as a principle, doctrine, guiding philosophy, or durable design rationale, or when a task clearly changes an existing principle.

If uncertain, agents should create a candidate principle note or mention the possible principle change in a handoff/report rather than rewriting an active principle.

## Active Principle Briefs in This Project

| File | Scope | Governs |
|---|---|---|
| `product-principles.md` | product | Simple First, Next Action Driven, Historical Context, User Control, Searchable, Scalable (from PRD §4) |
| `ui-ux-simplicity-principles.md` | ui-ux | Quiet, personal design; shape-over-color status; token-only styling; copy and voice (from `DESIGN.md`) |
| `accessibility-principles.md` | accessibility | Contrast, focus, semantics, touch targets, and the 360px/light/dark/keyboard check (from PRD §10.6 and `DESIGN.md` §11) |
| `architecture-restraint-principles.md` | architecture | Modular monolith, lazy infrastructure, and the 12 binding architecture rules (from architecture §4 and §92) |
| `plan-vs-implementation-truth.md` | agent-conduct | Never present planned work as implemented; distinguish observed vs accepted plan vs inferred |

All five were ingested on 2026-10-01 from the project's own authoritative documents, not invented by an agent. Read all five before architectural, UX, or product-scope work.
