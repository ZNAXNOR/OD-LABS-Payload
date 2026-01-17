#!/usr/bin/env node

/**
 * Performance profiling script for the analysis tools
 * Measures execution time and memory usage of different analyzers
 */

import { performance } from 'perf_hooks'
import { AnalysisOrchestrator } from '../analyzers/AnalysisOrchestrator.js'
import { BlockAnalyzer } from '../analyzers/BlockAnalyzer.js'
import { ComponentAnalyzer } from '../analyzers/ComponentAnalyzer.js'
import { IntegrationValidator } from '../analyzers/IntegrationValidator.js'
import { PatternComparator } from '../analyzers/PatternComparator.js'
import { SecurityAnalyzer } from '../analyzers/SecurityAnalyzer.js'
import { ReportGenerator } from '../generators/ReportGenerator.js'
import type { AnalysisOptions } from '../types/index.js'

interface PerformanceMetrics {
  name: string
  executionTime: number
  memoryUsage: {
    before: NodeJS.MemoryUsage
    after: NodeJS.MemoryUsage
    delta: NodeJS.MemoryUsage
  }
}

class PerformanceProfiler {
  private metrics: PerformanceMetrics[] = []

  async profileAnalyzer<T>(name: string, analyzerFn: () => Promise<T>): Promise<T> {
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }

    const memoryBefore = process.memoryUsage()
    const startTime = performance.now()

    const result = await analyzerFn()

    const endTime = performance.now()
    const memoryAfter = process.memoryUsage()

    const executionTime = endTime - startTime
    const memoryDelta = {
      rss: memoryAfter.rss - memoryBefore.rss,
      heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
      heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
      external: memoryAfter.external - memoryBefore.external,
      arrayBuffers: memoryAfter.arrayBuffers - memoryBefore.arrayBuffers,
    }

    this.metrics.push({
      name,
      executionTime,
      memoryUsage: {
        before: memoryBefore,
        after: memoryAfter,
        delta: memoryDelta,
      },
    })

    return result
  }

  async profileFullAnalysis(options: AnalysisOptions): Promise<void> {
    console.log('🔍 Starting performance profiling...\n')

    const orchestrator = new AnalysisOrchestrator()

    // Profile individual analyzers
    await this.profileAnalyzer('Block Analysis', async () => {
      return orchestrator.analyzeBlocks([options.blockDir])
    })

    await this.profileAnalyzer('Component Analysis', async () => {
      return orchestrator.analyzeComponents([options.componentDir])
    })

    await this.profileAnalyzer('Integration Validation', async () => {
      const validator = new IntegrationValidator()
      // Mock data for profiling
      return validator.validateIntegration(
        { slug: 'test', fields: [] },
        {
          path: 'test',
          name: 'Test',
          type: 'server',
          props: [],
          imports: [],
          exports: [],
          jsx: [],
          hooks: [],
          ast: {} as any,
        },
      )
    })

    if (options.compareOfficial) {
      await this.profileAnalyzer('Pattern Comparison', async () => {
        const comparator = new PatternComparator()
        return comparator.fetchOfficialPatterns()
      })
    }

    await this.profileAnalyzer('Security Analysis', async () => {
      const analyzer = new SecurityAnalyzer()
      return analyzer.analyzeBlock({ slug: 'test', fields: [] })
    })

    await this.profileAnalyzer('Report Generation', async () => {
      const generator = new ReportGenerator()
      return generator.generateReport({
        blocks: [],
        components: [],
        integration: {
          blockSlug: 'test',
          componentName: 'Test',
          isValid: true,
          issues: [],
          suggestions: [],
        },
        patterns: [],
        tests: { testSuites: [], generatedFiles: [] },
        report: {
          summary: {
            totalBlocks: 0,
            totalComponents: 0,
            totalIssues: 0,
            issuesBySeverity: {},
            overallScore: 100,
            topIssues: [],
          },
          blockAnalysis: [],
          componentAnalysis: [],
          integrationAnalysis: {
            blockSlug: 'test',
            componentName: 'Test',
            isValid: true,
            issues: [],
            suggestions: [],
          },
          patternComparison: {
            blockSlug: 'test',
            structuralDifferences: [],
            featureDifferences: [],
            organizationDifferences: [],
          },
          implementationGuide: { improvements: [], estimatedEffort: '0 hours' },
          generatedAt: new Date(),
        },
      })
    })

    // Profile full orchestrated analysis
    await this.profileAnalyzer('Full Analysis (Orchestrated)', async () => {
      return orchestrator.analyze(options)
    })
  }

  generateReport(): void {
    console.log('\n📊 Performance Analysis Report')
    console.log('='.repeat(50))

    // Sort by execution time (descending)
    const sortedMetrics = [...this.metrics].sort((a, b) => b.executionTime - a.executionTime)

    console.log('\n⏱️  Execution Time Ranking:')
    sortedMetrics.forEach((metric, index) => {
      const time = metric.executionTime.toFixed(2)
      const memoryMB = (metric.memoryUsage.delta.heapUsed / 1024 / 1024).toFixed(2)
      console.log(`${index + 1}. ${metric.name}: ${time}ms (${memoryMB}MB heap)`)
    })

    console.log('\n🧠 Memory Usage Analysis:')
    const memoryMetrics = [...this.metrics].sort(
      (a, b) => b.memoryUsage.delta.heapUsed - a.memoryUsage.delta.heapUsed,
    )

    memoryMetrics.forEach((metric, index) => {
      const heapMB = (metric.memoryUsage.delta.heapUsed / 1024 / 1024).toFixed(2)
      const rssMB = (metric.memoryUsage.delta.rss / 1024 / 1024).toFixed(2)
      console.log(`${index + 1}. ${metric.name}: ${heapMB}MB heap, ${rssMB}MB RSS`)
    })

    console.log('\n🎯 Optimization Recommendations:')

    // Identify slow operations (> 1000ms)
    const slowOperations = this.metrics.filter((m) => m.executionTime > 1000)
    if (slowOperations.length > 0) {
      console.log('\n⚠️  Slow Operations (>1s):')
      slowOperations.forEach((metric) => {
        console.log(`- ${metric.name}: ${metric.executionTime.toFixed(2)}ms`)
        this.suggestOptimizations(metric)
      })
    }

    // Identify memory-heavy operations (> 50MB heap)
    const memoryHeavyOps = this.metrics.filter(
      (m) => m.memoryUsage.delta.heapUsed > 50 * 1024 * 1024,
    )
    if (memoryHeavyOps.length > 0) {
      console.log('\n🧠 Memory-Heavy Operations (>50MB):')
      memoryHeavyOps.forEach((metric) => {
        const heapMB = (metric.memoryUsage.delta.heapUsed / 1024 / 1024).toFixed(2)
        console.log(`- ${metric.name}: ${heapMB}MB heap`)
        this.suggestMemoryOptimizations(metric)
      })
    }

    console.log('\n✅ Performance profiling complete!')
  }

  private suggestOptimizations(metric: PerformanceMetrics): void {
    const suggestions: string[] = []

    if (metric.name.includes('Block Analysis')) {
      suggestions.push('  • Consider parallel processing of block files')
      suggestions.push('  • Cache parsed TypeScript ASTs')
      suggestions.push('  • Implement incremental analysis for unchanged files')
    }

    if (metric.name.includes('Component Analysis')) {
      suggestions.push('  • Use worker threads for AST parsing')
      suggestions.push('  • Implement component-level caching')
      suggestions.push('  • Optimize JSX traversal algorithms')
    }

    if (metric.name.includes('Pattern Comparison')) {
      suggestions.push('  • Cache GitHub API responses')
      suggestions.push('  • Implement request batching')
      suggestions.push('  • Use CDN for pattern data')
    }

    if (metric.name.includes('Report Generation')) {
      suggestions.push('  • Stream report generation for large datasets')
      suggestions.push('  • Use template caching')
      suggestions.push('  • Optimize string concatenation')
    }

    suggestions.forEach((suggestion) => console.log(suggestion))
  }

  private suggestMemoryOptimizations(metric: PerformanceMetrics): void {
    const suggestions: string[] = []

    suggestions.push('  • Implement object pooling for frequently created objects')
    suggestions.push('  • Use streaming for large file processing')
    suggestions.push('  • Clear intermediate results after processing')
    suggestions.push('  • Consider using WeakMap for caching')

    suggestions.forEach((suggestion) => console.log(suggestion))
  }
}

// Main execution
async function main(): Promise<void> {
  const profiler = new PerformanceProfiler()

  const options: AnalysisOptions = {
    blockDir: process.argv[2] || '../blocks',
    componentDir: process.argv[3] || '../components',
    includeTests: true,
    compareOfficial: false, // Skip for performance testing
    severity: 'all',
  }

  try {
    await profiler.profileFullAnalysis(options)
    profiler.generateReport()
  } catch (error) {
    console.error('❌ Performance profiling failed:', error)
    process.exit(1)
  }
}

// Run with --expose-gc flag for better memory profiling
if (require.main === module) {
  main()
}

export { PerformanceProfiler }
