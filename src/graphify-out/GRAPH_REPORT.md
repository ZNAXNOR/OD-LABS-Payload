# Graph Report - src  (2026-05-08)

## Corpus Check
- 190 files · ~98,518 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 163 edges · 10 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `seed()` - 7 edges
2. `useHeaderTheme()` - 5 edges
3. `deepMerge()` - 5 edges
4. `PayloadRedirects()` - 4 edges
5. `generateMeta()` - 4 edges
6. `PageClient()` - 3 edges
7. `link()` - 3 edges
8. `linkGroup()` - 3 edges
9. `getImageURL()` - 3 edges
10. `getServerSideURL()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `seed()`  [INFERRED]
  app\(frontend)\next\seed\route.ts → endpoints\seed\index.ts
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  app\(frontend)\posts\page.client.tsx → providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  app\(frontend)\posts\page\[pageNumber]\page.client.tsx → providers\HeaderTheme\index.tsx
- `PageClient()` --calls--> `useHeaderTheme()`  [INFERRED]
  app\(frontend)\search\page.client.tsx → providers\HeaderTheme\index.tsx
- `seed()` --calls--> `home()`  [INFERRED]
  endpoints\seed\index.ts → endpoints\seed\home.ts

## Communities

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (7): home(), fetchFileByURL(), seed(), post1(), post2(), post3(), POST()

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (5): useHeaderTheme(), PageClient(), PageClient(), PageClient(), PageClient()

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (4): PayloadRedirects(), NotFound(), getCachedDocument(), getCachedRedirects()

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (5): generateMetadata(), generateStaticParams(), generateMeta(), getImageURL(), mergeOpenGraph()

### Community 5 - "Community 5"
Cohesion: 0.28
Nodes (5): link(), linkGroup(), pdfLink(), deepMerge(), isObject()

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (4): generateURL(), getMeUser(), getClientSideURL(), getServerSideURL()

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (2): useTheme(), ThemeSelector()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (2): Header(), getCachedGlobal()

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (2): ImageMedia(), getMediaUrl()

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (2): Search(), useDebounce()

## Knowledge Gaps
- **Thin community `Community 7`** (5 nodes): `index.tsx`, `index.tsx`, `ThemeProvider()`, `useTheme()`, `ThemeSelector()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (5 nodes): `Header()`, `Component.tsx`, `getCachedGlobal()`, `getGlobal()`, `getGlobals.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (4 nodes): `index.tsx`, `ImageMedia()`, `getMediaUrl()`, `getMediaUrl.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (4 nodes): `Search()`, `Component.tsx`, `useDebounce.ts`, `useDebounce()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 5 inferred relationships involving `seed()` (e.g. with `POST()` and `post1()`) actually correct?**
  _`seed()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useHeaderTheme()` (e.g. with `PageClient()` and `PageClient()`) actually correct?**
  _`useHeaderTheme()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `deepMerge()` (e.g. with `link()` and `linkGroup()`) actually correct?**
  _`deepMerge()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `PayloadRedirects()` (e.g. with `getCachedRedirects()` and `getCachedDocument()`) actually correct?**
  _`PayloadRedirects()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `generateMeta()` (e.g. with `generateMetadata()` and `mergeOpenGraph()`) actually correct?**
  _`generateMeta()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._