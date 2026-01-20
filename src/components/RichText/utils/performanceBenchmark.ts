/**
 * Performance benchmarking utilities for RichText components
 * Provides load testing and performance analysis capabilities
 */

// Remove unused import
import type { PerformanceMetrics } from '../types'
import { performanceMonitor } from './performanceMonitor'

export interface BenchmarkConfig {
  iterations: number
  warmupIterations: number
  contentSizes: number[] // Number of blocks
  blockTypes: string[]
  measureMemory: boolean
  measureRenderTime: boolean
  reportInterval: number
}

export interface BenchmarkResult {
  config: BenchmarkConfig
  results: PerformanceMetrics[]
  summary: {
    averageRenderTime: number
    minRenderTime: number
    maxRenderTime: number
    p95RenderTime: number
    averageMemoryUsage: number
    maxMemoryUsage: number
    totalIterations: number
    failedIterations: number
  }
  recommendations: string[]
}

export class RichTextBenchmark {
  private config: BenchmarkConfig
  private results: PerformanceMetrics[] = []

  constructor(config: Partial<BenchmarkConfig> = {}) {
    this.config = {
      iterations: 100,
      warmupIterations: 10,
      contentSizes: [1, 5, 10, 20, 50],
      blockTypes: ['content', 'hero', 'mediaBlock', 'cta'],
      measureMemory: true,
      measureRenderTime: true,
      reportInterval: 10,
      ...config,
    }
  }

  /**
   * Generate test content with specified number of blocks
   */
  private generateTestContent(blockCount: number, blockTypes: string[]): any {
    const blocks = []

    for (let i = 0; i < blockCount; i++) {
      const blockType = blockTypes[i % blockTypes.length]
      blocks.push({
        type: 'block',
        blockType,
        fields: this.generateBlockFields(blockType),
      })
    }

    return {
      root: {
        type: 'root',
        children: blocks,
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  /**
   * Generate realistic block fields for testing
   */
  private generateBlockFields(blockType: string | undefined): Record<string, any> {
    if (!blockType) {
      return { id: `test-unknown-${Math.random().toString(36).substr(2, 9)}` }
    }

    const commonFields = {
      id: `test-${blockType}-${Math.random().toString(36).substr(2, 9)}`,
    }

    switch (blockType) {
      case 'content':
        return {
          ...commonFields,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: `This is test content for ${blockType} block. `.repeat(10),
                    },
                  ],
                },
              ],
            },
          },
        }

      case 'hero':
        return {
          ...commonFields,
          type: 'highImpact',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [{ type: 'text', text: 'Test Hero Heading' }],
                },
              ],
            },
          },
          links: [
            {
              link: {
                type: 'custom',
                url: 'https://example.com',
                label: 'Test Link',
              },
            },
          ],
        }

      case 'mediaBlock':
        return {
          ...commonFields,
          media: {
            id: 'test-media-id',
            alt: 'Test image',
            filename: 'test-image.jpg',
            mimeType: 'image/jpeg',
            width: 1200,
            height: 800,
          },
          caption: 'Test media caption',
        }

      case 'cta':
        return {
          ...commonFields,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Test CTA content' }],
                },
              ],
            },
          },
          links: [
            {
              link: {
                type: 'custom',
                url: 'https://example.com',
                label: 'Test CTA Button',
              },
            },
          ],
        }

      default:
        return commonFields
    }
  }

  /**
   * Run a single benchmark iteration
   */
  private async runIteration(
    contentSize: number,
    iterationIndex: number,
  ): Promise<PerformanceMetrics | null> {
    try {
      const content = this.generateTestContent(contentSize, this.config.blockTypes)

      // Start measurement
      const startTime = performance.now()
      const startMemory =
        this.config.measureMemory && 'memory' in performance
          ? (performance as any).memory.usedJSHeapSize
          : 0

      // Simulate rendering (in real scenario, this would be actual component rendering)
      await this.simulateRender(content)

      // End measurement
      const endTime = performance.now()
      const endMemory =
        this.config.measureMemory && 'memory' in performance
          ? (performance as any).memory.usedJSHeapSize
          : 0

      const metrics: PerformanceMetrics = {
        renderTime: endTime - startTime,
        blockCount: contentSize,
        componentCount: 1,
        memoryUsage: this.config.measureMemory
          ? (endMemory - startMemory) / 1024 / 1024
          : undefined,
        timestamp: Date.now(),
        contentLength: JSON.stringify(content).length,
        blockTypes: this.config.blockTypes,
      }

      return metrics
    } catch (error) {
      console.error(`Benchmark iteration ${iterationIndex} failed:`, error)
      return null
    }
  }

  /**
   * Simulate rendering process (placeholder for actual rendering)
   */
  private async simulateRender(content: any): Promise<void> {
    // Simulate processing time based on content complexity
    const complexity = JSON.stringify(content).length
    const processingTime = Math.max(1, complexity / 10000) // Simulate processing

    return new Promise((resolve) => {
      setTimeout(resolve, processingTime)
    })
  }

  /**
   * Run warmup iterations to stabilize performance
   */
  private async runWarmup(): Promise<void> {
    console.log(`Running ${this.config.warmupIterations} warmup iterations...`)

    for (let i = 0; i < this.config.warmupIterations; i++) {
      await this.runIteration(5, i) // Use medium content size for warmup
    }
  }

  /**
   * Run the complete benchmark suite
   */
  async runBenchmark(): Promise<BenchmarkResult> {
    console.log('Starting RichText performance benchmark...')
    this.results = []

    // Run warmup
    await this.runWarmup()

    // Run actual benchmark
    let failedIterations = 0
    let totalIterations = 0

    for (const contentSize of this.config.contentSizes) {
      console.log(`Testing with ${contentSize} blocks...`)

      for (let i = 0; i < this.config.iterations; i++) {
        totalIterations++
        const result = await this.runIteration(contentSize, i)

        if (result) {
          this.results.push(result)

          // Record with performance monitor
          performanceMonitor.recordMetrics(result)
        } else {
          failedIterations++
        }

        // Progress reporting
        if (totalIterations % this.config.reportInterval === 0) {
          console.log(`Completed ${totalIterations} iterations...`)
        }
      }
    }

    return this.generateReport(totalIterations, failedIterations)
  }

  /**
   * Generate benchmark report
   */
  private generateReport(totalIterations: number, failedIterations: number): BenchmarkResult {
    if (this.results.length === 0) {
      throw new Error('No benchmark results available')
    }

    const renderTimes = this.results.map((r) => r.renderTime).sort((a, b) => a - b)
    const memoryUsages = this.results
      .map((r) => r.memoryUsage)
      .filter(Boolean)
      .sort((a, b) => a! - b!)

    const summary = {
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      minRenderTime: renderTimes[0] || 0,
      maxRenderTime: renderTimes[renderTimes.length - 1] || 0,
      p95RenderTime: renderTimes[Math.floor(renderTimes.length * 0.95)] || 0,
      averageMemoryUsage:
        memoryUsages.length > 0
          ? memoryUsages.filter((m) => m != null).reduce((a, b) => a + b, 0) / memoryUsages.length
          : 0,
      maxMemoryUsage: memoryUsages.length > 0 ? memoryUsages[memoryUsages.length - 1] || 0 : 0,
      totalIterations,
      failedIterations,
    }

    const recommendations = this.generateRecommendations(summary)

    return {
      config: this.config,
      results: this.results,
      summary,
      recommendations,
    }
  }

  /**
   * Generate performance recommendations based on results
   */
  private generateRecommendations(summary: BenchmarkResult['summary']): string[] {
    const recommendations: string[] = []

    if (summary.averageRenderTime > 100) {
      recommendations.push(
        'Average render time is high. Consider implementing lazy loading for blocks.',
      )
    }

    if (summary.p95RenderTime > 200) {
      recommendations.push('95th percentile render time is concerning. Optimize heavy blocks.')
    }

    if (summary.maxMemoryUsage > 50) {
      recommendations.push(
        'High memory usage detected. Check for memory leaks in block components.',
      )
    }

    if (summary.failedIterations > summary.totalIterations * 0.01) {
      recommendations.push('High failure rate detected. Investigate error handling in components.')
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Performance looks good! Consider running tests with larger content sizes.',
      )
    }

    return recommendations
  }

  /**
   * Export results to JSON
   */
  exportResults(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        config: this.config,
        results: this.results,
      },
      null,
      2,
    )
  }

  /**
   * Clear benchmark results
   */
  clearResults(): void {
    this.results = []
  }
}

/**
 * Quick benchmark utility function
 */
export const runQuickBenchmark = async (options: Partial<BenchmarkConfig> = {}) => {
  const benchmark = new RichTextBenchmark({
    iterations: 20,
    warmupIterations: 5,
    contentSizes: [1, 5, 10],
    ...options,
  })

  return await benchmark.runBenchmark()
}

/**
 * Load test utility for stress testing
 */
export const runLoadTest = async (options: Partial<BenchmarkConfig> = {}) => {
  const benchmark = new RichTextBenchmark({
    iterations: 1000,
    warmupIterations: 50,
    contentSizes: [10, 25, 50, 100],
    ...options,
  })

  return await benchmark.runBenchmark()
}

export default RichTextBenchmark
