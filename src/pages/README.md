# Pages Collections Hooks

This directory contains all page collections for the Payload CMS project, each with comprehensive hooks for enhanced functionality.

## Collections Overview

### 1. Pages (`/src/pages/Pages/`)

- **Purpose**: Main website pages with layout builder support
- **Features**: Hierarchical structure, breadcrumbs, draft/publish workflow
- **Hooks**:
  - `populateBreadcrumbs` - Automatically generates breadcrumb navigation
  - `revalidatePage` - Handles Next.js revalidation on publish/unpublish

### 2. Blog Pages (`/src/pages/Blogs/`)

- **Purpose**: Blog posts and articles
- **Features**: Author tracking, tags, publish dates, draft/publish workflow
- **Hooks**:
  - `generateSlug` - Auto-generates URL-friendly slugs from titles
  - `auditTrail` - Tracks who created/updated posts
  - `revalidateBlog` - Handles Next.js revalidation for blog routes

### 3. Contact Pages (`/src/pages/Contacts/`)

- **Purpose**: Contact forms and contact information pages
- **Features**: Form integration, contact settings, sidebar content
- **Hooks**:
  - `generateSlug` - Auto-generates URL-friendly slugs from titles
  - `auditTrail` - Tracks who created/updated pages
  - `revalidateContact` - Handles Next.js revalidation for contact routes

### 4. Legal Pages (`/src/pages/Legal/`)

- **Purpose**: Legal documents (privacy policy, terms of service, etc.)
- **Features**: Document type classification, effective dates, auto-update tracking
- **Hooks**:
  - `generateSlug` - Auto-generates URL-friendly slugs from titles
  - `auditTrail` - Tracks who created/updated documents
  - `revalidateLegal` - Handles Next.js revalidation for legal routes

### 5. Service Pages (`/src/pages/Services/`)

- **Purpose**: Service offerings and descriptions
- **Features**: Service categorization, pricing information, featured services
- **Hooks**:
  - `generateSlug` - Auto-generates URL-friendly slugs from titles
  - `auditTrail` - Tracks who created/updated services
  - `revalidateService` - Handles Next.js revalidation for service routes

## Hook Types

### Collection-Level Hooks

#### `beforeValidate`

- **Purpose**: Runs before field validation
- **Usage**: Auto-generating slugs, formatting data
- **Example**: `generateSlug` hook

#### `beforeChange`

- **Purpose**: Runs before saving to database
- **Usage**: Audit trails, data transformation, business logic
- **Example**: `auditTrail` hook

#### `afterChange`

- **Purpose**: Runs after successful save
- **Usage**: Cache invalidation, notifications, side effects
- **Example**: `revalidatePage`, `revalidateBlog` hooks

### Field-Level Hooks

#### `beforeValidate` (Field)

- **Purpose**: Runs before field validation
- **Usage**: Data formatting, auto-population
- **Example**: Slug generation in individual fields

#### `beforeChange` (Field)

- **Purpose**: Runs before field save
- **Usage**: Auto-updating timestamps
- **Example**: `lastUpdated` field in Legal pages

## Shared Utilities

### `/src/pages/shared/hooks/`

- `generateSlug.ts` - Reusable slug generation logic
- `auditTrail.ts` - Reusable audit trail logic
- `createRevalidateHook.ts` - Factory for creating revalidation hooks

### `/src/pages/shared/fields/`

- `auditFields.ts` - Reusable audit trail field definitions

## Features Implemented

### 1. **Automatic Slug Generation**

- Converts titles to URL-friendly slugs
- Handles special characters and spaces
- Only generates on creation if slug is empty

### 2. **Audit Trail**

- Tracks who created each document
- Tracks who last updated each document
- Automatically updates timestamps
- Hidden from admin interface

### 3. **Cache Revalidation**

- Logs when pages are published/unpublished
- Handles slug changes
- Respects context flags to disable revalidation
- Ready for Next.js ISR integration

### 4. **Draft/Publish Workflow**

- All collections support draft and published states
- Autosave functionality
- Scheduled publishing
- Version history (50 versions per document)

### 5. **Access Control**

- Authenticated users can create/edit
- Public can read published content only
- Proper security boundaries

### 6. **Enhanced Admin Experience**

- Consistent column layouts
- Sidebar positioning for metadata
- Grouped related fields
- Conditional field visibility

## Usage Examples

### Adding a New Page Collection

1. Create collection directory: `/src/pages/NewCollection/`
2. Create hooks directory: `/src/pages/NewCollection/hooks/`
3. Import shared hooks:
   ```typescript
   import { generateSlug } from '../shared/hooks/generateSlug'
   import { auditTrail } from '../shared/hooks/auditTrail'
   import { createRevalidateHook } from '../shared/hooks/createRevalidateHook'
   ```
4. Create revalidation hook:
   ```typescript
   export const revalidateNew = createRevalidateHook('new-collection')
   ```
5. Add to collection config:
   ```typescript
   hooks: {
     beforeValidate: [generateSlug],
     beforeChange: [auditTrail],
     afterChange: [revalidateNew],
   }
   ```

### Customizing Hooks

Each collection can override or extend the shared hooks:

```typescript
// Custom slug generation
const customGenerateSlug: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'create' && data?.title && !data?.slug) {
    data.slug = `custom-prefix-${data.title.toLowerCase().replace(/\s+/g, '-')}`
  }
  return data
}
```

## Security Considerations

1. **Access Control**: All collections use proper access control functions
2. **Audit Trail**: Hidden fields prevent tampering
3. **Transaction Safety**: All hooks pass `req` for transaction context
4. **Validation**: Proper validation on all required fields

## Performance Notes

1. **Efficient Queries**: Hooks use minimal database queries
2. **Context Flags**: Revalidation can be disabled via context
3. **Indexed Fields**: Slugs are indexed for fast lookups
4. **Version Limits**: Limited to 50 versions per document

## Future Enhancements

1. **SEO Hooks**: Auto-generate meta descriptions
2. **Image Optimization**: Automatic image processing
3. **Search Integration**: Full-text search indexing
4. **Analytics**: Page view tracking
5. **Notifications**: Email notifications on publish
6. **Workflow**: Approval workflows for content
