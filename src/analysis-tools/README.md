# Payload CMS Blocks and Components Analysis Tool

A comprehensive analysis system for Payload CMS blocks and React components that identifies issues, security vulnerabilities, accessibility problems, and provides actionable recommendations. **Now supports both legacy and restructured project layouts with automatic path detection.**

## Quick Start

```bash
# Run simple analysis (recommended) - automatically detects project structure
node simple-analysis.mjs

# View results
cat analysis-report.json
```

## Features

- **Automatic Path Detection**: Intelligently detects legacy vs restructured project layouts
- **Security Analysis**: Identifies missing access control and XSS vulnerabilities
- **Accessibility Compliance**: Checks WCAG 2.1 AA standards
- **TypeScript Integration**: Validates proper typing and interfaces
- **Performance Analysis**: Detects optimization opportunities
- **Block-Component Integration**: Ensures proper data flow
- **Comprehensive Reporting**: JSON, HTML, and console output formats
- **Flexible Project Structure Support**: Works with both original and restructured codebases

## Analysis Results

Our analysis of the current project found:

- **25 blocks analyzed** with comprehensive configuration review
- **51 components analyzed** for accessibility and performance
- **39 total issues identified** across critical, high, medium, and low severity
- **25 critical security issues** requiring immediate attention
- **Detailed recommendations** with step-by-step implementation guides

### Key Findings

1. **Critical Security Issue**: 25 blocks missing access control
2. **Integration Issues**: Several blocks missing corresponding React components
3. **Accessibility Improvements**: Components need ARIA labels and alt text
4. **TypeScript Enhancement**: Missing interface names for better type safety

## Documentation

- [**Usage Guide**](./USAGE.md) - Comprehensive usage instructions
- [**Developer Guide**](./DEVELOPER.md) - Architecture and extension guide
- [**API Reference**](./API.md) - Complete API documentation

## Installation

```bash
cd src/analysis-tools
npm install
npm run build  # Optional: for TypeScript compilation
```

## Usage Examples

```bash
# Basic analysis
node simple-analysis.mjs

# CLI with options (after build)
npx blocks-analyzer analyze --format html --output report.html
npx blocks-analyzer analyze --scope blocks --severity critical
```

## Report Interpretation

The analysis generates detailed reports with:

- **Summary metrics** showing overall project health
- **Issue categorization** by severity and type
- **Prioritized recommendations** with implementation steps
- **Code examples** demonstrating fixes

### Severity Levels

- 🔴 **Critical**: Security vulnerabilities, data integrity issues
- 🟠 **High**: Functionality problems, major accessibility issues
- 🟡 **Medium**: Code quality, minor accessibility issues
- 🟢 **Low**: Best practices, optimization opportunities

## Integration

### CI/CD Pipeline

```yaml
- name: Run Analysis
  run: node simple-analysis.mjs

- name: Check Critical Issues
  run: |
    CRITICAL=$(cat analysis-report.json | jq '.summary.criticalIssues')
    if [ "$CRITICAL" -gt 0 ]; then exit 1; fi
```

### Pre-commit Hook

```bash
#!/bin/sh
node simple-analysis.mjs
CRITICAL=$(cat analysis-report.json | jq '.summary.criticalIssues')
if [ "$CRITICAL" -gt 0 ]; then
  echo "❌ Critical issues found. Fix before committing."
  exit 1
fi
```

## Project Structure Support

The analysis tool automatically detects your project structure and adapts accordingly:

### Restructured Projects

- **Blocks**: `src/blocks/` with category-based organization
- **Components**: `src/components/` with ui/, blocks/, forms/, layout/, admin/ subdirectories
- **Tests**: `tests/` with unit/, integration/, e2e/, performance/, property-based/ subdirectories
- **Types**: `src/types/` centralized type definitions

### Legacy Projects

- **Blocks**: `src/blocks/` with individual config files
- **Components**: `src/components/` with mixed organization
- **Tests**: `tests/` with mixed organization
- **Types**: `src/payload-types.ts` generated types

The tool automatically detects which structure you're using and adjusts its analysis accordingly.

## Contributing

See [DEVELOPER.md](./DEVELOPER.md) for information on:

- Architecture overview
- Adding new analyzers
- Extending functionality
- Testing strategy

## License

MIT License - see project root for details.
