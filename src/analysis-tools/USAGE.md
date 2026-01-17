# Blocks and Components Analysis Tool - Usage Guide

## Overview

The Blocks and Components Analysis Tool is a comprehensive analysis system for Payload CMS blocks and React components. It analyzes block configurations and components for correctness, security, accessibility, performance, and best practices.

## Installation

The analysis tools are located in `src/analysis-tools/` and can be run using Node.js.

### Prerequisites

- Node.js 18+
- TypeScript (for development)
- A Payload CMS project with blocks and components

### Setup

1. Navigate to the analysis tools directory:

```bash
cd src/analysis-tools
```

2. Install dependencies:

```bash
npm install
```

3. Build the tools (optional, for TypeScript compilation):

```bash
npm run build
```

## Quick Start

### Simple Analysis

For a quick analysis without complex setup, use the simple analysis script:

```bash
# From project root
node simple-analysis.mjs
```

This will:

- Analyze all blocks in `src/blocks/`
- Analyze all components in `src/components/`
- Generate a comprehensive report in `analysis-report.json`
- Display a summary in the console

### CLI Usage

The full CLI tool provides more options and features:

```bash
# Basic analysis
npx blocks-analyzer analyze

# Analyze only blocks
npx blocks-analyzer analyze --scope blocks

# Analyze only components
npx blocks-analyzer analyze --scope components

# Custom directories
npx blocks-analyzer analyze --blocks-dir src/blocks --components-dir src/components

# Different output formats
npx blocks-analyzer analyze --format json --output report.json
npx blocks-analyzer analyze --format html --output report.html

# Filter by severity
npx blocks-analyzer analyze --severity critical
npx blocks-analyzer analyze --severity high

# Skip certain analysis types
npx blocks-analyzer analyze --no-tests --no-patterns

# Verbose output
npx blocks-analyzer analyze --verbose
```

## Command Line Options

### Global Options

| Option      | Description           | Default |
| ----------- | --------------------- | ------- |
| `--help`    | Show help information | -       |
| `--version` | Show version number   | -       |

### Analyze Command Options

| Option                        | Description                               | Default          | Values                         |
| ----------------------------- | ----------------------------------------- | ---------------- | ------------------------------ |
| `-b, --blocks-dir <path>`     | Directory containing block configurations | `src/blocks`     | Any valid path                 |
| `-c, --components-dir <path>` | Directory containing React components     | `src/components` | Any valid path                 |
| `-s, --scope <scope>`         | Analysis scope                            | `full`           | `blocks`, `components`, `full` |
| `-f, --format <format>`       | Output format                             | `console`        | `console`, `json`, `html`      |
| `-o, --output <path>`         | Output file path (for json/html)          | -                | Any valid file path            |
| `--no-tests`                  | Skip test generation                      | false            | -                              |
| `--no-patterns`               | Skip official pattern comparison          | false            | -                              |
| `--severity <level>`          | Minimum severity level                    | `all`            | `all`, `critical`, `high`      |
| `--verbose`                   | Enable verbose logging                    | false            | -                              |

## Analysis Scopes

### Full Analysis (Default)

Performs comprehensive analysis including:

- Block configuration analysis
- Component implementation review
- Block-component integration validation
- Official pattern comparison (if enabled)
- Test suite generation (if enabled)
- Security analysis
- Performance analysis
- Accessibility compliance validation

### Blocks Only

Analyzes only block configurations:

- Field structure validation
- Access control checks
- TypeScript typing analysis
- Admin configuration review
- Security validation

### Components Only

Analyzes only React components:

- Component type detection (Server/Client)
- Accessibility compliance
- Performance optimization opportunities
- Error handling patterns
- TypeScript prop typing

## Output Formats

### Console Output (Default)

Displays results directly in the terminal with:

- Color-coded severity levels
- Progress indicators
- Summary statistics
- Top issues highlighted

Example:

```
🔍 Starting Blocks and Components Analysis...
📦 Analyzing blocks...
⚛️ Analyzing components...
✅ Analysis complete!

📊 Summary:
- Blocks analyzed: 25
- Components analyzed: 51
- Total issues: 39
  - Critical: 25
  - High: 0
  - Medium: 11
  - Low: 3
```

### JSON Output

Structured JSON report suitable for:

- Integration with CI/CD pipelines
- Custom reporting tools
- Programmatic analysis

```bash
npx blocks-analyzer analyze --format json --output analysis-report.json
```

### HTML Output

Interactive HTML report with:

- Searchable and filterable results
- Detailed issue descriptions
- Code examples and recommendations
- Visual charts and metrics

```bash
npx blocks-analyzer analyze --format html --output analysis-report.html
```

## Understanding the Report

### Summary Section

The summary provides high-level metrics:

```json
{
  "summary": {
    "blocksAnalyzed": 25,
    "componentsAnalyzed": 51,
    "totalIssues": 39,
    "criticalIssues": 25,
    "highIssues": 0,
    "mediumIssues": 11,
    "lowIssues": 3
  }
}
```

### Issue Severity Levels

| Severity     | Description                                        | Examples                                      |
| ------------ | -------------------------------------------------- | --------------------------------------------- |
| **Critical** | Security vulnerabilities, data integrity issues    | Missing access control, XSS vulnerabilities   |
| **High**     | Functionality problems, major accessibility issues | Missing components, broken integrations       |
| **Medium**   | Code quality, minor accessibility issues           | Missing TypeScript types, missing ARIA labels |
| **Low**      | Best practices, optimization opportunities         | Missing React keys, admin UI improvements     |

### Issue Types

#### Block Issues

- `missing-access-control`: Block lacks security controls
- `missing-interface-name`: No TypeScript interface defined
- `missing-component`: Block config exists but no React component
- `missing-validation`: Fields lack validation rules
- `missing-labels`: No user-friendly labels defined

#### Component Issues

- `missing-alt-text`: Images without alt attributes
- `missing-aria-labels`: Interactive elements without ARIA labels
- `weak-typing`: Poor TypeScript type definitions
- `missing-error-handling`: Async operations without error handling
- `xss-risk`: Potential XSS vulnerabilities
- `missing-react-keys`: List items without unique keys

### Recommendations

Each report includes prioritized recommendations:

```json
{
  "recommendations": [
    {
      "priority": 1,
      "title": "Implement Access Control",
      "description": "25 block(s) are missing access control. This is a critical security issue.",
      "impact": "Critical security vulnerability - unauthorized access to data",
      "effort": "Medium",
      "steps": [
        "Review each block configuration",
        "Add appropriate access control rules",
        "Test access control with different user roles",
        "Document access control decisions"
      ]
    }
  ]
}
```

## Implementing Recommendations

### 1. Critical Security Issues

**Missing Access Control**

Add access control to block configurations:

```typescript
// Before
export const MyBlock: Block = {
  slug: 'my-block',
  fields: [
    // fields...
  ],
}

// After
export const MyBlock: Block = {
  slug: 'my-block',
  access: {
    read: () => true, // Public read access
    update: ({ req: { user } }) => Boolean(user), // Authenticated users only
  },
  fields: [
    // fields...
  ],
}
```

**XSS Vulnerabilities**

Replace `dangerouslySetInnerHTML` with safer alternatives:

```tsx
// Before - Dangerous
;<div dangerouslySetInnerHTML={{ __html: userContent }} />

// After - Safe
import { RichText } from '@payloadcms/richtext-lexical'
;<RichText content={userContent} />
```

### 2. TypeScript Integration

**Add Interface Names**

```typescript
// Before
export const MyBlock: Block = {
  slug: 'my-block',
  fields: [{ name: 'title', type: 'text' }],
}

// After
export const MyBlock: Block = {
  slug: 'my-block',
  interfaceName: 'MyBlock', // Enables TypeScript integration
  fields: [{ name: 'title', type: 'text' }],
}
```

### 3. Accessibility Improvements

**Add Alt Text to Images**

```tsx
// Before
<img src={image.url} />

// After
<img src={image.url} alt={image.alt || 'Decorative image'} />
```

**Add ARIA Labels**

```tsx
// Before
<button onClick={handleClick}>Submit</button>

// After
<button
  onClick={handleClick}
  aria-label="Submit contact form"
>
  Submit
</button>
```

### 4. Component Integration

**Create Missing Components**

If a block has a config but no component:

1. Create the component file: `src/blocks/MyBlock/Component.tsx`
2. Implement the component with proper TypeScript types:

```tsx
import type { MyBlock } from '@/payload-types'

interface Props {
  block: MyBlock
}

export function MyBlockComponent({ block }: Props) {
  return (
    <div>
      <h2>{block.title}</h2>
      {/* Render block content */}
    </div>
  )
}
```

3. Register the component in your block renderer

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Code Quality Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run blocks analysis
        run: |
          node simple-analysis.mjs

      - name: Check for critical issues
        run: |
          CRITICAL_COUNT=$(cat analysis-report.json | jq '.summary.criticalIssues')
          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "❌ Found $CRITICAL_COUNT critical issues"
            exit 1
          fi
          echo "✅ No critical issues found"

      - name: Upload analysis report
        uses: actions/upload-artifact@v3
        with:
          name: analysis-report
          path: analysis-report.json
```

### Pre-commit Hook

```bash
#!/bin/sh
# .husky/pre-commit

echo "🔍 Running blocks and components analysis..."
node simple-analysis.mjs

# Check for critical issues
CRITICAL_COUNT=$(cat analysis-report.json | jq '.summary.criticalIssues')
if [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo "❌ Commit blocked: Found $CRITICAL_COUNT critical issues"
  echo "Please fix critical issues before committing"
  exit 1
fi

echo "✅ Analysis passed"
```

## Troubleshooting

### Common Issues

**"Cannot find module" errors**

Ensure you're running from the correct directory and dependencies are installed:

```bash
cd src/analysis-tools
npm install
```

**TypeScript compilation errors**

The simple analysis script bypasses TypeScript compilation. For full CLI features, fix TypeScript errors:

```bash
npm run build
```

**Permission errors**

Ensure the analysis script has proper permissions:

```bash
chmod +x simple-analysis.mjs
```

**Large projects timing out**

For very large projects, analyze in smaller scopes:

```bash
# Analyze blocks first
npx blocks-analyzer analyze --scope blocks

# Then analyze components
npx blocks-analyzer analyze --scope components
```

### Getting Help

1. Check the verbose output for detailed error information:

   ```bash
   npx blocks-analyzer analyze --verbose
   ```

2. Review the generated report for specific issue details

3. Consult the developer documentation for extending the analysis tools

## Best Practices

### Regular Analysis

- Run analysis before major releases
- Include analysis in CI/CD pipelines
- Set up pre-commit hooks for critical issues
- Review reports during code reviews

### Prioritizing Fixes

1. **Critical issues first**: Security vulnerabilities and data integrity
2. **High issues**: Functionality problems and major accessibility issues
3. **Medium issues**: Code quality and minor accessibility improvements
4. **Low issues**: Optimization and best practice improvements

### Team Workflow

1. **Developer**: Run analysis locally before committing
2. **Code Review**: Include analysis results in pull request reviews
3. **QA**: Verify fixes address reported issues
4. **Release**: Ensure no critical issues in production releases

## Advanced Usage

### Custom Analysis Scripts

Create custom analysis scripts for specific needs:

```javascript
import { readFileSync } from 'fs'

// Load analysis report
const report = JSON.parse(readFileSync('analysis-report.json', 'utf-8'))

// Filter for specific issue types
const securityIssues = report.issues.filter(
  (issue) => issue.type.includes('access-control') || issue.type.includes('xss'),
)

console.log(`Found ${securityIssues.length} security issues`)
```

### Integration with Other Tools

Combine with other development tools:

```bash
# Run analysis and format code
node simple-analysis.mjs && npm run format

# Analysis with linting
node simple-analysis.mjs && npm run lint

# Generate report and run tests
node simple-analysis.mjs && npm test
```

This usage guide provides comprehensive information for effectively using the Blocks and Components Analysis Tool to improve code quality, security, and accessibility in Payload CMS projects.
