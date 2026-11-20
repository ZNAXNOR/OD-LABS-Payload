# Phase B — Semantic tokens, theme presets, and accessibility specification

**Status:** specification approved for implementation planning; no runtime code changed in Phase B.  
**Applies to:** public OD LABS website only. Payload Admin and email rendering remain separate systems.

## 1. Decisions

| Decision | Specification |
|---|---|
| Theme model | Four predefined schemes: OD Dark, OD Light, OD Dark High Contrast, OD Light High Contrast |
| Theme IDs | `od-dark`, `od-light`, `od-dark-contrast`, `od-light-contrast` |
| Automatic mode | Retain an Auto option. It follows `prefers-color-scheme` and selects the standard OD Dark or OD Light preset; it does not silently choose a high-contrast preset. |
| Brand accent | Retain production `#E94235` as the canonical OD LABS brand accent for this implementation. The Stitch `#FF3B30` / `#E62E24` pair is not adopted as the production brand palette. |
| Stitch visual direction | Adopt selectively: cool, blue-black/slate undertones and restrained surface layering may inform dark surfaces. Do not wholesale replace the current production palette or adopt every reference colour. |
| User colour controls | No arbitrary colour picker or custom user-authored palette in this release. |
| Token architecture | Extend the existing CSS custom properties and Tailwind v4 `@theme inline` mapping. Do not introduce another theme provider or a colour-token dependency. |
| UI primary vs brand | Keep action-role tokens distinct from the OD LABS brand accent. A generic `primary` button must not automatically become brand red. |
| Reading preferences | Separate from theme selection and scoped to editorial/content reading containers only. Initial controls: text size and reading width. |

These decisions are the basis for Phase C. Any change to them should be made in this document before implementation diverges.

## 2. Theme behaviour and persistence

### Theme presets

| Display name | ID | Behaviour |
|---|---|---|
| OD Dark | `od-dark` | Standard dark presentation |
| OD Light | `od-light` | Standard light presentation |
| OD Dark High Contrast | `od-dark-contrast` | Dark presentation with stronger text, borders, control boundaries, and focus indicators |
| OD Light High Contrast | `od-light-contrast` | Light presentation with stronger text, borders, control boundaries, and focus indicators |

The selector should expose Auto plus the four named presets. Auto resolves to one of the two standard presets based on the operating-system preference. The explicit preset choice is stored locally and survives reloads.

Recommended storage key: retain `payload-theme` for compatibility, but validate the expanded four-value set. Store only the explicit preset; Auto removes the key. The initial pre-interactive script and React provider must share the same valid IDs and fallback rules to avoid flash-of-wrong-theme. Theme initialization must set the root attribute before the page becomes visible.

Suggested root attributes:

```html
<html data-theme="od-dark">
<html data-theme="od-light">
<html data-theme="od-dark-contrast">
<html data-theme="od-light-contrast">
```

Use one canonical type/validation definition for the application. Do not keep independent theme unions in the provider, selector, and initialization code.

### System preference changes

When Auto is active, listen for `prefers-color-scheme` changes and update between OD Dark and OD Light. When a user has explicitly selected a preset, system changes must not override it.

### Reduced motion

Theme transitions must not force animated full-page colour changes. If subtle transitions are used, respect `prefers-reduced-motion: reduce`.

## 3. Semantic token contract

The following is the canonical semantic vocabulary for public frontend components. Tokens describe purpose, not raw palette positions.

### 3.1 Page and surface roles

| Token | Responsibility |
|---|---|
| `background` | Main page canvas |
| `foreground` | Default text on the page canvas; compatibility alias for existing shadcn usage |
| `surface` | Default component surface, such as a card or section panel |
| `surface-raised` | Surface one level above the default surface |
| `surface-overlay` | Menus, popovers, dialogs, command surfaces |
| `surface-subtle` | Low-emphasis surface tint, selected row, quiet grouping |
| `surface-inset` | Recessed area, input well, code viewport when not treated as a fixed theme exception |

### 3.2 Text roles

| Token | Responsibility |
|---|---|
| `text-primary` | Main readable text |
| `text-secondary` | Supporting body text and descriptions |
| `text-muted` | Metadata and non-primary but still meaningful text |
| `text-disabled` | Disabled labels and values only |
| `text-inverted` | Text on a contrasting filled action or accent surface; only use where the paired background is defined and tested |

Muted and disabled are not interchangeable. Muted text remains meaningful and must meet normal text contrast requirements. Disabled controls are exempt from some WCAG contrast requirements but should remain perceivable.

### 3.3 Structural roles

| Token | Responsibility |
|---|---|
| `border-subtle` | Decorative or low-emphasis separators |
| `border-default` | Default component boundary |
| `border-strong` | Strong grouping, table/header boundaries, high-contrast mode |
| `border-interactive` | Interactive control boundary and selected state |
| `focus-ring` | Keyboard focus indicator; must not rely on colour alone where shape/offset can improve clarity |

### 3.4 Brand and action roles

| Token | Responsibility |
|---|---|
| `brand` | OD LABS identity accent, canonically based on `#E94235` |
| `brand-hover` | Accessible hover/active brand treatment; must be tested for its actual foreground pairing |
| `brand-subtle` | Low-area brand tint for badges, selection cues, and decorative emphasis |
| `action-primary` | Primary action fill, independent from brand identity |
| `action-primary-foreground` | Text/icon colour on primary action fill |
| `action-secondary` | Secondary action surface or outline treatment |
| `action-secondary-foreground` | Text/icon colour for secondary actions |
| `link` | Inline link colour |
| `link-hover` | Inline link hover colour |

Do not assume the canonical brand red is suitable for small text on every surface. Use it as text only after contrast verification; otherwise use it as a border, icon, marker, or filled control with a separately validated foreground.

### 3.5 Semantic status roles

Each state needs a foreground, surface, and boundary where applicable. A single colour token is insufficient for reliable component use.

- `success`, `success-foreground`, `success-surface`, `success-border`
- `warning`, `warning-foreground`, `warning-surface`, `warning-border`
- `error`, `error-foreground`, `error-surface`, `error-border`
- `info`, `info-foreground`, `info-surface`, `info-border`

Status must also be communicated with text, iconography, or another non-colour cue. Do not encode success/warning/error solely through hue.

### 3.6 Data visualisation

Keep `chart-1` through `chart-5` as a dedicated chart palette for compatibility, but validate them separately for adjacent-series distinguishability, contrast, and colour-vision deficiencies. Charts should include labels, legends, patterns, or direct values where needed; colour alone must not carry the data meaning.

## 4. Compatibility mapping

Preserve existing shadcn variables and map them to the canonical roles. Avoid migrating every primitive to bespoke class names when a compatibility alias can maintain consistency.

| Existing variable | Canonical role |
|---|---|
| `--background` | `background` |
| `--foreground` | `foreground` / default foreground text |
| `--card` | `surface` |
| `--card-foreground` | `text-primary` |
| `--popover` | `surface-overlay` |
| `--popover-foreground` | `text-primary` |
| `--primary` / `--primary-foreground` | `action-primary` pair |
| `--secondary` / `--secondary-foreground` | `action-secondary` pair |
| `--muted` | `surface-subtle` |
| `--muted-foreground` | `text-secondary` (must meet text contrast) |
| `--accent` / `--accent-foreground` | Contextual interactive/selected surface pair; do not alias to brand automatically |
| `--destructive` / `--destructive-foreground` | Error action/state pair |
| `--border` | `border-default` |
| `--input` | Input boundary/surface role; split only if necessary |
| `--ring` | `focus-ring` |
| `--success`, `--warning`, `--error` | Corresponding semantic state family |
| `--sidebar-*` | Existing sidebar-specific compatibility aliases mapped to surface/text/action/structure roles |
| `--chart-1` … `--chart-5` | Dedicated chart palette |

Tailwind utilities should be exposed through `@theme inline` aliases to CSS variables. Use CSS custom properties as the runtime source of truth. Do not create parallel hardcoded colour values in `tailwind.config.mjs` and CSS for the same semantic token.

## 5. Palette direction and value policy

### Canonical brand

- Production brand: `#E94235`.
- Do not silently replace it with Stitch's `#FF3B30`.
- `brand-hover` must be selected through contrast testing and visual review, not copied mechanically from `#E62E24`.
- The current `#ef4444` hover and decoration occurrences should be classified as either brand interaction or semantic error; do not merge those meanings.

### Dark surfaces

Retain the existing production dark theme as the initial compatibility baseline. The Stitch reference may inform a restrained cool/slate undertone and distinct surface elevations, but do not adopt its whole palette by default. In particular, steel-blue metadata and amber should be used only when they communicate a defined role.

### Light surfaces

Use a neutral, readable light foundation with clear surface tiers and visible control boundaries. Do not merely invert dark values. Each foreground/background pair must be tested independently.

### High contrast variants

High contrast presets use the same semantic token names and component structure. They override values for:
- stronger primary and secondary text contrast;
- more visible component and input boundaries;
- clearer selected/active states;
- stronger focus indicators;
- less reliance on low-opacity white/black borders or text;
- restrained reduction of subtle surface distinctions where those distinctions are not sufficiently perceivable.

Do not implement high contrast as a global CSS filter, opacity change, or blanket saturation/brightness transform. It is a deliberate palette variant.

### Values remain to be calibrated

Phase B approves the vocabulary and value policy, not every final colour literal. Phase C must calculate and document the actual contrast ratios for each meaningful foreground/background pairing before shipping. The existing OKLCH values should remain in OKLCH where appropriate; avoid lossy conversion merely to make a palette table look uniform.

## 6. Accessibility requirements

Target **WCAG 2.2 Level AA** for the public website. These are minimum implementation gates:

| Area | Requirement |
|---|---|
| Normal text | Contrast ratio at least 4.5:1 |
| Large text | At least 3:1 |
| Meaningful icons, control boundaries, and visual state indicators | At least 3:1 against adjacent colours where WCAG 1.4.11 applies |
| Keyboard focus | Clearly visible; focus indicator must meet applicable non-text contrast expectations |
| Use of colour | Colour must not be the only way information, status, selection, or errors are conveyed |
| Text resizing and reflow | Content remains usable at 200% text resize and narrow viewport reflow; no loss of content/function |
| Text spacing overrides | No content or functionality loss when WCAG 1.4.12 text spacing overrides are applied |
| Focus obscuration | Focused controls must not be entirely hidden by sticky rails, overlays, banners, or dialogs |
| Motion | Respect reduced-motion preferences |

WCAG's 4.5:1 and 3:1 thresholds are thresholds, not values to round up. Aim above the minimum where feasible, especially for small text and thin visual strokes. Muted text, placeholders, navigation labels, timestamps, and helper copy are still text and should not be treated as decorative to avoid contrast requirements.

The high-contrast presets are an additional user option, not a substitute for making the standard presets conform to WCAG AA.

## 7. Reading preferences

Reading controls are independent of the colour theme. Store them separately from `payload-theme`, locally, and apply them only to designated editorial/content containers.

Initial controls:
1. **Text size:** a small set of discrete scale choices, not a free-form font-size field.
2. **Reading width:** narrow / standard / wide content measure choices.

Do not apply reading preferences to:
- navigation, rails, header, footer, menus, forms, buttons, or admin UI;
- code blocks and syntax-highlighted content;
- diagrams, images, charts, and media dimensions;
- layout-builder components whose width is structural rather than editorial.

Use CSS variables scoped to an explicit reading-content wrapper. Preserve responsive container behaviour and avoid causing horizontal overflow. Keep the chosen font family unchanged in this first release. Line-height and font-family selection are out of scope for the initial control set.

The exact scale and width values should be calibrated against real post/page templates during Phase C, not guessed from the theme palette.

## 8. Explicit boundaries and exceptions

| Area | Policy |
|---|---|
| Public application shell and components | Must use semantic tokens |
| Editorial content | Uses theme tokens; reading preferences apply only inside its content wrapper |
| AI workspace | Follows selected site theme; code/terminal sub-surfaces may have dedicated component tokens |
| Code syntax highlighting | Dedicated syntax palette may remain dark if it is a deliberate code-viewer presentation; container, border, toolbar, and surrounding text follow site theme |
| Logos and favicon | Brand assets may retain fixed artwork colours; choose suitable light/dark variants where required |
| Email | Separate email-safe palette; browser theme preference does not affect sent email |
| Payload Admin | Continue using Payload's `--theme-*` variables and Admin styling contracts |
| Usercentrics / Cookiebot | Scoped integration styles; third-party output must not leak into general frontend styles |
| Status and telemetry | Use semantic state families and redundant text/icon cues |
| Decorative gradients/transparency | May use effect-specific values, but must not reduce text or control contrast |
| Root error document | Must have a legible standalone fallback; should match the active theme when feasible without depending on the normal app provider |

## 9. Phase C implementation order

1. Define canonical TypeScript theme IDs and shared validation; reconcile provider, selector, and initializer.
2. Extend the existing CSS variables for the four presets, keeping compatibility aliases.
3. Add Tailwind v4 aliases through `@theme inline`.
4. Add contrast-tested palette values and a documented foreground/background contrast matrix.
5. Migrate shared shell and primitives first: header, navigation, footer, rails, buttons, inputs, popovers, dialogs, calendar.
6. Migrate content blocks, heroes, contact/status UI, and AI workspace.
7. Refactor LegalContent and scoped consent-provider styles.
8. Implement reading preferences with independent persistence and content-only scope.
9. Review error pages, scrollbars, code surfaces, SVGs, and exceptions.
10. Run typecheck, lint, production build, automated accessibility checks, and manual keyboard/visual QA in all four themes.

## 10. Required verification before completion

- All four explicit presets render correctly after reload.
- Auto resolves system preference and reacts to OS preference changes.
- Explicit selection is not overridden by OS changes.
- Initial theme is applied before visible paint; no incorrect-theme flash.
- Theme choice and reading preferences persist independently.
- Reading preferences affect only editorial reading containers.
- Contrast matrix covers all text and interactive pairings in all four presets.
- Standard and high-contrast themes both meet WCAG 2.2 AA; high contrast must be visibly stronger than standard.
- Keyboard focus is visible and not obscured.
- Light mode has no residual unintended black/white fixed-dark controls.
- Consent banners, legal content, AI, forms, navigation, and error pages are checked.
- `pnpm exec tsc --noEmit`, lint, and production build pass.

## 11. Standards and references

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [Understanding Contrast Minimum (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [Understanding Non-text Contrast (1.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
- [Understanding Text Spacing (1.4.12)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)
- [Understanding Focus Not Obscured (2.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

The normative standard and its success criteria take precedence over this project specification.
