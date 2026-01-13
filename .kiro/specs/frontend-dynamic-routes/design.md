# Design Document: Frontend Dynamic Routes

## Overview

This design implements Next.js dynamic routes to render PayloadCMS collection pages on the frontend. Each collection (Pages, Legal, Services, Blogs, Contacts) will have its own dynamic route that fetches content from Payload and renders it with proper SEO metadata and draft mode support.

## Architecture

### Route Structure

```
app/(frontend)/
├── [slug]/
│   └── page.tsx              # Main pages (About, Contact, etc.)
├── legal/
│   └── [slug]/
│       └── page.tsx          # Legal pages (Privacy, Terms, etc.)
├── services/
│   └── [slug]/
│       └── page.tsx          # Service pages
├── blogs/
│   └── [slug]/
│       └── page.tsx          # Blog posts
└── contacts/
    └── [slug]/
        └── page.tsx          # Contact pages
```

### Data Flow

1. User requests URL (e.g., `/legal/privacy-policy`)
2. Next.js matches dynamic route (`legal/[slug]/page.tsx`)
3. Route extracts slug from params
4. Payload query fetches document by slug
5. If found: Render page with content
6. If not found: Return 404

## Components and Interfaces

### Dynamic Page Template

Each dynamic route follows this pattern:

```typescript
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'legal', // or 'services', 'blogs', etc.
    limit: 1000,
    where: {
      _status: { equals: 'published' },
    },
  })

  return pages.docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  
  const payload = await getPayload({ config })
  const page = await payload.find({
    collection: 'legal',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  if (!page.docs[0]) return {}

  const doc = page.docs[0]
  return {
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description,
    openGraph: {
      title: doc.meta?.title || doc.title,
      description: doc.meta?.description,
      images: doc.meta?.image ? [{ url: doc.meta.image.url }] : [],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'legal',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  if (!result.docs[0]) {
    notFound()
  }

  const page = result.docs[0]

  return (
    <article className="container py-16">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose max-w-none">
        {/* Render content - will need RichText component */}
        {page.content && <RichText content={page.content} />}
      </div>
    </article>
  )
}
```

### RichText Component

For rendering Lexical content:

```typescript
import { SerializedEditorState } from 'lexical'

interface RichTextProps {
  content: SerializedEditorState
}

export function RichText({ content }: RichTextProps) {
  // Use @payloadcms/richtext-lexical/react for rendering
  return <div>{/* Render lexical content */}</div>
}
```

### RenderBlocks Component (for Pages collection)

```typescript
import type { Page } from '@/payload-types'

interface RenderBlocksProps {
  blocks: Page['layout']
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  return (
    <>
      {blocks?.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={index} {...block} />
          case 'content':
            return <ContentBlock key={index} {...block} />
          case 'cta':
            return <CTABlock key={index} {...block} />
          case 'mediaBlock':
            return <MediaBlock key={index} {...block} />
          case 'archive':
            return <ArchiveBlock key={index} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
```

## Data Models

### Query Response Structure

```typescript
interface QueryResult<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
```

## Error Handling

### 404 Handling

```typescript
if (!result.docs[0]) {
  notFound() // Triggers Next.js 404 page
}
```

### Draft Mode Errors

```typescript
try {
  const { isEnabled: draft } = await draftMode()
} catch (error) {
  console.error('Draft mode error:', error)
  // Fall back to published content
  const draft = false
}
```

## Testing Strategy

### Manual Testing Checklist

1. Create test pages in each collection via admin panel
2. Visit URLs and verify pages render correctly
3. Test 404 for non-existent slugs
4. Test draft mode preview
5. Verify SEO metadata in page source
6. Test static generation with `pnpm build`

### Integration Tests

- Test each dynamic route with valid and invalid slugs
- Test draft mode toggle
- Test metadata generation
- Test static params generation
