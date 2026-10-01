---
type: principle-brief
status: active
mutability: high-friction
scope: ui-ux
last_reviewed: 2026-10-01
---

# UI/UX Simplicity: Quiet, Personal, Shape Over Color

Provenance: ingested from `DESIGN.md` §2 "The five ideas that make this product look like itself", §12 "Copy and voice", and §14 "Do not do this". `DESIGN.md` is the design source of truth per its own stated source-of-truth order.

## Principle

1. **Next action first.** Every active application answers "what do I do now?".
2. **Progress is shape, not color.** Status is shown with the Stage Ring, never with colored pills.
3. **Quiet until it matters.** Separate surfaces by tone and hairline borders. Shadows only on floating layers.
4. **Numbers big, labels small.** Headings and figures use the display face; labels stay small, plain, sentence case.
5. **Personal, not corporate.** Plain second-person copy. No enterprise chrome, no confetti, no gradients.

When a design decision is not covered by these rules, choose the option that is quieter and plainer.

## Why It Matters

The product is a personal tool for one person managing their own job search, not an enterprise dashboard. Feature Overload and "too corporate" are the two failure modes this principle prevents. Rule 2 in particular is load-bearing: the Stage Ring is the canonical status display because it encodes progress as shape, which survives both color themes and does not compete with the single brand accent color.

## Applies To

- Any UI work, component, or layout
- Status display of any kind
- Copy, labels, empty states, error messages
- Color, typography, elevation, and motion choices

## Agent Guidance

- **Never hard-code a hex value in a component.** Use Tailwind token classes (`bg-card`, `text-muted-foreground`) or `var(--token)`. If no token exists, extend the tokens in the token stylesheet first, then use it.
- **Status is never a colored pill.** Use `ApplicationStatusBadge` / `StageRing` from `features/applications/components/application-status-badge.tsx`, always with a visible text label so status is not conveyed by shape alone.
- **The marker is reserved for the next action.** Never use it for emphasis, selection, or branding.
- **No drop shadows on cards, inputs, or buttons.** Shadows only on genuinely floating layers (dialogs, menus, popovers).
- **Do not make every container the same radius** — radius carries hierarchy, not a single default.
- **Do not introduce a new font, color, radius, or shadow value.** Fonts are `@fontsource-variable/bricolage-grotesque` and `@fontsource-variable/instrument-sans` only. Icons are `lucide-react` only.
- **Do not wrap every fact in its own card.** Prefer a hairline list or a bordered band.
- **Avoid banned patterns:** gradient washes, glassmorphism, decorative blobs, ALL CAPS labels, spaced eyebrows, middle-dot metadata chains, arrows appended to links, monospace for small data labels, stock-photo heroes, emoji as UI icons, rainbow status badges.

### Copy and voice

- Plain verbs, active voice, sentence case, second person.
- A control keeps its name through the whole flow ("Archive" button, "Archived" toast).
- Errors never apologize and never say "Oops". They state what happened and what to do next.
- Empty states invite an action. No filler, no exclamation marks, no emoji in UI copy.
- Name things the way the user does: "follow-up", "next action", "saved jobs". Never expose system terms like "entity", "record", or "payload".

| Instead of | Write |
|---|---|
| Submit | Save application |
| Oops! Something went wrong. | Couldn't save your changes. Your edits are still here. Try again. |
| No data available | No applications yet. Add your first one to start tracking. |
| Invalid input | Enter a salary as a number, like 50000. |
| Status updated successfully! | Moved to HR interview. |

## Non-Goals

- This principle does not forbid expressive design; it forbids decoration that does not carry information. A visually distinctive element is fine when it encodes state.
- It does not forbid color. It forbids using color as the only carrier of status.
- It does not mean minimal UI. Dense, information-rich layouts are correct for this product.

## Related Truths

- `DESIGN.md` §1 (stack and file placement), §2, §6 (Stage Ring), §12, §13 (responsive), §14, §15 (pre-finish checklist)
- `.wwg/wiki/project-truth.md` — "Frontend file-placement rules", "Current Product Direction"
- `.wwg/wiki/terminology.md` — `Stage Ring`, `Next Action`
- `.wwg/wiki/principles/accessibility-principles.md`
- `design-system.html` — live reference rendering every component