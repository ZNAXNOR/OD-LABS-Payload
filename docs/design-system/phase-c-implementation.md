# Phase C — Implementation record

**Branch:** `feature/accessibility-theme-system`  
**Status:** initial implementation landed; full component migration and verification remain in progress.

## Implemented

### Theme state and initialization
- Added canonical theme IDs: `od-dark`, `od-light`, `od-dark-contrast`, and `od-light-contrast`.
- Centralized the TypeScript theme union, validation, storage key, and default.
- Retained `payload-theme` for stored explicit preferences; Auto removes the key.
- Updated the pre-interactive initialization script to validate all four IDs.
- Added system preference change handling while Auto is selected.
- Updated the selector to show Auto and all four named presets.

### Semantic CSS tokens
- Added four theme palettes using CSS custom properties.
- Kept shadcn-compatible variables and added semantic roles for surfaces, text, borders, brand, actions, links, focus, and status.
- Mapped Tailwind v4 utilities through `@theme inline`.
- Changed legacy `odl` utility mapping to resolve from `--brand` instead of maintaining a second hardcoded value.
- Made scrollbar colours follow theme surface and border tokens.
- Added a global visible focus treatment and reduced-motion overrides.

### Reading controls
- Added appearance controls to the bottom of the desktop left rail and to the mobile header.
- Added discrete text-size and reading-width settings, stored independently under `od-reading-preferences`.
- Added an opt-in `readingContent` prop to RichText.
- Enabled reading preferences for post body and legal rich text only.

### Initial component migration
- Migrated footer and right rail to semantic tokens.
- Migrated AI workspace shell, header, composer, transcript, source cards, error states, and conversation navigation to semantic tokens.
- Migrated content-block headings, capability rows, testimonials, and the Introduction hero to semantic roles.
- Bound Tailwind Typography / Payload RichText prose colour variables to the active semantic palette.
- Added light/dark SVG wordmark and square-logo variants; logo visibility follows the active root or header theme.
- Migrated header surface and navigation text, including its image-hero dark override.
- Migrated service-status presentation to semantic state colours and button/calendar variants to contrast-aware action tokens.
- Added dedicated chart palettes for the dark and high-contrast presets.
- Migrated legal page and scoped Usercentrics/Cookiebot styling from fixed dark colours to theme variables.
- Migrated form controls and common overlay primitives (popover, calendar, command, dialog, dropdown, hover-card) where direct dark palette utilities were present.
- Updated image-led hero wrappers to use the new dark theme ID for their intentionally dark image-overlay context.

## Initial contrast checks

Ratios below were calculated from the literal sRGB hex values in the current CSS palette using the WCAG relative-luminance formula. Values are for the listed foreground/background pairs, not a certification of every state or component.

| Theme | Foreground role | Foreground / background | Contrast |
|---|---|---|---:|
| OD Light | Primary text | `#171C24 / #FFFFFF` | 17.10:1 |
| OD Light | Secondary text | `#3D4856 / #FFFFFF` | 9.29:1 |
| OD Light | Muted text | `#3D4856 / #EEF2F6` | 8.26:1 |
| OD Light | Brand link | `#8F211B / #FFFFFF` | 8.75:1 |
| OD Light | Focus ring | `#B52A22 / #FFFFFF` | 6.33:1 |
| OD Dark | Primary text | `#F4F7FA / #0B0F14` | 17.88:1 |
| OD Dark | Secondary text | `#C7D0DA / #0B0F14` | 12.32:1 |
| OD Dark | Muted text | `#AAB6C3 / #0B0F14` | 9.32:1 |
| OD Dark | Brand accent | `#E94235 / #0B0F14` | 4.85:1 |
| OD Dark | Link | `#FF9B90 / #0B0F14` | 9.47:1 |
| OD Dark | Default border | `#718096 / #0B0F14` | 4.79:1 |
| OD Dark | Subtle border | `#647184 / #0B0F14` | 3.88:1 |
| OD Dark High Contrast | Secondary text | `#F0F0F0 / #000000` | 18.43:1 |
| OD Dark High Contrast | Muted text | `#D6D6D6 / #000000` | 14.45:1 |
| OD Light High Contrast | Secondary text | `#171717 / #FFFFFF` | 17.93:1 |
| OD Light High Contrast | Muted text | `#333333 / #FFFFFF` | 12.63:1 |

Status foreground/background checks:

| Theme | State | Foreground / background | Contrast |
|---|---|---|---:|
| OD Light | Success | `#176B5B / #E4F3EF` | 5.58:1 |
| OD Light | Warning | `#8A5B16 / #FFF2D9` | 5.28:1 |
| OD Light | Error | `#B52A22 / #FCE9E7` | 5.41:1 |
| OD Light | Info | `#315D85 / #E8F0F8` | 6.01:1 |
| OD Dark | Success | `#78D7BE / #12372E` | 7.61:1 |
| OD Dark | Warning | `#FFD18A / #3B2A12` | 9.66:1 |
| OD Dark | Error | `#FF9B90 / #421B1A` | 7.37:1 |
| OD Dark | Info | `#A8C9E8 / #1B3043` | 7.86:1 |

The dark default and subtle border pairs exceed the 3:1 non-text contrast threshold against the page background. The values must still be tested against the actual adjacent surface for each control.

## Remaining work

This implementation is not yet ready to merge or deploy. The repository still contains fixed palette utilities and literal colours in multiple areas, including portions of MegaMenu, other content blocks, remaining heroes, and shared UI outside the migrated paths. Some fixed colours are intentional (image overlays, logos, code syntax, and explicit CMS-authored inline text formatting) and need explicit classification. Third-party AI element primitives and any nested components not listed above also require a targeted review.

Outstanding:
1. Complete the repository-wide component migration based on the Phase A inventory.
2. Review all component states, not just default styles: hover, focus, active, selected, disabled, invalid, loading, and error.
3. Review header theme interaction and all routes under the four presets.
4. Verify mobile and desktop placement and usability of the appearance panel.
5. Check all rich-text instances to ensure reading preferences only affect intended editorial content.
6. Compute contrast for all foreground/background and interactive-state combinations, including chart colours and focus against adjacent surfaces.
7. Run `pnpm exec tsc --noEmit`, lint, production build, and automated accessibility tests.
8. Perform manual browser QA with keyboard-only navigation, 200% text zoom, text-spacing overrides, reduced motion, and mobile reflow.

## Verification status

No local package install, TypeScript check, lint run, production build, Playwright run, or live browser inspection was available during this remote source-editing pass. Do not treat the contrast table or source edits as proof of WCAG conformance or successful compilation.
