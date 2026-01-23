# Database Identifier Validation System

This directory contains a comprehensive validation system for PostgreSQL database identifier length compliance in Payload CMS configurations.

## Overview

PostgreSQL has a 63-character limit for database identifiers. Payload CMS automatically generates these identifiers from field configurations, and deeply nested structures can easily exceed this limit. This validation system provides:

- **Build-time validation** - Prevents deployment of configurations with identifier issues
- **Development-time warnings** - Real-time feedback during development
- **IDE integration** - Warnings directly in your editor
- **Automated fixes** - Suggestions for resolving identifier length violations

## Components

### Core Validation

- **`identifierValidationPipeline.ts`** - Core validation logic and algorithms
- **`buildTimeValidator.ts`** - Build process integration and CLI tools
- **`developmentWarnings.ts`** - Real-time development warnings

### Development Integration

- **`devServerIntegration.ts`** - Development server middleware and WebSocket integration
- **API Routes** - Real-time validation endpoints for browser integration

### Configuration

- **`validation.config.js`** - Environment-specific validation configuration
- **`.vscode/settings.json`** - IDE integration settings

## Usage

### Command Line Validation

```bash
# Basic validation
pnpm run validate:identifiers

# Verbose output with suggestions
pnpm run validate:identifiers:verbose

# Strict mode (fails on warnings)
pnpm run validate:identifiers:strict

# Custom configuration
node scripts/validate-identifiers.js --config ./custom.config.ts --verbose
```

### Development Integration

The validation system automatically integrates with your development workflow:

1. **Real-time warnings** in browser console
2. **Pre-commit validation** via Husky hooks
3. **Build-time validation** in Next.js builds
4. **IDE warnings** in VSCode (with extension)

### Programmatic Usage

```typescript
import { DevelopmentWarningChecker } from './developmentWarnings'
import { validateIdentifiersCLI } from './identifierValidationPipeline'

// Quick validation
const checker = new DevelopmentWarningChecker()
const warnings = checker.checkPayloadConfig(payloadConfig)

// Full CLI validation
const result = await validateIdentifiersCLI(payloadConfig, {
  verbose: true,
  failOnWarnings: false,
})
```

## Configuration

### Environment-Specific Settings

The system uses `validation.config.js` for environment-specific configuration:

```javascript
module.exports = {
  development: {
    verbose: true,
    failOnWarnings: false,
    generateReports: false,
  },
  production: {
    failOnWarnings: true,
    generateReports: true,
    verbose: false,
  },
}
```

### Validation Rules

Default validation rules can be customized:

```typescript
const checker = new DevelopmentWarningChecker({
  maxLength: 50, // Warn at 50 characters
  errorLength: 63, // Error at PostgreSQL limit
  enforceSnakeCase: true,
  warnMissingDbName: true,
  dbNameRequiredDepth: 3,
})
```

## Integration Points

### Build Process

- **package.json scripts** - Validation commands
- **Husky pre-commit hooks** - Prevent commits with violations
- **GitHub Actions** - CI/CD validation
- **Next.js webpack plugin** - Build-time integration

### Development Server

- **Express middleware** - Real-time validation endpoints
- **WebSocket integration** - Live updates during development
- **Browser console** - Automatic validation reporting
- **File watchers** - Validation on configuration changes

### IDE Integration

- **VSCode settings** - Real-time warnings and suggestions
- **Language Server Protocol** - Standard IDE integration
- **Diagnostic reporting** - Inline error/warning display

## Validation Reports

The system generates comprehensive reports in multiple formats:

### JSON Report

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "totalViolations": 5,
    "errors": 2,
    "warnings": 3
  },
  "violations": [...]
}
```

### Markdown Report

Human-readable report with suggestions and examples.

### HTML Report

Interactive report with filtering and search capabilities.

## Best Practices

### Field Configuration

1. **Use `dbName` for nested fields** (3+ levels deep)
2. **Apply snake_case naming** for all database identifiers
3. **Use standard abbreviations** (see guidelines)
4. **Test with real data** before deployment

### Development Workflow

1. **Enable real-time validation** in development
2. **Run validation before commits** via pre-commit hooks
3. **Review validation reports** regularly
4. **Test migrations** with existing data

### Production Deployment

1. **Strict validation** in CI/CD pipelines
2. **Generate migration scripts** for identifier changes
3. **Backup data** before applying identifier migrations
4. **Monitor for issues** after deployment

## Troubleshooting

### Common Issues

1. **"Identifier too long" errors**
   - Add `dbName` properties to nested fields
   - Use abbreviations from the guidelines
   - Break up deeply nested structures

2. **Migration failures**
   - Check for existing data conflicts
   - Ensure all references are updated
   - Test rollback procedures

3. **Development warnings not showing**
   - Check that `NODE_ENV=development`
   - Verify middleware is properly configured
   - Check browser console for errors

### Debug Commands

```bash
# Verbose validation with debug info
pnpm run validate:identifiers:verbose

# Check validation status
curl http://localhost:3000/_payload/validation-status

# Manual browser validation
# In browser console: validatePayloadIdentifiers()
```

## Performance Considerations

- **Debounced validation** prevents excessive checks during development
- **Cached results** avoid redundant validation runs
- **Selective validation** focuses on changed configurations
- **Async processing** doesn't block development server

## Security Considerations

- **Development-only features** are disabled in production
- **No sensitive data** in validation reports
- **Safe error handling** prevents information leakage
- **Validated inputs** prevent injection attacks

## Contributing

When adding new validation rules or features:

1. **Add tests** for new validation logic
2. **Update documentation** with examples
3. **Consider performance** impact on development workflow
4. **Test across environments** (dev, staging, production)
5. **Follow naming conventions** for consistency

## Resources

- [PostgreSQL Identifier Documentation](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
- [Payload CMS Field Documentation](https://payloadcms.com/docs/fields/overview)
- [Database Identifier Guidelines](../../../docs/IDENTIFIER_GUIDELINES.md)
- [Migration Guide](../../../docs/MIGRATION.md)
