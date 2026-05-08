# Graph Report - src  (2026-05-08)

## Corpus Check
- 194 files · ~98,518 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 491 nodes · 273 edges · 95 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Next.js App Router Routes|Next.js App Router Routes]]
- [[_COMMUNITY_Page Rendering and Metadata|Page Rendering and Metadata]]
- [[_COMMUNITY_Seed Data and Image Entities|Seed Data and Image Entities]]
- [[_COMMUNITY_Client-side Components and Hooks|Client-side Components and Hooks]]
- [[_COMMUNITY_Payload CMS Blocks and Components|Payload CMS Blocks and Components]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 179|Community 179]]
- [[_COMMUNITY_Community 180|Community 180]]
- [[_COMMUNITY_Community 181|Community 181]]
- [[_COMMUNITY_Community 182|Community 182]]
- [[_COMMUNITY_Community 183|Community 183]]
- [[_COMMUNITY_Community 184|Community 184]]
- [[_COMMUNITY_Community 185|Community 185]]
- [[_COMMUNITY_Community 186|Community 186]]
- [[_COMMUNITY_Community 187|Community 187]]
- [[_COMMUNITY_Community 188|Community 188]]
- [[_COMMUNITY_Community 189|Community 189]]
- [[_COMMUNITY_Community 190|Community 190]]
- [[_COMMUNITY_Community 191|Community 191]]
- [[_COMMUNITY_Community 192|Community 192]]
- [[_COMMUNITY_Community 193|Community 193]]
- [[_COMMUNITY_Community 194|Community 194]]
- [[_COMMUNITY_Community 195|Community 195]]
- [[_COMMUNITY_Community 196|Community 196]]
- [[_COMMUNITY_Community 197|Community 197]]
- [[_COMMUNITY_Community 198|Community 198]]
- [[_COMMUNITY_Community 199|Community 199]]
- [[_COMMUNITY_Community 200|Community 200]]
- [[_COMMUNITY_Community 201|Community 201]]
- [[_COMMUNITY_Community 202|Community 202]]
- [[_COMMUNITY_Community 203|Community 203]]
- [[_COMMUNITY_Community 204|Community 204]]
- [[_COMMUNITY_Community 205|Community 205]]
- [[_COMMUNITY_Community 206|Community 206]]
- [[_COMMUNITY_Community 207|Community 207]]
- [[_COMMUNITY_Community 208|Community 208]]
- [[_COMMUNITY_Community 209|Community 209]]
- [[_COMMUNITY_Community 210|Community 210]]
- [[_COMMUNITY_Community 211|Community 211]]
- [[_COMMUNITY_Community 212|Community 212]]
- [[_COMMUNITY_Community 213|Community 213]]
- [[_COMMUNITY_Community 214|Community 214]]
- [[_COMMUNITY_Community 215|Community 215]]
- [[_COMMUNITY_Community 216|Community 216]]
- [[_COMMUNITY_Community 217|Community 217]]
- [[_COMMUNITY_Community 218|Community 218]]
- [[_COMMUNITY_Community 219|Community 219]]
- [[_COMMUNITY_Community 220|Community 220]]
- [[_COMMUNITY_Community 221|Community 221]]
- [[_COMMUNITY_Community 222|Community 222]]
- [[_COMMUNITY_Community 223|Community 223]]
- [[_COMMUNITY_Community 224|Community 224]]
- [[_COMMUNITY_Community 225|Community 225]]
- [[_COMMUNITY_Community 226|Community 226]]
- [[_COMMUNITY_Community 227|Community 227]]
- [[_COMMUNITY_Community 228|Community 228]]
- [[_COMMUNITY_Community 229|Community 229]]
- [[_COMMUNITY_Community 230|Community 230]]
- [[_COMMUNITY_Community 231|Community 231]]
- [[_COMMUNITY_Community 232|Community 232]]

## God Nodes (most connected - your core abstractions)
1. `seed()` - 7 edges
2. `Form Field Width Wrapper` - 7 edges
3. `Form Error Component` - 6 edges
4. `useHeaderTheme()` - 5 edges
5. `deepMerge()` - 5 edges
6. `seed` - 5 edges
7. `PageClient()` - 4 edges
8. `PayloadRedirects()` - 4 edges
9. `generateMeta()` - 4 edges
10. `RenderBlocks` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  app\(frontend)\search\page.client.tsx → providers\HeaderTheme\index.tsx
- `seed()` --calls--> `home()`  [INFERRED]
  endpoints\seed\index.ts → endpoints\seed\home.ts
- `seed()` --calls--> `post1()`  [INFERRED]
  endpoints\seed\index.ts → endpoints\seed\post-1.ts
- `seed()` --calls--> `post2()`  [INFERRED]
  endpoints\seed\index.ts → endpoints\seed\post-2.ts
- `seed()` --calls--> `post3()`  [INFERRED]
  endpoints\seed\index.ts → endpoints\seed\post-3.ts

## Hyperedges (group relationships)
- **Block Rendering System** — renderblocks_renderblocks, archiveblock_archiveblock, banner_bannerblock, accordion_accordionblock [INFERRED 0.90]
- **Payload CMS Blocks** — config_calltoaction, config_code, config_comparison, config_content, config_formblock [INFERRED 0.90]
- **Form Builder Block Set** — index_email, index_number, index_select, index_state, index_text, index_textarea, index_message [EXTRACTED 1.00]
- **Seed Data Components** — contact_form_contactform, contact_page_contact, home_static_homestatic, home_home, image_1_image1, image_2_image2 [INFERRED 0.90]
- **Shadcn UI Components** — accordion_accordion, alert_alert, badge_badge, button_button, card_card, checkbox_checkbox, input_input, label_label, pagination_uipagination, progress_progress, select_select, separator_separator, textarea_textarea [INFERRED 0.95]

## Communities

### Community 0 - "Next.js App Router Routes"
Cohesion: 0.06
Nodes (6): Header(), PayloadRedirects(), NotFound(), getCachedDocument(), getCachedGlobal(), getCachedRedirects()

### Community 1 - "Page Rendering and Metadata"
Cohesion: 0.12
Nodes (9): generateURL(), generateMetadata(), generateStaticParams(), generateMeta(), getImageURL(), getMeUser(), getClientSideURL(), getServerSideURL() (+1 more)

### Community 2 - "Seed Data and Image Entities"
Cohesion: 0.12
Nodes (12): imageHero1, post1, post2, post3, home(), fetchFileByURL(), seed(), post1() (+4 more)

### Community 3 - "Client-side Components and Hooks"
Cohesion: 0.12
Nodes (10): useHeaderTheme(), PageClient(), Page (PageNumber), posts, PageClient(), Page (Posts), getPostsSitemap, PageClient() (+2 more)

### Community 4 - "Payload CMS Blocks and Components"
Cohesion: 0.12
Nodes (16): Accordion Block, Archive Block Router, Banner Block Router, Default Archive Block, Home Page Seed, Icon Banner Variant, Image 1 Seed, Image 2 Seed (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.36
Nodes (10): Email Form Block, Form Error Component, Message Form Block, Number Form Block, Select Form Block, State Selector Form Block, Text Form Block, Textarea Form Block (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.28
Nodes (5): link(), linkGroup(), pdfLink(), deepMerge(), isObject()

### Community 7 - "Community 7"
Cohesion: 0.32
Nodes (8): src/collections/Media.ts, src/collections/Pages/hooks/revalidatePage.ts, src/collections/Pages/index.ts, src/collections/Posts/hooks/populateAuthors.ts, src/collections/Posts/hooks/revalidatePost.ts, src/collections/Posts/index.ts, src/collections/Users/index.ts, src/components/Link/index.tsx

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (6): CallToActionBlock, ContentBlock, CallToAction, Content, LargeCTA, SmallCTA

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (6): FormBlock, FormBlock, fields, Checkbox, Country, countryOptions

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (4): revalidateRedirects(), plugins, beforeSyncWithSearch(), searchFields

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): HeaderThemeProvider, Providers(), ThemeProvider, themeUtils, ThemeSelector

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (2): useTheme(), ThemeSelector()

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (5): src/components/Card/index.tsx, src/components/CollectionArchive/index.tsx, src/components/Media/ImageMedia/index.tsx, src/components/Media/VideoMedia/index.tsx, src/components/Media/index.tsx

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (5): getCachedDocument, getDocument, getCachedRedirects, getRedirects, PayloadRedirects

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (2): ImageMedia(), getMediaUrl()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (2): Search(), useDebounce()

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (4): Code, CodeBlock, Code, CopyButton

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (4): DefaultHero, MediumImpactHero, RightPanel, SidePanelHero

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (4): generateMeta, getImageURL, getServerSideURL, mergeOpenGraph

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (3): Button UI, Pagination Component, Pagination UI

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (3): hero, link, linkGroup

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (3): HeaderClient, Header, HeaderNav

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (3): canUseDOM, getMeUser, getClientSideURL

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (2): getPagesSitemap, pages

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (2): Payload Config, Config

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (2): Payload Import Map, Payload Root Layout

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (2): ComparisonBlockComponent, Comparison

### Community 81 - "Community 81"
Cohesion: 1.0
Nodes (2): Media Block Component, Media Block Configuration

### Community 82 - "Community 82"
Cohesion: 1.0
Nodes (2): Metrics Strip Component, Metrics Strip Configuration

### Community 83 - "Community 83"
Cohesion: 1.0
Nodes (2): Pricing Block Component, Pricing Block Configuration

### Community 84 - "Community 84"
Cohesion: 1.0
Nodes (2): Process Block Component, Process Block Configuration

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (2): Typography Block Component, Typography Block Configuration

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (2): src/components/BeforeDashboard/SeedButton/index.tsx, src/components/BeforeDashboard/index.tsx

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (2): Contact Form Seed, Contact Page Seed

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (2): Footer, revalidateFooter

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (2): Header, revalidateHeader

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (2): HighImpactHero, RenderHero

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (2): sync_cta_changes, migrations

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (2): deepMerge, isObject

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (2): getCachedGlobal, getGlobal

### Community 179 - "Community 179"
Cohesion: 1.0
Nodes (1): cssVariables

### Community 180 - "Community 180"
Cohesion: 1.0
Nodes (1): ProcessEnv

### Community 181 - "Community 181"
Cohesion: 1.0
Nodes (1): anyone

### Community 182 - "Community 182"
Cohesion: 1.0
Nodes (1): authenticated

### Community 183 - "Community 183"
Cohesion: 1.0
Nodes (1): authenticatedOrPublished

### Community 184 - "Community 184"
Cohesion: 1.0
Nodes (1): RootLayout

### Community 185 - "Community 185"
Cohesion: 1.0
Nodes (1): NotFound

### Community 186 - "Community 186"
Cohesion: 1.0
Nodes (1): PageTemplate

### Community 187 - "Community 187"
Cohesion: 1.0
Nodes (1): generateMetadata (Search)

### Community 188 - "Community 188"
Cohesion: 1.0
Nodes (1): generateStaticParams

### Community 189 - "Community 189"
Cohesion: 1.0
Nodes (1): queryPageBySlug

### Community 190 - "Community 190"
Cohesion: 1.0
Nodes (1): Admin Root Page

### Community 191 - "Community 191"
Cohesion: 1.0
Nodes (1): Accordion Config

### Community 192 - "Community 192"
Cohesion: 1.0
Nodes (1): Archive Config

### Community 193 - "Community 193"
Cohesion: 1.0
Nodes (1): Banner Config

### Community 194 - "Community 194"
Cohesion: 1.0
Nodes (1): WarningBlock

### Community 195 - "Community 195"
Cohesion: 1.0
Nodes (1): image-post1

### Community 196 - "Community 196"
Cohesion: 1.0
Nodes (1): image-post2

### Community 197 - "Community 197"
Cohesion: 1.0
Nodes (1): image-post3

### Community 198 - "Community 198"
Cohesion: 1.0
Nodes (1): Related Posts Component

### Community 199 - "Community 199"
Cohesion: 1.0
Nodes (1): Categories Collection

### Community 200 - "Community 200"
Cohesion: 1.0
Nodes (1): src/components/AdminBar/index.tsx

### Community 201 - "Community 201"
Cohesion: 1.0
Nodes (1): src/components/BeforeLogin/index.tsx

### Community 202 - "Community 202"
Cohesion: 1.0
Nodes (1): src/components/ExclusiveCheckbox/index.tsx

### Community 203 - "Community 203"
Cohesion: 1.0
Nodes (1): src/components/LivePreviewListener/index.tsx

### Community 204 - "Community 204"
Cohesion: 1.0
Nodes (1): src/components/Logo/Logo.tsx

### Community 205 - "Community 205"
Cohesion: 1.0
Nodes (1): src/components/PageRange/index.tsx

### Community 206 - "Community 206"
Cohesion: 1.0
Nodes (1): Alert UI

### Community 207 - "Community 207"
Cohesion: 1.0
Nodes (1): Badge UI

### Community 208 - "Community 208"
Cohesion: 1.0
Nodes (1): Card UI

### Community 209 - "Community 209"
Cohesion: 1.0
Nodes (1): Checkbox UI

### Community 210 - "Community 210"
Cohesion: 1.0
Nodes (1): Input UI

### Community 211 - "Community 211"
Cohesion: 1.0
Nodes (1): Label UI

### Community 212 - "Community 212"
Cohesion: 1.0
Nodes (1): Progress UI

### Community 213 - "Community 213"
Cohesion: 1.0
Nodes (1): Select UI

### Community 214 - "Community 214"
Cohesion: 1.0
Nodes (1): Separator UI

### Community 215 - "Community 215"
Cohesion: 1.0
Nodes (1): Textarea UI

### Community 216 - "Community 216"
Cohesion: 1.0
Nodes (1): Home Static Seed

### Community 217 - "Community 217"
Cohesion: 1.0
Nodes (1): defaultLexical

### Community 218 - "Community 218"
Cohesion: 1.0
Nodes (1): pdfLink

### Community 219 - "Community 219"
Cohesion: 1.0
Nodes (1): Footer

### Community 220 - "Community 220"
Cohesion: 1.0
Nodes (1): RowLabel

### Community 221 - "Community 221"
Cohesion: 1.0
Nodes (1): LowImpactHero

### Community 222 - "Community 222"
Cohesion: 1.0
Nodes (1): PostHero

### Community 223 - "Community 223"
Cohesion: 1.0
Nodes (1): InitTheme

### Community 224 - "Community 224"
Cohesion: 1.0
Nodes (1): formatAuthors

### Community 225 - "Community 225"
Cohesion: 1.0
Nodes (1): formatDateTime

### Community 226 - "Community 226"
Cohesion: 1.0
Nodes (1): generatePreviewPath

### Community 227 - "Community 227"
Cohesion: 1.0
Nodes (1): getMediaUrl

### Community 228 - "Community 228"
Cohesion: 1.0
Nodes (1): defaultOpenGraph

### Community 229 - "Community 229"
Cohesion: 1.0
Nodes (1): toKebabCase

### Community 230 - "Community 230"
Cohesion: 1.0
Nodes (1): cn

### Community 231 - "Community 231"
Cohesion: 1.0
Nodes (1): useClickableCard

### Community 232 - "Community 232"
Cohesion: 1.0
Nodes (1): useDebounce

## Knowledge Gaps
- **123 isolated node(s):** `cssVariables`, `ProcessEnv`, `pages`, `Config`, `Payload Config` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 12`** (5 nodes): `index.tsx`, `index.tsx`, `ThemeProvider()`, `useTheme()`, `ThemeSelector()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `index.tsx`, `ImageMedia()`, `getMediaUrl()`, `getMediaUrl.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `Search()`, `Component.tsx`, `useDebounce.ts`, `useDebounce()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (2 nodes): `getPagesSitemap`, `pages`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `Payload Config`, `Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `Payload Import Map`, `Payload Root Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `ComparisonBlockComponent`, `Comparison`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `Media Block Component`, `Media Block Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (2 nodes): `Metrics Strip Component`, `Metrics Strip Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `Pricing Block Component`, `Pricing Block Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (2 nodes): `Process Block Component`, `Process Block Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `Typography Block Component`, `Typography Block Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `src/components/BeforeDashboard/SeedButton/index.tsx`, `src/components/BeforeDashboard/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `Contact Form Seed`, `Contact Page Seed`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (2 nodes): `Footer`, `revalidateFooter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `Header`, `revalidateHeader`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (2 nodes): `HighImpactHero`, `RenderHero`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (2 nodes): `sync_cta_changes`, `migrations`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (2 nodes): `deepMerge`, `isObject`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (2 nodes): `getCachedGlobal`, `getGlobal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 179`** (1 nodes): `cssVariables`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 180`** (1 nodes): `ProcessEnv`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 181`** (1 nodes): `anyone`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 182`** (1 nodes): `authenticated`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 183`** (1 nodes): `authenticatedOrPublished`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `RootLayout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 185`** (1 nodes): `NotFound`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 186`** (1 nodes): `PageTemplate`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 187`** (1 nodes): `generateMetadata (Search)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 188`** (1 nodes): `generateStaticParams`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 189`** (1 nodes): `queryPageBySlug`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 190`** (1 nodes): `Admin Root Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 191`** (1 nodes): `Accordion Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 192`** (1 nodes): `Archive Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 193`** (1 nodes): `Banner Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 194`** (1 nodes): `WarningBlock`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 195`** (1 nodes): `image-post1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 196`** (1 nodes): `image-post2`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 197`** (1 nodes): `image-post3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 198`** (1 nodes): `Related Posts Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 199`** (1 nodes): `Categories Collection`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 200`** (1 nodes): `src/components/AdminBar/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 201`** (1 nodes): `src/components/BeforeLogin/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 202`** (1 nodes): `src/components/ExclusiveCheckbox/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 203`** (1 nodes): `src/components/LivePreviewListener/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 204`** (1 nodes): `src/components/Logo/Logo.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 205`** (1 nodes): `src/components/PageRange/index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 206`** (1 nodes): `Alert UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 207`** (1 nodes): `Badge UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 208`** (1 nodes): `Card UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 209`** (1 nodes): `Checkbox UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 210`** (1 nodes): `Input UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 211`** (1 nodes): `Label UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 212`** (1 nodes): `Progress UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 213`** (1 nodes): `Select UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 214`** (1 nodes): `Separator UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 215`** (1 nodes): `Textarea UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 216`** (1 nodes): `Home Static Seed`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 217`** (1 nodes): `defaultLexical`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 218`** (1 nodes): `pdfLink`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 219`** (1 nodes): `Footer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 220`** (1 nodes): `RowLabel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 221`** (1 nodes): `LowImpactHero`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 222`** (1 nodes): `PostHero`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 223`** (1 nodes): `InitTheme`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 224`** (1 nodes): `formatAuthors`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 225`** (1 nodes): `formatDateTime`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 226`** (1 nodes): `generatePreviewPath`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 227`** (1 nodes): `getMediaUrl`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 228`** (1 nodes): `defaultOpenGraph`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 229`** (1 nodes): `toKebabCase`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 230`** (1 nodes): `cn`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 231`** (1 nodes): `useClickableCard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 232`** (1 nodes): `useDebounce`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 5 inferred relationships involving `seed()` (e.g. with `POST()` and `post1()`) actually correct?**
  _`seed()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useHeaderTheme()` (e.g. with `PageClient()` and `PageClient()`) actually correct?**
  _`useHeaderTheme()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `deepMerge()` (e.g. with `link()` and `linkGroup()`) actually correct?**
  _`deepMerge()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `cssVariables`, `ProcessEnv`, `pages` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Next.js App Router Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Page Rendering and Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Seed Data and Image Entities` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._