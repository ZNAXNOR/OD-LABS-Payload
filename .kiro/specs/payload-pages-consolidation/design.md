# Design Document: Payload CMS Pages Collection Consolidation

## Overview

This design consolidates five specialized Payload CMS collections (Pages, Blogs, Services, Legal, Contacts) into a single canonical Pages collection. The solution uses a discriminator field (`pageType`) with conditional field groups to maintain all existing functionality while simplifying the content management architecture.

The design preserves all existing patterns including audit trails, revalidation hooks, access control, hierarchical structures, block layouts, and live preview functionality. The consolidation is achieved through strategic field organization and conditional rendering rather than feature removal or rewriting.

## Architecture

### Collection Structure

The unified Pages collection follows this architectural pattern:

```
Pages Collection
├── Core Fields (all page types)
│   ├── pageType (discriminator)
│   ├── title, slug, status
│   └── shared metadata (behavioral, non-rendered)
├── Conditional Field Groups
│   ├── Blog Fields (when pageType = 'blog')
│   ├── Service Fields (when pageType = 'service')
│   ├── Legal Fields (when pageType = 'legal')
│   └── Contact Fields (when pageType = 'contact')
├── Universal Fields (all page types)
│   ├── Block Layout System (primary rendered content)
│   ├── SEO Metadata
│   ├── Hierarchical Metadata
│   └── Audit & Lifecycle Metadata
└── Hook System
    ├── Audit Trail Hooks
    ├── Revalidation Hooks
    └── Slug Generation Hooks
```

**Conditional Configuration Groups:**

Each page type exposes a dedicated configuration object containing
page-type–specific metadata and behavior controls.

- `blogConfig`: author, tags, publishedDate, excerpt
- `serviceConfig`: pricing, serviceType, featured
- `legalConfig`: documentType, effectiveDate, lastUpdated, notificationSettings
- `contactConfig`: purpose, form relationships

These configuration groups:
- Do NOT contain rendered content
- Are conditionally displayed based on `pageType`
- Are consumed by frontend logic only when behavior differs

### Page Type Discrimination

The `pageType` field serves as the primary discriminator:

```typescript
{
  name: 'pageType',
  type: 'select',
  options: [
    { label: 'Page', value: 'page' },
    { label: 'Blog Post', value: 'blog' },
    { label: 'Service', value: 'service' },
    { label: 'Legal Document', value: 'legal' },
    { label: 'Contact Page', value: 'contact' }
  ],
  defaultValue: 'page',
  required: true,
  admin: {
    position: 'sidebar',
    description: 'Determines which fields are available for this page'
  }
}
```

### Conditional Field Architecture

Each page type's specific fields are organized into conditional groups using `admin.condition`:

```typescript
// Example: Blog-specific fields
{
  type: 'group',
  name: 'blogFields',
  admin: {
    condition: (data) => data.pageType === 'blog'
  },
  fields: [
    // Blog-specific fields here
  ]
}
```

## Components and Interfaces

### Field Organization Strategy

The consolidated Pages collection follows a strict separation between
**rendered content**, **behavioral metadata**, and **page-type configuration**
to ensure frontend clarity and long-term maintainability.

#### Tab Structure

**Content Tab**
- Primary rendered content
- Contains the `layout` blocks field
- All visual composition (including heroes) is defined here

**Configuration Tab**
- Page-type–specific configuration fields
- Fields are conditionally rendered based on `pageType`
- Contains only non-rendered, behavioral, or structural data

**SEO Tab**
- Universal across all page types
- Contains metadata only

#### Sidebar Fields

- `pageType` selector (primary discriminator)
- `slug` (shared generation logic)
- Publishing status & scheduling controls

### Hook System Architecture

**Audit Trail Integration:**

```typescript
import { createAuditTrailHook } from '../shared/hooks/createAuditTrailHook'

const auditHook = createAuditTrailHook({
  collection: 'pages',
  trackFields: ['title', 'status', 'pageType', 'content'],
})
```

**Revalidation Strategy:**

```typescript
import { createRevalidateHook } from '../shared/hooks/createRevalidateHook'

const revalidateHook = createRevalidateHook({
  getRevalidationPaths: (doc) => {
    const paths = [`/${doc.slug}`]

    // Add pageType-specific paths
    switch (doc.pageType) {
      case 'blog':
        paths.push('/blog', `/blog/${doc.slug}`)
        break
      case 'service':
        paths.push('/services', `/services/${doc.slug}`)
        break
      // ... other cases
    }

    return paths
  },
})
```

### Access Control Preservation

The consolidated collection maintains identical access control semantics:

```typescript
access: {
  create: authenticated,
  read: authenticatedOrPublished,
  update: authenticated,
  delete: authenticated,
  admin: authenticated
}
```

Field-level access controls are preserved within conditional groups, maintaining the same security boundaries as the original collections.

## Data Models

### Core Page Model

```typescript
interface BasePage {
  id: string
  pageType: 'page' | 'blog' | 'service' | 'legal' | 'contact'

  // Identity
  title: string
  slug: string
  status: 'draft' | 'published'

  // Rendered content
  layout: Block[]

  // Metadata & behavior (non-rendered)
  metadata: {
    seo: SEOFields
    hierarchy?: {
      parent?: string
      breadcrumbs?: Array<{
        doc: string
        label: string
        url: string
      }>
    }
  }

  // Lifecycle & audit
  audit: {
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
  }
}
```

### Page Type Extensions

```typescript
interface BlogPage extends BasePage {
  pageType: 'blog'
  blogConfig: {
    author: string
    tags: string[]
    publishedDate: string
    excerpt: string
  }
}

interface ServicePage extends BasePage {
  pageType: 'service'
  serviceConfig: {
    pricing: {
      amount: number
      currency: string
      period: string
    }
    serviceType: string
    featured: boolean
  }
}

interface LegalPage extends BasePage {
  pageType: 'legal'
  legalConfig: {
    documentType: string
    effectiveDate: string
    lastUpdated: string
    notificationSettings?: {
      notifyOnChange: boolean
      recipients?: string[]
    }
  }
}

interface ContactPage extends BasePage {
  pageType: 'contact'
  contactConfig: {
    purpose: string
    forms: string[]
  }
}
```

### Block System Preservation

All existing blocks are preserved. Shared blocks are available to all page types, while page-type–specific blocks may be conditionally enabled based on `pageType`.


```typescript
import { HeroBlock } from '../blocks/Hero'
import { ContentBlock } from '../blocks/Content'
import { CallToActionBlock } from '../blocks/CallToAction'
// ... all other existing blocks

const layoutField = {
  name: 'layout',
  type: 'blocks',
  blocks: [
    HeroBlock,
    ContentBlock,
    CallToActionBlock,
    // ... all existing blocks
  ],
}
```

## Correctness Properties

Now I need to analyze the acceptance criteria to create correctness properties. Let me use the prework tool:

<function_calls>
<invoke name="prework">
<parameter name="featureName">payload-pages-consolidation

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated to eliminate redundancy:

**Field Availability Properties (2.1-2.4):** These can be combined into a single comprehensive property that tests field availability based on pageType.

**Access Control Properties (5.1-5.5):** These can be consolidated into properties that test access control behavior across all page types.

**Validation Properties (12.1-12.5):** These can be combined into comprehensive validation properties that test all validation rules.

**API Compatibility Properties (10.1-10.4):** These can be consolidated into properties that test API compatibility across all page types.

### Core Properties

**Property 1: PageType-Specific Field Availability**
_For any_ pageType value, when creating a page with that pageType, all fields specific to that page type should be accessible and all non-applicable fields should be conditionally hidden
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Property 2: Universal Field Preservation**
_For any_ pageType value, when creating a page, all universal fields (slug, SEO, blocks, audit fields) should always be present and accessible
**Validates: Requirements 2.5**

**Property 3: Conditional Field Visibility**
_For any_ pageType selection, only the fields relevant to that pageType should be displayed in the admin interface
**Validates: Requirements 1.3**

**Property 4: Field Definition Preservation**
_For any_ field from the original collections, the field definition in the consolidated collection should maintain the same type, validation rules, and configuration
**Validates: Requirements 1.4**

**Property 5: Validation Rule Preservation**
_For any_ validation rule from the original collections, the same validation should apply to the corresponding fields in the consolidated collection
**Validates: Requirements 1.5, 12.1, 12.2, 12.4, 12.5**

**Property 6: Hierarchical Relationship Preservation**
_For any_ parent-child page relationship, the hierarchical structure should be maintained regardless of the pageType of parent or child pages
**Validates: Requirements 3.1, 3.4**

**Property 7: Breadcrumb Generation Consistency**
_For any_ hierarchical page structure, breadcrumbs should be generated correctly regardless of the pageType of pages in the hierarchy
**Validates: Requirements 3.2**

**Property 8: Circular Reference Prevention**
_For any_ attempt to create a circular parent-child relationship, the validation should prevent the circular reference regardless of pageType
**Validates: Requirements 3.3, 12.3**

**Property 9: URL Generation Preservation**
_For any_ page with hierarchical structure, the URL generation should follow the same patterns as the original collections
**Validates: Requirements 3.5**

**Property 10: Audit Trail Functionality**
_For any_ CRUD operation on a page, audit trail records should be created with the same information as the original collections
**Validates: Requirements 4.1**

**Property 11: Revalidation Hook Execution**
_For any_ page update, the appropriate revalidation paths should be triggered based on the pageType and page hierarchy
**Validates: Requirements 4.2, 4.3**

**Property 12: Slug Generation Consistency**
_For any_ page creation or title update, slug generation should follow the same logic as the original collections
**Validates: Requirements 4.4**

**Property 13: Access Control Preservation**
_For any_ user and operation combination, the access control behavior should match the original collections' behavior
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

**Property 14: Block System Preservation**
_For any_ block type from the original collections, the block should be available and function identically in the consolidated collection
**Validates: Requirements 6.1, 6.2, 6.3**

**Property 15: Live Preview Functionality**
_For any_ pageType, live preview should work correctly for both draft and published content
**Validates: Requirements 7.1, 7.5**

**Property 16: Preview URL Generation**
_For any_ page, preview URLs should be generated correctly based on pageType and hierarchical structure
**Validates: Requirements 7.2**

**Property 17: Preview Configuration Preservation**
_For any_ preview configuration from the original collections, the same configuration should apply in the consolidated collection
**Validates: Requirements 7.3**

**Property 18: API Behavioral Equivalence**
_For any_ frontend use case supported before consolidation, the consolidated Pages API SHALL provide equivalent data sufficient to produce identical frontend behavior.
**Validates: Requirements 10.1, 10.3**

**Property 19: GraphQL Compatibility Boundary**
_Existing_ GraphQL queries MAY require namespace adjustments, but the semantic meaning and structure of returned data SHALL remain consistent.
**Validates: Requirements 10.2**

**Property 20: Data Serialization Consistency**
_For any_ page data, serialization and deserialization should produce the same results as the original collections
**Validates: Requirements 10.4**

**Property 21: Field Description Preservation**
_For any_ field with descriptions or help text in the original collections, the same descriptions should be present in the consolidated collection
**Validates: Requirements 11.2**

## Error Handling

### Validation Error Handling

The consolidated collection maintains all existing validation error patterns:

**Field Validation Errors:**

- Required field violations return specific field-level errors
- Type validation errors maintain original error messages
- Custom validation errors preserve original logic and messaging

**Cross-Field Validation Errors:**

- Circular reference detection returns descriptive error messages
- Conditional field validation respects pageType context
- Hierarchical validation errors maintain original specificity

**Access Control Errors:**

- Unauthorized access attempts return consistent 401/403 responses
- Field-level access violations return appropriate error messages
- Role-based access errors maintain original messaging patterns

### Hook Error Handling

**Audit Trail Errors:**

- Audit trail failures are logged but don't block primary operations
- Audit trail errors maintain original error handling patterns
- Failed audit operations trigger appropriate alerts

**Revalidation Errors:**

- Revalidation failures are logged but don't block content updates
- Failed revalidation attempts are retried using existing retry logic
- Revalidation errors maintain original error handling patterns

**Slug Generation Errors:**

- Slug generation failures fall back to ID-based slugs
- Duplicate slug detection maintains original conflict resolution
- Slug validation errors return descriptive messages

### Migration Error Handling

**Data Migration Errors:**

- Migration failures trigger automatic rollback procedures
- Data integrity violations are logged with specific details
- Migration errors provide clear recovery instructions

**Schema Migration Errors:**

- Schema changes are validated before application
- Schema migration failures trigger rollback procedures
- Schema errors provide specific field-level details

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**

- Test specific examples of pageType field configurations
- Test edge cases for conditional field visibility
- Test error conditions for validation failures
- Test integration points between hooks and collection operations

**Property-Based Tests:**

- Test universal properties across all pageType values
- Test field availability and validation across randomized inputs
- Test hierarchical relationships with randomized page structures
- Test access control behavior across different user and permission combinations

### Property-Based Testing Configuration

All property tests will be configured to run a minimum of 100 iterations using the appropriate property-based testing library for TypeScript/JavaScript (fast-check). Each property test will be tagged with comments referencing the design document property:

**Tag Format:** `// Feature: payload-pages-consolidation, Property {number}: {property_text}`

**Example Test Structure:**

```typescript
// Feature: payload-pages-consolidation, Property 1: PageType-Specific Field Availability
test('pageType-specific field availability', () => {
  fc.assert(
    fc.property(fc.constantFrom('page', 'blog', 'service', 'legal', 'contact'), (pageType) => {
      const page = createPageWithType(pageType)
      const availableFields = getAvailableFields(page)
      return verifyFieldsMatchPageType(availableFields, pageType)
    }),
    { numRuns: 100 },
  )
})
```

### Testing Priorities

**High Priority (Core Functionality):**

1. PageType field configuration and conditional field visibility
2. Field preservation from original collections
3. Validation rule preservation
4. Access control behavior
5. Hook system functionality (audit, revalidation, slug generation)

**Medium Priority (Integration Points):**

1. Hierarchical relationship preservation
2. Block system functionality
3. Live preview functionality
4. API compatibility
5. Database migration integrity

**Lower Priority (UI/UX):**

1. Admin interface consistency
2. Field descriptions and help text
3. Performance characteristics
4. Error message formatting

### Test Data Management

**Test Data Generation:**

- Use property-based testing generators for randomized page data
- Create representative test data sets for each pageType
- Generate hierarchical page structures for relationship testing
- Create user profiles with different permission levels for access control testing

**Test Environment Setup:**

- Use isolated test databases for each test suite
- Reset database state between test runs
- Mock external dependencies (Next.js revalidation, audit systems)
- Provide test fixtures for complex scenarios

### Migration Testing

**Pre-Migration Testing:**

- Validate existing collection schemas and data integrity
- Test migration scripts against representative data sets
- Verify rollback procedures work correctly
- Test migration performance with large data sets

**Post-Migration Testing:**

- Verify all data migrated correctly with no loss
- Test all functionality works with migrated data
- Verify performance characteristics are maintained
- Test frontend compatibility with migrated data

**Continuous Testing:**

- Run property-based tests against production-like data sets
- Monitor system performance during and after migration
- Validate API compatibility with existing frontend code
- Test backup and recovery procedures
