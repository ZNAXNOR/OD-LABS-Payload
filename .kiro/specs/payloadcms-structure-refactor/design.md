# Design Document: Payload CMS Structure Refactor

## Overview

This design outlines the approach for restructuring a Payload CMS project to align with official Payload conventions. The refactoring will transform the current flat file structure into a directory-based organization pattern that matches the official Payload repository and website template.

The refactoring focuses on:

- Converting flat component files to directory-based structure
- Reorganizing blocks with proper config/component separation
- Standardizing collection organization
- Maintaining all functionality while improving maintainability

## Architecture

### Current Structure Issues

1. **Components**: Mix of flat files (`BreadcrumbCell.tsx`) and directory-based (`AdminBar/index.tsx`)
2. **Blocks**: Inconsistent organization - some have directories (`Banner/`, `Code/`), others are flat files (`Hero.ts`, `Content.ts`)
3. **Collections**: Pages collection incorrectly located in `src/pages/` instead of `src/collections/`
4. **Exports**: Inconsistent export patterns across the codebase

### Target Structure

```
src/
├── blocks/
│   ├── Hero/
│   │   ├── config.ts          # Block configuration
│   │   ├── Component.tsx      # Server component
│   │   └── Component.client.tsx (if needed)
│   ├── Content/
│   │   └── config.ts
│   ├── CallToAction/
│   │   ├── config.ts
│   │   └── Component.tsx
│   └── index.ts               # Aggregates all block exports
├── collections/
│   ├── Pages/
│   │   ├── index.ts           # Collection config
│   │   └── hooks/
│   │       ├── revalidatePage.ts
│   │       └── populateBreadcrumbs.ts
│   ├── Blogs/
│   │   ├── index.ts
│   │   └── hooks/
│   ├── Media/
│   │   ├── index.ts
│   │   └── hooks/
│   └── Users/
│       └── index.ts
├── components/
│   ├── BreadcrumbCell/
│   │   └── index.tsx
│   ├── DashboardCollections/
│   │   └── index.tsx
│   └── GoogleAnalytics/
│       └── index.tsx
└── globals/
    ├── Header/
    │   ├── config.ts
    │   ├── Component.tsx
    │   ├── Component.client.tsx
    │   └── hooks/
    └── Footer/
        ├── config.ts
        ├── Component.tsx
        └── Component.client.tsx
```

## Components and Interfaces

### File Migration Map

#### Blocks to Restructure

| Current Path                 | New Path                            | Changes                   |
| ---------------------------- | ----------------------------------- | ------------------------- |
| `src/blocks/Hero.ts`         | `src/blocks/Hero/config.ts`         | Rename to config.ts       |
| `src/blocks/Content.ts`      | `src/blocks/Content/config.ts`      | Rename to config.ts       |
| `src/blocks/CallToAction.ts` | `src/blocks/CallToAction/config.ts` | Move to directory, rename |
| `src/blocks/Archive.ts`      | `src/blocks/Archive/config.ts`      | Move to directory, rename |

#### Components to Restructure

| Current Path                              | New Path                                        |
| ----------------------------------------- | ----------------------------------------------- |
| `src/components/BreadcrumbCell.tsx`       | `src/components/BreadcrumbCell/index.tsx`       |
| `src/components/DashboardCollections.tsx` | `src/components/DashboardCollections/index.tsx` |
| `src/components/GoogleAnalytics.tsx`      | `src/components/GoogleAnalytics/index.tsx`      |

#### Collections to Restructure

| Current Path          | New Path                    |
| --------------------- | --------------------------- |
| `src/pages/Pages/`    | `src/collections/Pages/`    |
| `src/pages/Blogs/`    | `src/collections/Blogs/`    |
| `src/pages/Contacts/` | `src/collections/Contacts/` |
| `src/pages/Legal/`    | `src/collections/Legal/`    |
| `src/pages/Services/` | `src/collections/Services/` |

### Block Configuration Pattern

All blocks will follow this pattern:

**config.ts** (Block configuration):

```typescript
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    // ... field definitions
  ],
}
```

**Component.tsx** (Server component for rendering):

```typescript
import React from 'react'
import type { HeroBlock as HeroBlockType } from '@/payload-types'

export const HeroBlock: React.FC<HeroBlockType> = (props) => {
  return (
    // ... rendering logic
  )
}
```

### Collection Organization Pattern

All collections will follow this structure:

**index.ts** (Collection configuration):

```typescript
import type { CollectionConfig } from 'payload'
import { revalidateHook } from './hooks/revalidateHook'

export const CollectionName: CollectionConfig = {
  slug: 'collection-name',
  // ... configuration
  hooks: {
    afterChange: [revalidateHook],
  },
}
```

**hooks/** (Collection-specific hooks):

- Each hook in its own file
- Named exports for hooks
- Co-located with collection config

### Import Path Updates

All import paths will be updated to reflect new structure:

**Before:**

```typescript
import { Hero } from '@/blocks/Hero'
import { BreadcrumbCell } from '@/components/BreadcrumbCell'
import { Pages } from '@/pages/Pages'
```

**After:**

```typescript
import { HeroBlock } from '@/blocks/Hero/config'
import { BreadcrumbCell } from '@/components/BreadcrumbCell'
import { Pages } from '@/collections/Pages'
```

## Data Models

### File Structure Model

```typescript
interface FileMove {
  oldPath: string
  newPath: string
  type: 'move' | 'rename' | 'restructure'
  requiresContentChange: boolean
}

interface ImportUpdate {
  filePath: string
  oldImport: string
  newImport: string
  importType: 'default' | 'named'
}
```

### Migration Tracking

```typescript
interface MigrationRecord {
  timestamp: string
  filesMoved: FileMove[]
  importsUpdated: ImportUpdate[]
  errors: string[]
  warnings: string[]
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: File Structure Consistency

_For any_ component, block, or collection in the restructured codebase, if it has multiple related files (config, component, hooks), then all related files should be co-located within the same directory.

**Validates: Requirements 1.1, 2.1, 3.1, 5.1**

### Property 2: Import Path Validity

_For any_ import statement in the codebase after restructuring, the imported file should exist at the specified path and export the referenced symbol.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 3: Export Pattern Consistency

_For any_ configuration file (Block, Collection, Global), it should use a named export that matches the Payload naming convention (e.g., `HeroBlock`, `Pages`, `Header`).

**Validates: Requirements 8.1, 8.2**

### Property 4: Directory-Based Component Structure

_For any_ component file, it should be located at `ComponentName/index.tsx` rather than `ComponentName.tsx`, ensuring consistent directory-based organization.

**Validates: Requirements 1.1, 4.1**

### Property 5: Block Configuration Separation

_For any_ block, its configuration should be in a `config.ts` file and any frontend rendering component should be in a separate `Component.tsx` file within the same block directory.

**Validates: Requirements 2.2, 2.3**

### Property 6: Collection Hook Co-location

_For any_ collection that has hooks, all hook files should be located in a `hooks/` subdirectory within that collection's directory.

**Validates: Requirements 3.1, 5.3**

### Property 7: Functional Preservation

_For any_ file that is moved or restructured, its exported functionality (functions, components, configurations) should remain identical in behavior to the original implementation.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 8: Reference Completeness

_For any_ file that is moved, all files that previously imported from the old location should be updated to import from the new location.

**Validates: Requirements 6.1, 6.5**

## Error Handling

### File Operation Errors

1. **File Not Found**: If a source file doesn't exist during migration, log error and skip
2. **Permission Denied**: If file operations fail due to permissions, report and halt
3. **Circular Dependencies**: Detect and report any circular import dependencies created

### Import Resolution Errors

1. **Broken Imports**: After restructuring, scan for any imports that can't be resolved
2. **Type Mismatches**: Verify TypeScript compilation succeeds after changes
3. **Missing Exports**: Ensure all expected exports are available at new locations

### Validation Errors

1. **Duplicate Files**: Check for naming conflicts before creating new directories
2. **Invalid Paths**: Validate all new paths follow project conventions
3. **Configuration Errors**: Verify Payload config remains valid after changes

## Testing Strategy

### Unit Tests

Unit tests will verify specific structural transformations and edge cases:

1. **File Move Operations**
   - Test moving a flat component file to directory structure
   - Test renaming config files
   - Test handling files with existing directories

2. **Import Path Updates**
   - Test updating relative imports
   - Test updating absolute imports with aliases
   - Test preserving import types (default vs named)

3. **Export Pattern Validation**
   - Test config files use named exports
   - Test components follow React conventions
   - Test index files properly re-export

### Property-Based Tests

Property-based tests will validate universal correctness across the entire codebase:

1. **Property Test: File Structure Consistency**
   - Generate random component/block/collection structures
   - Verify all related files are co-located
   - Minimum 100 iterations

2. **Property Test: Import Path Validity**
   - Parse all TypeScript/JavaScript files
   - Extract all import statements
   - Verify each imported path exists and exports the symbol
   - Minimum 100 iterations

3. **Property Test: Directory-Based Structure**
   - Scan all component directories
   - Verify each follows `ComponentName/index.tsx` pattern
   - Minimum 100 iterations

4. **Property Test: Block Configuration Separation**
   - Scan all block directories
   - Verify config.ts exists
   - Verify Component.tsx exists if block has rendering
   - Minimum 100 iterations

5. **Property Test: Collection Hook Co-location**
   - Scan all collection directories
   - Verify hooks are in hooks/ subdirectory
   - Minimum 100 iterations

6. **Property Test: Reference Completeness**
   - For each moved file, find all references
   - Verify all references updated to new path
   - Minimum 100 iterations

### Integration Tests

1. **Payload Config Validation**
   - Verify Payload config loads without errors
   - Verify all collections are registered
   - Verify all blocks are available

2. **TypeScript Compilation**
   - Run `tsc --noEmit` to verify no type errors
   - Verify generated types are correct

3. **Application Startup**
   - Verify Next.js dev server starts successfully
   - Verify Payload admin panel loads
   - Verify no runtime errors

### Testing Configuration

All property-based tests will:

- Run minimum 100 iterations per test
- Use appropriate generators for file paths and structures
- Tag tests with: **Feature: payloadcms-structure-refactor, Property {number}: {property_text}**
- Use fast-check library for TypeScript property-based testing

## Implementation Notes

### Migration Order

1. **Phase 1**: Restructure blocks (lowest risk, most isolated)
2. **Phase 2**: Restructure components (moderate risk, many references)
3. **Phase 3**: Move collections from pages/ to collections/ (higher risk, affects routing)
4. **Phase 4**: Update all import paths (critical, must be complete)
5. **Phase 5**: Validate and test (verification phase)

### Rollback Strategy

- Create git branch before starting
- Commit after each phase
- Keep migration log for reference
- Test thoroughly before merging

### Performance Considerations

- Use batch file operations where possible
- Cache file system reads
- Parallelize independent file moves
- Use AST parsing for import updates (more reliable than regex)
