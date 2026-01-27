# Design Document

## Overview

This design addresses the critical database relation inference error in the PayloadCMS header global configuration by realigning the configuration with the actual database schema. The solution focuses on correcting `dbName` properties, ensuring proper table relationships, and maintaining data integrity while restoring site functionality.

The core issue stems from a mismatch between the configured `dbName` properties in the header global and the actual database table names. PayloadCMS cannot infer the relation `header_tabs.dropdown_navItems` because the referenced table `header_nav_items` does not exist in the database schema, while the actual table follows a different naming pattern.

## Architecture

### Current State Analysis

The header global configuration currently uses these problematic `dbName` properties:

```typescript
// Current problematic configuration
{
  name: 'navItems',
  type: 'array',
  dbName: 'header_nav_items', // Table doesn't exist
  // ... nested fields
}
```

Based on the database identifier optimization documentation, the actual database schema uses a different naming pattern that was established during the PostgreSQL identifier length optimization work.

### Target Architecture

The solution implements a three-layer approach:

1. **Configuration Layer**: Update header global config to match actual database schema
2. **Validation Layer**: Add runtime validation to prevent future mismatches
3. **Migration Layer**: Ensure database schema consistency (if needed)

### Database Schema Alignment Strategy

The design follows PayloadCMS's automatic table naming conventions while respecting the existing database schema created during the identifier optimization process.

## Components and Interfaces

### Header Global Configuration Component

**Purpose**: Corrected PayloadCMS global configuration that aligns with actual database schema

**Key Changes**:

- Remove or correct problematic `dbName` properties
- Ensure array field naming follows actual database table structure
- Maintain all existing field functionality and data access patterns

```typescript
// Corrected configuration approach
export const Header: GlobalConfig = {
  slug: 'header',
  dbName: 'header', // Keep existing global table name
  fields: [
    {
      name: 'tabs',
      type: 'array',
      // Remove dbName to use PayloadCMS default: header_tabs
      fields: [
        // ... tab fields
        {
          name: 'dropdown',
          type: 'group',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              // Remove problematic dbName, let PayloadCMS generate: header_tabs_dropdown_nav_items
              fields: [
                // ... navigation item fields
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### Database Schema Validator Component

**Purpose**: Runtime validation to ensure configuration-database alignment

**Interface**:

```typescript
interface SchemaValidator {
  validateTableExists(tableName: string): Promise<boolean>
  validateRelationIntegrity(globalSlug: string): Promise<ValidationResult>
  generateMissingTables(config: GlobalConfig): Promise<string[]>
}

interface ValidationResult {
  isValid: boolean
  missingTables: string[]
  invalidRelations: string[]
  recommendations: string[]
}
```

### Migration Safety Component

**Purpose**: Safe database schema updates with rollback capability

**Interface**:

```typescript
interface MigrationSafety {
  backupTableData(tableName: string): Promise<BackupResult>
  validateMigration(changes: SchemaChange[]): Promise<ValidationResult>
  executeSafeMigration(changes: SchemaChange[]): Promise<MigrationResult>
  rollbackMigration(migrationId: string): Promise<RollbackResult>
}
```

## Data Models

### Header Global Data Structure

The header global maintains its existing data structure while ensuring proper database mapping:

```typescript
interface HeaderGlobal {
  id: string
  tabs: HeaderTab[]
  menuCta: LinkField
  updatedAt: string
  createdAt: string
}

interface HeaderTab {
  id: string
  label: string
  enableDirectLink: boolean
  enableDropdown: boolean
  directLink?: LinkGroup
  dropdown?: DropdownGroup
}

interface DropdownGroup {
  description?: string
  descriptionLinks: LinkField[]
  navItems: NavigationItem[]
}

interface NavigationItem {
  id: string
  style: 'default' | 'featured' | 'list'
  defaultLink?: DefaultLinkGroup
  featuredLink?: FeaturedLinkGroup
  listLinks?: ListLinkGroup
}
```

### Database Table Mapping

The corrected configuration maps to these database tables:

```sql
-- Main global table
header

-- Array tables (PayloadCMS auto-generated names)
header_tabs
header_tabs_dropdown_description_links
header_tabs_dropdown_nav_items
header_tabs_dropdown_nav_items_featured_link_links
header_tabs_dropdown_nav_items_list_links_links
```

## Error Handling

### Relation Inference Error Prevention

**Strategy**: Proactive validation and clear error messaging

```typescript
// Configuration validation hook
const validateHeaderConfig = async (config: GlobalConfig): Promise<void> => {
  const requiredTables = extractRequiredTables(config)
  const missingTables = await checkMissingTables(requiredTables)

  if (missingTables.length > 0) {
    throw new ConfigurationError(
      `Missing database tables for header global: ${missingTables.join(', ')}`,
    )
  }
}
```

### Runtime Error Handling

**Strategy**: Graceful degradation with informative error messages

```typescript
// Runtime relation validation
const validateRelations = async (payload: Payload): Promise<void> => {
  try {
    await payload.find({
      collection: 'header',
      limit: 1,
    })
  } catch (error) {
    if (error.message.includes('infer relation')) {
      throw new RelationInferenceError(
        'Header global database relations are misconfigured. Please check dbName properties.',
        { originalError: error },
      )
    }
    throw error
  }
}
```

### Data Recovery Mechanisms

**Strategy**: Automatic data recovery and manual intervention options

```typescript
interface DataRecovery {
  detectOrphanedData(): Promise<OrphanedData[]>
  repairRelations(orphanedData: OrphanedData[]): Promise<RepairResult>
  generateRecoveryScript(issues: DatabaseIssue[]): string
}
```

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific functionality with property-based tests for comprehensive validation:

**Unit Tests**: Focus on specific configuration scenarios, error conditions, and data migration edge cases
**Property Tests**: Verify universal properties across all possible header configurations and database states

### Property-Based Testing Configuration

Using **fast-check** for TypeScript property-based testing with minimum 100 iterations per test. Each property test references its corresponding design document property with the tag format: **Feature: header-relation-fix, Property {number}: {property_text}**

### Unit Testing Balance

Unit tests complement property tests by covering:

- Specific database schema validation scenarios
- Integration points between PayloadCMS and PostgreSQL
- Edge cases in configuration parsing and validation
- Error recovery and rollback mechanisms

Property tests handle comprehensive input coverage through randomization of:

- Header configuration variations
- Database schema states
- Migration scenarios
- Data integrity validation

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Based on the prework analysis and property reflection, the following properties ensure the header relation fix works correctly across all scenarios:

### Property 1: Database Schema Consistency

_For any_ header global configuration, all referenced database tables (including array field tables and relation tables) should exist in the current database schema and be accessible for relation inference.

**Validates: Requirements 1.2, 1.4, 1.5, 6.1**

### Property 2: System Loading Without Errors

_For any_ valid header global configuration that passes schema validation, the PayloadCMS system should start and load the header global without database relation inference errors.

**Validates: Requirements 1.1, 5.1**

### Property 3: Configuration-Database Mapping Integrity

_For any_ array field in the header global configuration, the field should successfully map to an existing database table, and all nested array fields should follow the same mapping pattern.

**Validates: Requirements 1.3, 4.2**

### Property 4: Admin Panel Accessibility

_For any_ properly configured header global, the admin panel should display the global in the globals list, allow editing without errors, and render all configured fields correctly.

**Validates: Requirements 2.1, 2.2, 2.5**

### Property 5: Data Persistence Accuracy

_For any_ changes made to header navigation items through the admin panel, the changes should be saved to the correct database tables and be retrievable in subsequent queries.

**Validates: Requirements 2.3, 2.4**

### Property 6: Data Integrity During Updates

_For any_ configuration update or database table reference correction, all existing header navigation data should be preserved, and referential integrity between parent and child records should be maintained.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 7: PayloadCMS Convention Compliance

_For any_ header global configuration, the field naming, structure, and database identifier generation should follow PayloadCMS conventions and comply with PostgreSQL length limitations.

**Validates: Requirements 4.1, 4.3, 4.4**

### Property 8: Access Control Implementation

_For any_ header global configuration, proper access control functions should be implemented and correctly restrict or allow access based on user permissions.

**Validates: Requirements 4.5**

### Property 9: Frontend Functionality

_For any_ header global data, the frontend header component should render all navigation items correctly, handle both direct links and dropdown menus, and provide full navigation functionality.

**Validates: Requirements 5.2, 5.3, 5.4, 5.5**

### Property 10: Error Prevention and Validation

_For any_ header global configuration, the system should validate database table existence, provide clear error messages for relation inference failures, and prevent configuration-database mismatches.

**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

### Property 11: API Compatibility Preservation

_For any_ header configuration update, the API responses should maintain the same format and structure, preserving compatibility with existing frontend components and integrations.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 12: Migration Safety and Rollback

_For any_ database schema changes required during the fix, proper migration scripts should be created, data should be backed up before changes, and the migration process should be reversible with rollback capabilities.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 13: Data Integrity Validation After Migration

_For any_ schema modification during the fix, data integrity should be validated after changes, and if migration fails, the system should restore the previous working state.

**Validates: Requirements 8.4, 8.5**
