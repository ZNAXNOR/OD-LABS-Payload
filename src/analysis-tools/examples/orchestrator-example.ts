/**
 * Example usage of the Analysis Orchestrator
 * Demonstrates how to use the orchestrator to analyze blocks and components
 */

import { AnalysisOrchestrator } from '../analyzers/AnalysisOrchestrator'
import type { ProgressCallback } from '../analyzers/AnalysisOrchestrator'
import * as path from 'path'

/**
 * Example: Basic analysis
 */
async function basicAnalysisExample() {
  console.log('=== Basic Analysis Example ===\n')

  // Create progress callback
  const onProgress: ProgressCallback = (phase, current, total, message) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0
    console.log(`[${phase}] ${percentage}% (${current}/${total}) ${message || ''}`)
  }

  // Create orchestrator
  const orchestrator = new AnalysisOrchestrator({
    onProgress,
    enableCache: true,
    continueOnError: true,
  })

  try {
    // Run analysis
    const result = await orchestrator.analyze({
      blockDir: path.join(process.cwd(), 'src/blocks'),
      componentDir: path.join(process.cwd(), 'src/components/blocks'),
      includeTests: false,
      compareOfficial: false,
      severity: 'all',
    })

    // Display results
    console.log('\n=== Analysis Results ===')
    console.log(`Blocks analyzed: ${result.blocks.length}`)
    console.log(`Components analyzed: ${result.components.length}`)
    console.log(`Total issues: ${result.report.summary.totalIssues}`)
    console.log(`Overall score: ${result.report.summary.overallScore}/100`)

    // Display issues by severity
    console.log('\nIssues by severity:')
    Object.entries(result.report.summary.issuesBySeverity).forEach(([severity, count]) => {
      console.log(`  ${severity}: ${count}`)
    })

    // Display top issues
    console.log('\nTop 5 issues:')
    result.report.summary.topIssues.slice(0, 5).forEach((issue, index) => {
      console.log(`  ${index + 1}. [${issue.severity}] ${issue.title}`)
      console.log(`     ${issue.description}`)
    })

    // Display cache stats
    const cacheStats = orchestrator.getCacheStats()
    console.log('\nCache statistics:')
    console.log(`  Blocks cached: ${cacheStats.blocks}`)
    console.log(`  Components cached: ${cacheStats.components}`)

    // Display errors if any
    if (orchestrator.hasErrors()) {
      console.log('\n=== Errors ===')
      const errorSummary = orchestrator.getErrorSummary()
      console.log(`Total errors: ${errorSummary.total}`)
      console.log('Errors by phase:')
      Object.entries(errorSummary.byPhase).forEach(([phase, count]) => {
        console.log(`  ${phase}: ${count}`)
      })

      if (errorSummary.criticalErrors.length > 0) {
        console.log(`\nCritical errors: ${errorSummary.criticalErrors.length}`)
      }
    }
  } catch (error) {
    console.error('Analysis failed:', error)

    // Display error report
    console.log('\n' + orchestrator.generateErrorReport())
  }
}

/**
 * Example: Analysis with caching
 */
async function cachingExample() {
  console.log('\n=== Caching Example ===\n')

  const orchestrator = new AnalysisOrchestrator({
    enableCache: true,
    cacheDir: path.join(process.cwd(), '.cache/analysis'),
    cacheTTL: 3600000, // 1 hour
    continueOnError: true,
  })

  console.log('First run (no cache):')
  const start1 = Date.now()
  await orchestrator.analyze({
    blockDir: path.join(process.cwd(), 'src/blocks'),
    componentDir: path.join(process.cwd(), 'src/components/blocks'),
  })
  const duration1 = Date.now() - start1
  console.log(`Duration: ${duration1}ms`)

  console.log('\nSecond run (with cache):')
  const start2 = Date.now()
  await orchestrator.analyze({
    blockDir: path.join(process.cwd(), 'src/blocks'),
    componentDir: path.join(process.cwd(), 'src/components/blocks'),
  })
  const duration2 = Date.now() - start2
  console.log(`Duration: ${duration2}ms`)
  console.log(`Speed improvement: ${Math.round((1 - duration2 / duration1) * 100)}%`)

  // Clear cache
  orchestrator.clearCache()
  console.log('\nCache cleared')
}

/**
 * Example: Analysis with pattern comparison
 */
async function patternComparisonExample() {
  console.log('\n=== Pattern Comparison Example ===\n')

  const orchestrator = new AnalysisOrchestrator({
    githubToken: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
    continueOnError: true,
  })

  const result = await orchestrator.analyze({
    blockDir: path.join(process.cwd(), 'src/blocks'),
    componentDir: path.join(process.cwd(), 'src/components/blocks'),
    compareOfficial: true, // Enable pattern comparison
  })

  console.log('Pattern comparison results:')
  console.log(`Missing features: ${result.report.patternComparison.missingFeatures.length}`)

  // Display missing features
  if (result.report.patternComparison.missingFeatures.length > 0) {
    console.log('\nTop missing features:')
    result.report.patternComparison.missingFeatures.slice(0, 5).forEach((feature, index) => {
      console.log(`  ${index + 1}. ${feature.featureName}`)
      console.log(`     ${feature.description}`)
      console.log(`     Complexity: ${feature.implementationComplexity}`)
    })
  }
}

/**
 * Example: Analysis with test generation
 */
async function testGenerationExample() {
  console.log('\n=== Test Generation Example ===\n')

  const orchestrator = new AnalysisOrchestrator({
    continueOnError: true,
  })

  const result = await orchestrator.analyze({
    blockDir: path.join(process.cwd(), 'src/blocks'),
    componentDir: path.join(process.cwd(), 'src/components/blocks'),
    includeTests: true, // Enable test generation
  })

  console.log('Test generation results:')
  console.log(`Block tests: ${result.tests.blockTests.length}`)
  console.log(`Component tests: ${result.tests.componentTests.length}`)
  console.log(`Integration tests: ${result.tests.integrationTests.length}`)
  console.log(`Property tests: ${result.tests.propertyTests.length}`)
  console.log(`Accessibility tests: ${result.tests.accessibilityTests.length}`)
}

// Run examples
if (require.main === module) {
  ;(async () => {
    try {
      await basicAnalysisExample()
      // Uncomment to run other examples:
      // await cachingExample()
      // await patternComparisonExample()
      // await testGenerationExample()
    } catch (error) {
      console.error('Example failed:', error)
      process.exit(1)
    }
  })()
}

export { basicAnalysisExample, cachingExample, patternComparisonExample, testGenerationExample }
