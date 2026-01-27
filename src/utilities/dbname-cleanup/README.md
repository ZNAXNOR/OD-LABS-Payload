# DbName Cleanup Optimization System

A comprehensive system for analyzing and cleaning up excessive `dbName` usage in PayloadCMS projects. This system follows PayloadCMS best practices and ensures database schema compatibility while reducing configuration complexity and maintenance overhead.

## Overview

The DbName Cleanup Optimization system addresses the excessive and inconsistent usage of `dbName` properties throughout PayloadCMS projects. It systematically identifies unnecessary, redundant, and invalid `dbName` properties while preserving strategic usage that solves actual database identifier issues.

## Architecture

The system follows a pipeline architecture with distinct phases:

1. **Discovery Phase**: Scan and catalog all PayloadCMS configuration files
2. **Analysis Phase**: Evaluate each `dbName` usage against cleanup rules
3. **Validation Phase**: Ensure proposed changes maintain database compatibility
4. **Cleanup Phase**: Apply approved modifications to configuration files
5. **Reporting Phase**: Generate comprehensive cleanup analysis

## Core Components

### Types and Interfaces

- **`types.ts`**: Core TypeScript interfaces and data models
- **`interfaces.ts`**: Component interfaces and contracts
- **`field-type-registry.ts`**: PayloadCMS field type support information

### Key Types

#### ConfigurationFile

Represents a PayloadCMS configuration file with its dbName usages:

```typescript
interface ConfigurationFile {
  path: string
  type: 'collection' | 'global' | 'field'
  config: any
  dbNameUsages: DbNameUsage[]
}
```

#### DbNameUsage

Tracks individual dbName property usage with context:

```typescript
interface DbNameUsage {
  location: string // JSON path to the dbName property
  fieldName: string
  dbNameValue: string
  fieldType: string
  nestingLevel: number
  context: FieldContext
}
```

#### AnalysisResult

Result of analyzing a dbName usage:

```typescript
interface AnalysisResult {
  action: 'remove' | 'keep' | 'modify'
  reason: string
  riskLevel: 'low' | 'medium' | 'high'
  suggestedValue?: string
}
```

## Field Type Registry

The system maintains comprehensive knowledge of PayloadCMS field types and their `dbName` support:

### Supported Field Types

- **Data Fields**: `text`, `textarea`, `email`, `number`, `date`, `checkbox`, `select`, `radio`
- **Relationship Fields**: `relationship`, `upload`, `join`
- **Content Fields**: `richText`, `json`, `code`
- **Geospatial Fields**: `point`
- **Container Fields**: `array`, `group`, `blocks`

### Unsupported Field Types

- **Layout Fields**: `tabs`, `row`, `collapsible`
- **UI Fields**: `ui`

### Usage Examples

```typescript
import { FieldTypeRegistry } from './field-type-registry'

// Check if field type supports dbName
const supportsDbName = FieldTypeRegistry.supportsDbName('text') // true
const noSupport = FieldTypeRegistry.supportsDbName('ui') // false

// Get identifier impact level
const impact = FieldTypeRegistry.getIdentifierImpact('array') // 'high'

// Check if field affects database
const affectsDB = FieldTypeRegistry.affectsDatabase('relationship') // true
```

## Component Interfaces

### ConfigurationScanner

Discovers and parses PayloadCMS configuration files:

```typescript
interface ConfigurationScanner {
  scanProject(rootPath: string): Promise<ConfigurationFile[]>
  parseCollectionConfig(filePath: string): Promise<CollectionConfig>
  parseGlobalConfig(filePath: string): Promise<GlobalConfig>
  extractDbNameUsages(config: any, filePath: string): DbNameUsage[]
}
```

### DbNameAnalyzer

Core analysis engine for evaluating dbName usage patterns:

```typescript
interface DbNameAnalyzer {
  analyzeUsage(usage: DbNameUsage): AnalysisResult
  evaluateStrategicValue(usage: DbNameUsage): boolean
  checkFieldTypeSupport(fieldType: string): boolean
  calculateIdentifierLength(usage: DbNameUsage): number
}
```

### RuleEngine

Implements cleanup rules based on PayloadCMS best practices:

```typescript
interface RuleEngine {
  applyCollectionRules(usage: DbNameUsage): RuleResult
  applyFieldRules(usage: DbNameUsage): RuleResult
  applyValidationRules(usage: DbNameUsage): RuleResult
  checkFieldTypeCompatibility(fieldType: string): boolean
}
```

### SchemaValidator

Validates database compatibility of cleanup changes:

```typescript
interface SchemaValidator {
  validateIdentifierLength(identifier: string): boolean
  checkForConflicts(changes: CleanupChange[]): ValidationResult
  ensureBackwardCompatibility(change: CleanupChange): boolean
  validateDatabaseConstraints(change: CleanupChange): boolean
}
```

### FileModifier

Handles safe modification of configuration files:

```typescript
interface FileModifier {
  applyChanges(changes: CleanupChange[]): Promise<ModificationResult>
  removeDbNameProperty(filePath: string, location: string): Promise<void>
  modifyDbNameValue(filePath: string, location: string, newValue: string): Promise<void>
  preserveFormatting(filePath: string): Promise<void>
}
```

### CleanupOrchestrator

Main orchestrator coordinating all cleanup phases:

```typescript
interface CleanupOrchestrator {
  executeCleanup(projectPath: string, options?: CleanupOptions): Promise<CleanupResult>
  dryRun(projectPath: string, options?: CleanupOptions): Promise<CleanupChange[]>
  generateReport(projectPath: string, options?: CleanupOptions): Promise<CleanupReport>
}
```

## Constants and Utilities

### Key Constants

- `POSTGRES_IDENTIFIER_LIMIT`: 63 characters (PostgreSQL limit)
- `DEFAULT_NESTING_THRESHOLD`: 3 levels for strategic preservation
- `PAYLOAD_CONFIG_PATTERNS`: Common PayloadCMS config file patterns

### Utility Functions

- `isValidDatabaseIdentifier()`: Validates database identifier format
- `generateShortIdentifier()`: Creates shortened identifiers
- `calculateNestingLevel()`: Determines field nesting depth
- `extractCollectionSlug()`: Extracts collection name from file path

## Usage Example

```typescript
import {
  CleanupOrchestrator,
  DEFAULT_CLEANUP_OPTIONS,
  FieldTypeRegistry,
} from '@/utilities/dbname-cleanup'

// Check field type support
const canUseDbName = FieldTypeRegistry.supportsDbName('text')

// Configure cleanup options
const options = {
  ...DEFAULT_CLEANUP_OPTIONS,
  dryRun: true,
  verbose: true,
}

// Execute cleanup (when implemented)
const orchestrator: CleanupOrchestrator = new CleanupOrchestratorImpl()
const result = await orchestrator.executeCleanup('/path/to/project', options)
```

## Requirements Addressed

This core structure addresses the following requirements:

- **8.1**: TypeScript interfaces for configuration scanning and analysis
- **8.2**: Data models for DbName usage tracking and cleanup changes
- **8.5**: Field type registry with PayloadCMS field support information

## Next Steps

The following components need to be implemented in subsequent tasks:

1. **ConfigurationScanner** implementation
2. **DbNameAnalyzer** implementation
3. **RuleEngine** implementation
4. **SchemaValidator** implementation
5. **FileModifier** implementation
6. **CleanupOrchestrator** implementation

Each component will implement the interfaces defined in this core structure, ensuring type safety and consistent behavior across the system.
