# Design Document

## Overview

This design document outlines the implementation strategy for organizing and assigning content blocks across different page collection types in the PayloadCMS website. The system will provide contextually appropriate block options for each page type (Blogs, Services, Contacts, Legal, Pages) while maintaining backward compatibility with existing content.

The implementation involves:

1. Creating centralized block configuration utilities
2. Updating each page collection with appropriate block assignments
3. Ensuring type safety through TypeScript
4. Maintaining backward compatibility for existing pages
5. Organizing frontend components to match block categories

## Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Block Configuration Layer                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  src/blocks/config/                                    │  │
│  │  - blockAssignments.ts (centralized configuration)     │  │
│  │  - blockCategories.ts (category definitions)           │  │
│  │  - types.ts (TypeScript interfaces)                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Page Collections Layer                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Blogs   │  │ Services │  │ Contacts │  │  Legal   │      │
│  │  (14)    │  │  (17)    │  │   (8)    │  │   (5)    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                    ┌──────────┐                              │
│                    │  Pages   │                              │
│                    │  (All)   │                              │
│                    └──────────┘                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Frontend Components Layer                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  src/components/blocks/                                 │ │
│  │  - Hero/, Content/, Services/, Portfolio/               │ │
│  │  - Technical/, CTA/, Layout/                            │ │
│  │  - BlockRenderer.tsx (dynamic block rendering)          │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── blocks/
│   ├── config/
│   │   ├── blockAssignments.ts      # Centralized block assignments
│   │   ├── blockCategories.ts       # Category definitions
│   │   └── types.ts                 # TypeScript types
│   ├── Hero/
│   ├── Content/
│   ├── services/
│   │   ├── ServicesGrid/
│   │   ├── TechStack/
│   │   ├── ProcessSteps/
│   │   └── PricingTable/
│   ├── portfolio/
│   │   ├── ProjectShowcase/
│   │   ├── CaseStudy/
│   │   ├── BeforeAfter/
│   │   └── Testimonial/
│   ├── technical/
│   │   ├── FeatureGrid/
│   │   ├── StatsCounter/
│   │   ├── FAQAccordion/
│   │   └── Timeline/
│   ├── cta/
│   │   ├── ContactForm/
│   │   ├── Newsletter/
│   │   └── SocialProof/
│   ├── layout/
│   │   ├── Container/
│   │   ├── Divider/
│   │   └── Spacer/
│   └── index.ts
├── pages/
│   ├── Blogs/
│   │   └── index.ts                 # Updated with blog blocks
│   ├── Services/
│   │   └── index.ts                 # Updated with service blocks
│   ├── Contacts/
│   │   └── index.ts                 # Updated with contact blocks
│   ├── Legal/
│   │   └── index.ts                 # Updated with legal blocks
│   └── Pages/
│       └── index.ts                 # All blocks (unchanged)
└── components/
    └── blocks/
        ├── BlockRenderer.tsx        # Dynamic block component renderer
        └── [category]/              # Organized by category
            └── [BlockName]/
                ├── index.tsx
                └── types.ts
```

## Components and Interfaces

### 1. Block Configuration System

#### blockCategories.ts

Defines the logical grouping of blocks by category:

```typescript
import type { Block } from 'payload'

export interface BlockCategory {
  label: string
  description: string
  blocks: Block[]
}

export const BLOCK_CATEGORIES = {
  HERO: 'hero',
  CONTENT: 'content',
  SERVICES: 'services',
  PORTFOLIO: 'portfolio',
  TECHNICAL: 'technical',
  CTA: 'cta',
  LAYOUT: 'layout',
} as const

export type BlockCategoryKey = (typeof BLOCK_CATEGORIES)[keyof typeof BLOCK_CATEGORIES]
```

#### blockAssignments.ts

Centralized configuration for which blocks are available to each page collection:

```typescript
import type { Block } from 'payload'
import { HeroBlock } from '@/blocks/Hero/config'
import { ContentBlock } from '@/blocks/Content/config'
// ... other imports

export interface PageCollectionBlocks {
  hero?: Block[]
  layout: Block[]
}

export const BLOCK_ASSIGNMENTS = {
  blogs: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      ArchiveBlock,
      Banner,
      Code,
      // Technical blocks
      FeatureGridBlock,
      StatsCounterBlock,
      FAQAccordionBlock,
      TimelineBlock,
      // CTA blocks
      CallToActionBlock,
      NewsletterBlock,
      SocialProofBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },
  services: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      CallToActionBlock,
      // Services blocks
      ServicesGridBlock,
      TechStackBlock,
      ProcessStepsBlock,
      PricingTableBlock,
      // Portfolio blocks (testimonial only)
      TestimonialBlock,
      // Technical blocks
      FeatureGridBlock,
      StatsCounterBlock,
      FAQAccordionBlock,
      // CTA blocks
      ContactFormBlock,
      NewsletterBlock,
      SocialProofBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },
  contacts: {
    hero: [HeroBlock],
    layout: [
      // Content blocks
      ContentBlock,
      MediaBlock,
      // CTA blocks
      ContactFormBlock,
      SocialProofBlock,
      // Technical blocks
      FAQAccordionBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },
  legal: {
    hero: [], // No hero for legal pages
    layout: [
      // Content blocks
      ContentBlock,
      Banner,
      // Technical blocks
      FAQAccordionBlock,
      // Layout blocks
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },
  pages: {
    hero: [HeroBlock],
    layout: [
      // All blocks available
      ContentBlock,
      CallToActionBlock,
      MediaBlock,
      ArchiveBlock,
      Banner,
      Code,
      ServicesGridBlock,
      TechStackBlock,
      ProcessStepsBlock,
      PricingTableBlock,
      ProjectShowcaseBlock,
      CaseStudyBlock,
      BeforeAfterBlock,
      TestimonialBlock,
      FeatureGridBlock,
      StatsCounterBlock,
      FAQAccordionBlock,
      TimelineBlock,
      ContactFormBlock,
      NewsletterBlock,
      SocialProofBlock,
      ContainerBlock,
      DividerBlock,
      SpacerBlock,
    ],
  },
} as const

export type PageCollectionType = keyof typeof BLOCK_ASSIGNMENTS

// Helper function to get blocks for a collection
export function getBlocksForCollection(collection: PageCollectionType): PageCollectionBlocks {
  return BLOCK_ASSIGNMENTS[collection]
}
```

#### types.ts

TypeScript type definitions for block assignments:

```typescript
import type { Block } from 'payload'

export interface BlockAssignment {
  collection: string
  hero?: Block[]
  layout: Block[]
}

export interface BlockMetadata {
  slug: string
  category: string
  label: string
  description: string
  availableIn: string[]
}

export type BlockMap = Record<string, Block>
```

### 2. Page Collection Updates

Each page collection will be updated to use the centralized block configuration:

#### Example: Blogs Collection

```typescript
import type { CollectionConfig } from 'payload'
import { getBlocksForCollection } from '@/blocks/config/blockAssignments'

const blogBlocks = getBlocksForCollection('blogs')

export const BlogPages: CollectionConfig = {
  slug: 'blogs',
  // ... other config
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Layout',
          description: 'Add content blocks to build your blog post layout',
          fields: [
            {
              name: 'hero',
              type: 'blocks',
              label: 'Hero Section',
              blocks: blogBlocks.hero,
              maxRows: 1,
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Content Blocks',
              blocks: blogBlocks.layout,
            },
          ],
        },
      ],
    },
    // ... sidebar fields
  ],
}
```

### 3. Frontend Component Organization

#### BlockRenderer Component

Dynamic component that renders blocks based on their type:

```typescript
import React from 'react'
import type { Block } from '@/blocks/types'

// Import all block components
import { Hero } from '@/components/blocks/Hero'
import { Content } from '@/components/blocks/Content'
// ... other imports

const BLOCK_COMPONENTS = {
  hero: Hero,
  content: Content,
  mediaBlock: MediaBlock,
  // ... map all blocks
} as const

interface BlockRendererProps {
  blocks: Block[]
  className?: string
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.blockType]

        if (!Component) {
          console.warn(`No component found for block type: ${block.blockType}`)
          return null
        }

        return <Component key={`${block.blockType}-${index}`} {...block} />
      })}
    </div>
  )
}
```

## Data Models

### Block Assignment Data Structure

```typescript
interface BlockAssignmentConfig {
  blogs: {
    hero: Block[] // 1 block
    layout: Block[] // 13 blocks
  }
  services: {
    hero: Block[] // 1 block
    layout: Block[] // 16 blocks
  }
  contacts: {
    hero: Block[] // 1 block
    layout: Block[] // 7 blocks
  }
  legal: {
    hero: Block[] // 0 blocks
    layout: Block[] // 5 blocks
  }
  pages: {
    hero: Block[] // 1 block
    layout: Block[] // 27+ blocks
  }
}
```

### Page Document Structure

Each page document will have this structure:

```typescript
interface PageDocument {
  id: string
  title: string
  slug: string
  hero?: HeroBlock[] // Optional hero section
  layout: Block[] // Main content blocks
  _status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  // ... other fields
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Block Assignment Completeness

_For any_ page collection type, all blocks assigned to that collection must exist and be properly imported.

**Validates: Requirements 1.1, 2.1, 3.1, 4.1, 5.1**

### Property 2: Block Category Consistency

_For any_ block in a page collection's assignment, that block must belong to an allowed category for that collection type.

**Validates: Requirements 1.5, 1.6, 2.7, 2.8, 3.5, 3.6, 3.7, 4.5, 4.6, 4.7**

### Property 3: Type Safety Validation

_For any_ block configuration, TypeScript compilation must succeed without type errors.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 4: Component Mapping Completeness

_For any_ block type assigned to a collection, a corresponding React component must exist in the components directory.

**Validates: Requirements 7.1, 7.2**

### Property 5: Backward Compatibility Preservation

_For any_ existing page document with blocks, all blocks must remain accessible and renderable after migration.

**Validates: Requirements 10.1, 10.2, 10.4**

### Property 6: Block Import Organization

_For any_ page collection configuration file, block imports must be grouped by category with consistent ordering.

**Validates: Requirements 6.1, 6.2, 6.4**

### Property 7: Hero Block Constraint

_For any_ page collection with hero blocks enabled, the hero field must have maxRows: 1 constraint.

**Validates: Requirements 1.1, 2.1, 3.1, 4.5**

### Property 8: Legal Pages Minimalism

_For any_ legal page collection, only document-focused blocks (Content, Banner, FAQAccordion, Layout) must be available.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 9: Services Block Exclusivity

_For any_ non-service page collection (except Pages), Services category blocks must not be available.

**Validates: Requirements 1.5, 3.5, 4.7**

### Property 10: Block Renderer Fallback

_For any_ unrecognized block type, the BlockRenderer must log a warning and skip rendering without crashing.

**Validates: Requirements 7.3**

## Error Handling

### 1. Missing Block Component

**Scenario**: A block type is configured but no React component exists.

**Handling**:

- Log warning to console: `"No component found for block type: {blockType}"`
- Skip rendering that block
- Continue rendering remaining blocks
- Display admin warning in development mode

### 2. Invalid Block Configuration

**Scenario**: A block is assigned to a collection but the import fails.

**Handling**:

- TypeScript compilation error at build time
- Clear error message indicating which block and collection
- Prevent deployment until resolved

### 3. Legacy Block in Restricted Collection

**Scenario**: An existing page has a block that's no longer available for its collection type.

**Handling**:

- Continue rendering the block on frontend (backward compatibility)
- Display admin warning when editing: "This block is no longer available for new additions"
- Preserve block data unless explicitly removed
- Prevent adding new instances of that block type

### 4. Circular Dependencies

**Scenario**: Block imports create circular dependency issues.

**Handling**:

- Use dynamic imports for block components
- Lazy load block components in BlockRenderer
- Ensure block config files don't import from page collections

### 5. Type Mismatch

**Scenario**: Block data doesn't match expected TypeScript interface.

**Handling**:

- Validate block data at runtime in development mode
- Log detailed error with block type and expected vs actual structure
- Render fallback component or skip block
- Report to error monitoring service in production

## Testing Strategy

### Unit Tests

**Block Configuration Tests**:

- Test `getBlocksForCollection()` returns correct blocks for each collection
- Test block assignments don't include undefined or null blocks
- Test hero blocks have maxRows: 1 constraint
- Test legal pages don't include hero blocks

**Component Tests**:

- Test BlockRenderer renders each block type correctly
- Test BlockRenderer handles missing components gracefully
- Test BlockRenderer logs warnings for unknown block types
- Test each block component renders with valid props

**Type Tests**:

- Test TypeScript compilation succeeds for all configurations
- Test block assignments match PageCollectionBlocks interface
- Test all block types are properly typed

### Property-Based Tests

**Property 1: Block Assignment Completeness**

```typescript
// For any collection type, all assigned blocks must be valid Block objects
test('all assigned blocks are valid', () => {
  forAll(collectionType, (type) => {
    const blocks = getBlocksForCollection(type)
    return blocks.layout.every((block) => block && typeof block === 'object' && 'slug' in block)
  })
})
```

**Property 2: Block Category Consistency**

```typescript
// For any block in a collection, it must belong to an allowed category
test('blocks belong to allowed categories', () => {
  forAll(collectionType, block, (type, block) => {
    const allowedCategories = getAllowedCategories(type)
    return allowedCategories.includes(block.category)
  })
})
```

**Property 3: Component Mapping**

```typescript
// For any block type, a component must exist
test('all blocks have components', () => {
  forAll(blockType, (type) => {
    return BLOCK_COMPONENTS[type] !== undefined
  })
})
```

**Property 4: Backward Compatibility**

```typescript
// For any existing page with blocks, all blocks must render
test('legacy blocks still render', () => {
  forAll(existingPage, (page) => {
    const rendered = renderBlocks(page.layout)
    return rendered.length === page.layout.length
  })
})
```

### Integration Tests

**Page Collection Tests**:

- Test creating a blog page with blog-specific blocks
- Test creating a service page with service-specific blocks
- Test creating a contact page with contact-specific blocks
- Test creating a legal page with legal-specific blocks
- Test general pages have access to all blocks

**Admin Panel Tests**:

- Test block picker shows only allowed blocks for each collection
- Test hero section limited to 1 block
- Test drag-and-drop block ordering works
- Test block deletion works correctly

**Frontend Rendering Tests**:

- Test pages render correctly with assigned blocks
- Test BlockRenderer handles all block types
- Test responsive rendering of blocks
- Test block styling and layout

### End-to-End Tests

**Content Editor Workflow**:

1. Create new blog post
2. Verify only blog-appropriate blocks are available
3. Add hero block
4. Add multiple content blocks
5. Publish page
6. Verify frontend renders correctly

**Migration Workflow**:

1. Load existing page with all block types
2. Verify page still renders correctly
3. Edit page in admin
4. Verify legacy blocks are preserved
5. Verify new blocks follow restrictions

## Performance Considerations

### 1. Block Import Optimization

- Use tree-shaking to eliminate unused blocks from bundles
- Lazy load block components on frontend
- Code-split by page collection type

### 2. Configuration Caching

- Cache block assignments at build time
- Avoid runtime computation of block lists
- Use static imports where possible

### 3. Component Rendering

- Memoize BlockRenderer component
- Use React.memo for individual block components
- Implement virtual scrolling for long page layouts

### 4. Type Checking

- Run TypeScript checks in CI/CD pipeline
- Use incremental compilation for faster builds
- Cache type checking results

## Migration Strategy

### Phase 1: Setup (No Breaking Changes)

1. Create `src/blocks/config/` directory
2. Implement `blockAssignments.ts` with all configurations
3. Implement `blockCategories.ts` with category definitions
4. Add TypeScript types in `types.ts`
5. Run tests to verify configuration is valid

### Phase 2: Update Collections (Backward Compatible)

1. Update Blogs collection to use new block assignments
2. Update Services collection to use new block assignments
3. Update Contacts collection to use new block assignments
4. Update Legal collection to use new block assignments
5. Keep Pages collection unchanged (all blocks)
6. Deploy and verify existing pages still work

### Phase 3: Frontend Updates

1. Create BlockRenderer component
2. Organize components by category
3. Update page rendering to use BlockRenderer
4. Test all block types render correctly

### Phase 4: Documentation and Cleanup

1. Document block assignments in README
2. Add inline code comments
3. Create admin panel help text
4. Remove deprecated code
5. Update developer documentation

## Security Considerations

### 1. Access Control

- Block assignments don't affect access control
- Existing access control rules remain unchanged
- Content editors still need appropriate permissions

### 2. Data Validation

- Validate block data matches expected schema
- Sanitize user input in block fields
- Prevent XSS in rich text blocks

### 3. Type Safety

- TypeScript prevents invalid block configurations
- Runtime validation in development mode
- Error boundaries prevent crashes from bad data

## Deployment Considerations

### 1. Zero-Downtime Deployment

- New block assignments are backward compatible
- Existing pages continue to work
- No database migrations required

### 2. Rollback Strategy

- Keep previous version deployed
- Monitor error rates after deployment
- Quick rollback if issues detected

### 3. Monitoring

- Log block rendering errors
- Track which blocks are most used
- Monitor page load performance

## Future Enhancements

### 1. Dynamic Block Assignments

- Allow admins to configure block assignments via UI
- Store assignments in database
- Hot-reload block configurations

### 2. Block Variants

- Create page-type-specific variants of blocks
- Example: BlogHero vs ServiceHero
- Customize block fields per collection

### 3. Block Analytics

- Track which blocks are used most
- Identify unused blocks for removal
- Optimize based on usage patterns

### 4. Block Versioning

- Version block schemas
- Migrate block data automatically
- Support multiple block versions simultaneously

### 5. Block Marketplace

- Share custom blocks across projects
- Import community-created blocks
- Export blocks as packages
