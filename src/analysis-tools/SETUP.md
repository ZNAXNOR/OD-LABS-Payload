# Analysis Tools Setup Documentation

## Overview

This document describes the project structure and setup for the Blocks and Components Analysis System.

## Project Structure

```
src/analysis-tools/
├── README.md                 # Main documentation
├── SETUP.md                  # This file - setup documentation
├── package.json              # Package configuration with test scripts
├── tsconfig.json             # TypeScript configuration
├── vitest.config.mts         # Vitest test configuration
├── vitest.setup.ts           # Test setup with fast-check configuration
│
├── types/                    # Core TypeScript interfaces and types
│   └── index.ts              # All type definitions from design document
│
├── src/                      # Source code
│   └── index.ts              # Main entry point
│
├── analyzers/                # Block and component analyzers
│   └── .gitkeep
│
├── validators/               # Integration and security validators
│   └── .gitkeep
│
├── generators/               # Test and report generators
│   └── .gitkeep
│
├── comparators/              # Pattern comparison tools
│   └── .gitkeep
│
├── utils/                    # Shared utilities
│   └── index.ts              # Utility functions
│
├── cli/                      # Command-line interface
│   └── .gitkeep
│
└── tests/                    # Test suites
    ├── unit/                 # Unit tests
    │   └── utils.test.ts
    ├── property/             # Property-based tests (fast-check)
    │   └── utils.property.test.ts
    ├── integration/          # Integration tests
    │   └── .gitkeep
    ├── accessibility/        # Accessibility tests
    │   └── .gitkeep
    └── performance/          # Performance tests
        └── .gitkeep
```

## Core Types

All TypeScript interfaces and types are defined in `types/index.ts` based on the design document:

- **Analysis Orchestrator Types**: `AnalysisOptions`, `AnalysisResult`
- **Block Analyzer Types**: `BlockAnalysisResult`, `FieldValidationResult`, `TypingIssue`, `SecurityIssue`, `BlockMetrics`
- **Component Analyzer Types**: `ComponentAnalysisResult`, `AccessibilityIssue`, `PerformanceIssue`, `ComponentMetrics`
- **Integration Validator Types**: `IntegrationResult`, `MappingIssue`, `NamingIssue`, `PreviewIssue`
- **Pattern Comparator Types**: `OfficialPattern`, `PatternComparisonResult`, `StructuralDiff`, `FeatureDiff`
- **Test Generator Types**: `TestGenerationResult`, `TestSuite`, `PropertyTest`, `AccessibilityTest`
- **Report Generator Types**: `Report`, `Summary`, `ImplementationGuide`, `PrioritizedImprovement`
- **Common Types**: `Issue`, `Suggestion`, `Recommendation`, `Location`
- **Payload CMS Types**: `Block`, `Field`, `AccessControl`, `Component`, `PropDefinition`

## Testing Framework

### Configuration

- **Test Runner**: Vitest 3.2.3
- **Property Testing**: fast-check 4.5.3 (configured for minimum 100 iterations)
- **React Testing**: @testing-library/react 16.3.0
- **Environment**: jsdom for DOM testing

### Test Scripts

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:property      # Property-based tests only
npm run test:integration   # Integration tests only
npm run test:accessibility # Accessibility tests only
npm run test:performance   # Performance tests only

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Property-Based Testing

All property tests use fast-check with the following global configuration:

```typescript
fc.configureGlobal({
  numRuns: 100, // Minimum 100 iterations per test
  verbose: true, // Detailed output
  seed: Date.now(), // Random seed for reproducibility
})
```

### Coverage Thresholds

The project enforces 80% code coverage across all metrics:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## TypeScript Configuration

The project uses strict TypeScript configuration with:

- Target: ES2022
- Module: ESNext
- Strict mode enabled
- Path aliases: `@/*` for src, `@types` for types

## Utility Functions

The `utils/index.ts` file provides shared utilities:

- **ID Generation**: `generateId(prefix)`
- **Complexity Calculation**: `calculateComplexityScore(metrics)`
- **Path Utilities**: `normalizePath()`, `getFileNameWithoutExtension()`
- **Case Conversion**: `toKebabCase()`, `toPascalCase()`, `toCamelCase()`
- **Object Utilities**: `isPlainObject()`, `deepMerge()`
- **Retry Logic**: `retryWithBackoff()`
- **Formatting**: `formatBytes()`, `formatDuration()`

## Next Steps

1. **Task 2**: Implement Block Analyzer
2. **Task 4**: Implement Component Analyzer
3. **Task 6**: Implement Integration Validator
4. **Task 7**: Implement Pattern Comparator
5. **Task 10**: Implement Test Generator
6. **Task 12**: Implement Report Generator
7. **Task 14**: Implement Analysis Orchestrator
8. **Task 16**: Create CLI interface

## Development Guidelines

1. **Type Safety**: Always use TypeScript types from `types/index.ts`
2. **Testing**: Write both unit tests and property tests for all new code
3. **Error Handling**: Follow error handling patterns from design document
4. **Documentation**: Document all public APIs with JSDoc comments
5. **Code Style**: Follow existing code style and formatting
6. **Commits**: Make atomic commits with clear messages

## Dependencies

### Production Dependencies

- None yet (will be added as needed)

### Development Dependencies

- vitest: Test runner
- fast-check: Property-based testing
- @testing-library/react: React component testing
- @vitejs/plugin-react: React support for Vitest
- vite-tsconfig-paths: TypeScript path resolution

## Running Tests

To verify the setup is working correctly:

```bash
# From project root
npx vitest run --config ./src/analysis-tools/vitest.config.mts

# Expected output: All tests passing
# ✓ src/analysis-tools/tests/unit/utils.test.ts (21 tests)
# ✓ src/analysis-tools/tests/property/utils.property.test.ts (13 tests)
```

## Troubleshooting

### Tests not found

- Verify test files match the patterns in `vitest.config.mts`
- Check that test files are in the correct directories

### Import errors

- Verify TypeScript paths are configured correctly
- Check that `vite-tsconfig-paths` plugin is loaded

### Property tests failing

- Check fast-check configuration in `vitest.setup.ts`
- Verify generators are producing valid test data
- Review counterexamples in test output

## Additional Resources

- Design Document: `.kiro/specs/blocks-components-analysis-improvement/design.md`
- Requirements: `.kiro/specs/blocks-components-analysis-improvement/requirements.md`
- Tasks: `.kiro/specs/blocks-components-analysis-improvement/tasks.md`
