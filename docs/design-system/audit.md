# Phase A — Existing application audit

**Repository:** `ZNAXNOR/OD-LABS-Payload`  
**Branch:** `staging` snapshot, used as the base for this work  
**Scope:** static source inspection and repository-wide code-search inventory  
**Result:** descriptive audit only; no production theme or component code changed.

## Executive finding

The public frontend already has a semantic CSS-variable foundation for Light and Dark themes, but many components bypass it with direct Tailwind palette utilities, literal hex colours, fixed dark surfaces, and component-specific SCSS. The system is therefore only partially theme-aware. A new semantic token layer should consolidate these parallel sources rather than introduce another theme provider or replace the existing CSS variable architecture wholesale.

## 1. Current theme architecture

The existing implementation is in:

- `src/providers/Theme/index.tsx`
- `src/providers/Theme/shared.ts`
- `src/providers/Theme/types.ts`
- `src/providers/Theme/InitTheme/index.tsx`
- `src/providers/Theme/ThemeSelector/index.tsx`

The current theme type is `'dark' | 'light'`. The selector exposes Auto, Light, and Dark. Explicit preference is stored under `payload-theme`; Auto removes that preference and resolves `prefers-color-scheme`. The default fallback in `shared.ts` is Light. The root document uses `data-theme`.

There are duplicated theme constants/types between `Theme/shared.ts` / `Theme/types.ts` and `ThemeSelector/types.ts`. This is a source-of-truth cleanup candidate for a later implementation phase. Do not add another provider.

## 2. Existing CSS token foundation

`src/app/(frontend)/globals.css` defines Light values in `:root`, Dark overrides under `[data-theme='dark']`, and exposes the values to Tailwind through `@theme inline`. The body uses `bg-background` and `text-foreground`. Most semantic values are expressed in OKLCH.

Existing variable families:

- Core: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`.
- Actions: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`.
- Muted/destructive: `muted`, `muted-foreground`, `destructive`, `destructive-foreground`.
- Structure: `border`, `input`, `ring`.
- Charts: `chart-1` through `chart-5`.
- Sidebar: `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.
- States: `success`, `warning`, `error`.
- Shape: `radius`.
- Brand: `--color-odl: #e94235`.

The current values are transcribed in source at `src/app/(frontend)/globals.css`; this audit intentionally does not restate every OKLCH value as a hex approximation. The existing shadcn-compatible variables should be retained as compatibility mappings where practical.

## 3. Colour inventory and observed drift

GitHub code search across the repository found the following direct utility usage. Counts represent matching files returned by code search, not exact class-instance counts.

| Search pattern | Matching files | Representative surfaces |
|---|---:|---|
| `text-zinc-*` | 64 | Header/footer, rails, MegaMenu, forms, AI, content, error/contact UI |
| `bg-zinc-*` | 26 | Rails, footer, popovers, calendar, forms, AI, error cards |
| `border-zinc-*` | 48 | Rails, MegaMenu, forms, calendar, AI, contact and content blocks |
| `text-white` | 51 | Navigation, heroes, MegaMenu, AI, forms and error UI |
| `bg-black` | 23 | Forms, AI, calendar, code block, footer |
| `text-red-*` / `bg-red-*` | Several | Form errors, service status, error UI |
| `text-amber-*` / `bg-amber-*` | Several | Warnings and service status |
| White/black alpha utilities | Several | Hero overlays, dividers, translucent fills |

The inventory spans `src/Header/`, `src/Footer/`, `src/Rail/`, `src/MegaMenu/`, `src/blocks/Form/`, `src/components/ui/`, `src/components/AI/`, `src/heros/`, `src/blocks/Content/`, `src/components/Contact/`, and frontend error/status pages.

### Brand accent

Production CSS defines `--color-odl: #e94235`; `tailwind.config.mjs` duplicates the same value as `#E94235`. Other values also exist:

- `#ef4444`: red hover/decoration states.
- `#FF3B30`: Stitch design reference and rich-text colour configuration.
- `#E62E24`: Stitch reference hover value.
- Stitch also includes `#FFB4AA`, `#FF5545`, and `#C0000A`.

The production source currently identifies `#E94235` as the OD accent. The Stitch file is exploratory reference material and does not establish a production brand change.

### Other literal values

- `#4B525F`: header/MegaMenu separators.
- `#09090b`: global error background and AI scrollbar track.
- `#0A0A0A`: MegaMenu loading surface.
- `#52525b`: AI scrollbar thumb.
- `#484848`, `#151515`, `#777777`: MegaMenu scrollbar.
- `#F4F4F0`: Introduction hero heading.
- `#f4f4f5`, `#e4e4e7`, `#a1a1aa`, `#d4d4d8`: legal content and supporting text.
- `rgba(255,255,255,0.04)`: table hover treatment.

These require role-based classification; they should not be mechanically replaced with one generic token.

## 4. Surface-by-surface assessment

| Area | Current implementation pattern | Assessment |
|---|---|---|
| Global shell | Semantic variables for body, direct utilities elsewhere | Mixed |
| Header/navigation/footer/rails | Zinc, white, black, literal divider colours | Fixed-dark assumptions |
| MegaMenu | Direct palette classes, loading surface, independent scrollbars | Mixed and locally themed |
| Forms | Black controls, zinc borders/text, brand focus and red errors | Fixed-dark controls |
| UI primitives | Popover/calendar/dialog use direct dark palette | Theme compatibility gap |
| AI workspace | Black surface, white text, zinc borders and fixed scrollbar | Theme behaviour must be decided |
| Legal content | Extensive hardcoded dark SCSS and third-party overrides | High-priority compatibility gap |
| Error/not-found/status | Direct zinc, white, black, red, amber, green | Needs semantic state mapping |
| Content blocks/heroes | Direct palette utilities and alpha overlays | Mixed |
| Code block | Prism `vsDark` | Potential intentional fixed-dark exception |
| Logos/SVG/favicon | Asset-specific fills | Review per asset |
| Email templates | Inline email-safe palette | Keep separate from website theme |
| Payload Admin | `--theme-*` variables | Separate design-system boundary |

## 5. Stylesheet and integration exceptions

- `src/components/LegalContent/index.scss` contains hardcoded dark styling for legal content, Usercentrics output, and Cookiebot declarations. It uses many `!important` overrides and fixed dark table surfaces.
- `globals.css` contains separate hardcoded scrollbar palettes for AI and MegaMenu.
- `src/app/global-error.tsx` is a root-level error document and needs deliberate theme handling.
- `src/components/SizeSlider/**/*.scss` consumes Payload Admin variables such as `--theme-elevation-*` and `--theme-text`; it should not be coupled to frontend tokens by default.
- `src/components/AdminBar/index.scss` imports Payload UI styles.
- `src/email/template.ts` and auth email templates should remain independent from browser theme switching.
- Prism syntax colours, logo assets, third-party embeds, and transparency effects may require explicit exception families.

## 6. Proposed semantic vocabulary for Phase B

Candidate names, not yet approved implementation tokens:

| Role | Candidate tokens |
|---|---|
| Page/surfaces | `background`, `surface`, `surface-raised`, `surface-overlay`, `surface-subtle` |
| Text | `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverted` |
| Borders | `border-subtle`, `border-default`, `border-strong`, `border-interactive` |
| Interaction | `brand`, `brand-hover`, `brand-subtle`, `focus-ring`, `interactive`, `interactive-foreground` |
| Status | `success`, `warning`, `error`, `info` |
| Data visualisation | Separate chart palette with differentiation and contrast requirements |

Tokens should name interface intent, not reproduce a raw shade scale. Existing shadcn variables should be mapped as aliases or compatibility surfaces where appropriate.

## 7. Reference direction

The Stitch reference is preserved at [references/stitch-design.md](references/stitch-design.md). It proposes a blue-black canvas (`#0B0D12`), slate surfaces (`#10131A`, `#161A23`, `#1E2330`), borders (`#262D3D`, `#333C52`), warm off-white text (`#F4F4F0`), and a brighter red (`#FF3B30`). It also proposes steel-blue metadata, amber and green status accents, Source Sans 3 body typography, and a restrained shape/spacing system.

This is a design reference, not proof of current production styling or an approved token map. Phase B must identify which elements are accepted, adapted, or rejected.

## 8. Risks and decisions needed

High-priority risks:
1. Many components bypass theme variables, so Light mode may retain black backgrounds and white text.
2. Legal and consent-provider styling is hardcoded to dark.
3. Brand red is duplicated and has competing reference values.
4. Scrollbar styling is independently hardcoded.
5. Semantic status colours and foreground pairings are not yet governed by one documented system.

Phase B must decide:
- Canonical brand red.
- Whether the Stitch blue-black surface direction is approved.
- Final semantic token names and responsibilities.
- Compatibility mapping for existing shadcn variables.
- Whether AI and code surfaces follow the selected theme or remain intentionally dark.
- Which predefined themes are supported; arbitrary user colour pickers remain out of scope unless explicitly approved.
- Contrast requirements for text, controls, focus indicators, and status badges.
- Explicit boundaries for Payload Admin, email, syntax highlighting, assets, and third-party embeds.

## 9. Audit limitations

This is a static source audit. It does not replace browser testing of every route, responsive viewport, interactive state, or CMS-generated document. Search counts are indicative file coverage, not exact occurrence totals; dynamic class generation and runtime third-party output may not be fully represented. A complete contrast matrix and visual QA have not yet been performed. The directly inspected sources included the theme provider/initializer/selector, `globals.css`, Tailwind config, components configuration, legal SCSS, SizeSlider SCSS, AI workspace, Introduction hero, LayoutClient, root error page, email template, rich-text colour configuration, logo assets, and Stitch reference. The broader utility inventory came from repository code searches.

## 10. Phase A outcome

Phase A establishes that the application has an existing theme foundation worth extending, but semantic coverage is incomplete. No runtime files have been modified. Phase B should approve the vocabulary, theme set, brand direction, and exceptions before implementation begins.
