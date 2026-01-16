# Requirements Document

## Introduction

This specification addresses a critical error in the Services collection configuration where a "Cannot read properties of undefined (reading 'map')" error occurs when attempting to use the collection. The root cause is the ContainerBlock's nested blocks field with an empty array (`blocks: []`), which creates a circular reference issue in Payload's block processing system.

## Glossary

- **Services_Collection**: The PayloadCMS collection for service pages located at `src/pages/Services/index.ts`
- **ContainerBlock**: A layout block that allows nesting other blocks inside it, defined at `src/blocks/layout/Container/config.ts`
- **Block_Assignments**: The centralized configuration system that defines which blocks are available for each page collection type
- **Nested_Blocks_Field**: A blocks-type field within a block that allows recursive block composition
- **Circular_Reference**: A situation where a block can contain itself, either directly or indirectly through other blocks
- **Block_Processing**: Payload's internal mechanism for validating and rendering block configurations

## Requirements

### Requirement 1: Diagnose Map Error

**User Story:** As a developer, I want to understand the exact cause of the map error, so that I can implement the correct fix.

#### Acceptance Criteria

1. WHEN the Services collection configuration is loaded, THE System SHALL identify which component is attempting to call `.map()` on undefined
2. WHEN the ContainerBlock is processed, THE System SHALL detect if the empty blocks array causes the error
3. WHEN block assignments are retrieved, THE System SHALL verify that all block references are properly defined
4. THE System SHALL log detailed error information including the stack trace and affected block configuration

### Requirement 2: Fix ContainerBlock Configuration

**User Story:** As a developer, I want the ContainerBlock to properly handle nested blocks, so that it can be used in the Services collection without errors.

#### Acceptance Criteria

1. WHEN the ContainerBlock is defined, THE System SHALL either remove the nested blocks field OR populate it with valid block references
2. IF the nested blocks field is kept, THEN THE System SHALL prevent circular references by excluding the ContainerBlock from its own nested blocks array
3. WHEN the ContainerBlock is used in a collection, THE System SHALL successfully process the block configuration without map errors
4. THE System SHALL ensure the ContainerBlock configuration is valid according to Payload's block schema requirements

### Requirement 3: Update Block Assignment Strategy

**User Story:** As a developer, I want a clear strategy for handling nested blocks in layout blocks, so that similar errors don't occur in the future.

#### Acceptance Criteria

1. WHEN layout blocks with nested blocks are defined, THE System SHALL document the approach for populating the nested blocks array
2. THE System SHALL provide a helper function or pattern for safely creating nested block configurations
3. WHEN a block can contain other blocks, THE System SHALL prevent infinite recursion by excluding itself from the nested blocks list
4. THE System SHALL validate that all blocks in the nested blocks array are properly imported and defined

### Requirement 4: Validate Services Collection

**User Story:** As a developer, I want to verify that the Services collection works correctly after the fix, so that I can use it in production.

#### Acceptance Criteria

1. WHEN the Services collection is loaded in the admin panel, THE System SHALL display the collection without errors
2. WHEN creating a new service page, THE System SHALL allow adding blocks to both hero and layout fields
3. WHEN the ContainerBlock is added to a service page, THE System SHALL render the block configuration UI correctly
4. WHEN saving a service page with blocks, THE System SHALL persist the data without validation errors

### Requirement 5: Test Block Rendering

**User Story:** As a content editor, I want all blocks including the ContainerBlock to render correctly, so that I can build service pages effectively.

#### Acceptance Criteria

1. WHEN a service page with a ContainerBlock is saved, THE System SHALL store the nested blocks data correctly
2. WHEN viewing a service page in the admin panel, THE System SHALL display all blocks including nested blocks
3. WHEN editing a ContainerBlock, THE System SHALL allow adding, removing, and reordering nested blocks
4. THE System SHALL render the ContainerBlock's nested blocks in the correct order and structure

### Requirement 6: Document Solution

**User Story:** As a developer, I want clear documentation of the fix and best practices, so that I can avoid similar issues in the future.

#### Acceptance Criteria

1. THE System SHALL document the root cause of the map error in code comments
2. THE System SHALL provide examples of correct nested block configuration patterns
3. THE System SHALL document any limitations or constraints for nested blocks
4. THE System SHALL include warnings or validation to prevent similar configuration errors
