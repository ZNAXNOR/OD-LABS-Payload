# Implementation Plan: Payload CMS Pages Collection Consolidation

## Overview

This implementation plan consolidates five specialized Payload CMS collections (Pages, Blogs, Services, Legal, Contacts) into a single canonical Pages collection using TypeScript. The approach uses conditional field groups and a pageType discriminator to maintain all existing functionality while simplifying the content management architecture.

## Tasks

- [x] 1. Set up consolidated Pages collection structure
  - Create the new unified Pages collection configuration
  - Define the pageType discriminator field with all required options
  - Set up basic collection metadata and admin configuration
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement core shared fields
  - [x] 2.1 Create base page schema with universal fields
    - Define title, slug, status fields
    - Set up SEO metadata fields
    - Configure audit and lifecycle fields
    - _Requirements: 2.1, 2.5_
  - [ ]\* 2.2 Write property test for universal field preservation
    - **Property 2: Universal Field Preservation**
    - **Validates: Requirements 2.5**
  - [x] 2.3 Implement block layout system
    - Configure shared blocks field for all page types
    - Import and configure all existing block types
    - Set up block validation and ordering
    - _Requirements: 6.1, 6.2_

  - [ ]\* 2.4 Write property test for block system preservation
    - **Property 14: Block System Preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 3. Create conditional field groups for page types
  - [x] 3.1 Implement blog-specific fields
    - Create blogConfig group with author, tags, publishedDate, excerpt
    - Set up conditional visibility based on pageType = 'blog'
    - Configure field validation and admin UI
    - _Requirements: 2.1_
  - [x] 3.2 Implement service-specific fields
    - Create serviceConfig group with pricing, serviceType, featured
    - Set up conditional visibility based on pageType = 'service'
    - Configure pricing field structure and validation
    - _Requirements: 2.2_
  - [x] 3.3 Implement legal-specific fields
    - Create legalConfig group with documentType, effectiveDate, lastUpdated, notificationSettings
    - Set up conditional visibility based on pageType = 'legal'
    - Configure date validation and notification settings
    - _Requirements: 2.3_
  - [x] 3.4 Implement contact-specific fields
    - Create contactConfig group with purpose, formRelations
    - Set up conditional visibility based on pageType = 'contact'
    - Configure form relationship fields
    - _Requirements: 2.4_

  - [ ]\* 3.5 Write property test for pageType-specific field availability
    - **Property 1: PageType-Specific Field Availability**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

  - [ ]\* 3.6 Write property test for conditional field visibility
    - **Property 3: Conditional Field Visibility**
    - **Validates: Requirements 1.3**

- [x] 4. Checkpoint - Ensure basic collection structure works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement hierarchical relationships
  - [x] 5.1 Set up parent-child relationship fields
    - Configure parent field with self-referencing relationship
    - Set up breadcrumb generation logic
    - Implement circular reference prevention
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]\* 5.2 Write property test for hierarchical relationship preservation
    - **Property 6: Hierarchical Relationship Preservation**
    - **Validates: Requirements 3.1, 3.4**

  - [ ]\* 5.3 Write property test for breadcrumb generation
    - **Property 7: Breadcrumb Generation Consistency**
    - **Validates: Requirements 3.2**

  - [ ]\* 5.4 Write property test for circular reference prevention
    - **Property 8: Circular Reference Prevention**
    - **Validates: Requirements 3.3, 12.3**

  - [x] 5.5 Implement URL generation logic
    - Set up slug generation with hierarchy support
    - Configure URL path generation based on pageType
    - Ensure compatibility with existing frontend routing
    - _Requirements: 3.5_

  - [ ]\* 5.6 Write property test for URL generation preservation
    - **Property 9: URL Generation Preservation**
    - **Validates: Requirements 3.5**

- [x] 6. Implement hook system
  - [x] 6.1 Create audit trail hooks
    - Implement createAuditTrailHook factory function
    - Configure audit tracking for all relevant fields
    - Set up audit trail storage and retrieval
    - _Requirements: 4.1_
  - [ ]\* 6.2 Write property test for audit trail functionality
    - **Property 10: Audit Trail Functionality**
    - **Validates: Requirements 4.1**

  - [x] 6.3 Create revalidation hooks
    - Implement createRevalidateHook factory function
    - Configure pageType-specific revalidation paths
    - Set up hierarchical revalidation logic
    - _Requirements: 4.2, 4.3_

  - [ ]\* 6.4 Write property test for revalidation hook execution
    - **Property 11: Revalidation Hook Execution**
    - **Validates: Requirements 4.2, 4.3**

  - [x] 6.5 Implement slug generation hooks
    - Create centralized slug generation logic
    - Handle duplicate slug resolution
    - Configure slug validation and formatting
    - _Requirements: 4.4_

  - [ ]\* 6.6 Write property test for slug generation consistency
    - **Property 12: Slug Generation Consistency**
    - **Validates: Requirements 4.4**

- [x] 7. Configure access control
  - [x] 7.1 Set up collection-level access control
    - Configure create, read, update, delete permissions
    - Implement authenticated and authenticatedOrPublished access patterns
    - Set up admin access controls
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 7.2 Implement field-level access controls
    - Configure access controls for sensitive fields within conditional groups
    - Set up role-based field visibility
    - Implement user-specific field access patterns
    - _Requirements: 5.4, 5.5_

  - [ ]\* 7.3 Write property test for access control preservation
    - **Property 13: Access Control Preservation**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [-] 8. Implement validation system
  - [x] 8.1 Set up field validation rules
    - Configure required field validation for each pageType
    - Implement custom validation functions for complex fields
    - Set up cross-field validation logic
    - _Requirements: 12.1, 12.2, 12.4, 12.5_
  - [ ]\* 8.2 Write property test for validation rule preservation
    - **Property 5: Validation Rule Preservation**
    - **Validates: Requirements 1.5, 12.1, 12.2, 12.4, 12.5**

  - [ ]\* 8.3 Write property test for field definition preservation
    - **Property 4: Field Definition Preservation**
    - **Validates: Requirements 1.4**

- [x] 9. Configure live preview functionality
  - [x] 9.1 Set up live preview for all page types
    - Configure preview URL generation based on pageType
    - Set up draft and published preview handling
    - Implement preview authentication and security
    - _Requirements: 7.1, 7.5_
  - [ ]\* 9.2 Write property test for live preview functionality
    - **Property 15: Live Preview Functionality**
    - **Validates: Requirements 7.1, 7.5**

  - [x] 9.3 Implement preview URL generation
    - Create pageType-aware preview URL logic
    - Handle hierarchical preview URLs
    - Configure preview routing compatibility
    - _Requirements: 7.2_

  - [ ]\* 9.4 Write property test for preview URL generation
    - **Property 16: Preview URL Generation**
    - **Validates: Requirements 7.2**

  - [x] 9.5 Preserve preview configurations
    - Migrate existing preview configurations from original collections
    - Set up pageType-specific preview settings
    - Configure preview customization options
    - _Requirements: 7.3_

  - [ ]\* 9.6 Write property test for preview configuration preservation
    - **Property 17: Preview Configuration Preservation**
    - **Validates: Requirements 7.3**

- [ ] 10. Checkpoint - Ensure all functionality works before migration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Create data migration system
  - [ ] 11.1 Implement migration scripts
    - Create scripts to migrate data from original collections
    - Set up data transformation logic for each pageType
    - Implement relationship preservation during migration
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ] 11.2 Set up migration validation
    - Create validation scripts to verify migration integrity
    - Implement data comparison between original and migrated data
    - Set up migration rollback procedures
    - _Requirements: 8.4, 8.5_

  - [ ] 11.3 Preserve document metadata
    - Migrate version history and drafts
    - Preserve audit metadata and timestamps
    - Maintain document IDs where possible
    - _Requirements: 8.6_

  - [ ]\* 11.4 Write integration tests for migration
    - Test complete migration process with sample data
    - Verify data integrity after migration
    - Test rollback procedures

- [ ] 12. Ensure API compatibility
  - [ ] 12.1 Verify GraphQL API compatibility
    - Test existing GraphQL queries against consolidated collection
    - Update GraphQL schema generation if needed
    - Ensure query result structure remains consistent
    - _Requirements: 10.2_
  - [ ] 12.2 Verify REST API compatibility
    - Test existing REST API endpoints against consolidated collection
    - Ensure response format consistency
    - Validate API performance characteristics
    - _Requirements: 10.1, 10.4_

  - [ ]\* 12.3 Write property test for API behavioral equivalence
    - **Property 18: API Behavioral Equivalence**
    - **Validates: Requirements 10.1, 10.3**

  - [ ]\* 12.4 Write property test for GraphQL compatibility
    - **Property 19: GraphQL Compatibility Boundary**
    - **Validates: Requirements 10.2**

  - [ ]\* 12.5 Write property test for data serialization consistency
    - **Property 20: Data Serialization Consistency**
    - **Validates: Requirements 10.4**

- [x] 13. Configure admin UI
  - [x] 13.1 Set up admin interface customizations
    - Configure pageType visibility in list and edit views
    - Set up conditional field grouping and organization
    - Implement admin UI customizations from original collections
    - _Requirements: 11.1, 11.3_
  - [x] 13.2 Preserve field descriptions and help text
    - Migrate field descriptions from original collections
    - Set up contextual help for conditional fields
    - Configure admin UI guidance for pageType selection
    - _Requirements: 11.2_

  - [ ]\* 13.3 Write property test for field description preservation
    - **Property 21: Field Description Preservation**
    - **Validates: Requirements 11.2**

- [ ] 14. Final integration and testing
  - [ ] 14.1 Run comprehensive test suite
    - Execute all property-based tests with full coverage
    - Run integration tests with realistic data sets
    - Validate performance characteristics
    - _All Requirements_
  - [ ] 14.2 Perform end-to-end testing
    - Test complete content creation workflow for each pageType
    - Verify frontend compatibility with consolidated API
    - Test admin UI functionality across all page types
    - _All Requirements_

  - [ ]\* 14.3 Write integration tests for complete workflow
    - Test full page creation, editing, and publishing workflow
    - Verify hook execution and side effects
    - Test access control across different user roles

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Migration tasks include comprehensive data validation and rollback procedures
- All existing functionality is preserved through the consolidation process
