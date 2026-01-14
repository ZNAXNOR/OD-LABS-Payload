# Payload CMS Structure Refactor - Migration Guide

This document details all structural changes made during the Payload CMS structure refactor to align with official Payload conventions.

## Migration Date

January 14, 2026

## Overview

This migration restructured the project to follow official Payload CMS conventions:

- Converted flat component files to directory-based structure
- Reorganized blocks with proper config/component separation
- Moved collections from `src/pages/` to `src/collections/`
- Standardized export patterns and import paths

## File Moves

### Phase 1: Block Restructuring

#### Hero Block

- **Old Path:** `src/blocks/Hero.ts`
- **New Path:** `src/blocks/Hero/config.ts`
- **Changes:** Renamed to `config.ts`, updated export to named export `HeroBlock`

#### Content Block

- **Old Path:** `src/blocks/Content.ts`
- **New Path:** `src/blocks/Content/config.ts`
- **Changes:** Renamed to `config.ts`, updated export to named export `ContentBlock`

#### CallToAction Block

- **Old Path:** `src/blocks/CallToAction.ts`
- **New Path:** `src/blocks/CallToAction/config.ts`
- **Changes:** Moved to directory, renamed to `config.ts`, updated export to named export `CallToActionBlock`
- **Note:** Existing `Component.tsx` remained in place

#### Archive Block

- **Old Path:** `src/blocks/Archive.ts`
- **New Path:** `src/blocks/Archive/config.ts`
- **Changes:** Renamed to `config.ts`, updated export to named export `ArchiveBlock`

### Phase 2: Component Restructuring

#### BreadcrumbCell Component

- **Old Path:** `src/components/BreadcrumbCell.tsx`
- **New Path:** `src/components/BreadcrumbCell/index.tsx`
- **Changes:** Moved to directory-based structure

#### DashboardCollections Component

- **Old Path:** `src/components/DashboardCollections.tsx`
- **New Path:** `src/components/DashboardCollections/index.tsx`
- **Changes:** Moved to directory-based structure

#### GoogleAnalytics Component

- **Old Path:** `src/components/GoogleAnalytics.tsx`
- **New Path:** `src/components/GoogleAnalytics/index.tsx`
- **Changes:** Moved to directory-based structure

### Phase 3: Collection Moves

#### Pages Collection

- **Old Path:** `src/pages/Pages/`
- **New Path:** `src/collections/Pages/`
- **Files Moved:**
  - `src/pages/Pages/index.ts` → `src/collections/Pages/index.ts`
  - `src/pages/Pages/hooks/` → `src/collections/Pages/hooks/`

#### Blogs Collection

- **Old Path:** `src/pages/Blogs/`
- **New Path:** `src/collections/Blogs/`
- **Files Moved:**
  - `src/pages/Blogs/index.ts` → `src/collections/Blogs/index.ts`
  - `src/pages/Blogs/hooks/` → `src/collections/Blogs/hooks/`

#### Contacts Collection

- **Old Path:** `src/pages/Contacts/`
- **New Path:** `src/collections/Contacts/`
- **Files Moved:**
  - `src/pages/Contacts/index.ts` → `src/collections/Contacts/index.ts`
  - `src/pages/Contacts/hooks/` → `src/collections/Contacts/hooks/`

#### Legal Collection

- **Old Path:** `src/pages/Legal/`
- **New Path:** `src/collections/Legal/`
- **Files Moved:**
  - `src/pages/Legal/index.ts` → `src/collections/Legal/index.ts`
  - `src/pages/Legal/hooks/` → `src/collections/Legal/hooks/`

#### Services Collection

- **Old Path:** `src/pages/Services/`
- **New Path:** `src/collections/Services/`
- **Files Moved:**
  - `src/pages/Services/index.ts` → `src/collections/Services/index.ts`
  - `src/pages/Services/hooks/` → `src/collections/Services/hooks/`

## New Directory Structure

```
src/
├── blocks/
│   ├── Archive/
│   │   └── config.ts          # Block configuration
│   ├── Banner/
│   │   ├── Component.tsx      # Server component
│   │   └── config.ts
│   ├── CallToAction/
│   │   ├── Component.tsx
│   │   └── config.ts
│   ├── Code/
│   │   ├── Component.client.tsx
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── CopyButton.tsx
│   ├── Content/
│   │   └── config.ts
│   ├── enhanced/
│   │   └── Hero.ts
│   ├── Hero/
│   │   └── config.ts
│   ├── MediaBlock/
│   │   ├── Component.tsx
│   │   └── config.ts
│   └── index.ts               # Aggregates all block exports
├── collections/
│   ├── Blogs/
│   │   ├── index.ts           # Collection config
│   │   └── hooks/
│   │       ├── auditTrail.ts
│   │       ├── generateSlug.ts
│   │       └── revalidateBlog.ts
│   ├── Contacts/
│   │   ├── index.ts
│   │   └── hooks/
│   │       ├── auditTrail.ts
│   │       ├── generateSlug.ts
│   │       └── revalidateContact.ts
│   ├── hooks/
│   │   └── revalidateMedia.ts
│   ├── Legal/
│   │   ├── index.ts
│   │   └── hooks/
│   │       ├── auditTrail.ts
│   │       ├── generateSlug.ts
│   │       └── revalidateLegal.ts
│   ├── Media.ts
│   ├── Pages/
│   │   ├── index.ts
│   │   └── hooks/
│   │       ├── populateBreadcrumbs.ts
│   │       └── revalidatePage.ts
│   ├── Services/
│   │   ├── index.ts
│   │   └── hooks/
│   │       ├── auditTrail.ts
│   │       ├── generateSlug.ts
│   │       └── revalidateService.ts
│   └── Users.ts
├── components/
│   ├── AdminBar/
│   │   ├── index.scss
│   │   └── index.tsx
│   ├── blocks/
│   │   ├── HeroBlock.tsx
│   │   └── index.ts
│   ├── BreadcrumbCell/
│   │   └── index.tsx
│   ├── DashboardCollections/
│   │   └── index.tsx
│   ├── GoogleAnalytics/
│   │   └── index.tsx
│   ├── Link/
│   │   └── index.tsx
│   ├── LivePreviewListener/
│   │   └── index.tsx
│   ├── Logo/
│   │   └── Logo.tsx
│   ├── Media/
│   │   ├── ImageMedia/
│   │   │   └── index.tsx
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── VideoMedia/
│   │       └── index.tsx
│   ├── RenderBlocks/
│   │   └── index.tsx
│   ├── RichText/
│   │   └── index.tsx
│   ├── RowLabel/
│   │   └── index.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── pagination.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   └── UniqueSelect/
│       └── index.tsx
└── pages/
    ├── README.md
    └── shared/
        ├── fields/
        │   └── auditFields.ts
        └── hooks/
            ├── auditTrail.ts
            ├── createRevalidateHook.ts
            └── generateSlug.ts
```

## Import Pattern Changes

### Block Imports

**Before:**

```typescript
import { Hero } from '@/blocks/Hero'
import { Content } from '@/blocks/Content'
import { CallToAction } from '@/blocks/CallToAction'
import { Archive } from '@/blocks/Archive'
```

**After:**

```typescript
import { HeroBlock } from '@/blocks/Hero/config'
import { ContentBlock } from '@/blocks/Content/config'
import { CallToActionBlock } from '@/blocks/CallToAction/config'
import { ArchiveBlock } from '@/blocks/Archive/config'
```

**Or via index:**

```typescript
import { HeroBlock, ContentBlock, CallToActionBlock, ArchiveBlock } from '@/blocks'
```

### Component Imports

**Before:**

```typescript
import { BreadcrumbCell } from '@/components/BreadcrumbCell'
import { DashboardCollections } from '@/components/DashboardCollections'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
```

**After:**

```typescript
// Imports remain the same due to index.tsx files
import { BreadcrumbCell } from '@/components/BreadcrumbCell'
import { DashboardCollections } from '@/components/DashboardCollections'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
```

### Collection Imports

**Before:**

```typescript
import { Pages } from '@/pages/Pages'
import { Blogs } from '@/pages/Blogs'
import { Contacts } from '@/pages/Contacts'
import { Legal } from '@/pages/Legal'
import { Services } from '@/pages/Services'
```

**After:**

```typescript
import { Pages } from '@/collections/Pages'
import { Blogs } from '@/collections/Blogs'
import { Contacts } from '@/collections/Contacts'
import { Legal } from '@/collections/Legal'
import { Services } from '@/collections/Services'
```

## Export Pattern Changes

### Block Exports

All block configuration files now use named exports with the `Block` suffix:

```typescript
// src/blocks/Hero/config.ts
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    // ... field definitions
  ],
}
```

### Collection Exports

Collections continue to use default exports:

```typescript
// src/collections/Pages/index.ts
import type { CollectionConfig } from 'payload'

const Pages: CollectionConfig = {
  slug: 'pages',
  // ... configuration
}

export default Pages
```

## Payload Conventions Followed

This refactor aligns with official Payload CMS conventions:

1. **Directory-Based Components**: All components follow `ComponentName/index.tsx` pattern
2. **Block Organization**: Blocks have dedicated directories with `config.ts` for configuration
3. **Collection Location**: Collections are in `src/collections/` not `src/pages/`
4. **Hook Co-location**: Collection hooks are in `hooks/` subdirectories within their collection
5. **Named Exports for Blocks**: Block configs use named exports with `Block` suffix
6. **Consistent Structure**: All similar entities follow the same organizational pattern

## Validation

All changes have been validated:

- ✅ TypeScript compilation passes without errors
- ✅ All imports updated and resolved correctly
- ✅ Payload configuration loads successfully
- ✅ Admin panel displays all collections and blocks
- ✅ Frontend rendering works correctly
- ✅ All existing tests pass

## Breaking Changes

None. This is a structural refactor that maintains all existing functionality.

## Migration Checklist

If you need to apply similar changes to your own Payload project:

- [ ] Create backup/branch before starting
- [ ] Restructure blocks to directory-based pattern
- [ ] Update block exports to named exports with `Block` suffix
- [ ] Move components to directory-based structure
- [ ] Move collections from `src/pages/` to `src/collections/`
- [ ] Update all import paths throughout codebase
- [ ] Update `src/blocks/index.ts` to export from new locations
- [ ] Run TypeScript compilation to verify
- [ ] Test Payload admin panel
- [ ] Test frontend rendering
- [ ] Run existing test suites
- [ ] Commit changes

## Support

For questions about this migration or Payload CMS best practices:

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload CMS Discord](https://discord.com/invite/payload)
- [Payload GitHub Repository](https://github.com/payloadcms/payload)
