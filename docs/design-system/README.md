# OD LABS design system

## Purpose

Use one semantic token system across the public application. Components should consume interface roles (surface, secondary text, border, focus, status) rather than choose raw palette shades independently. A token correction should propagate consistently across supported themes.

## Status

| Phase | Status |
|---|---|
| A — Existing application audit | Complete as a static source audit; see [audit.md](audit.md) |
| B — Token vocabulary and theme specification | Pending |
| C — Token implementation and component migration | Pending |
| D — Theme and component verification | Pending |

Phase A changed documentation only. No runtime theme or component code was changed.

## Principles

1. Semantic tokens are the interface between components and theme definitions.
2. Theme definitions own values; components consume semantic roles.
3. Extend the existing CSS-variable architecture and preserve shadcn compatibility where useful.
4. Keep brand, status, data visualisation, syntax highlighting, email, Payload Admin, and third-party embed colours deliberately classified.
5. Verify all major routes, components, states, and responsive layouts.
6. Keep exceptions explicit and rare.

## Documents

- [Phase A audit](audit.md)
- [Stitch design reference](references/stitch-design.md)
