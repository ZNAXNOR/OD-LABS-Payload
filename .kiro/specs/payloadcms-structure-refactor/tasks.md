# Implementation Plan: Payload CMS Structure Refactor

## Overview

This implementation plan restructures the Payload CMS project to follow official conventions. The tasks are organized in phases to minimize risk and ensure each step can be validated before proceeding.

## Tasks

- [x] 1. Phase 1: Restructure Block Files
  - Create directory structure for blocks and move configuration files
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 1.1 Restructure Hero block
  - Create `src/blocks/Hero/` directory
  - Move `src/blocks/Hero.ts` to `src/blocks/Hero/config.ts`
  - Update export to named export `HeroBlock`
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 1.2 Restructure Content block
  - Create `src/blocks/Content/` directory
  - Move `src/blocks/Content.ts` to `src/blocks/Content/config.ts`
  - Update export to named export `ContentBlock`
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 1.3 Restructure CallToAction block
  - Create `src/blocks/CallToAction/` directory if not exists
  - Move `src/blocks/CallToAction.ts` to `src/blocks/CallToAction/config.ts`
  - Update export to named export `CallToActionBlock`
  - Verify existing `Component.tsx` and `Component.client.tsx` remain in place
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 1.4 Restructure Archive block
  - Create `src/blocks/Archive/` directory
  - Move `src/blocks/Archive.ts` to `src/blocks/Archive/config.ts`
  - Update export to named export `ArchiveBlock`
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 1.5 Update blocks index file
  - Update `src/blocks/index.ts` to export from new config.ts locations
  - Use named exports for all blocks
  - Verify all blocks are exported correctly
  - _Requirements: 2.6_

- [x] 1.6 Checkpoint - Verify block restructuring
  - Ensure all block files moved successfully
  - Verify no duplicate files remain
  - Run TypeScript compiler to check for errors
  - Ask user if questions arise

- [x] 2. Phase 2: Restructure Component Files
  - Convert flat component files to directory-based structure
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2.1 Restructure BreadcrumbCell component
  - Create `src/components/BreadcrumbCell/` directory
  - Move `src/components/BreadcrumbCell.tsx` to `src/components/BreadcrumbCell/index.tsx`
  - Preserve all component logic and exports
  - _Requirements: 1.1, 1.2_

- [x] 2.2 Restructure DashboardCollections component
  - Create `src/components/DashboardCollections/` directory
  - Move `src/components/DashboardCollections.tsx` to `src/components/DashboardCollections/index.tsx`
  - Preserve all component logic and exports
  - _Requirements: 1.1, 1.2_

- [x] 2.3 Restructure GoogleAnalytics component
  - Create `src/components/GoogleAnalytics/` directory
  - Move `src/components/GoogleAnalytics.tsx` to `src/components/GoogleAnalytics/index.tsx`
  - Preserve all component logic and exports
  - _Requirements: 1.1, 1.2_

- [x] 2.4 Checkpoint - Verify component restructuring
  - Ensure all component files moved successfully
  - Verify no duplicate files remain
  - Run TypeScript compiler to check for errors
  - Ask user if questions arise

- [x] 3. Phase 3: Move Collections from pages/ to collections/
  - Relocate page-type collections to proper collections directory
  - _Requirements: 3.1, 3.2, 3.3, 9.1, 9.2, 9.3, 9.4_

- [x] 3.1 Move Pages collection
  - Create `src/collections/Pages/` directory
  - Move `src/pages/Pages/index.ts` to `src/collections/Pages/index.ts`
  - Move `src/pages/Pages/hooks/` to `src/collections/Pages/hooks/`
  - Preserve all collection configuration and hooks
  - _Requirements: 3.1, 3.2, 9.1, 9.2, 9.3, 9.4_

- [x] 3.2 Move Blogs collection
  - Create `src/collections/Blogs/` directory
  - Move `src/pages/Blogs/index.ts` to `src/collections/Blogs/index.ts`
  - Move `src/pages/Blogs/hooks/` to `src/collections/Blogs/hooks/`
  - Preserve all collection configuration and hooks
  - _Requirements: 3.1, 3.2_

- [x] 3.3 Move Contacts collection
  - Create `src/collections/Contacts/` directory
  - Move `src/pages/Contacts/index.ts` to `src/collections/Contacts/index.ts`
  - Move `src/pages/Contacts/hooks/` to `src/collections/Contacts/hooks/`
  - Preserve all collection configuration and hooks
  - _Requirements: 3.1, 3.2_

- [x] 3.4 Move Legal collection
  - Create `src/collections/Legal/` directory
  - Move `src/pages/Legal/index.ts` to `src/collections/Legal/index.ts`
  - Move `src/pages/Legal/hooks/` to `src/collections/Legal/hooks/`
  - Preserve all collection configuration and hooks
  - _Requirements: 3.1, 3.2_

- [x] 3.5 Move Services collection
  - Create `src/collections/Services/` directory
  - Move `src/pages/Services/index.ts` to `src/collections/Services/index.ts`
  - Move `src/pages/Services/hooks/` to `src/collections/Services/hooks/`
  - Preserve all collection configuration and hooks
  - _Requirements: 3.1, 3.2_

- [x] 3.6 Remove empty pages directory
  - Verify all collections moved from `src/pages/`
  - Keep `src/pages/shared/` if it contains shared utilities
  - Remove empty collection directories from `src/pages/`
  - _Requirements: 9.4_

- [x] 3.7 Checkpoint - Verify collection moves
  - Ensure all collections moved successfully
  - Verify hooks directories moved correctly
  - Run TypeScript compiler to check for errors
  - Ask user if questions arise

- [x] 4. Phase 4: Update All Import Paths
  - Systematically update all imports to reflect new file locations
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4.1 Update block imports in collection configs
  - Find all files importing from `@/blocks/Hero`, `@/blocks/Content`, etc.
  - Update to import from `@/blocks/Hero/config`, `@/blocks/Content/config`, etc.
  - Update import names to use Block suffix (e.g., `HeroBlock`)
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4.2 Update component imports
  - Find all files importing `BreadcrumbCell`, `DashboardCollections`, `GoogleAnalytics`
  - Verify imports still work with directory-based structure
  - Update any broken import paths
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4.3 Update collection imports in payload.config.ts
  - Update imports from `@/pages/Pages` to `@/collections/Pages`
  - Update imports from `@/pages/Blogs` to `@/collections/Blogs`
  - Update imports from `@/pages/Contacts` to `@/collections/Contacts`
  - Update imports from `@/pages/Legal` to `@/collections/Legal`
  - Update imports from `@/pages/Services` to `@/collections/Services`
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4.4 Update collection imports in frontend routes
  - Check `src/app/(frontend)/` for any collection imports
  - Update paths to new collection locations
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4.5 Update hook imports within collections
  - Verify relative imports within collection hooks still work
  - Update any broken relative paths
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4.6 Scan for remaining old import paths
  - Use grep/search to find any remaining references to old paths
  - Update any missed imports
  - _Requirements: 6.5_

- [x] 4.7 Checkpoint - Verify all imports updated
  - Run TypeScript compiler with `tsc --noEmit`
  - Verify no import errors
  - Ask user if questions arise

- [x] 5. Phase 5: Validation and Testing
  - Comprehensive validation of the restructured codebase
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5.1 Run TypeScript compilation
  - Execute `tsc --noEmit` to check for type errors
  - Fix any type errors that appear
  - Verify payload-types.ts is still valid
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 5.2 Verify Payload configuration loads
  - Start the development server
  - Verify Payload config loads without errors
  - Check that all collections appear in admin panel
  - Verify all blocks are available in layout builders
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5.3 Test admin panel functionality
  - Open Payload admin panel
  - Navigate to each collection
  - Verify breadcrumbs display correctly
  - Test creating/editing documents with blocks
  - _Requirements: 7.4_

- [x] 5.4 Test frontend rendering
  - Visit frontend pages
  - Verify blocks render correctly
  - Check that all components display properly
  - _Requirements: 7.4_

- [x] 5.5 Run existing test suites
  - Execute `npm test` or `pnpm test`
  - Verify all existing tests pass
  - Fix any broken tests
  - _Requirements: 7.4_

- [x] 5.6 Final checkpoint
  - Confirm all functionality works as before restructuring
  - Verify no console errors in browser or terminal
  - Ask user for final approval

- [x] 6. Phase 6: Documentation and Cleanup
  - Create migration documentation and clean up old files
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 6.1 Create migration documentation
  - Document all file moves in MIGRATION.md
  - List old paths and new paths
  - Include examples of new import patterns
  - Document new directory structure
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 6.2 Update project README
  - Update any references to old file structure
  - Document new organizational patterns
  - Add section on Payload conventions followed
  - _Requirements: 10.4_

- [x] 6.3 Clean up old files
  - Verify no duplicate files exist
  - Remove any backup files created during migration
  - Verify git status is clean
  - _Requirements: 7.1_

- [x] 6.4 Final verification
  - Review all changes in git diff
  - Ensure no unintended changes
  - Commit all changes with descriptive message
  - Ask user if questions arise

## Notes

- Each phase builds on the previous one and should be completed in order
- Checkpoints are included after major changes to catch issues early
- TypeScript compilation should be verified frequently to catch import errors
- The restructuring maintains all existing functionality while improving organization
- All tasks reference specific requirements for traceability
