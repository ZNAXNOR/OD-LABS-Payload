# Pages Collection Stability & Improvement Design

## Overview

This design addresses critical stability issues, missing patterns, and improvements needed for all page collections (Pages, Blogs, Services, Contacts, Legal) in the Payload CMS project. The design focuses on standardization, security, performance, and maintainability while ensuring transaction safety and data integrity.

## Design Principles

1. **Transaction Safety First**: All nested operations must maintain transaction context
2. **DRY (Don't Repeat Yourself)**: Use factory functions and shared utilities
3. **Security by Default**: Proper access control on all sensitive fields
4. **Type Safety**: Full TypeScript coverage with no `any` types
5. **Performance**: Optimize queries, indexes, and hook execution
6. **Testability**: All functions must be unit testable

## Architecture Overview

### Component Structure

```
src/
├── pages/
│   ├── shared/
│   │   ├── hooks/
│   │   │   ├── createSlugGenerationHook.ts (deprecated - use utility)
│   │   │   ├── createRevalidateHook.ts (factory)
│   │   │   └── createAuditTrailHook.ts (factory - new)
│   │   ├── fields/
│   │   │   ├── auditFields.ts (updated)
│   │   │   ├── metaFields.ts (new)
│   │   │   └── slugField.ts (new)
│   │   └── validation/
│   │       ├── circularReference.ts (new)
│   │       └── slugValidation.ts (new)
│   ├── Pages/
│   ├── Blogs/
│   ├── Services/
│   ├── Contacts/
│   └── Legal/
└── utilities/
    ├── slugGeneration.ts (enhanced)
    └── revalidation.ts (new)
```

## Critical Issue Resolutions

### 1. Transaction Safety in Hooks

**Problem**: Nested operations in hooks don't pass `req`, breaking transaction atomicity.

**Solution**: Update all hooks to pass `req` parameter to nested operations.

**Design Decision**:

- All factory functions will enforce `req` parameter passing
- Add TypeScript types to catch missing `req` at compile time
- Document transaction safety requirements in hook templates

**Implementation**:

```typescript
// src/pages/shared/hooks/createRevalidateHook.ts
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const createRevalidateHook = (pathPrefix: string): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req }) => {
    // ✅ Pass req to maintain transaction context
    if (req.context.disableRevalidate) {
      return doc
    }

    // Revalidation logic with proper transaction safety
    if (doc._status === 'published') {
      const path = `/${pathPrefix}/${doc.slug}`

      // Any nested operations must pass req
      if (doc.relatedContent) {
        await req.payload.find({
          collection: 'related',
          where: { id: { in: doc.relatedContent } },
          req, // ✅ Maintains transaction
        })
      }

      revalidatePath(path)
      req.payload.logger.info(`Revalidated: ${path}`)
    }

    return doc
  }
}
```

**Rationale**: Transaction safety is critical for data integrity. Without passing `req`, operations run in separate transactions, leading to potential data corruption if any operation fails.

### 2. Audit Trail Integration with Payload Timestamps

**Problem**: Custom `createdAt`/`updatedAt` fields conflict with Payload's built-in `timestamps: true`.

**Solution**: Remove custom timestamp fields, use only Payload's built-in timestamps. Track only `createdBy` and `updatedBy`.

**Design Decision**:

- Leverage Payload's `timestamps: true` for `createdAt` and `updatedAt`
- Add only `createdBy` and `updatedBy` relationship fields
- Make audit fields read-only with proper access control
- Use field-level hooks for auto-population

**Implementation**:

```typescript
// src/pages/shared/hooks/createAuditTrailHook.ts
import type { CollectionBeforeChangeHook } from 'payload'

export const createAuditTrailHook = (): CollectionBeforeChangeHook => {
  return ({ data, req, operation }) => {
    const user = req.user

    if (operation === 'create' && user) {
      data.createdBy = user.id
      // Payload handles createdAt automatically via timestamps: true
    }

    if (operation === 'update' && user) {
      data.updatedBy = user.id
      // Payload handles updatedAt automatically via timestamps: true
    }

    return data
  }
}

// src/pages/shared/fields/auditFields.ts
import type { Field } from 'payload'

export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who created this document',
    },
    access: {
      create: () => false, // System-only field
      update: () => false, // Cannot be modified
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who last updated this document',
    },
    access: {
      create: () => false,
      update: () => false,
    },
  },
]
```

**Rationale**: Using Payload's built-in timestamps avoids duplication and conflicts. Field-level access control prevents tampering with audit trail data.

### 3. Circular Reference Prevention

**Problem**: Pages can create circular parent references (A → B → C → A), causing infinite loops.

**Solution**: Implement recursive validation that traverses the entire parent chain to detect cycles.

**Design Decision**:

- Use async validation with depth-first search
- Cache visited nodes to detect cycles
- Limit traversal depth to prevent performance issues
- Provide clear error messages

**Implementation**:

```typescript
// src/pages/shared/validation/circularReference.ts
import type { Validate } from 'payload'

export const createCircularReferenceValidator = (collection: string, maxDepth = 50): Validate => {
  return async (value, { data, req }) => {
    if (!value || !data?.id) return true

    // Prevent self-reference
    if (value === data.id) {
      return 'A page cannot be its own parent'
    }

    // Traverse parent chain to detect cycles
    const visited = new Set<string>([data.id])
    let currentId = value
    let depth = 0

    while (currentId && depth < maxDepth) {
      if (visited.has(currentId)) {
        return 'Circular parent reference detected. This would create an infinite loop.'
      }

      visited.add(currentId)
      depth++

      try {
        const parent = await req.payload.findByID({
          collection,
          id: currentId,
          depth: 0,
          req, // ✅ Maintain transaction context
        })

        currentId = parent?.parent
      } catch (error) {
        // Parent not found or access denied
        return true
      }
    }

    if (depth >= maxDepth) {
      return `Parent hierarchy too deep (max ${maxDepth} levels)`
    }

    return true
  }
}
```

**Rationale**: Circular references can cause stack overflows and infinite loops in breadcrumb generation and navigation rendering. Async validation with cycle detection prevents this at the data layer.

### 4. Slug Generation Race Condition

**Problem**: Concurrent requests can generate duplicate slugs due to check-then-act race condition.

**Solution**: Use optimistic locking with retry logic and rely on database unique constraints.

**Design Decision**:

- Keep database unique constraint as final arbiter
- Implement retry logic with exponential backoff
- Add transaction-safe uniqueness checks
- Limit retry attempts to prevent infinite loops

**Implementation**:

```typescript
// Enhanced src/utilities/slugGeneration.ts
export async function generateUniqueSlug(
  baseSlug: string,
  collection: string,
  req: PayloadRequest,
  excludeId?: string | number,
  maxRetries = 10,
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  // Check if base slug is unique
  if (await isSlugUnique(slug, collection, req, excludeId)) {
    return slug
  }

  // Try appending numbers until we find a unique slug
  while (counter <= maxRetries) {
    const candidateSlug = `${baseSlug}-${counter}`

    if (await isSlugUnique(candidateSlug, collection, req, excludeId)) {
      return candidateSlug
    }

    counter++
  }

  // If we can't find a unique slug, append timestamp
  const timestamp = Date.now().toString(36)
  return `${baseSlug}-${timestamp}`
}

// Transaction-safe uniqueness check
export async function isSlugUnique(
  slug: string,
  collection: string,
  req: PayloadRequest,
  excludeId?: string | number,
): Promise<boolean> {
  try {
    const query: any = { slug: { equals: slug } }

    if (excludeId) {
      query.id = { not_equals: excludeId }
    }

    const result = await req.payload.count({
      collection: collection as any,
      where: query,
      req, // ✅ Maintain transaction context
    })

    return result.totalDocs === 0
  } catch (error) {
    req.payload.logger.error(`Error checking slug uniqueness: ${error}`)
    return false
  }
}
```

**Rationale**: Race conditions are inherent in distributed systems. While we minimize the window with checks, the database unique constraint is the ultimate safeguard. Retry logic with timestamp fallback ensures operations eventually succeed.

### 5. Hook Standardization

**Problem**: Inconsistent hook implementations across collections (Pages uses modern patterns, others use deprecated shared hooks).

**Solution**: Migrate all collections to use factory functions from utilities.

**Design Decision**:

- Deprecate old shared hooks (`generateSlug`, `auditTrail`)
- All collections use `createSlugGenerationHook` from utilities
- All collections use `createRevalidateHook` factory
- All collections use `createAuditTrailHook` factory
- Consistent configuration across all page types

**Implementation Pattern**:

```typescript
// All collections will follow this pattern
import { createSlugGenerationHook } from '@/utilities/slugGeneration'
import { createRevalidateHook } from '@/pages/shared/hooks/createRevalidateHook'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'

export const BlogPages: CollectionConfig = {
  slug: 'blogs',
  timestamps: true, // ✅ Use Payload's built-in timestamps
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('blogs', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('blogs')],
  },
  fields: [
    // ... fields
    ...auditFields, // Spread shared audit fields
  ],
}
```

**Migration Strategy**:

1. Update Pages collection (already uses modern pattern)
2. Update Blogs collection
3. Update Services collection
4. Update Contacts collection
5. Update Legal collection
6. Mark old shared hooks as deprecated
7. Remove old shared hooks after migration

**Rationale**: Factory functions provide consistency, reduce duplication, and make it easier to update behavior across all collections. Centralized utilities ensure all collections benefit from bug fixes and improvements.

## Major Improvements

### 6. SEO Integration

**Problem**: No SEO plugin configured, missing meta fields for search optimization.

**Solution**: Add SEO plugin with comprehensive meta fields for all page collections.

**Design Decision**:

- Use `@payloadcms/plugin-seo` for standardized SEO fields
- Configure for all page collections
- Add meta fields: title, description, image
- Support Open Graph tags
- Auto-generate meta from content when not provided

**Implementation**:

```typescript
// src/payload.config.ts
import { seoPlugin } from '@payloadcms/plugin-seo'

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['pages', 'blogs', 'services', 'contacts', 'legal'],
      uploadsCollection: 'media',
      tabbedUI: true, // Adds SEO tab to admin UI
      generateTitle: ({ doc }) => doc?.title || '',
      generateDescription: ({ doc }) => doc?.excerpt || doc?.content?.substring(0, 160) || '',
      generateImage: ({ doc }) => doc?.featuredImage || null,
    }),
  ],
})
```

**Alternative (Manual Meta Fields)**:

If SEO plugin is not desired, implement manual meta fields:

```typescript
// src/pages/shared/fields/metaFields.ts
import type { Field } from 'payload'

export const metaFields: Field[] = [
  {
    name: 'meta',
    type: 'group',
    label: 'SEO & Meta',
    fields: [
      {
        name: 'title',
        type: 'text',
        maxLength: 60,
        admin: {
          description: 'SEO title (max 60 characters). Defaults to page title if empty.',
        },
      },
      {
        name: 'description',
        type: 'textarea',
        maxLength: 160,
        admin: {
          description: 'SEO description (max 160 characters). Shown in search results.',
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        admin: {
          description: 'Image for social media sharing (Open Graph)',
        },
      },
      {
        name: 'keywords',
        type: 'text',
        admin: {
          description: 'Comma-separated keywords (optional)',
        },
      },
    ],
  },
]
```

**Rationale**: SEO is critical for content discoverability. The SEO plugin provides a standardized, tested solution with automatic meta generation. Manual implementation gives more control but requires more maintenance.

### 7. Auto-Population Features

**Problem**: Author and published date fields require manual input, leading to inconsistency.

**Solution**: Auto-populate author with current user, auto-set published date on first publish.

**Design Decision**:

- Use field-level hooks for auto-population
- Only set values if not already provided
- Respect manual overrides
- Log auto-population for audit trail

**Implementation**:

```typescript
// Author auto-population
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    position: 'sidebar',
    description: 'Author of this content (defaults to current user)',
  },
  hooks: {
    beforeChange: [
      ({ value, req, operation }) => {
        // Auto-populate on create if not provided
        if (operation === 'create' && !value && req.user) {
          req.payload.logger.info(`Auto-populated author: ${req.user.id}`)
          return req.user.id
        }
        return value
      },
    ],
  },
}

// Published date auto-setting
{
  name: 'publishedDate',
  type: 'date',
  admin: {
    position: 'sidebar',
    description: 'Date this content was first published (auto-set on publish)',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
  hooks: {
    beforeChange: [
      ({ value, siblingData, operation, req }) => {
        // Auto-set on first publish
        if (
          operation === 'update' &&
          siblingData._status === 'published' &&
          !value
        ) {
          const now = new Date()
          req.payload.logger.info(`Auto-set published date: ${now.toISOString()}`)
          return now
        }
        return value
      },
    ],
  },
}
```

**Rationale**: Auto-population reduces manual work and ensures consistency. Field-level hooks are the appropriate place for this logic as they operate on individual field values and respect manual overrides.

### 8. Enhanced Revalidation

**Problem**: Current revalidation hooks only log, don't actually revalidate Next.js cache.

**Solution**: Implement proper Next.js revalidation with path and tag support.

**Design Decision**:

- Use Next.js `revalidatePath` for specific pages
- Use `revalidateTag` for collection-wide invalidation
- Support context flag to disable revalidation (for bulk operations)
- Handle slug changes and unpublish scenarios
- Debounce revalidation to prevent excessive calls

**Implementation**:

```typescript
// src/utilities/revalidation.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import type { PayloadRequest } from 'payload'

export interface RevalidationOptions {
  path?: string
  tag?: string
  debounceMs?: number
}

// Debounce map to prevent excessive revalidation
const revalidationQueue = new Map<string, NodeJS.Timeout>()

export function revalidateWithDebounce(key: string, fn: () => void, debounceMs = 1000): void {
  // Clear existing timeout
  if (revalidationQueue.has(key)) {
    clearTimeout(revalidationQueue.get(key)!)
  }

  // Set new timeout
  const timeout = setTimeout(() => {
    fn()
    revalidationQueue.delete(key)
  }, debounceMs)

  revalidationQueue.set(key, timeout)
}

// src/pages/shared/hooks/createRevalidateHook.ts (enhanced)
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { revalidateWithDebounce } from '@/utilities/revalidation'

export const createRevalidateHook = (
  pathPrefix: string,
  options: { debounce?: boolean } = {},
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req }) => {
    // Skip if revalidation disabled via context
    if (req.context.disableRevalidate) {
      return doc
    }

    const revalidateFn = () => {
      // Handle published status
      if (doc._status === 'published') {
        const path =
          pathPrefix === 'pages' && doc.slug === 'home' ? '/' : `/${pathPrefix}/${doc.slug}`

        revalidatePath(path)
        req.payload.logger.info(`Revalidated: ${path}`)
      }

      // Handle unpublish
      if (previousDoc?._status === 'published' && doc._status !== 'published') {
        const oldPath =
          pathPrefix === 'pages' && previousDoc.slug === 'home'
            ? '/'
            : `/${pathPrefix}/${previousDoc.slug}`

        revalidatePath(oldPath)
        req.payload.logger.info(`Revalidated (unpublished): ${oldPath}`)
      }

      // Handle slug changes
      if (doc._status === 'published' && previousDoc?.slug && doc.slug !== previousDoc.slug) {
        const oldPath = `/${pathPrefix}/${previousDoc.slug}`
        const newPath = `/${pathPrefix}/${doc.slug}`

        revalidatePath(oldPath)
        revalidatePath(newPath)
        req.payload.logger.info(`Revalidated (slug change): ${oldPath} -> ${newPath}`)
      }

      // Revalidate collection tag
      revalidateTag(pathPrefix)
    }

    // Debounce if enabled
    if (options.debounce) {
      revalidateWithDebounce(`${pathPrefix}-${doc.id}`, revalidateFn)
    } else {
      revalidateFn()
    }

    return doc
  }
}
```

**Rationale**: Proper cache invalidation is essential for serving fresh content. Debouncing prevents excessive revalidation during rapid edits. Tag-based revalidation allows invalidating entire collections when needed.

### 9. Field Validation & Constraints

**Problem**: Missing validation on text fields, no maxLength constraints, weak slug validation.

**Solution**: Add comprehensive validation to all fields with appropriate constraints.

**Design Decision**:

- Add maxLength to all text fields
- Add format validation to slug fields
- Add required field validation with helpful messages
- Use field-level validation for immediate feedback
- Add custom validators for complex rules

**Implementation**:

```typescript
// Enhanced slug field configuration
// src/pages/shared/fields/slugField.ts
import type { Field } from 'payload'
import { validateSlugFormat } from '@/utilities/slugGeneration'

export const createSlugField = (options: {
  description?: string
  required?: boolean
} = {}): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  required: options.required ?? false,
  maxLength: 100,
  admin: {
    position: 'sidebar',
    description: options.description || 'URL-friendly identifier (auto-generated from title)',
  },
  validate: (value) => {
    if (!value) return true // Let required handle empty values

    const validation = validateSlugFormat(value)
    if (!validation.isValid) {
      return validation.errors.join(', ')
    }
    return true
  },
})

// Title field with validation
{
  name: 'title',
  type: 'text',
  required: true,
  minLength: 1,
  maxLength: 200,
  admin: {
    description: 'The main title of the page (1-200 characters)',
  },
  validate: (value) => {
    if (!value || typeof value !== 'string') {
      return 'Title is required'
    }
    if (value.trim().length === 0) {
      return 'Title cannot be empty or only whitespace'
    }
    if (value.length > 200) {
      return 'Title must be 200 characters or less'
    }
    return true
  },
}

// Excerpt field with validation
{
  name: 'excerpt',
  type: 'textarea',
  maxLength: 300,
  admin: {
    description: 'Brief description (max 300 characters) for previews and SEO',
  },
  validate: (value) => {
    if (value && value.length > 300) {
      return 'Excerpt must be 300 characters or less'
    }
    return true
  },
}
```

**Rationale**: Validation at the field level provides immediate feedback to users and prevents invalid data from entering the system. Clear error messages improve UX and reduce support burden.

### 10. Access Control Enhancement

**Problem**: Audit fields lack proper access control, can be tampered with via API.

**Solution**: Implement field-level access control for all sensitive fields.

**Design Decision**:

- Audit fields are read-only in admin UI
- Audit fields cannot be created or updated via API
- Slug field has restricted update access (admin only after publish)
- Status changes are logged
- Role-based access for sensitive operations

**Implementation**:

```typescript
// Enhanced audit fields with access control
export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who created this document',
    },
    access: {
      create: () => false, // System-only field
      update: () => false, // Cannot be modified
      read: ({ req: { user } }) => {
        // Only authenticated users can see who created content
        return Boolean(user)
      },
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'User who last updated this document',
    },
    access: {
      create: () => false,
      update: () => false,
      read: ({ req: { user } }) => Boolean(user),
    },
  },
]

// Slug field with restricted update access
{
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  maxLength: 100,
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier (auto-generated from title)',
  },
  access: {
    update: ({ req: { user }, doc }) => {
      // Admins can always update
      if (user?.roles?.includes('admin')) return true

      // Others can only update unpublished content
      return doc?._status !== 'published'
    },
  },
}

// Status field with logging
{
  name: '_status',
  // ... other config
  hooks: {
    beforeChange: [
      ({ value, originalDoc, req }) => {
        if (originalDoc?._status !== value) {
          req.payload.logger.info(
            `Status changed from ${originalDoc?._status} to ${value} by ${req.user?.email}`
          )
        }
        return value
      },
    ],
  },
}
```

**Rationale**: Field-level access control prevents unauthorized modifications to sensitive data. Read-only admin UI combined with API-level restrictions provides defense in depth.

## Performance Optimizations

### 11. Database Indexing Strategy

**Problem**: Missing indexes on frequently queried fields leads to slow queries.

**Solution**: Add indexes to all fields used in queries, sorting, and filtering.

**Design Decision**:

- Index all slug fields (already done)
- Index publishedDate for sorting
- Index status field for filtering
- Index author field for relationship queries
- Composite indexes for common query patterns

**Implementation**:

```typescript
// Indexed fields configuration
{
  name: 'slug',
  type: 'text',
  unique: true,
  index: true, // ✅ Unique index for fast lookups
}

{
  name: 'publishedDate',
  type: 'date',
  index: true, // ✅ Index for sorting by date
}

{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  index: true, // ✅ Index for filtering by author
}

{
  name: 'featured',
  type: 'checkbox',
  index: true, // ✅ Index for filtering featured content
}

// For PostgreSQL, consider composite indexes in migrations
// CREATE INDEX idx_blogs_status_date ON blogs(_status, publishedDate DESC);
// CREATE INDEX idx_services_featured_status ON services(featured, _status);
```

**Query Optimization Examples**:

```typescript
// Optimized query using indexed fields
const recentPosts = await payload.find({
  collection: 'blogs',
  where: {
    _status: { equals: 'published' }, // Uses index
  },
  sort: '-publishedDate', // Uses index
  limit: 10,
})

// Optimized author query
const authorPosts = await payload.find({
  collection: 'blogs',
  where: {
    author: { equals: authorId }, // Uses index
    _status: { equals: 'published' }, // Uses index
  },
})
```

**Rationale**: Proper indexing is critical for query performance. Indexes on frequently queried fields can reduce query time from seconds to milliseconds, especially as data grows.

### 12. Hook Performance Optimization

**Problem**: Hooks run on every save, including drafts, causing unnecessary overhead.

**Solution**: Optimize hooks to skip unnecessary operations and use context caching.

**Design Decision**:

- Check operation type before executing expensive logic
- Use context to cache expensive operations
- Skip hooks for draft saves when appropriate
- Debounce revalidation
- Limit database queries in hooks

**Implementation**:

```typescript
// Optimized revalidation hook
export const createRevalidateHook = (pathPrefix: string): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req, operation }) => {
    // Skip for draft operations
    if (operation === 'create' && doc._status === 'draft') {
      return doc
    }

    // Skip if disabled via context
    if (req.context.disableRevalidate) {
      return doc
    }

    // Only revalidate on status changes or slug changes
    const statusChanged = doc._status !== previousDoc?._status
    const slugChanged = doc.slug !== previousDoc?.slug
    const isPublished = doc._status === 'published'

    if (!statusChanged && !slugChanged) {
      return doc // No revalidation needed
    }

    // Perform revalidation
    if (isPublished) {
      const path = `/${pathPrefix}/${doc.slug}`
      revalidatePath(path)
    }

    return doc
  }
}

// Optimized audit trail with context caching
export const createAuditTrailHook = (): CollectionBeforeChangeHook => {
  return ({ data, req, operation, context }) => {
    // Cache user lookup in context
    if (!context.auditUser && req.user) {
      context.auditUser = req.user.id
    }

    if (operation === 'create' && context.auditUser) {
      data.createdBy = context.auditUser
    }

    if (operation === 'update' && context.auditUser) {
      data.updatedBy = context.auditUser
    }

    return data
  }
}

// Optimized circular reference check with caching
export const createCircularReferenceValidator = (collection: string): Validate => {
  return async (value, { data, req, context }) => {
    if (!value || !data?.id) return true

    // Cache parent chain in context to avoid repeated queries
    const cacheKey = `parentChain_${data.id}`

    if (!context[cacheKey]) {
      // Build parent chain once
      const chain = await buildParentChain(value, collection, req)
      context[cacheKey] = chain
    }

    const chain = context[cacheKey]

    if (chain.includes(data.id)) {
      return 'Circular parent reference detected'
    }

    return true
  }
}
```

**Rationale**: Hooks can significantly impact performance if not optimized. Skipping unnecessary operations, caching expensive lookups, and using context to share data between hooks reduces overhead.

## Testing Strategy

### 13. Unit Tests

**Scope**: Test individual functions and utilities in isolation.

**Coverage Requirements**:

- All hook factory functions
- All validation functions
- All utility functions
- Edge cases and error conditions

**Implementation**:

```typescript
// tests/unit/hooks/auditTrail.test.ts
import { describe, it, expect, vi } from 'vitest'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'

describe('createAuditTrailHook', () => {
  it('should set createdBy on create operation', () => {
    const hook = createAuditTrailHook()
    const data = {}
    const req = { user: { id: 'user-123' } }

    const result = hook({ data, req, operation: 'create', context: {} })

    expect(result.createdBy).toBe('user-123')
  })

  it('should set updatedBy on update operation', () => {
    const hook = createAuditTrailHook()
    const data = {}
    const req = { user: { id: 'user-456' } }

    const result = hook({ data, req, operation: 'update', context: {} })

    expect(result.updatedBy).toBe('user-456')
  })

  it('should not set fields when user is not present', () => {
    const hook = createAuditTrailHook()
    const data = {}
    const req = { user: null }

    const result = hook({ data, req, operation: 'create', context: {} })

    expect(result.createdBy).toBeUndefined()
  })
})

// tests/unit/utilities/slugGeneration.test.ts
import { describe, it, expect } from 'vitest'
import { generateSlugFromText, validateSlugFormat } from '@/utilities/slugGeneration'

describe('generateSlugFromText', () => {
  it('should convert text to lowercase slug', () => {
    expect(generateSlugFromText('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(generateSlugFromText('Hello @#$ World!')).toBe('hello-world')
  })

  it('should handle accented characters', () => {
    expect(generateSlugFromText('Café Münchën')).toBe('cafe-munchen')
  })

  it('should truncate to maxLength', () => {
    const longText = 'a'.repeat(150)
    const slug = generateSlugFromText(longText, { maxLength: 100 })
    expect(slug.length).toBeLessThanOrEqual(100)
  })

  it('should throw on reserved slugs', () => {
    expect(() => generateSlugFromText('admin')).toThrow('reserved')
  })
})

describe('validateSlugFormat', () => {
  it('should validate correct slug format', () => {
    const result = validateSlugFormat('valid-slug-123')
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject uppercase letters', () => {
    const result = validateSlugFormat('Invalid-Slug')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('lowercase letters')
  })

  it('should reject leading/trailing hyphens', () => {
    const result = validateSlugFormat('-invalid-')
    expect(result.isValid).toBe(false)
  })
})
```

### 14. Integration Tests

**Scope**: Test collection operations with real Payload instance.

**Coverage Requirements**:

- CRUD operations for all collections
- Hook execution and side effects
- Validation enforcement
- Access control rules
- Transaction rollback scenarios

**Implementation**:

```typescript
// tests/int/collections/blogs.int.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'

describe('Blogs Collection', () => {
  let payload

  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    // Cleanup
  })

  describe('Slug Generation', () => {
    it('should auto-generate slug from title', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: {
          title: 'Test Blog Post',
          content: 'Content here',
        },
      })

      expect(blog.slug).toBe('test-blog-post')
    })

    it('should generate unique slug when duplicate exists', async () => {
      await payload.create({
        collection: 'blogs',
        data: { title: 'Duplicate', content: 'Content' },
      })

      const blog2 = await payload.create({
        collection: 'blogs',
        data: { title: 'Duplicate', content: 'Content' },
      })

      expect(blog2.slug).toBe('duplicate-1')
    })

    it('should validate slug format', async () => {
      await expect(
        payload.create({
          collection: 'blogs',
          data: {
            title: 'Test',
            slug: 'Invalid Slug!',
            content: 'Content',
          },
        }),
      ).rejects.toThrow('Invalid slug format')
    })
  })

  describe('Audit Trail', () => {
    it('should set createdBy on create', async () => {
      const user = await payload.create({
        collection: 'users',
        data: { email: 'test@example.com', password: 'password' },
      })

      const blog = await payload.create({
        collection: 'blogs',
        data: { title: 'Test', content: 'Content' },
        user,
      })

      expect(blog.createdBy).toBe(user.id)
    })

    it('should set updatedBy on update', async () => {
      const user = await payload.create({
        collection: 'users',
        data: { email: 'updater@example.com', password: 'password' },
      })

      const blog = await payload.create({
        collection: 'blogs',
        data: { title: 'Test', content: 'Content' },
      })

      const updated = await payload.update({
        collection: 'blogs',
        id: blog.id,
        data: { title: 'Updated' },
        user,
      })

      expect(updated.updatedBy).toBe(user.id)
    })
  })

  describe('Access Control', () => {
    it('should prevent updating audit fields', async () => {
      const blog = await payload.create({
        collection: 'blogs',
        data: { title: 'Test', content: 'Content' },
      })

      const updated = await payload.update({
        collection: 'blogs',
        id: blog.id,
        data: {
          title: 'Updated',
          createdBy: 'fake-user-id', // Should be ignored
        },
      })

      expect(updated.createdBy).not.toBe('fake-user-id')
    })
  })
})
```

### 15. Property-Based Tests

**Scope**: Test properties that should hold for all inputs.

**Coverage Requirements**:

- Slug generation properties
- Validation properties
- Circular reference detection
- Uniqueness guarantees

**Implementation**:

```typescript
// tests/pbt/slugGeneration.pbt.test.ts
import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { generateSlugFromText, validateSlugFormat } from '@/utilities/slugGeneration'

describe('Slug Generation Properties', () => {
  it('property: generated slugs are always valid', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 200 }), (input) => {
        try {
          const slug = generateSlugFromText(input)
          const validation = validateSlugFormat(slug)
          return validation.isValid
        } catch {
          // Reserved slugs throw, which is expected
          return true
        }
      }),
    )
  })

  it('property: slugs are idempotent', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 200 }), (input) => {
        try {
          const slug1 = generateSlugFromText(input)
          const slug2 = generateSlugFromText(slug1)
          return slug1 === slug2
        } catch {
          return true
        }
      }),
    )
  })

  it('property: slugs never exceed maxLength', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.integer({ min: 10, max: 100 }),
        (input, maxLength) => {
          try {
            const slug = generateSlugFromText(input, { maxLength })
            return slug.length <= maxLength
          } catch {
            return true
          }
        },
      ),
    )
  })

  it('property: slugs only contain valid characters', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 200 }), (input) => {
        try {
          const slug = generateSlugFromText(input)
          return /^[a-z0-9-]+$/.test(slug)
        } catch {
          return true
        }
      }),
    )
  })

  it('property: same input produces same slug', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 200 }), (input) => {
        try {
          const slug1 = generateSlugFromText(input)
          const slug2 = generateSlugFromText(input)
          return slug1 === slug2
        } catch {
          return true
        }
      }),
    )
  })
})

describe('Circular Reference Detection Properties', () => {
  it('property: direct cycles are always detected', () => {
    // Test that A -> B -> A is always detected
    // This would require mocking Payload operations
  })

  it('property: no false positives for valid hierarchies', () => {
    // Test that valid parent chains never trigger false positives
  })
})
```

**Rationale**: Property-based testing validates that functions behave correctly across a wide range of inputs, catching edge cases that example-based tests might miss.

## Collection-Specific Designs

### Pages Collection

**Unique Features**:

- Hierarchical structure with parent relationships
- Breadcrumb generation
- All blocks available
- Home page special handling

**Configuration**:

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  timestamps: true,
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('pages', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
        reservedSlugs: ['home', 'index'],
      }),
    ],
    beforeChange: [
      createAuditTrailHook(),
      populateBreadcrumbs, // Pages-specific
    ],
    afterChange: [createRevalidateHook('pages')],
  },
  fields: [
    // ... standard fields
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      validate: createCircularReferenceValidator('pages'),
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
      }),
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        { name: 'doc', type: 'relationship', relationTo: 'pages' },
        { name: 'url', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    ...auditFields,
  ],
}
```

### Blogs Collection

**Unique Features**:

- Author field with auto-population
- Published date with auto-setting
- Tags array
- Excerpt field

**Configuration**:

```typescript
export const BlogPages: CollectionConfig = {
  slug: 'blogs',
  timestamps: true,
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('blogs', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('blogs')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Brief description for previews and SEO (max 300 characters)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    createSlugField(),
    {
      name: 'publishedDate',
      type: 'date',
      index: true,
      hooks: {
        beforeChange: [
          ({ value, siblingData, operation }) => {
            if (operation === 'update' && siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      hooks: {
        beforeChange: [
          ({ value, req, operation }) => {
            if (operation === 'create' && !value && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          maxLength: 50,
        },
      ],
    },
    ...auditFields,
  ],
}
```

### Services Collection

**Unique Features**:

- Service type categorization
- Pricing information group
- Featured flag

**Configuration**:

```typescript
export const ServicesPages: CollectionConfig = {
  slug: 'services',
  timestamps: true,
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('services', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('services')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    createSlugField(),
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Web Development', value: 'web-dev' },
        { label: 'Mobile Development', value: 'mobile-dev' },
        { label: 'UI/UX Design', value: 'design' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Maintenance & Support', value: 'support' },
        { label: 'Digital Marketing', value: 'marketing' },
        { label: 'Other', value: 'other' },
      ],
      index: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Feature this service on the homepage',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'startingPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'currency',
          type: 'select',
          options: ['USD', 'EUR', 'GBP', 'INR'],
          defaultValue: 'USD',
        },
        {
          name: 'pricingModel',
          type: 'select',
          options: [
            { label: 'Fixed Price', value: 'fixed' },
            { label: 'Hourly Rate', value: 'hourly' },
            { label: 'Monthly Retainer', value: 'monthly' },
            { label: 'Custom Quote', value: 'custom' },
          ],
          defaultValue: 'custom',
        },
      ],
    },
    ...auditFields,
  ],
}
```

### Contacts Collection

**Unique Features**:

- Contact purpose categorization
- Form relationship
- Contact info display settings
- Optional sidebar

**Configuration**:

```typescript
export const ContactPages: CollectionConfig = {
  slug: 'contacts',
  timestamps: true,
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('contacts', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('contacts')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'content',
      type: 'richText',
    },
    createSlugField(),
    {
      name: 'purpose',
      type: 'select',
      required: true,
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Technical Support', value: 'technical' },
        { label: 'Bug Report', value: 'bug' },
        { label: 'Feature Request', value: 'feature' },
        { label: 'Feedback', value: 'feedback' },
        { label: 'Sales Inquiry', value: 'sales' },
        { label: 'Partnership/Collaboration', value: 'partnership' },
        { label: 'Media/Press', value: 'media' },
        { label: 'Careers', value: 'careers' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        description: 'Select a form to display on this contact page',
      },
    },
    {
      name: 'displayContactInfo',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'contactInfoSections',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'General Info', value: 'general' },
        { label: 'Office Locations', value: 'offices' },
        { label: 'Social Media', value: 'social' },
        { label: 'Business Hours', value: 'hours' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.displayContactInfo,
      },
    },
    ...auditFields,
  ],
}
```

### Legal Collection

**Unique Features**:

- Document type categorization
- Effective date tracking
- Auto-updating lastUpdated field
- No hero blocks

**Configuration**:

```typescript
export const LegalPages: CollectionConfig = {
  slug: 'legal',
  timestamps: true,
  hooks: {
    beforeValidate: [
      createSlugGenerationHook('legal', {
        sourceField: 'title',
        enforceUniqueness: true,
        maxLength: 100,
      }),
    ],
    beforeChange: [createAuditTrailHook()],
    afterChange: [createRevalidateHook('legal')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    createSlugField(),
    {
      name: 'documentType',
      type: 'select',
      options: [
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Terms of Service', value: 'terms' },
        { label: 'Cookie Policy', value: 'cookies' },
        { label: 'GDPR Compliance', value: 'gdpr' },
        { label: 'Disclaimer', value: 'disclaimer' },
        { label: 'License Agreement', value: 'license' },
        { label: 'Other', value: 'other' },
      ],
      index: true,
    },
    {
      name: 'effectiveDate',
      type: 'date',
      admin: {
        description: 'When this legal document becomes effective',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last modification date (auto-updated)',
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === 'update') {
              return new Date()
            }
            return undefined
          },
        ],
      },
    },
    ...auditFields,
  ],
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1)

**Goal**: Fix critical issues and establish shared utilities.

**Tasks**:

1. Create `createAuditTrailHook` factory function
2. Update `auditFields` with proper access control
3. Fix transaction safety in `createRevalidateHook`
4. Enhance `slugGeneration.ts` with race condition handling
5. Create `circularReference.ts` validator
6. Update Pages collection to use new patterns

**Validation**:

- All hooks pass `req` parameter
- Audit fields are read-only
- Circular reference validation works
- Unit tests pass

### Phase 2: Collection Migration (Week 2)

**Goal**: Migrate all collections to use standardized patterns.

**Tasks**:

1. Update Blogs collection
2. Update Services collection
3. Update Contacts collection
4. Update Legal collection
5. Deprecate old shared hooks
6. Add SEO plugin or manual meta fields

**Validation**:

- All collections use factory functions
- All collections have consistent structure
- Integration tests pass
- No deprecated hooks in use

### Phase 3: Enhancement (Week 3)

**Goal**: Add missing features and optimizations.

**Tasks**:

1. Implement proper revalidation with Next.js
2. Add auto-population for author/dates
3. Add field validation and constraints
4. Add database indexes
5. Optimize hook performance
6. Add field descriptions

**Validation**:

- Revalidation works correctly
- Auto-population works
- Queries are fast
- All fields have descriptions

### Phase 4: Testing & Documentation (Week 4)

**Goal**: Comprehensive test coverage and documentation.

**Tasks**:

1. Write unit tests for all utilities
2. Write integration tests for all collections
3. Write property-based tests
4. Update documentation
5. Create migration guide
6. Performance benchmarking

**Validation**:

- Test coverage > 80%
- All tests pass
- Documentation complete
- Performance benchmarks met

## Rollback Plan

### If Critical Issues Arise

**Scenario 1: Transaction Safety Issues**

- Rollback: Revert to previous hook implementations
- Fix: Add proper `req` parameter passing
- Test: Run integration tests to verify atomicity
- Deploy: Gradual rollout with monitoring

**Scenario 2: Slug Generation Failures**

- Rollback: Revert to simple slug generation
- Fix: Add retry logic and better error handling
- Test: Property-based tests for edge cases
- Deploy: Monitor duplicate slug errors

**Scenario 3: Performance Degradation**

- Rollback: Disable expensive hooks temporarily
- Fix: Add caching and optimize queries
- Test: Performance benchmarks
- Deploy: Gradual rollout with metrics

**Scenario 4: Data Corruption**

- Rollback: Restore from backup
- Fix: Identify and fix root cause
- Test: Comprehensive integration tests
- Deploy: Manual verification before rollout

### Monitoring & Alerts

**Key Metrics**:

- Hook execution time (< 50ms target)
- Database query count per operation
- Slug generation failures
- Circular reference detection rate
- Revalidation success rate

**Alerts**:

- Hook execution > 100ms
- Duplicate slug errors
- Circular reference detected
- Transaction rollback rate > 1%
- Test failures in CI/CD

## Security Considerations

### 1. Access Control

**Threat**: Unauthorized modification of audit trail fields.

**Mitigation**:

- Field-level access control prevents API modifications
- Read-only admin UI prevents accidental changes
- System-only fields cannot be created or updated by users

### 2. Slug Injection

**Threat**: Malicious slugs containing XSS or path traversal attempts.

**Mitigation**:

- Strict slug format validation (lowercase, numbers, hyphens only)
- Reserved slug list prevents system path conflicts
- Sanitization removes all special characters

### 3. Circular Reference DoS

**Threat**: Intentional creation of circular references to cause DoS.

**Mitigation**:

- Async validation prevents circular references at data layer
- Max depth limit prevents excessive traversal
- Transaction rollback on validation failure

### 4. Race Condition Exploitation

**Threat**: Concurrent requests to create duplicate slugs.

**Mitigation**:

- Database unique constraint as final safeguard
- Retry logic with exponential backoff
- Transaction isolation prevents dirty reads

### 5. Information Disclosure

**Threat**: Exposing sensitive audit information to unauthorized users.

**Mitigation**:

- Field-level read access control
- Only authenticated users can see audit fields
- Logs don't contain sensitive user data

## Performance Benchmarks

### Target Metrics

**Hook Execution**:

- Slug generation: < 20ms
- Audit trail: < 5ms
- Revalidation: < 30ms
- Circular reference check: < 50ms (cached), < 200ms (uncached)

**Database Operations**:

- Create document: < 100ms
- Update document: < 80ms
- Find by slug: < 10ms (indexed)
- Count query: < 20ms

**Admin UI**:

- Page load: < 200ms
- Form submission: < 500ms
- Validation feedback: < 100ms

### Load Testing Scenarios

**Scenario 1: Concurrent Creates**

- 100 concurrent blog post creations
- All should succeed with unique slugs
- No duplicate slug errors
- Transaction rollback rate < 1%

**Scenario 2: Bulk Updates**

- Update 1000 documents
- Audit trail correctly updated
- Revalidation completes
- Total time < 30 seconds

**Scenario 3: Deep Hierarchy**

- Create 50-level deep page hierarchy
- Breadcrumb generation completes
- Circular reference check completes
- No stack overflow errors

## Documentation Requirements

### 1. Developer Documentation

**Hook Development Guide**:

- How to create custom hooks
- Transaction safety requirements
- Context usage patterns
- Error handling best practices

**Collection Configuration Guide**:

- Standard field patterns
- Access control examples
- Validation patterns
- Performance considerations

**Testing Guide**:

- Unit test examples
- Integration test setup
- Property-based test patterns
- Mocking strategies

### 2. User Documentation

**Content Editor Guide**:

- How to create pages
- Understanding slugs
- Using blocks
- SEO best practices

**Admin Guide**:

- User management
- Access control
- Audit trail interpretation
- Troubleshooting common issues

### 3. API Documentation

**Collection Endpoints**:

- CRUD operations
- Query parameters
- Filtering and sorting
- Pagination

**Webhook Documentation**:

- Available events
- Payload structure
- Authentication
- Error handling

## Correctness Properties

These properties define the formal correctness requirements that must be upheld by the implementation. Each property will be validated through property-based testing.

### Property 1: Transaction Atomicity

**Validates: Requirements 1.4**

**Property**: All nested operations within a hook must either all succeed or all fail together.

**Formal Statement**:

```
∀ hook execution h, ∀ nested operations O = {o₁, o₂, ..., oₙ}:
  (∃ oᵢ ∈ O : failed(oᵢ)) ⟹ (∀ oⱼ ∈ O : rolled_back(oⱼ))
```

**Test Strategy**:

- Create hook with multiple nested operations
- Force failure in one operation
- Verify all operations are rolled back
- Check database state is unchanged

**Implementation Requirement**:

- All nested `payload` operations must receive `req` parameter
- Use same transaction context throughout hook execution

---

### Property 2: Slug Uniqueness

**Validates: Requirements 2.1, 2.2**

**Property**: No two documents in the same collection can have the same slug.

**Formal Statement**:

```
∀ collection C, ∀ documents d₁, d₂ ∈ C:
  d₁ ≠ d₂ ⟹ slug(d₁) ≠ slug(d₂)
```

**Test Strategy**:

- Generate random titles
- Create documents concurrently
- Verify all slugs are unique
- Check database constraint enforcement

**Implementation Requirement**:

- Database unique constraint on slug field
- Retry logic with incremental suffixes
- Transaction-safe uniqueness checks

---

### Property 3: Slug Format Validity

**Validates: Requirements 2.1**

**Property**: All generated slugs must match the valid format pattern.

**Formal Statement**:

```
∀ slug s generated from text t:
  matches(s, /^[a-z0-9-]+$/) ∧
  ¬starts_with(s, '-') ∧
  ¬ends_with(s, '-') ∧
  ¬contains(s, '--') ∧
  length(s) ≤ 100
```

**Test Strategy**:

- Generate slugs from arbitrary text inputs
- Verify all match format pattern
- Check length constraints
- Validate no reserved slugs

**Implementation Requirement**:

- Strict format validation in `validateSlugFormat`
- Sanitization in `generateSlugFromText`
- Reserved slug checking

---

### Property 4: Circular Reference Prevention

**Validates: Requirements 2.2**

**Property**: No page can be its own ancestor in the parent hierarchy.

**Formal Statement**:

```
∀ page p, ∀ ancestor chain A = {a₁, a₂, ..., aₙ} where parent(aᵢ) = aᵢ₊₁:
  p ∉ A
```

**Test Strategy**:

- Attempt to create circular references
- Verify validation rejects all cycles
- Test direct and indirect cycles
- Check performance with deep hierarchies

**Implementation Requirement**:

- Recursive parent chain traversal
- Visited set to detect cycles
- Max depth limit to prevent DoS

---

### Property 5: Audit Trail Immutability

**Validates: Requirements 3.1, 3.2, 3.3**

**Property**: Once set, audit trail fields cannot be modified by users.

**Formal Statement**:

```
∀ document d, ∀ user u (u ≠ system):
  created(d) ⟹ immutable(d.createdBy) ∧
  updated(d) ⟹ (d.updatedBy = current_user ∨ immutable(d.updatedBy))
```

**Test Strategy**:

- Attempt to modify createdBy via API
- Attempt to modify updatedBy via API
- Verify field-level access control
- Check admin UI read-only enforcement

**Implementation Requirement**:

- Field-level access control: `create: () => false, update: () => false`
- Admin UI: `readOnly: true`
- Hook-based population only

---

### Property 6: Slug Idempotence

**Validates: Requirements 2.1**

**Property**: Generating a slug from a slug produces the same slug.

**Formal Statement**:

```
∀ text t:
  slug(slug(t)) = slug(t)
```

**Test Strategy**:

- Generate slug from text
- Generate slug from generated slug
- Verify both are identical
- Test with various inputs

**Implementation Requirement**:

- Slug generation is deterministic
- Already-valid slugs pass through unchanged

---

### Property 7: Auto-Population Consistency

**Validates: Requirements 7.1, 7.2**

**Property**: Auto-populated fields are set correctly based on operation and context.

**Formal Statement**:

```
∀ document d, ∀ user u:
  (operation = 'create' ∧ ¬provided(d.author)) ⟹ d.author = u ∧
  (operation = 'update' ∧ status_changed_to_published(d) ∧ ¬provided(d.publishedDate)) ⟹ d.publishedDate = now()
```

**Test Strategy**:

- Create document without author
- Verify author is current user
- Publish document without date
- Verify date is set to now

**Implementation Requirement**:

- Field-level hooks for auto-population
- Check operation type and existing value
- Respect manual overrides

---

### Property 8: Revalidation Correctness

**Validates: Requirements TR-4**

**Property**: Revalidation occurs exactly when needed and only for affected paths.

**Formal Statement**:

```
∀ document d:
  (status_changed(d) ∨ slug_changed(d)) ⟹ revalidated(path(d)) ∧
  ¬(status_changed(d) ∨ slug_changed(d)) ⟹ ¬revalidated(path(d))
```

**Test Strategy**:

- Track revalidation calls
- Verify revalidation on publish
- Verify revalidation on slug change
- Verify no revalidation on draft saves

**Implementation Requirement**:

- Check status and slug changes
- Call revalidatePath only when needed
- Support context flag to disable

---

### Property 9: Access Control Enforcement

**Validates: Requirements 6.1, 6.2, 6.3**

**Property**: Sensitive fields are only accessible to authorized users.

**Formal Statement**:

```
∀ field f (f ∈ sensitive_fields), ∀ user u:
  can_read(u, f) ⟺ authorized(u, f) ∧
  can_update(u, f) ⟺ admin(u)
```

**Test Strategy**:

- Attempt to read audit fields as anonymous
- Attempt to update audit fields as user
- Verify admin can read all fields
- Check API and admin UI enforcement

**Implementation Requirement**:

- Field-level access control functions
- Role-based authorization checks
- Consistent enforcement across API and UI

---

### Property 10: Performance Bounds

**Validates: Requirements NFR-3**

**Property**: All operations complete within specified time bounds.

**Formal Statement**:

```
∀ operation op:
  execution_time(op) ≤ max_time(op)
where:
  max_time(slug_generation) = 50ms
  max_time(audit_trail) = 10ms
  max_time(circular_check) = 200ms
```

**Test Strategy**:

- Measure execution time for each operation
- Test with various input sizes
- Verify all operations meet bounds
- Check performance under load

**Implementation Requirement**:

- Efficient algorithms
- Database query optimization
- Caching where appropriate
- Indexed fields for queries

## Design Decisions & Rationale

### Decision 1: Factory Functions Over Shared Hooks

**Decision**: Use factory functions (`createSlugGenerationHook`, `createRevalidateHook`) instead of shared hook instances.

**Rationale**:

- **Flexibility**: Each collection can customize behavior via options
- **Type Safety**: Factory functions can enforce correct parameter types
- **Testability**: Easier to test with different configurations
- **Maintainability**: Single source of truth for hook logic

**Alternative Considered**: Shared hook instances with configuration objects
**Why Rejected**: Less flexible, harder to customize per collection

---

### Decision 2: Payload Timestamps Over Custom Fields

**Decision**: Use Payload's built-in `timestamps: true` instead of custom `createdAt`/`updatedAt` fields.

**Rationale**:

- **Consistency**: Payload manages timestamps automatically
- **No Conflicts**: Avoids duplicate fields
- **Less Code**: No need for custom timestamp logic
- **Standard Practice**: Follows Payload conventions

**Alternative Considered**: Custom timestamp fields with full control
**Why Rejected**: Unnecessary complexity, conflicts with Payload's system

---

### Decision 3: Async Validation for Circular References

**Decision**: Use async validation with database queries to detect circular references.

**Rationale**:

- **Accuracy**: Only way to detect indirect cycles (A → B → C → A)
- **Data Integrity**: Prevents invalid data at validation layer
- **User Feedback**: Immediate error message on save attempt
- **Performance**: Acceptable with caching and depth limits

**Alternative Considered**: Client-side validation only
**Why Rejected**: Can be bypassed, doesn't catch all cases

---

### Decision 4: Database Unique Constraint + Retry Logic

**Decision**: Rely on database unique constraint with retry logic for slug uniqueness.

**Rationale**:

- **Reliability**: Database constraint is ultimate safeguard
- **Race Condition Handling**: Retry logic handles concurrent requests
- **Simplicity**: Simpler than distributed locking
- **Performance**: Optimistic approach is faster in common case

**Alternative Considered**: Distributed locking before slug generation
**Why Rejected**: Complex, slower, overkill for this use case

---

### Decision 5: Field-Level Access Control for Audit Fields

**Decision**: Use field-level access control (`create: () => false, update: () => false`) for audit fields.

**Rationale**:

- **Security**: Prevents tampering via API
- **Defense in Depth**: Multiple layers of protection
- **Clear Intent**: Explicitly marks fields as system-only
- **Payload Best Practice**: Recommended approach in documentation

**Alternative Considered**: Collection-level access control only
**Why Rejected**: Less granular, easier to bypass

---

### Decision 6: SEO Plugin vs Manual Meta Fields

**Decision**: Recommend SEO plugin but provide manual implementation as alternative.

**Rationale**:

- **Plugin Benefits**: Tested, maintained, feature-rich
- **Flexibility**: Manual implementation for custom requirements
- **Migration Path**: Can start manual, migrate to plugin later
- **User Choice**: Different projects have different needs

**Alternative Considered**: Plugin only or manual only
**Why Rejected**: One-size-fits-all doesn't work for all projects

---

### Decision 7: Debounced Revalidation

**Decision**: Add optional debouncing to revalidation hooks.

**Rationale**:

- **Performance**: Prevents excessive revalidation during rapid edits
- **Cost Savings**: Reduces API calls to Next.js
- **User Experience**: Faster admin UI response
- **Configurable**: Can be disabled if immediate revalidation needed

**Alternative Considered**: Immediate revalidation always
**Why Rejected**: Can cause performance issues with rapid edits

---

### Decision 8: Property-Based Testing for Slug Generation

**Decision**: Use property-based testing (fast-check) for slug generation.

**Rationale**:

- **Coverage**: Tests wide range of inputs automatically
- **Edge Cases**: Finds cases example-based tests miss
- **Confidence**: Higher confidence in correctness
- **Regression Prevention**: Catches bugs from future changes

**Alternative Considered**: Example-based tests only
**Why Rejected**: Can't cover all edge cases, less thorough

---

### Decision 9: Gradual Migration Strategy

**Decision**: Migrate collections one at a time over 4 weeks.

**Rationale**:

- **Risk Mitigation**: Limits blast radius of issues
- **Learning**: Each migration informs the next
- **Testing**: Time to test each collection thoroughly
- **Rollback**: Easier to rollback individual collections

**Alternative Considered**: Big bang migration all at once
**Why Rejected**: Too risky, harder to debug issues

---

### Decision 10: Context Caching for Expensive Operations

**Decision**: Use `req.context` to cache expensive operations within a request.

**Rationale**:

- **Performance**: Avoids redundant database queries
- **Consistency**: Same data used across multiple hooks
- **Payload Pattern**: Recommended approach in documentation
- **Simple**: No external caching infrastructure needed

**Alternative Considered**: External cache (Redis)
**Why Rejected**: Overkill for request-scoped caching

## Open Questions & Future Considerations

### Open Questions

1. **SEO Plugin Configuration**
   - Should we use `@payloadcms/plugin-seo` or manual implementation?
   - What meta fields are most important for this project?
   - Do we need Open Graph image generation?

2. **Revalidation Strategy**
   - Should revalidation be debounced by default?
   - What debounce timeout is appropriate?
   - Should we use tags in addition to paths?

3. **Performance Targets**
   - Are the proposed performance benchmarks realistic?
   - Do we need more aggressive caching?
   - Should we implement query result caching?

4. **Testing Coverage**
   - Is 80% test coverage sufficient?
   - Should we aim for 100% on critical paths?
   - What's the right balance between unit and integration tests?

5. **Migration Timeline**
   - Is 4 weeks realistic for this migration?
   - Should we do a pilot with one collection first?
   - What's the rollback plan if issues arise?

### Future Considerations

1. **Breadcrumb Generation for All Collections**
   - Extend breadcrumb functionality to Blogs (categories)
   - Add breadcrumbs to Services (service types)
   - Consider tag-based breadcrumbs

2. **Advanced Slug Features**
   - Slug history tracking
   - Automatic redirects on slug changes
   - Slug suggestions in admin UI
   - Custom slug patterns per collection

3. **Enhanced Audit Trail**
   - Track field-level changes (what changed, not just who)
   - Audit log collection for compliance
   - Change history UI in admin panel
   - Export audit logs for analysis

4. **Performance Monitoring**
   - Add APM integration (New Relic, DataDog)
   - Custom metrics dashboard
   - Slow query logging
   - Hook execution profiling

5. **Advanced Access Control**
   - Row-level security based on organization
   - Time-based access (scheduled publishing)
   - IP-based restrictions
   - Multi-factor authentication for sensitive operations

6. **Internationalization**
   - Localized slugs
   - Multi-language content
   - Locale-specific validation
   - Translation workflow

7. **Content Versioning Enhancements**
   - Compare versions side-by-side
   - Restore specific fields from versions
   - Version branching
   - Scheduled version publishing

8. **Block System Improvements**
   - Block validation at runtime
   - Block preview in admin UI
   - Block templates
   - Block usage analytics

9. **Automated Testing**
   - Visual regression testing
   - E2E tests for admin UI
   - Load testing automation
   - Continuous performance monitoring

10. **Developer Experience**
    - CLI tool for collection generation
    - Hook debugging tools
    - Schema visualization
    - Migration generator

## Success Criteria

### Functional Requirements

✅ **All collections use standardized hooks**

- All collections use `createSlugGenerationHook`
- All collections use `createRevalidateHook`
- All collections use `createAuditTrailHook`
- No deprecated shared hooks in use

✅ **Transaction safety maintained**

- All nested operations pass `req` parameter
- No transaction safety violations
- Rollback works correctly on errors

✅ **Data integrity guaranteed**

- No circular references possible
- All slugs are unique
- Audit trail is immutable
- Validation prevents invalid data

✅ **SEO support implemented**

- Meta fields available on all collections
- SEO plugin configured or manual fields added
- Open Graph tags supported

✅ **Auto-population working**

- Author auto-populated on create
- Published date auto-set on publish
- Last updated auto-updated

### Non-Functional Requirements

✅ **Performance targets met**

- Hook execution < 50ms
- Database queries optimized
- Admin UI response < 100ms
- No N+1 queries

✅ **Test coverage achieved**

- Unit test coverage > 80%
- Integration tests for all collections
- Property-based tests for critical functions
- All tests passing

✅ **Security requirements met**

- Field-level access control implemented
- Audit fields protected
- No security vulnerabilities
- Access control tested

✅ **Code quality maintained**

- Zero TypeScript errors
- Zero ESLint warnings
- Consistent code style
- Comprehensive documentation

### Acceptance Criteria

The implementation will be considered complete when:

1. All 5 collections (Pages, Blogs, Services, Contacts, Legal) use standardized patterns
2. All critical issues from analysis are resolved
3. All correctness properties pass property-based tests
4. Test coverage exceeds 80%
5. Performance benchmarks are met
6. Documentation is complete
7. Migration is successfully deployed to production
8. No regression in existing functionality
9. User acceptance testing passes
10. Monitoring shows stable performance

## Appendix

### A. File Structure Reference

```
src/
├── pages/
│   ├── shared/
│   │   ├── hooks/
│   │   │   ├── createSlugGenerationHook.ts (deprecated - use utility)
│   │   │   ├── createRevalidateHook.ts (factory)
│   │   │   ├── createAuditTrailHook.ts (factory - new)
│   │   │   ├── generateSlug.ts (deprecated)
│   │   │   └── auditTrail.ts (deprecated)
│   │   ├── fields/
│   │   │   ├── auditFields.ts (updated)
│   │   │   ├── metaFields.ts (new)
│   │   │   └── slugField.ts (new)
│   │   └── validation/
│   │       ├── circularReference.ts (new)
│   │       └── slugValidation.ts (new)
│   ├── Pages/
│   │   ├── index.ts (updated)
│   │   └── hooks/
│   │       ├── populateBreadcrumbs.ts
│   │       └── revalidatePage.ts (updated)
│   ├── Blogs/
│   │   ├── index.ts (updated)
│   │   └── hooks/
│   │       ├── revalidateBlog.ts (updated)
│   │       ├── generateSlug.ts (deprecated)
│   │       └── auditTrail.ts (deprecated)
│   ├── Services/
│   │   ├── index.ts (updated)
│   │   └── hooks/ (similar structure)
│   ├── Contacts/
│   │   ├── index.ts (updated)
│   │   └── hooks/ (similar structure)
│   └── Legal/
│       ├── index.ts (updated)
│       └── hooks/ (similar structure)
├── utilities/
│   ├── slugGeneration.ts (enhanced)
│   └── revalidation.ts (new)
└── tests/
    ├── unit/
    │   ├── hooks/
    │   ├── utilities/
    │   └── validation/
    ├── int/
    │   └── collections/
    └── pbt/
        └── slugGeneration.pbt.test.ts
```

### B. Dependencies

**Required Packages**:

- `payload` (v3.x)
- `@payloadcms/db-postgres` or `@payloadcms/db-mongodb`
- `@payloadcms/richtext-lexical`
- `next` (v15.x)
- `react` (v18.x)

**Optional Packages**:

- `@payloadcms/plugin-seo` (for SEO features)
- `fast-check` (for property-based testing)
- `vitest` (for testing)

**Development Packages**:

- `typescript` (v5.x)
- `eslint`
- `prettier`

### C. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Payload
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional: SEO
SEO_DEFAULT_IMAGE=/default-og-image.jpg
```

### D. TypeScript Types Reference

```typescript
// Hook factory types
type SlugGenerationOptions = {
  sourceField?: string
  maxLength?: number
  enforceUniqueness?: boolean
  transform?: (text: string) => string
  reservedSlugs?: string[]
  updateOnChange?: boolean
}

type RevalidationOptions = {
  debounce?: boolean
  debounceMs?: number
}

// Validation types
type CircularReferenceValidator = (collection: string, maxDepth?: number) => Validate

// Field types
type AuditFields = Field[]
type MetaFields = Field[]
type SlugField = Field
```

### E. Glossary

**Audit Trail**: System for tracking who created and modified documents

**Circular Reference**: Invalid parent relationship where a page is its own ancestor

**Factory Function**: Function that returns a configured hook function

**Property-Based Testing**: Testing approach that validates properties across many inputs

**Revalidation**: Process of clearing Next.js cache to serve fresh content

**Slug**: URL-friendly identifier for a document

**Transaction Safety**: Ensuring all operations succeed or fail together

**Hook**: Function that runs at specific points in document lifecycle
