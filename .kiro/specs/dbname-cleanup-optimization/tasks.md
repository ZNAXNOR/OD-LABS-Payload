# Implementation Plan: DbName Cleanup Optimization

## Overview

This implementation plan converts the dbName cleanup optimization design into discrete coding tasks. The approach follows a pipeline architecture with distinct phases: discovery, analysis, validation, cleanup, and reporting. Each task builds incrementally to create a comprehensive system for cleaning up excessive `dbName` usage in PayloadCMS projects.

## Tasks

- [x] 1. Set up core project structure and interfaces
  - Create TypeScript interfaces for configuration scanning and analysis
  - Define data models for DbName usage tracking and cleanup changes
  - Set up field type registry with PayloadCMS field support information
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 2. Implement configuration file discovery and parsing
  - [x] 2.1 Create ConfigurationScanner class
    - Implement project scanning to find PayloadCMS configuration files
    - Add support for parsing collection and global configuration files
    - Extract dbName usages with full context information
    - _Requirements: 9.1, 9.5_
  - [ ]\* 2.2 Write property test for configuration scanning
    - **Property 1: Configuration file discovery completeness**
    - **Validates: Requirements 9.1**
  - [x] 2.3 Implement DbNameUsage extraction with nesting analysis
    - Calculate field nesting levels and full identifier paths
    - Track field context including parent fields and collection information
    - Generate comprehensive usage metadata for analysis
    - _Requirements: 3.5, 6.1_
  - [ ]\* 2.4 Write unit tests for parsing edge cases
    - Test handling of malformed configuration files
    - Test extraction from complex nested structures
    - _Requirements: 9.5_

- [x] 3. Build rule-based analysis engine
  - [x] 3.1 Create DbNameAnalyzer with strategic value evaluation
    - Implement analysis of dbName usage patterns
    - Add strategic value assessment for nested fields and long identifiers
    - Calculate identifier length impacts and database benefits
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]\* 3.2 Write property test for strategic dbName preservation
    - **Property 3: Strategic dbName preservation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
  - [x] 3.3 Implement RuleEngine with PayloadCMS compliance
    - Create collection-level cleanup rules
    - Add field-level cleanup rules with field type support checking
    - Implement validation rules for database compatibility
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 8.1, 8.2_
  - [ ]\* 3.4 Write property test for field dbName cleanup
    - **Property 2: Field dbName cleanup**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 4. Checkpoint - Ensure analysis engine works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement schema validation and conflict resolution
  - [x] 5.1 Create SchemaValidator for database compatibility
    - Validate identifier length limits against PostgreSQL constraints
    - Check for naming conflicts after dbName removal
    - Ensure backward compatibility with existing database schemas
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]\* 5.2 Write property test for database schema compatibility
    - **Property 6: Database schema compatibility**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
  - [x] 5.3 Implement conflict resolution for duplicate dbName values
    - Detect and resolve duplicate dbName values across fields
    - Standardize patterns between related configuration files
    - Apply consistent naming conventions following PayloadCMS best practices
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  - [ ]\* 5.4 Write property test for dbName conflict resolution
    - **Property 4: DbName conflict resolution**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

- [x] 6. Build file modification system
  - [x] 6.1 Create FileModifier for safe in-place updates
    - Implement safe modification of TypeScript configuration files
    - Preserve existing file structure, formatting, and comments
    - Remove or modify dbName properties without creating backups
    - _Requirements: 9.1, 9.2, 9.4, 9.5_
  - [ ]\* 6.2 Write property test for in-place file modifications
    - **Property 9: In-place file modifications**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**
  - [x] 6.3 Implement invalid dbName removal with logging
    - Remove dbName from field types that don't support it
    - Handle UI fields and presentational-only fields
    - Log all removals with detailed explanations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ]\* 6.4 Write property test for invalid dbName removal
    - **Property 5: Invalid dbName removal**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 7. Create main cleanup orchestrator
  - [x] 7.1 Build CleanupOrchestrator to coordinate all phases
    - Integrate discovery, analysis, validation, and modification phases
    - Implement error handling and recovery mechanisms
    - Ensure PayloadCMS compliance throughout the process
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [ ]\* 7.2 Write property test for collection dbName cleanup
    - **Property 1: Collection dbName cleanup**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
  - [x] 7.3 Add comprehensive error handling
    - Handle file system errors gracefully
    - Manage configuration parsing failures
    - Provide meaningful error messages and recovery suggestions
    - _Requirements: 6.5, 5.5_
  - [ ]\* 7.4 Write property test for PayloadCMS compliance
    - **Property 8: PayloadCMS compliance**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 8. Integration and CLI interface
  - [ ]\* 8.1 Create command-line interface for the cleanup tool
    - Implement CLI with options for dry-run and verbose output
    - Add project path specification and configuration options
    - Integrate all components into a cohesive cleanup workflow
    - _Requirements: 7.1, 9.3_
  - [ ]\* 8.2 Write integration tests for end-to-end cleanup
    - Test complete cleanup process on sample PayloadCMS projects
    - Verify multi-file consistency and database compatibility
    - _Requirements: 1.4, 1.5, 6.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The system modifies files in-place without creating backups per requirements
- All output goes to console/logs without creating additional files
