# Implementation Plan: Pages Collection Setup

## Overview

This implementation plan breaks down the creation of a comprehensive Pages collection following the PayloadCMS website template pattern. Tasks are organized to build incrementally, starting with core structure, then adding blocks and hooks.

## Tasks

- [x] 1. Create link field utility
  - Create `src/fields/link.ts` file (if not exists) or update existing
  - Define reusable link field with type (reference/custom), newTab, reference, url, label, and appearance
  - Export as `linkField` for use in blocks
  - _Requirements: 2.1, 2.2_

- [x] 2. Create content blocks
  - [x] 2.1 Create Hero block
    - Define Hero block with type, richText, media, and links fields
    - Set slug to 'hero' and interfaceName to 'HeroBlock'
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Create Content block
    - Define Content block with columns array (size, richText, enableLink, link)
    - Support 1-4 columns with conditional link display
    - Set slug to 'content' and interfaceName to 'ContentBlock'
    - _Requirements: 2.1, 2.2_

  - [x] 2.3 Create Call To Action block
    - Define CTA block with richText and links array
    - Set slug to 'cta' and interfaceName to 'CallToActionBlock'
    - _Requirements: 2.1, 2.2_

  - [x] 2.4 Create Media block
    - Define Media block with position, media, and caption fields
    - Set slug to 'mediaBlock' and interfaceName to 'MediaBlock'
    - _Requirements: 2.1, 2.2_

  - [x] 2.5 Create Archive block
    - Define Archive block with introContent, populateBy, relationTo, categories, selectedDocs, and limit
    - Implement conditional field display based on populateBy value
    - Set slug to 'archive' and interfaceName to 'ArchiveBlock'
    - _Requirements: 2.1, 2.2_

- [x] 3. Create revalidation hook
  - Create `src/pages/Pages/hooks/revalidatePage.ts` file
  - Implement `revalidatePage` hook that calls Next.js `revalidatePath`
  - Handle published status changes (publish and unpublish)
  - Handle slug changes (revalidate both old and new paths)
  - Handle home page special case (slug 'home' → path '/')
  - Add logging for debugging
  - Check `context.disableRevalidate` flag to allow bypassing
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Create breadcrumb population hook
  - Create `src/pages/Pages/hooks/populateBreadcrumbs.ts` file
  - Implement `beforeChange` hook to populate breadcrumbs array
  - Recursively fetch parent pages to build ancestry chain
  - Store doc reference, url (slug), and label (title) for each ancestor
  - Handle circular reference detection
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 5. Create access control functions
  - Verify `src/access/authenticated.ts` exists with authenticated check
  - Verify `src/access/authenticatedOrPublished.ts` exists
  - If missing, create authenticatedOrPublished function that returns true for authenticated users or query constraint `{ _status: { equals: 'published' } }` for public
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6. Create main Pages collection
  - Create `src/pages/Pages/index.ts` file
  - Import all blocks, hooks, and access functions
  - Define collection config with slug 'pages', interface 'Page'
  - Add title field (text, required)
  - Add slug field (text, unique, indexed, sidebar position)
  - Add slug auto-generation hook in beforeValidate
  - Add parent field (relationship to pages, sidebar position, filter to exclude self)
  - Add breadcrumbs field (array, hidden in admin)
  - Add layout field (blocks type with all 5 blocks)
  - Configure versions with drafts (autosave, schedulePublish, validate: false, maxPerDoc: 100)
  - Set access control (create: authenticated, read: authenticatedOrPublished, update: authenticated, delete: authenticated)
  - Add afterChange hook with revalidatePage
  - Add beforeChange hook with populateBreadcrumbs
  - Set admin config (useAsTitle: 'title', defaultColumns, group: 'Pages')
  - Export as `Pages`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 7. Update payload config
  - Verify `src/pages/Pages/index.ts` is imported in `src/payload.config.ts`
  - Verify Pages collection is included in collections array
  - If missing, add import and include in collections
  - _Requirements: 8.1_

- [x] 8. Generate TypeScript types
  - Run `pnpm generate:types` to generate updated payload-types.ts
  - Verify Page interface is generated with all fields
  - Verify block interfaces are generated
  - _Requirements: All_