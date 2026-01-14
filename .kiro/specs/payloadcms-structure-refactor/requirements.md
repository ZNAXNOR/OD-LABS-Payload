# Requirements Document

## Introduction

This specification defines the requirements for restructuring the Payload CMS project to follow official Payload conventions and best practices as demonstrated in the official Payload repository (https://github.com/payloadcms/payload/) and the Payload website repository (https://github.com/payloadcms/website/).

The current project structure deviates from Payload conventions in several areas:

- Component file organization (flat files vs. directory-based)
- Block structure and organization
- Collection organization patterns
- Component export patterns

## Glossary

- **Block**: A reusable content block in Payload CMS that can be used in layout builders
- **Collection**: A Payload CMS collection configuration defining a content type
- **Component**: A React component used in the Payload admin panel or frontend
- **Directory-based Component**: A component organized as `ComponentName/index.tsx` instead of `ComponentName.tsx`
- **Config File**: A Payload configuration file defining blocks, collections, or globals
- **Frontend Component**: React components used for rendering content on the website
- **Admin Component**: React components used within the Payload admin panel

## Requirements

### Requirement 1: Restructure Component Files

**User Story:** As a developer, I want components to follow the directory-based pattern (`Component/index.tsx`), so that the project structure aligns with Payload conventions and is easier to maintain.

#### Acceptance Criteria

1. WHEN a component exists as a flat file (e.g., `BreadcrumbCell.tsx`), THE System SHALL restructure it to a directory-based pattern (e.g., `BreadcrumbCell/index.tsx`)
2. WHEN restructuring components, THE System SHALL preserve all imports and exports
3. WHEN restructuring components, THE System SHALL update all references to the component throughout the codebase
4. WHEN a component has associated files (styles, types, utilities), THE System SHALL co-locate them within the component directory

### Requirement 2: Reorganize Block Structure

**User Story:** As a developer, I want blocks to be organized with their configuration and components in dedicated directories, so that block-related code is properly encapsulated and follows Payload patterns.

#### Acceptance Criteria

1. WHEN a block exists as a flat config file (e.g., `Hero.ts`), THE System SHALL restructure it to include both config and component files in a dedicated directory
2. WHEN restructuring blocks, THE System SHALL create a `config.ts` file for the block configuration
3. WHEN a block has a frontend component, THE System SHALL create a `Component.tsx` file in the block directory
4. WHEN a block has client-side interactivity, THE System SHALL create a `Component.client.tsx` file
5. WHEN restructuring blocks, THE System SHALL maintain the block's slug and interface name
6. WHEN blocks are restructured, THE System SHALL update the blocks index file to export from the new locations

### Requirement 3: Standardize Collection Organization

**User Story:** As a developer, I want collections to follow a consistent directory structure with hooks and utilities co-located, so that collection-related code is organized according to Payload best practices.

#### Acceptance Criteria

1. WHEN a collection has hooks, THE System SHALL organize them in a `hooks` subdirectory within the collection directory
2. WHEN a collection configuration exists, THE System SHALL ensure it's named `index.ts` within its collection directory
3. WHEN collections have shared utilities, THE System SHALL organize them appropriately within the collection structure
4. WHEN restructuring collections, THE System SHALL preserve all hook registrations and configurations

### Requirement 4: Organize Icon Components

**User Story:** As a developer, I want icon components to follow the directory-based pattern with proper index files, so that icon imports are consistent and maintainable.

#### Acceptance Criteria

1. WHEN icon components exist, THE System SHALL ensure each icon is in its own directory with an `index.tsx` file
2. WHEN icons have shared types or utilities, THE System SHALL maintain them at the icons directory level
3. WHEN restructuring icons, THE System SHALL update all icon imports throughout the codebase

### Requirement 5: Standardize Global Configurations

**User Story:** As a developer, I want global configurations to follow consistent patterns with components and hooks properly organized, so that global-related code is maintainable and follows Payload conventions.

#### Acceptance Criteria

1. WHEN a global has a configuration file, THE System SHALL ensure it's named `config.ts`
2. WHEN a global has frontend components, THE System SHALL organize them with proper naming (`Component.tsx`, `Component.client.tsx`)
3. WHEN a global has hooks, THE System SHALL organize them in a `hooks` subdirectory
4. WHEN a global has row labels or custom components, THE System SHALL co-locate them within the global directory

### Requirement 6: Update Import Paths

**User Story:** As a developer, I want all import paths to be updated automatically when files are restructured, so that the application continues to function correctly after the refactoring.

#### Acceptance Criteria

1. WHEN a file is moved or renamed, THE System SHALL identify all files that import from the old location
2. WHEN updating imports, THE System SHALL update both relative and absolute import paths
3. WHEN updating imports, THE System SHALL preserve import aliases (e.g., `@/components`)
4. WHEN updating imports, THE System SHALL handle both default and named exports correctly
5. WHEN all imports are updated, THE System SHALL verify no broken imports remain

### Requirement 7: Maintain Functional Equivalence

**User Story:** As a developer, I want the restructured codebase to maintain identical functionality, so that no features are broken during the refactoring process.

#### Acceptance Criteria

1. WHEN files are restructured, THE System SHALL preserve all component logic and behavior
2. WHEN configurations are reorganized, THE System SHALL maintain all field definitions and settings
3. WHEN hooks are moved, THE System SHALL preserve all hook logic and execution order
4. WHEN the refactoring is complete, THE System SHALL ensure all existing functionality works as before

### Requirement 8: Follow Payload Export Patterns

**User Story:** As a developer, I want exports to follow Payload conventions (default exports for configs, named exports for utilities), so that the codebase is consistent with official Payload patterns.

#### Acceptance Criteria

1. WHEN a file exports a configuration (Block, Collection, Global), THE System SHALL use default export
2. WHEN a file exports utilities or helpers, THE System SHALL use named exports
3. WHEN a component is exported, THE System SHALL follow React component export conventions
4. WHEN index files aggregate exports, THE System SHALL use appropriate re-export patterns

### Requirement 9: Organize Pages Collection Structure

**User Story:** As a developer, I want the Pages collection to be properly structured with its hooks and utilities, so that it follows the same organizational pattern as other collections.

#### Acceptance Criteria

1. WHEN the Pages collection exists, THE System SHALL ensure it has a dedicated directory under `src/collections/Pages`
2. WHEN the Pages collection has hooks, THE System SHALL organize them in `src/collections/Pages/hooks`
3. WHEN the Pages collection configuration exists, THE System SHALL name it `index.ts`
4. WHEN restructuring the Pages collection, THE System SHALL move it from `src/pages/Pages` to `src/collections/Pages`

### Requirement 10: Create Migration Documentation

**User Story:** As a developer, I want clear documentation of all structural changes, so that I understand what was changed and can reference the new structure.

#### Acceptance Criteria

1. WHEN the restructuring is complete, THE System SHALL create a migration document listing all moved files
2. WHEN files are restructured, THE System SHALL document the old path and new path for each file
3. WHEN import patterns change, THE System SHALL document the new import patterns
4. WHEN the documentation is created, THE System SHALL include examples of the new structure
