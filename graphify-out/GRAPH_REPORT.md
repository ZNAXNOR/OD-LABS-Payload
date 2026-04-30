# Graph Report - .  (2026-04-30)

## Corpus Check
- 178 files · ~80,263 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 279 nodes · 158 edges · 10 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Seed Operations|Seed Operations]]
- [[_COMMUNITY_Frontend Client Components|Frontend Client Components]]
- [[_COMMUNITY_Redirects & Document Loading|Redirects & Document Loading]]
- [[_COMMUNITY_Metadata & SEO|Metadata & SEO]]
- [[_COMMUNITY_Plugins & User Utilities|Plugins & User Utilities]]
- [[_COMMUNITY_Link Fields & Deep Merge|Link Fields & Deep Merge]]
- [[_COMMUNITY_Header & Global Data|Header & Global Data]]
- [[_COMMUNITY_Theme Management|Theme Management]]
- [[_COMMUNITY_Media & Image Utilities|Media & Image Utilities]]
- [[_COMMUNITY_Search & Debounce|Search & Debounce]]

## God Nodes (most connected - your core abstractions)
1. `seed()` - 7 edges
2. `useHeaderTheme()` - 5 edges
3. `PayloadRedirects()` - 4 edges
4. `deepMerge()` - 4 edges
5. `generateMeta()` - 4 edges
6. `PageClient()` - 3 edges
7. `link()` - 3 edges
8. `linkGroup()` - 3 edges
9. `getImageURL()` - 3 edges
10. `getServerSideURL()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `seed()`  [INFERRED]
  src\app\(frontend)\next\seed\route.ts → src\endpoints\seed\index.ts
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\posts\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\posts\page\[pageNumber]\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\search\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `seed()` --calls--> `home()`  [INFERRED]
  src\endpoints\seed\index.ts → src\endpoints\seed\home.ts

## Communities

### Community 1 - "Seed Operations"
Cohesion: 0.17
Nodes (7): home(), fetchFileByURL(), seed(), post1(), post2(), post3(), POST()

### Community 2 - "Frontend Client Components"
Cohesion: 0.17
Nodes (5): useHeaderTheme(), PageClient(), PageClient(), PageClient(), PageClient()

### Community 3 - "Redirects & Document Loading"
Cohesion: 0.18
Nodes (4): PayloadRedirects(), NotFound(), getCachedDocument(), getCachedRedirects()

### Community 4 - "Metadata & SEO"
Cohesion: 0.22
Nodes (5): generateMetadata(), generateStaticParams(), generateMeta(), getImageURL(), mergeOpenGraph()

### Community 5 - "Plugins & User Utilities"
Cohesion: 0.25
Nodes (4): generateURL(), getMeUser(), getClientSideURL(), getServerSideURL()

### Community 6 - "Link Fields & Deep Merge"
Cohesion: 0.38
Nodes (4): link(), linkGroup(), deepMerge(), isObject()

### Community 7 - "Header & Global Data"
Cohesion: 0.4
Nodes (2): Header(), getCachedGlobal()

### Community 8 - "Theme Management"
Cohesion: 0.4
Nodes (2): useTheme(), ThemeSelector()

### Community 9 - "Media & Image Utilities"
Cohesion: 0.5
Nodes (2): ImageMedia(), getMediaUrl()

### Community 10 - "Search & Debounce"
Cohesion: 0.5
Nodes (2): Search(), useDebounce()

## Knowledge Gaps
- **Thin community `Header & Global Data`** (5 nodes): `Header()`, `Component.tsx`, `getGlobals.ts`, `getCachedGlobal()`, `getGlobal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Management`** (5 nodes): `index.tsx`, `index.tsx`, `ThemeProvider()`, `useTheme()`, `ThemeSelector()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Media & Image Utilities`** (4 nodes): `ImageMedia()`, `index.tsx`, `getMediaUrl.ts`, `getMediaUrl()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Search & Debounce`** (4 nodes): `Search()`, `Component.tsx`, `useDebounce.ts`, `useDebounce()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 5 inferred relationships involving `seed()` (e.g. with `POST()` and `post1()`) actually correct?**
  _`seed()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useHeaderTheme()` (e.g. with `PageClient()` and `PageClient()`) actually correct?**
  _`useHeaderTheme()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `PayloadRedirects()` (e.g. with `getCachedRedirects()` and `getCachedDocument()`) actually correct?**
  _`PayloadRedirects()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `deepMerge()` (e.g. with `link()` and `linkGroup()`) actually correct?**
  _`deepMerge()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `generateMeta()` (e.g. with `generateMetadata()` and `mergeOpenGraph()`) actually correct?**
  _`generateMeta()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Core App & Payload Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._