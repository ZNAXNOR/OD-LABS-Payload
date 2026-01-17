# API Reference - Blocks and Components Analysis Tool

## Core Classes

### AnalysisOrchestrator

The main orchestrator class that coordinates all analysis activities.

```typescript
class AnalysisOrchestrator {
  constructor(options?: OrchestratorOptions)

  // Main analysis methods
  analyze(options: AnalysisOptions): Promise<AnalysisResult>
  analyzeBlocks(blockPaths: string[]): Promise<BlockAnalysisResult[]>
  analyzeComponents(componentPaths: string[]): Promise<ComponentAnalysisResult[]>

  // Specialized analysis
  validateIntegration(): Promise<IntegrationResult>
  comparePatterns(): Promise<PatternComparisonResult>
  generateTests(): Promise<TestGenerationResult>
  generateReport(): Promise<Report>
}
```

#### Methods

##### `analyze(options: AnalysisOptions): Promise<AnalysisResult>`

Performs comprehensive analysis of blocks and components.

**Parameters:**

- `options.blockDir` (string): Directory containing block configurations
- `options.componentDir` (string): Directory containing React components
- `options.includeTests` (boolean, optional): Generate test suites
- `options.compareOfficial` (boolean, optional): Compare against official patterns
- `options.severity` ('all' | 'critical' | 'high', optional): Minimum severity level

**Returns:** Complete analysis results including all findings and recommendations.

### BlockAnalyzer

Analyzes Payload CMS block configurations.

```typescript
class BlockAnalyzer {
  analyzeBlock(blockPath: string): Promise<BlockAnalysisResult>
  validateFields(block: Block): FieldValidationResult[]
  checkTyping(block: Block): TypingIssue[]
  checkAccessControl(block: Block): SecurityIssue[]
  checkAdminConfig(block: Block): AdminConfigIssue[]
}
```

#### Methods

##### `analyzeBlock(blockPath: string): Promise<BlockAnalysisResult>`

Analyzes a single block configuration file.

**Parameters:**

- `blockPath` (string): Path to the block configuration file

**Returns:** Analysis results including issues, metrics, and recommendations.

### ComponentAnalyzer

Analyzes React components for various quality aspects.

```typescript
class ComponentAnalyzer {
  analyzeComponent(componentPath: string): Promise<ComponentAnalysisResult>
  detectComponentType(source: string): 'server' | 'client'
  checkAccessibility(ast: AST): AccessibilityIssue[]
  checkPerformance(ast: AST): PerformanceIssue[]
  checkSecurity(ast: AST): SecurityIssue[]
}
```

#### Methods

##### `analyzeComponent(componentPath: string): Promise<ComponentAnalysisResult>`

Analyzes a single React component file.

**Parameters:**

- `componentPath` (string): Path to the component file

**Returns:** Analysis results including component type, issues, and metrics.

## Type Definitions

### Core Types

```typescript
interface AnalysisOptions {
  blockDir: string
  componentDir: string
  includeTests?: boolean
  compareOfficial?: boolean
  severity?: 'all' | 'critical' | 'high'
}

interface AnalysisResult {
  blocks: BlockAnalysisResult[]
  components: ComponentAnalysisResult[]
  integration: IntegrationResult
  patterns: PatternComparisonResult
  tests: TestGenerationResult
  report: Report
}

interface BlockAnalysisResult {
  blockPath: string
  blockSlug: string
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: BlockMetrics
}

interface ComponentAnalysisResult {
  componentPath: string
  componentName: string
  componentType: 'server' | 'client'
  issues: Issue[]
  suggestions: Suggestion[]
  metrics: ComponentMetrics
}
```

### Issue Types

```typescript
interface Issue {
  id: string
  type: IssueType
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'security' | 'accessibility' | 'performance' | 'typing' | 'best-practice'
  title: string
  description: string
  location: Location
  remediation: string
  codeExample?: string
  relatedIssues?: string[]
}

interface Location {
  file: string
  line?: number
  column?: number
  snippet?: string
}

type IssueType =
  | 'missing-validation'
  | 'missing-access-control'
  | 'missing-interface-name'
  | 'missing-alt-text'
  | 'missing-aria-label'
  | 'no-semantic-html'
  | 'missing-keyboard-nav'
  | 'insufficient-contrast'
  | 'xss-vulnerability'
  | 'unnecessary-rerender'
  | 'missing-memo'
  | 'weak-typing'
  | 'field-prop-mismatch'
  | 'naming-inconsistency'
```

### Block Types

```typescript
interface Block {
  slug: string
  interfaceName?: string
  labels?: {
    singular: string
    plural: string
  }
  fields: Field[]
  access?: AccessControl
  admin?: AdminConfig
  hooks?: BlockHooks
}

interface Field {
  name: string
  type: FieldType
  required?: boolean
  unique?: boolean
  index?: boolean
  validate?: ValidationFunction
  access?: FieldAccessControl
  admin?: FieldAdminConfig
  [key: string]: any
}

type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'radio'
  | 'relationship'
  | 'upload'
  | 'richText'
  | 'array'
  | 'group'
  | 'blocks'
  | 'row'
  | 'collapsible'
  | 'tabs'
  | 'point'
  | 'json'
  | 'code'
  | 'ui'
```

### Component Types

```typescript
interface Component {
  path: string
  name: string
  type: 'server' | 'client'
  props: PropDefinition[]
  imports: Import[]
  exports: Export[]
  jsx: JSXElement[]
  hooks: ReactHook[]
  ast: AST
}

interface PropDefinition {
  name: string
  type: string
  required: boolean
  defaultValue?: any
}

interface JSXElement {
  type: string
  props: Record<string, any>
  children: JSXElement[]
  line: number
}
```

### Metrics Types

```typescript
interface BlockMetrics {
  fieldCount: number
  nestedDepth: number
  hasAccessControl: boolean
  hasValidation: boolean
  hasInterfaceName: boolean
  complexityScore: number
}

interface ComponentMetrics {
  lineCount: number
  complexity: number
  hasErrorBoundary: boolean
  hasLoadingState: boolean
  accessibilityScore: number
  performanceScore: number
}
```

## Utility Functions

### File Processing

```typescript
// File discovery utilities
function discoverBlocks(directory: string): Promise<string[]>
function discoverComponents(directory: string): Promise<string[]>

// File parsing utilities
function parseBlockConfig(filePath: string): Promise<Block>
function parseComponent(filePath: string): Promise<Component>

// AST utilities
function parseToAST(source: string): AST
function traverseAST(ast: AST, visitor: ASTVisitor): void
```

### Validation Utilities

```typescript
// Field validation
function validateFieldStructure(field: Field): ValidationResult
function validateFieldType(field: Field): boolean
function validateFieldAccess(field: Field): AccessValidationResult

// Component validation
function validateComponentProps(component: Component): PropValidationResult
function validateAccessibility(jsx: JSXElement[]): AccessibilityResult
function validatePerformance(component: Component): PerformanceResult
```

### Analysis Utilities

```typescript
// Issue management
function createIssue(type: IssueType, details: IssueDetails): Issue
function categorizeIssues(issues: Issue[]): CategorizedIssues
function prioritizeIssues(issues: Issue[]): PrioritizedIssue[]

// Metrics calculation
function calculateBlockMetrics(block: Block): BlockMetrics
function calculateComponentMetrics(component: Component): ComponentMetrics
function calculateOverallScore(metrics: Metrics[]): number
```

## CLI Interface

### Commands

#### `analyze`

Main analysis command with comprehensive options.

```bash
npx blocks-analyzer analyze [options]
```

**Options:**

- `-b, --blocks-dir <path>`: Block configurations directory (default: "src/blocks")
- `-c, --components-dir <path>`: React components directory (default: "src/components")
- `-s, --scope <scope>`: Analysis scope - blocks, components, or full (default: "full")
- `-f, --format <format>`: Output format - console, json, or html (default: "console")
- `-o, --output <path>`: Output file path (required for json/html formats)
- `--no-tests`: Skip test generation
- `--no-patterns`: Skip official pattern comparison
- `--severity <level>`: Minimum severity level - all, critical, or high (default: "all")
- `--verbose`: Enable verbose logging

**Examples:**

```bash
# Basic analysis
npx blocks-analyzer analyze

# Analyze only blocks with JSON output
npx blocks-analyzer analyze --scope blocks --format json --output blocks-report.json

# Critical issues only with verbose logging
npx blocks-analyzer analyze --severity critical --verbose

# Full analysis with HTML report
npx blocks-analyzer analyze --format html --output analysis-report.html
```

#### `help`

Display help information.

```bash
npx blocks-analyzer help [command]
```

### Exit Codes

- `0`: Analysis completed successfully
- `1`: Analysis failed due to errors
- `2`: Invalid command line arguments
- `3`: File system errors (permissions, missing directories)

## Configuration

### Configuration File

Create `analysis.config.js` in your project root:

```javascript
module.exports = {
  // Analysis options
  analysis: {
    blockDir: 'src/blocks',
    componentDir: 'src/components',
    includeTests: true,
    compareOfficial: false,
    severity: 'all',
  },

  // Analyzer-specific settings
  analyzers: {
    blocks: {
      strictMode: true,
      requireInterfaceName: true,
      requireAccessControl: true,
    },
    components: {
      accessibilityLevel: 'AA',
      performanceThreshold: 0.8,
      requirePropTypes: true,
    },
  },

  // Output settings
  output: {
    format: 'console',
    verbose: false,
    includeCodeExamples: true,
  },

  // Exclusion patterns
  exclude: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*'],
}
```

### Environment Variables

```bash
# Enable debug mode
DEBUG=blocks-analyzer

# Set custom configuration file
BLOCKS_ANALYZER_CONFIG=./custom-config.js

# Override default directories
BLOCKS_DIR=src/custom-blocks
COMPONENTS_DIR=src/custom-components
```

## Error Handling

### Error Types

```typescript
class AnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'AnalysisError'
  }
}

// Specific error types
class ParseError extends AnalysisError {}
class ValidationError extends AnalysisError {}
class FileSystemError extends AnalysisError {}
class ConfigurationError extends AnalysisError {}
```

### Error Codes

- `PARSE_ERROR`: Failed to parse block or component file
- `VALIDATION_ERROR`: Validation rules failed
- `FILE_NOT_FOUND`: Required file not found
- `PERMISSION_DENIED`: Insufficient file system permissions
- `INVALID_CONFIG`: Invalid configuration provided
- `NETWORK_ERROR`: Failed to fetch external resources
- `TIMEOUT_ERROR`: Operation timed out

### Error Recovery

The analysis system implements graceful error recovery:

1. **Individual File Errors**: Continue analysis of other files
2. **Analyzer Errors**: Skip failed analyzer, continue with others
3. **Network Errors**: Fall back to cached data or skip external comparisons
4. **Parse Errors**: Attempt alternative parsing methods

## Performance Considerations

### Optimization Strategies

1. **Parallel Processing**: Analyze multiple files concurrently
2. **Caching**: Cache parsed results and analysis outcomes
3. **Incremental Analysis**: Only analyze changed files
4. **Memory Management**: Process large projects in batches

### Performance Metrics

```typescript
interface PerformanceMetrics {
  totalDuration: number
  filesParsed: number
  filesPerSecond: number
  memoryUsage: {
    peak: number
    average: number
  }
  cacheHitRate: number
}
```

### Benchmarking

```typescript
// Built-in benchmarking utilities
function benchmark<T>(operation: () => Promise<T>): Promise<BenchmarkResult<T>>
function profileMemory<T>(operation: () => Promise<T>): Promise<MemoryProfile<T>>
function measurePerformance(options: PerformanceOptions): PerformanceMonitor
```

## Integration Examples

### Node.js Integration

```typescript
import { AnalysisOrchestrator } from '@analysis-tools/core'

const orchestrator = new AnalysisOrchestrator()

async function analyzeProject() {
  try {
    const result = await orchestrator.analyze({
      blockDir: 'src/blocks',
      componentDir: 'src/components',
      includeTests: true,
      severity: 'high',
    })

    console.log(`Found ${result.issues.length} issues`)

    // Process critical issues
    const criticalIssues = result.issues.filter((i) => i.severity === 'critical')
    if (criticalIssues.length > 0) {
      console.error(`❌ ${criticalIssues.length} critical issues found`)
      process.exit(1)
    }

    return result
  } catch (error) {
    console.error('Analysis failed:', error.message)
    process.exit(1)
  }
}

analyzeProject()
```

### Express.js API

```typescript
import express from 'express'
import { AnalysisOrchestrator } from '@analysis-tools/core'

const app = express()
const orchestrator = new AnalysisOrchestrator()

app.post('/api/analyze', async (req, res) => {
  try {
    const { blockDir, componentDir, options } = req.body

    const result = await orchestrator.analyze({
      blockDir,
      componentDir,
      ...options,
    })

    res.json({
      success: true,
      data: result,
      summary: {
        totalIssues: result.issues.length,
        criticalIssues: result.issues.filter((i) => i.severity === 'critical').length,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.listen(3000)
```

### GitHub Actions Integration

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

      - name: Run analysis
        run: |
          npx blocks-analyzer analyze \
            --format json \
            --output analysis-report.json \
            --severity critical

      - name: Check results
        run: |
          CRITICAL_COUNT=$(cat analysis-report.json | jq '.summary.criticalIssues')
          echo "Critical issues found: $CRITICAL_COUNT"

          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "❌ Critical issues must be fixed before merging"
            exit 1
          fi

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: analysis-report
          path: analysis-report.json
```

This API reference provides comprehensive documentation for all public interfaces, types, and utilities in the Blocks and Components Analysis Tool.
