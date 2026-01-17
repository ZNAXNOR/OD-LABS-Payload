# Payload CMS Blocks & Components Analyzer CLI

A command-line interface for analyzing Payload CMS blocks and components for best practices, security, accessibility, and performance.

## Installation

```bash
npm install -g @analysis-tools/blocks-components
```

Or run directly with npx:

```bash
npx @analysis-tools/blocks-components analyze
```

## Quick Start

```bash
# Basic analysis
blocks-analyzer analyze

# Analyze only blocks
blocks-analyzer analyze --scope blocks

# Generate HTML report
blocks-analyzer analyze --format html --output report.html

# Custom directories
blocks-analyzer analyze --blocks-dir ./src/blocks --components-dir ./src/components
```

## Commands

### `analyze`

Analyze Payload CMS blocks and components.

**Options:**

- `-b, --blocks-dir <path>` - Directory containing block configurations (default: src/blocks)
- `-c, --components-dir <path>` - Directory containing React components (default: src/components)
- `-s, --scope <scope>` - Analysis scope: blocks, components, or full (default: full)
- `-f, --format <format>` - Output format: console, json, or html (default: console)
- `-o, --output <path>` - Output file path (required for json/html formats)
- `--no-tests` - Skip test generation
- `--no-patterns` - Skip official pattern comparison
- `--severity <level>` - Minimum severity level: all, critical, high (default: all)
- `--verbose` - Enable verbose logging

### `help`

Show detailed help information with examples.

## Analysis Scopes

- **blocks** - Analyze only block configurations for validation, typing, security
- **components** - Analyze only React components for accessibility, performance, best practices
- **full** - Complete analysis including block-component integration validation

## Output Formats

- **console** - Colored terminal output with progress indicators
- **json** - Machine-readable JSON format for CI/CD integration
- **html** - Interactive HTML report with collapsible sections

## Examples

```bash
# Full analysis with verbose output
blocks-analyzer analyze --verbose

# Focus on critical security issues
blocks-analyzer analyze --severity critical --format json --output security-report.json

# Quick component-only analysis
blocks-analyzer analyze --scope components --no-tests --no-patterns

# Generate comprehensive HTML report
blocks-analyzer analyze --format html --output analysis-report.html --verbose
```

## Report Sections

- 📊 **Summary** - Overview of analysis results and metrics
- 📦 **Block Analysis** - Block configuration issues and recommendations
- ⚛️ **Component Analysis** - React component issues and performance metrics
- 🔗 **Integration Analysis** - Block-component mapping validation
- 📋 **Pattern Comparison** - Comparison against official Payload patterns
- 🚀 **Implementation Guide** - Prioritized improvement recommendations

## Issue Severity Levels

- **Critical** - Security vulnerabilities, missing access control
- **High** - Accessibility violations, performance issues
- **Medium** - Best practice violations, missing validations
- **Low** - Style issues, minor improvements

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Analyze Payload Blocks
  run: |
    npx @analysis-tools/blocks-components analyze \
      --format json \
      --output analysis-report.json \
      --severity high

- name: Upload Analysis Report
  uses: actions/upload-artifact@v3
  with:
    name: analysis-report
    path: analysis-report.json
```

## Development

```bash
# Install dependencies
npm install

# Run CLI in development
npm run cli -- analyze --help

# Build for production
npm run build

# Run tests
npm test
```

## License

MIT
