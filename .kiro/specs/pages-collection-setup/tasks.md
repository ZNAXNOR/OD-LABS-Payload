# Implementation Plan: Pages Collection Setup

## Overview

This implementation plan breaks down the creation of a comprehensive Pages collection following the PayloadCMS website template pattern. Tasks are organized to build incrementally, starting with core structure, then adding blocks, hooks, and testing.

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

- [ ] 7. Update payload config
  - Verify `src/pages/Pages/index.ts` is imported in `src/payload.config.ts`
  - Verify Pages collection is included in collections array
  - If missing, add import and include in collections
  - _Requirements: 8.1_

- [ ] 8. Generate TypeScript types
  - Run `pnpm generate:types` to generate updated payload-types.ts
  - Verify Page interface is generated with all fields
  - Verify block interfaces are generated
  - _Requirements: All_

- [ ] 9. Checkpoint - Verify collection setup
  - Start dev server with `pnpm dev`
  - Access admin panel at http://localhost:3000/admin
  - Verify Pages collection appears in "Pages" group
  - Create a test page with title and verify slug auto-generation
  - Add blocks to layout and verify they save correctly
  - Create parent-child page relationship and verify breadcrumbs populate
  - Save as draft and verify required validation is skipped
  - Publish page and verify revalidation logs appear
  - Ensure all tests pass, ask the user if questions arise

- [ ] 10. Write unit tests for slug generation
  - Create `src/pages/Pages/__tests__/slugGeneration.test.ts`
  - Test title to slug conversion (spaces to hyphens)
  - Test special character removal
  - Test lowercase conversion
  - Test empty title handling
  - _Requirements: 1.3, 1.4_

- [ ] 11. Write property tests
  - [ ] 11.1 Property test for slug generation
    - Create `src/pages/Pages/__tests__/properties.test.ts`
    - Use fast-check to generate random titles
    - Verify all generated slugs are URL-safe (lowercase, hyphens, no special chars)
    - Run minimum 100 iterations
    - **Property 1: Slug generation produces URL-safe strings**
    - **Validates: Requirements 1.3, 1.4**

  - [ ] 11.2 Property test for unique slugs
    - Generate multiple pages with random titles
    - Attempt to create pages with duplicate slugs
    - Verify system rejects duplicates with appropriate error
    - Run minimum 100 iterations
    - **Property 2: No two pages can have the same slug**
    - **Validates: Requirements 1.2**

  - [ ] 11.3 Property test for breadcrumb ancestry
    - Generate random page hierarchies (1-5 levels deep)
    - Verify breadcrumbs contain all ancestors in correct order
    - Verify breadcrumb URLs and labels match parent pages
    - Run minimum 100 iterations
    - **Property 3: Breadcrumbs reflect complete ancestry**
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ] 11.4 Property test for circular reference prevention
    - Create page hierarchies
    - Attempt to set parent to self or descendant
    - Verify system prevents circular references
    - Run minimum 100 iterations
    - **Property 4: Circular references are prevented**
    - **Validates: Requirements 3.5**

  - [ ] 11.5 Property test for draft validation bypass
    - Generate pages with missing required fields
    - Save as drafts
    - Verify drafts save successfully without validation errors
    - Run minimum 100 iterations
    - **Property 5: Drafts bypass required validation**
    - **Validates: Requirements 4.2**

  - [ ] 11.6 Property test for published content visibility
    - Create mix of draft and published pages
    - Query without authentication
    - Verify only published pages are returned
    - Run minimum 100 iterations
    - **Property 6: Unauthenticated users see only published pages**
    - **Validates: Requirements 5.2, 5.3**

  - [ ] 11.7 Property test for revalidation path correctness
    - Create pages with various slugs (including 'home')
    - Publish and unpublish pages
    - Verify correct paths are passed to revalidatePath
    - Run minimum 100 iterations
    - **Property 7: Revalidation uses correct paths**
    - **Validates: Requirements 6.1, 6.3, 6.4**

  - [ ] 11.8 Property test for slug change revalidation
    - Create published pages
    - Change slugs to new values
    - Verify both old and new paths are revalidated
    - Run minimum 100 iterations
    - **Property 8: Slug changes revalidate both paths**
    - **Validates: Requirements 6.2**

- [ ] 12. Write integration tests
  - Create `tests/int/pages.int.spec.ts`
  - Test end-to-end page creation via API
  - Test draft to published workflow
  - Test hierarchical navigation with breadcrumbs
  - Test access control for authenticated vs unauthenticated users
  - _Requirements: All_

- [ ] 13. Final checkpoint - Complete verification
  - Run all tests: `pnpm test`
  - Verify all property tests pass (100+ iterations each)
  - Verify all unit tests pass
  - Verify all integration tests pass
  - Test in admin panel: create, edit, publish, unpublish pages
  - Test page hierarchy and breadcrumbs
  - Test block-based layout builder
  - Verify Next.js revalidation works on frontend
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- The link field is reusable across all blocks that need links
- Blocks are modular and can be extended with additional types later
- Revalidation hook integrates with Next.js ISR for automatic cache updates
- Breadcrumb hook maintains page hierarchy automatically
- **Reference**: PayloadCMS website template - https://github.com/payloadcms/payload/tree/main/templates/website
- **Key reference files**:
  - Pages collection: `templates/website/src/collections/Pages/index.ts`
  - Blocks: `templates/website/src/blocks/`
  - Link field: `templates/website/src/fields/link.ts`
  - Revalidation hook: `templates/website/src/collections/Pages/hooks/revalidatePage.ts`
  - Breadcrumbs hook: `templates/website/src/collections/Pages/hooks/populateFullTitle.ts`
