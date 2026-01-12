# Design Document: Pages Collection Setup

## Overview

This design document outlines the implementation of a comprehensive Pages collection for the PayloadCMS application, following the official PayloadCMS website template architecture. The Pages collection will serve as the primary content management system for general website pages, featuring a flexible block-based layout system, hierarchical organization, draft/publish workflow, and Next.js integration.

## Architecture

### Collection Structure

The Pages collection follows PayloadCMS best practices with:

- **TypeScript Interface**: `Page` type for type-safe operations
- **Slug Pattern**: `pages` for REST API endpoints (`/api/pages`)
- **Admin Grouping**: Organized under "Pages" group in admin panel
- **Access Control**: Public read for published content, authenticated for management
- **Versioning**: Draft support with autosave and scheduled publishing

### Integration Points

1. **SEO Plugin**: Automatic meta tag generation and Open Graph support
2. **Next.js Revalidation**: Cache invalidation on publish/unpublish
3. **Lexical Editor**: Rich text editing for content blocks
4. **Parent-Child Relationships**: Self-referencing for page hierarchy

## Components and Interfaces

### Main Collection Configuration

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  typescript: {
    interface: 'Page',
  },
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Pages',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false,
    },
    maxPerDoc: 100,
  },
  hooks: {
    afterChange: [revalidatePage],
  },
  fields: [
    // Field definitions
  ],
}
```

### Field Schema

#### Core Fields

1. **Title Field**
   - Type: `text`
   - Required: `true`
   - Purpose: Page display name and admin panel identifier

2. **Slug Field**
   - Type: `text`
   - Unique: `true`
   - Indexed: `true`
   - Auto-generation: From title using `beforeValidate` hook
   - Position: Sidebar
   - Validation: URL-safe characters only

3. **Parent Field**
   - Type: `relationship`
   - RelationTo: `pages` (self-referencing)
   - Position: Sidebar
   - Purpose: Hierarchical page organization
   - Filter: Exclude self to prevent circular references

4. **Breadcrumbs Field**
   - Type: `array`
   - Admin: Hidden (auto-populated)
   - Purpose: Store ancestor chain for navigation
   - Sub-fields:
     - `doc`: relationship to pages
     - `url`: text field for path
     - `label`: text field for display name

#### Layout Builder

5. **Layout Field**
   - Type: `blocks`
   - Purpose: Flexible page content composition
   - Blocks: Hero, Content, CallToAction, MediaBlock, Archive

### Block Definitions

#### Hero Block

```typescript
const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['default', 'centered', 'minimal'],
      defaultValue: 'default',
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      fields: [linkField],
    },
  ],
}
```

#### Content Block

```typescript
const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'size',
          type: 'select',
          options: ['oneThird', 'half', 'twoThirds', 'full'],
          defaultValue: 'full',
        },
        {
          name: 'richText',
          type: 'richText',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        {
          name: 'link',
          type: 'group',
          fields: [linkField],
          admin: {
            condition: (_, siblingData) => siblingData?.enableLink,
          },
        },
      ],
    },
  ],
}
```

#### Call To Action Block

```typescript
const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      fields: [linkField],
    },
  ],
}
```

#### Media Block

```typescript
const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'position',
      type: 'select',
      options: ['default', 'fullscreen'],
      defaultValue: 'default',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
    },
  ],
}
```

#### Archive Block

```typescript
const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
    },
    {
      name: 'populateBy',
      type: 'select',
      options: ['collection', 'selection'],
      defaultValue: 'collection',
    },
    {
      name: 'relationTo',
      type: 'select',
      options: ['blogs', 'services'],
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: ['blogs', 'services'],
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
  ],
}
```

### Link Field (Reusable)

```typescript
export const linkField: Field = {
  name: 'link',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Internal', value: 'reference' },
        { label: 'Custom URL', value: 'custom' },
      ],
      defaultValue: 'reference',
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'blogs', 'services'],
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Custom URL',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'appearance',
      type: 'select',
      options: ['default', 'primary', 'secondary'],
      defaultValue: 'default',
    },
  ],
}
```

## Data Models

### Page Document Structure

```typescript
interface Page {
  id: string
  title: string
  slug: string
  parent?: Page | string
  breadcrumbs?: Array<{
    doc: Page | string
    url: string
    label: string
  }>
  layout: Array<HeroBlock | ContentBlock | CallToActionBlock | MediaBlock | ArchiveBlock>
  _status: 'draft' | 'published'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
```

### Block Type Definitions

```typescript
interface HeroBlock {
  blockType: 'hero'
  type: 'default' | 'centered' | 'minimal'
  richText: any // Lexical JSON
  media?: Media | string
  links?: Array<LinkGroup>
}

interface ContentBlock {
  blockType: 'content'
  columns: Array<{
    size: 'oneThird' | 'half' | 'twoThirds' | 'full'
    richText: any
    enableLink?: boolean
    link?: LinkGroup
  }>
}

interface CallToActionBlock {
  blockType: 'cta'
  richText: any
  links?: Array<LinkGroup>
}

interface MediaBlock {
  blockType: 'mediaBlock'
  position: 'default' | 'fullscreen'
  media: Media | string
  caption?: any
}

interface ArchiveBlock {
  blockType: 'archive'
  introContent?: any
  populateBy: 'collection' | 'selection'
  relationTo?: 'blogs' | 'services'
  categories?: Array<Category | string>
  selectedDocs?: Array<Blog | Service | string>
  limit?: number
}

interface LinkGroup {
  type: 'reference' | 'custom'
  newTab?: boolean
  reference?: Page | Blog | Service | string
  url?: string
  label: string
  appearance: 'default' | 'primary' | 'secondary'
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Slug Generation Consistency

*For any* page with a title, if no slug is provided, then generating the slug should produce a URL-safe string that is lowercase, hyphen-separated, and contains no special characters.

**Validates: Requirements 1.3, 1.4**

### Property 2: Unique Slug Enforcement

*For any* two pages in the system, their slugs must be unique (no duplicate slugs allowed).

**Validates: Requirements 1.2**

### Property 3: Breadcrumb Ancestry Chain

*For any* page with a parent, the breadcrumbs array should contain all ancestor pages in hierarchical order from root to immediate parent.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 4: Circular Reference Prevention

*For any* page, setting its parent should fail if it would create a circular reference (page cannot be its own ancestor).

**Validates: Requirements 3.5**

### Property 5: Draft Validation Bypass

*For any* page saved as a draft, required field validation should be skipped, allowing incomplete pages to be saved.

**Validates: Requirements 4.2**

### Property 6: Published Content Visibility

*For any* unauthenticated request, only pages with `_status === 'published'` should be returned in query results.

**Validates: Requirements 5.2, 5.3**

### Property 7: Revalidation Path Correctness

*For any* page that is published or unpublished, the revalidation hook should be called with the correct path (slug or '/' for home).

**Validates: Requirements 6.1, 6.3, 6.4**

### Property 8: Slug Change Revalidation

*For any* page where the slug changes, both the old path and new path should be revalidated.

**Validates: Requirements 6.2**

## Error Handling

### Slug Validation Errors

- **Duplicate Slug**: Return 400 error with message "A page with this slug already exists"
- **Invalid Characters**: Return 400 error with message "Slug contains invalid characters"
- **Empty Slug**: Auto-generate from title or return 400 if title is also empty

### Circular Reference Errors

- **Self-Parent**: Return 400 error with message "A page cannot be its own parent"
- **Ancestor Loop**: Return 400 error with message "This would create a circular reference"

### Revalidation Errors

- **Revalidation Failure**: Log error but don't fail the save operation
- **Missing Slug**: Skip revalidation if slug is undefined

### Access Control Errors

- **Unauthorized Create**: Return 401 error with message "Authentication required"
- **Unauthorized Update**: Return 401 error with message "Authentication required"
- **Unauthorized Delete**: Return 401 error with message "Authentication required"

## Testing Strategy

### Unit Tests

1. **Slug Generation**
   - Test title to slug conversion
   - Test special character removal
   - Test space to hyphen conversion
   - Test lowercase conversion

2. **Breadcrumb Population**
   - Test single-level hierarchy
   - Test multi-level hierarchy
   - Test breadcrumb order

3. **Access Control**
   - Test authenticated user access
   - Test unauthenticated user access
   - Test published vs draft visibility

### Property-Based Tests

Each property test should run a minimum of 100 iterations to ensure comprehensive coverage.

1. **Property 1: Slug Generation Consistency**
   - Generate random titles with various characters
   - Verify all generated slugs are URL-safe
   - **Feature: pages-collection-setup, Property 1: Slug generation produces URL-safe strings**

2. **Property 2: Unique Slug Enforcement**
   - Attempt to create pages with duplicate slugs
   - Verify system rejects duplicates
   - **Feature: pages-collection-setup, Property 2: No two pages can have the same slug**

3. **Property 3: Breadcrumb Ancestry Chain**
   - Generate random page hierarchies
   - Verify breadcrumbs contain all ancestors in order
   - **Feature: pages-collection-setup, Property 3: Breadcrumbs reflect complete ancestry**

4. **Property 4: Circular Reference Prevention**
   - Attempt to create circular parent-child relationships
   - Verify system prevents circular references
   - **Feature: pages-collection-setup, Property 4: Circular references are prevented**

5. **Property 5: Draft Validation Bypass**
   - Create drafts with missing required fields
   - Verify drafts save successfully
   - **Feature: pages-collection-setup, Property 5: Drafts bypass required validation**

6. **Property 6: Published Content Visibility**
   - Query pages without authentication
   - Verify only published pages are returned
   - **Feature: pages-collection-setup, Property 6: Unauthenticated users see only published pages**

7. **Property 7: Revalidation Path Correctness**
   - Publish/unpublish pages with various slugs
   - Verify correct paths are revalidated
   - **Feature: pages-collection-setup, Property 7: Revalidation uses correct paths**

8. **Property 8: Slug Change Revalidation**
   - Change page slugs
   - Verify both old and new paths are revalidated
   - **Feature: pages-collection-setup, Property 8: Slug changes revalidate both paths**

### Integration Tests

1. **End-to-End Page Creation**
   - Create page via API
   - Verify page appears in admin panel
   - Verify page is accessible via slug

2. **Draft to Published Workflow**
   - Create draft page
   - Publish page
   - Verify revalidation occurs
   - Verify page is publicly accessible

3. **Hierarchical Navigation**
   - Create parent and child pages
   - Verify breadcrumbs are correct
   - Verify parent-child relationships

### Testing Framework

- **Unit Tests**: Vitest
- **Property Tests**: fast-check (TypeScript property-based testing library)
- **Integration Tests**: Playwright for E2E testing
- **Test Configuration**: Minimum 100 iterations per property test
