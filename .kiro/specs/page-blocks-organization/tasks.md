# Implementation Plan: Page Blocks Organization

## Overview

This implementation plan outlines the step-by-step tasks to organize and assign content blocks across different page collection types. The implementation follows a phased approach to ensure backward compatibility and zero-downtime deployment.

## Tasks

- [x] 1. Create block configuration infrastructure
  - Create centralized configuration system for block assignments
  - Set up TypeScript types for type safety
  - Establish foundation for all subsequent changes
  - _Requirements: 6.1, 6.2, 8.1, 8.2_

  - [x] 1.1 Create block configuration directory structure
    - Create `src/blocks/config/` directory
    - Create placeholder files: `blockAssignments.ts`, `blockCategories.ts`, `types.ts`
    - _Requirements: 6.1_

  - [x] 1.2 Implement block categories configuration
    - Define `BlockCategory` interface in `types.ts`
    - Create `BLOCK_CATEGORIES` constant with all category keys
    - Export `BlockCategoryKey` type
    - _Requirements: 6.1, 8.1_

  - [x] 1.3 Implement block assignments configuration
    - Import all block configs from existing blocks
    - Create `BLOCK_ASSIGNMENTS` object with assignments for all collections
    - Implement `getBlocksForCollection()` helper function
    - Export `PageCollectionType` type
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 1.4 Add TypeScript type definitions
    - Define `BlockAssignment` interface
    - Define `BlockMetadata` interface
    - Define `PageCollectionBlocks` interface
    - Export all types from `types.ts`
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]\* 1.5 Write unit tests for block configuration
    - Test `getBlocksForCollection()` returns correct blocks for each collection type
    - Test all block assignments are valid Block objects (not undefined/null)
    - Test blog blocks exclude Services and Portfolio categories
    - Test service blocks include Services category
    - Test contact blocks are minimal (8 blocks)
    - Test legal blocks are minimal (5 blocks)
    - Test pages collection has all blocks
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 2. Update Blogs collection with block assignments
  - Add layout builder with blog-appropriate blocks
  - Ensure hero section is optional with maxRows: 1
  - Organize imports by category
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 2.1 Update Blogs collection configuration
    - Import `getBlocksForCollection` from block config
    - Get blog blocks using `getBlocksForCollection('blogs')`
    - Add "Layout" tab to tabs structure
    - Add `hero` blocks field with `maxRows: 1`
    - Add `layout` blocks field with blog-specific blocks
    - Organize block imports by category with comments
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]\* 2.2 Write unit tests for Blogs collection
    - Test Blogs collection has hero field with maxRows: 1
    - Test Blogs collection has layout field with correct blocks
    - Test Blogs collection excludes Services category blocks
    - Test Blogs collection excludes Portfolio category blocks
    - _Requirements: 1.1, 1.5, 1.6_

- [x] 3. Update Services collection with block assignments
  - Add layout builder with service-appropriate blocks
  - Include Services category blocks
  - Include Testimonial block for client testimonials
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [x] 3.1 Update Services collection configuration
    - Import `getBlocksForCollection` from block config
    - Get service blocks using `getBlocksForCollection('services')`
    - Add "Layout" tab to tabs structure
    - Add `hero` blocks field with `maxRows: 1`
    - Add `layout` blocks field with service-specific blocks
    - Organize block imports by category with comments
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]\* 3.2 Write unit tests for Services collection
    - Test Services collection has hero field with maxRows: 1
    - Test Services collection has layout field with correct blocks
    - Test Services collection includes all Services category blocks
    - Test Services collection includes Testimonial block
    - Test Services collection excludes Archive and Code blocks
    - _Requirements: 2.1, 2.2, 2.7, 2.8_

- [x] 4. Update Contacts collection with block assignments
  - Add layout builder with contact-appropriate blocks
  - Keep minimal block selection focused on contact forms
  - Include FAQ block for contact-related questions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 4.1 Update Contacts collection configuration
    - Import `getBlocksForCollection` from block config
    - Get contact blocks using `getBlocksForCollection('contacts')`
    - Add "Layout" tab to tabs structure
    - Add `hero` blocks field with `maxRows: 1`
    - Add `layout` blocks field with contact-specific blocks
    - Organize block imports by category with comments
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]\* 4.2 Write unit tests for Contacts collection
    - Test Contacts collection has hero field with maxRows: 1
    - Test Contacts collection has layout field with correct blocks (8 total)
    - Test Contacts collection excludes Services category blocks
    - Test Contacts collection excludes Portfolio category blocks
    - Test Contacts collection excludes Archive, Banner, and Code blocks
    - _Requirements: 3.1, 3.5, 3.6, 3.7_

- [x] 5. Update Legal collection with block assignments
  - Add layout builder with document-focused blocks
  - Exclude hero section (no hero for legal pages)
  - Keep minimal block selection for legal documents
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 5.1 Update Legal collection configuration
    - Import `getBlocksForCollection` from block config
    - Get legal blocks using `getBlocksForCollection('legal')`
    - Add "Layout" tab to tabs structure
    - Do NOT add hero field (legal pages have no hero)
    - Add `layout` blocks field with legal-specific blocks
    - Organize block imports by category with comments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]\* 5.2 Write unit tests for Legal collection
    - Test Legal collection does NOT have hero field
    - Test Legal collection has layout field with correct blocks (5 total)
    - Test Legal collection excludes Hero, Media, Archive, and Code blocks
    - Test Legal collection excludes Services, Portfolio, and CTA categories (except specified)
    - _Requirements: 4.5, 4.6, 4.7_

- [x] 6. Verify Pages collection remains unchanged
  - Ensure Pages collection still has access to all blocks
  - Verify no breaking changes to existing functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 6.1 Review Pages collection configuration
    - Verify Pages collection imports all blocks
    - Verify hero field exists with HeroBlock
    - Verify layout field includes all 27+ blocks
    - Confirm no changes needed (already correct)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]\* 6.2 Write unit tests for Pages collection
    - Test Pages collection has hero field with HeroBlock
    - Test Pages collection has layout field with all blocks
    - Test Pages collection includes all category blocks
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 7. Checkpoint - Ensure all collection tests pass
  - Run all unit tests for collections
  - Verify TypeScript compilation succeeds
  - Ensure all tests pass, ask the user if questions arise

- [x] 8. Create BlockRenderer component
  - Implement dynamic block rendering system
  - Handle missing components gracefully
  - Add error logging for unknown block types
  - _Requirements: 7.1, 7.2, 7.3_

  - [x] 8.1 Implement BlockRenderer component
    - Create `src/components/blocks/BlockRenderer.tsx`
    - Import all block components
    - Create `BLOCK_COMPONENTS` mapping object
    - Implement component with blocks array prop
    - Map over blocks and render corresponding components
    - Handle missing components with console warning
    - Add TypeScript types for props
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]\* 8.2 Write unit tests for BlockRenderer
    - Test BlockRenderer renders each block type correctly
    - Test BlockRenderer handles missing components gracefully
    - Test BlockRenderer logs warnings for unknown block types
    - Test BlockRenderer returns null for empty blocks array
    - _Requirements: 7.2, 7.3_

- [x] 9. Organize frontend components by category
  - Restructure components directory to match block categories
  - Ensure all block components are properly organized
  - Update imports in BlockRenderer
  - _Requirements: 7.1, 7.4_

  - [x] 9.1 Create category directories in components
    - Create `src/components/blocks/hero/`
    - Create `src/components/blocks/content/`
    - Create `src/components/blocks/services/`
    - Create `src/components/blocks/portfolio/`
    - Create `src/components/blocks/technical/`
    - Create `src/components/blocks/cta/`
    - Create `src/components/blocks/layout/`
    - _Requirements: 7.4_

  - [x] 9.2 Move existing block components to category directories
    - Move Hero component to `hero/` directory
    - Move Content, Media, Archive, Banner components to `content/` directory
    - Move Services components to `services/` directory
    - Move Portfolio components to `portfolio/` directory
    - Move Technical components to `technical/` directory
    - Move CTA components to `cta/` directory
    - Move Layout components to `layout/` directory
    - Update all import paths
    - _Requirements: 7.4_

  - [ ]\* 9.3 Write integration tests for component organization
    - Test all block components can be imported from new locations
    - Test BlockRenderer can import all components
    - Test no broken imports exist
    - _Requirements: 7.1, 7.4_

- [x] 10. Update page rendering to use BlockRenderer
  - Integrate BlockRenderer into page templates
  - Test rendering for all page types
  - Verify backward compatibility
  - _Requirements: 7.1, 7.2, 10.1, 10.2, 10.4_

  - [x] 10.1 Update blog page template
    - Import BlockRenderer component
    - Replace manual block rendering with BlockRenderer
    - Pass hero blocks to BlockRenderer
    - Pass layout blocks to BlockRenderer
    - Test blog pages render correctly
    - _Requirements: 7.1, 10.1_

  - [x] 10.2 Update service page template
    - Import BlockRenderer component
    - Replace manual block rendering with BlockRenderer
    - Pass hero blocks to BlockRenderer
    - Pass layout blocks to BlockRenderer
    - Test service pages render correctly
    - _Requirements: 7.1, 10.1_

  - [x] 10.3 Update contact page template
    - Import BlockRenderer component
    - Replace manual block rendering with BlockRenderer
    - Pass hero blocks to BlockRenderer
    - Pass layout blocks to BlockRenderer
    - Test contact pages render correctly
    - _Requirements: 7.1, 10.1_

  - [x] 10.4 Update legal page template
    - Import BlockRenderer component
    - Replace manual block rendering with BlockRenderer
    - Pass layout blocks to BlockRenderer (no hero)
    - Test legal pages render correctly
    - _Requirements: 7.1, 10.1_

  - [x] 10.5 Update general page template
    - Import BlockRenderer component
    - Replace manual block rendering with BlockRenderer
    - Pass hero blocks to BlockRenderer
    - Pass layout blocks to BlockRenderer
    - Test general pages render correctly
    - _Requirements: 7.1, 10.1_

  - [ ]\* 10.6 Write integration tests for page rendering
    - Test blog pages render with blog blocks
    - Test service pages render with service blocks
    - Test contact pages render with contact blocks
    - Test legal pages render with legal blocks
    - Test general pages render with all blocks
    - Test existing pages with legacy blocks still render
    - _Requirements: 7.1, 10.1, 10.2, 10.4_

- [ ] 11. Checkpoint - Ensure all rendering tests pass
  - Run all integration tests
  - Test in development environment
  - Verify all page types render correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 12. Add documentation and comments
  - Document block assignments in code
  - Add README documentation
  - Create admin panel help text
  - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 12.1 Add inline code documentation
    - Add JSDoc comments to `blockAssignments.ts`
    - Add JSDoc comments to `getBlocksForCollection()`
    - Add comments explaining block categories in each collection
    - Document rationale for block assignments
    - _Requirements: 9.1, 9.2_

  - [ ] 12.2 Create block assignment matrix documentation
    - Create `docs/block-assignments.md`
    - Document which blocks are available for each collection
    - Create markdown table showing block distribution
    - Explain rationale for each collection's block selection
    - _Requirements: 9.1, 9.2_

  - [ ] 12.3 Add admin panel descriptions
    - Add description to hero field in each collection
    - Add description to layout field in each collection
    - Explain which blocks are available and why
    - _Requirements: 9.3_

- [x] 13. Implement backward compatibility handling
  - Add legacy block detection
  - Display warnings for legacy blocks in admin
  - Ensure legacy blocks continue to render
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 13.1 Add legacy block detection in admin
    - Create utility function to detect legacy blocks
    - Check if page has blocks not in current collection assignment
    - Display admin warning when legacy blocks detected
    - Show message: "This page contains blocks that are no longer available for new additions"
    - _Requirements: 10.3_

  - [x] 13.2 Ensure legacy blocks render on frontend
    - Update BlockRenderer to handle all block types (not just assigned ones)
    - Test pages with legacy blocks render correctly
    - Verify no blocks are lost during editing
    - _Requirements: 10.2, 10.4_

  - [ ]\* 13.3 Write tests for backward compatibility
    - Test legacy blocks are detected correctly
    - Test legacy blocks continue to render on frontend
    - Test legacy blocks are preserved when editing page
    - Test warning is displayed in admin for legacy blocks
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 14. Run comprehensive test suite
  - Execute all unit tests
  - Execute all integration tests
  - Execute all E2E tests
  - Verify all tests pass
  - _Requirements: All_

  - [ ] 14.1 Run unit tests
    - Run tests for block configuration
    - Run tests for collection configurations
    - Run tests for BlockRenderer component
    - Verify all unit tests pass
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 7.2_

  - [ ] 14.2 Run integration tests
    - Run tests for component organization
    - Run tests for page rendering
    - Run tests for backward compatibility
    - Verify all integration tests pass
    - _Requirements: 7.1, 10.1, 10.2_

  - [ ]\* 14.3 Run E2E tests for content editor workflows
    - Test creating new blog post with blog blocks
    - Test creating new service page with service blocks
    - Test creating new contact page with contact blocks
    - Test creating new legal page with legal blocks
    - Test editing existing page with legacy blocks
    - Verify all E2E tests pass
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 10.3_

- [ ] 15. Final checkpoint and deployment preparation
  - Review all changes
  - Verify TypeScript compilation
  - Run production build
  - Prepare deployment
  - Ensure all tests pass, ask the user if questions arise

  - [ ] 15.1 Review all code changes
    - Review block configuration files
    - Review collection configuration updates
    - Review component organization
    - Review documentation
    - Ensure code quality and consistency
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 15.2 Verify TypeScript compilation
    - Run `tsc --noEmit` to check for type errors
    - Verify no TypeScript errors exist
    - Confirm all types are properly defined
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 15.3 Run production build
    - Execute production build command
    - Verify build succeeds without errors
    - Check bundle sizes are reasonable
    - Test tree-shaking is working correctly
    - _Requirements: All_

  - [ ] 15.4 Create deployment checklist
    - Document deployment steps
    - List rollback procedures
    - Define monitoring metrics
    - Prepare for zero-downtime deployment
    - _Requirements: All_

## Notes

- Tasks marked with `*` are optional test-related tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- The implementation is designed for zero-downtime deployment
- All changes are backward compatible with existing content
- TypeScript provides compile-time safety for all configurations
