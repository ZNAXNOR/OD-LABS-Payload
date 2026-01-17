# Analysis Orchestrator

The Analysis Orchestrator is the main entry point for the Blocks and Components Analysis System. It coordinates all analyzers, manages the analysis workflow, and generates comprehensive reports.

## Features

- **Parallel Execution**: Analyzes multiple files concurrently for better performance
- **Intelligent Caching**: Caches analysis results with file modification tracking
- **Error Recovery**: Continues analysis even when individual files fail
- **Progress Reporting**: Real-time progress updates during analysis
- **Comprehensive Reporting**: Generates detailed reports with prioritized issues

## Usage

### Basic Analysis

```typescript
import { AnalysisOrchestrator } from './analyzers/AnalysisOrchestrator'

const orchestrator = new AnalysisOrchestrator()

const result = await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
})

console.log(`Total issues: ${result.report.summary.totalIssues}`)
console.log(`Overall score: ${result.report.summary.overallScore}/100`)
```

### With Progress Tracking

```typescript
const orchestrator = new AnalysisOrchestrator({
  onProgress: (phase, current, total, message) => {
    console.log(`[${phase}] ${current}/${total} ${message || ''}`)
  },
})

await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
})
```

### With Caching

```typescript
const orchestrator = new AnalysisOrchestrator({
  enableCache: true,
  cacheDir: '.cache/analysis',
  cacheTTL: 3600000, // 1 hour
})

// First run: analyzes all files
await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
})

// Second run: uses cached results for unchanged files
await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
})
```

### With Pattern Comparison

```typescript
const orchestrator = new AnalysisOrchestrator({
  githubToken: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
})

const result = await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
  compareOfficial: true, // Compare against official Payload CMS patterns
})

console.log(`Missing features: ${result.report.patternComparison.missingFeatures.length}`)
```

### With Test Generation

```typescript
const result = await orchestrator.analyze({
  blockDir: 'src/blocks',
  componentDir: 'src/components/blocks',
  includeTests: true, // Generate test suites
})

console.log(`Generated ${result.tests.blockTests.length} block test suites`)
console.log(`Generated ${result.tests.componentTests.length} component test suites`)
```

## Configuration Options

### OrchestratorConfig

| Option            | Type               | Default     | Description                                  |
| ----------------- | ------------------ | ----------- | -------------------------------------------- |
| `githubToken`     | `string`           | `undefined` | GitHub API token for pattern fetching        |
| `cacheDir`        | `string`           | `undefined` | Directory for persistent cache storage       |
| `cacheTTL`        | `number`           | `3600000`   | Cache time-to-live in milliseconds (1 hour)  |
| `onProgress`      | `ProgressCallback` | `undefined` | Callback for progress updates                |
| `enableCache`     | `boolean`          | `true`      | Enable/disable caching                       |
| `continueOnError` | `boolean`          | `true`      | Continue analysis when individual files fail |

### AnalysisOptions

| Option            | Type                            | Default      | Description                               |
| ----------------- | ------------------------------- | ------------ | ----------------------------------------- |
| `blockDir`        | `string`                        | **required** | Directory containing block configurations |
| `componentDir`    | `string`                        | **required** | Directory containing React components     |
| `includeTests`    | `boolean`                       | `false`      | Generate test suites                      |
| `compareOfficial` | `boolean`                       | `false`      | Compare against official patterns         |
| `severity`        | `'all' \| 'critical' \| 'high'` | `'all'`      | Filter issues by severity                 |

## Analysis Phases

The orchestrator executes analysis in the following phases:

1. **Initialization**: Set up analyzers and load cache
2. **Discovery**: Find all block and component files
3. **Block Analysis**: Analyze all block configurations (parallel)
4. **Component Analysis**: Analyze all React components (parallel)
5. **Integration Validation**: Validate block-component integration
6. **Pattern Comparison**: Compare against official patterns (optional)
7. **Test Generation**: Generate test suites (optional)
8. **Report Generation**: Compile comprehensive report

## Caching

The orchestrator implements intelligent caching to improve performance:

### In-Memory Cache

- Stores analysis results in memory during execution
- Automatically invalidated when files are modified
- Respects TTL (time-to-live) configuration

### Disk Cache

- Persists cache to disk for reuse across runs
- Automatically loaded on orchestrator initialization
- Stored in JSON format with file hashes for validation

### Cache Invalidation

Cache is automatically invalidated when:

- File modification time changes
- File content hash changes
- Cache TTL expires

### Cache Management

```typescript
// Get cache statistics
const stats = orchestrator.getCacheStats()
console.log(`Blocks cached: ${stats.blocks}`)
console.log(`Components cached: ${stats.components}`)

// Clear cache
orchestrator.clearCache()
```

## Error Handling

The orchestrator implements comprehensive error handling:

### Error Tracking

All errors are tracked with:

- Phase where error occurred
- File that caused the error
- Error details and stack trace
- Timestamp

### Error Recovery

By default (`continueOnError: true`), the orchestrator:

- Continues analysis when individual files fail
- Returns error results for failed files
- Includes errors in final report

### Error Reporting

```typescript
// Check if errors occurred
if (orchestrator.hasErrors()) {
  // Get error summary
  const summary = orchestrator.getErrorSummary()
  console.log(`Total errors: ${summary.total}`)
  console.log('Errors by phase:', summary.byPhase)
  console.log(`Critical errors: ${summary.criticalErrors.length}`)

  // Generate detailed error report
  console.log(orchestrator.generateErrorReport())
}

// Get all errors
const errors = orchestrator.getErrors()
errors.forEach((error) => {
  console.log(`[${error.phase}] ${error.file}: ${error.error.message}`)
})

// Clear error tracking
orchestrator.clearErrors()
```

## Performance Optimization

### Parallel Execution

The orchestrator analyzes files in parallel with a concurrency limit (default: 5) to balance performance and resource usage.

### Incremental Analysis

With caching enabled, only modified files are re-analyzed, significantly improving performance for large projects.

### File Discovery Optimization

File discovery skips common directories that shouldn't be analyzed:

- `node_modules`
- `.git`
- `.next`
- `dist`
- `build`
- `coverage`

## Analysis Results

The orchestrator returns a comprehensive `AnalysisResult` object:

```typescript
interface AnalysisResult {
  blocks: BlockAnalysisResult[] // Block analysis results
  components: ComponentAnalysisResult[] // Component analysis results
  integration: IntegrationResult // Integration validation results
  patterns: PatternComparisonResult // Pattern comparison results
  tests: TestGenerationResult // Generated test suites
  report: Report // Comprehensive report
}
```

### Report Structure

The report includes:

- **Summary**: Aggregate metrics and top issues
- **Block Analysis**: Detailed results for each block
- **Component Analysis**: Detailed results for each component
- **Integration Analysis**: Block-component integration validation
- **Pattern Comparison**: Comparison with official patterns
- **Implementation Guide**: Prioritized improvements with steps

## Examples

See `src/analysis-tools/examples/orchestrator-example.ts` for complete examples:

- Basic analysis
- Analysis with caching
- Pattern comparison
- Test generation

## Best Practices

1. **Enable Caching**: For large projects, enable caching to improve performance
2. **Use Progress Callbacks**: Implement progress callbacks for better user experience
3. **Handle Errors**: Check for errors after analysis and handle appropriately
4. **Filter by Severity**: Use severity filtering to focus on critical issues first
5. **Incremental Analysis**: Run analysis frequently to catch issues early

## Troubleshooting

### Analysis is Slow

- Enable caching with `enableCache: true`
- Reduce concurrency if system resources are limited
- Use severity filtering to analyze only critical issues

### Cache Not Working

- Ensure `cacheDir` is writable
- Check that files are not being modified during analysis
- Verify `cacheTTL` is appropriate for your workflow

### Errors During Analysis

- Check error report with `orchestrator.generateErrorReport()`
- Verify file paths are correct
- Ensure files have valid syntax
- Check file permissions

### Missing Results

- Verify directory paths are correct
- Check that files match expected patterns (config.ts, .tsx, .jsx)
- Review error report for file discovery issues

## API Reference

### AnalysisOrchestrator

#### Constructor

```typescript
constructor(config?: OrchestratorConfig)
```

#### Methods

- `analyze(options: AnalysisOptions): Promise<AnalysisResult>` - Run complete analysis
- `analyzeBlocks(blockPaths: string[]): Promise<BlockAnalysisResult[]>` - Analyze specific blocks
- `analyzeComponents(componentPaths: string[]): Promise<ComponentAnalysisResult[]>` - Analyze specific components
- `clearCache(): void` - Clear all caches
- `getCacheStats(): { blocks: number; components: number }` - Get cache statistics
- `getErrors(): AnalysisError[]` - Get all tracked errors
- `getErrorSummary(): ErrorSummary` - Get error summary
- `clearErrors(): void` - Clear error tracking
- `hasErrors(): boolean` - Check if errors occurred
- `generateErrorReport(): string` - Generate detailed error report

## Related Documentation

- [Block Analyzer](./analyzers/BlockAnalyzer.ts)
- [Component Analyzer](./analyzers/ComponentAnalyzer.ts)
- [Integration Validator](./analyzers/IntegrationValidator.ts)
- [Pattern Comparator](./analyzers/PatternComparator.ts)
- [Test Generator](./generators/TestGenerator.ts)
- [Report Generator](./generators/ReportGenerator.ts)
