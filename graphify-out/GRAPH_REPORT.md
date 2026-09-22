# Graph Report - OD-LABS-Payload  (2026-09-22)

## Corpus Check
- 193 files · ~104,351 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 323 nodes · 184 edges · 12 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `seed()` - 7 edges
2. `useHeaderTheme()` - 5 edges
3. `PayloadRedirects()` - 4 edges
4. `deepMerge()` - 4 edges
5. `generateMeta()` - 4 edges
6. `PageClient()` - 3 edges
7. `SizeSliderField()` - 3 edges
8. `normalizeValue()` - 3 edges
9. `link()` - 3 edges
10. `linkGroup()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `seed()`  [INFERRED]
  src\app\(frontend)\next\seed\route.ts → src\endpoints\seed\index.ts
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\posts\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\posts\page\[pageNumber]\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  src\app\(frontend)\search\page.client.tsx → src\providers\HeaderTheme\index.tsx
- `generateMetadata()` --calls--> `generateMeta()`  [INFERRED]
  src\app\(frontend)\[slug]\page.tsx → src\utilities\generateMeta.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (2): generateMetadata(), generateStaticParams()

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (7): home(), fetchFileByURL(), seed(), post1(), post2(), post3(), POST()

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (7): generateURL(), generateMeta(), getImageURL(), getMeUser(), getClientSideURL(), getServerSideURL(), mergeOpenGraph()

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (5): useHeaderTheme(), PageClient(), PageClient(), PageClient(), PageClient()

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (4): PayloadRedirects(), NotFound(), getCachedDocument(), getCachedRedirects()

### Community 5 - "Community 5"
Cohesion: 0.38
Nodes (4): link(), linkGroup(), deepMerge(), isObject()

### Community 6 - "Community 6"
Cohesion: 0.47
Nodes (4): SizeSliderField(), findNearestVisiblePoint(), getVisiblePoints(), normalizeValue()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (2): LayoutClientContent(), useMegaMenu()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (2): Header(), getCachedGlobal()

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (2): useTheme(), ThemeSelector()

### Community 11 - "Community 11"
Cohesion: 0.5
Nodes (2): Search(), useDebounce()

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (2): ImageMedia(), getMediaUrl()

## Knowledge Gaps
- **Thin community `Community 0`** (30 nodes): `cleanupTestUser()`, `seedTestUser()`, `getMegaMenuData()`, `getPageHref()`, `GET()`, `Layout()`, `GET()`, `GET()`, `generateMetadata()`, `Page()`, `generateMetadata()`, `generateStaticParams()`, `Page()`, `route.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `route.ts`, `route.ts`, `page.tsx`, `page.tsx`, `route.ts`, `route.ts`, `route.ts`, `layout.tsx`, `Component.tsx`, `getMegaMenuData.ts`, `payload.config.ts`, `seedUser.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (6 nodes): `LayoutClient()`, `LayoutClientContent()`, `MegaMenuProvider()`, `useMegaMenu()`, `LayoutClient.tsx`, `index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (5 nodes): `Header()`, `Component.tsx`, `getGlobals.ts`, `getCachedGlobal()`, `getGlobal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (5 nodes): `index.tsx`, `index.tsx`, `ThemeProvider()`, `useTheme()`, `ThemeSelector()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (4 nodes): `Search()`, `Component.tsx`, `useDebounce.ts`, `useDebounce()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (4 nodes): `ImageMedia()`, `index.tsx`, `getMediaUrl.ts`, `getMediaUrl()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `generateMetadata()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `generateMeta()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
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