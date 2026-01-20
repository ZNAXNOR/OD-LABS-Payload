/**
 * Performance monitoring utilities for RichText components
 * Provides comprehensive performance tracking and analysis
 */

export interface PerformanceMetrics {
  renderTime: number
  blockCount: number
  componentCount: number
  memoryUsage?: number
  bundleSize?: number
  timestamp: number
  contentLength: number
  blockTypes: string[]
}

export interface PerformanceThresholds {
  renderTime: number // ms
  memoryUsage: number // MB
  blockCount: number
  contentLength: number // characters
}

export interface PerformanceReport {
  metrics: PerformanceMetrics
  thresholds: PerformanceThresholds
  warnings: string[]
  recommendations: string[]
  score: number // 0-100
}

export interface BenchmarkConfig {
  iterations: number
  blockTypes: string[]
  contentSizes: number[]
  measureMemory: boolean
  measureBundleSize: boolean
}

export interface BenchmarkResult {
  config: BenchmarkConfig
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
  timestamp: number
}

class RichTextPerformanceMonitor {
  private static instance: RichTextPerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []
  private thresholds: PerformanceThresholds = {
    renderTime: 100, // 100ms
    memoryUsage: 50, // 50MB
    blockCount: 20,
    contentLength: 10000, // 10k characters
  }

  private constructor() {
    this.initializeObservers()
  }

  static getInstance(): RichTextPerformanceMonitor {
    if (!RichTextPerformanceMonitor.instance) {
      RichTextPerformanceMonitor.instance = new RichTextPerformanceMonitor()
    }
    return RichTextPerformanceMonitor.instance
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return

    // Performance Observer for measuring render times
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.startsWith('richtext-')) {
            this.recordPerformanceEntry(entry)
          }
        })
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] })
      this.observers.push(observer)
    }

    // Memory usage observer (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.recordMemoryUsage()
      }, 5000) // Every 5 seconds
    }
  }

  private recordPerformanceEntry(entry: PerformanceEntry): void {
    console.log(`RichText Performance: ${entry.name} took ${entry.duration}ms`)

    if (entry.duration > this.thresholds.renderTime) {
      console.warn(
        `RichText Performance Warning: ${entry.name} exceeded threshold (${entry.duration}ms > ${this.thresholds.renderTime}ms)`,
      )
    }
  }

  private recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsageMB = memory.usedJSHeapSize / 1024 / 1024

      if (memoryUsageMB > this.thresholds.memoryUsage) {
        console.warn(
          `RichText Memory Warning: High memory usage detected (${memoryUsageMB.toFixed(2)}MB > ${this.thresholds.memoryUsage}MB)`,
        )
      }
    }
  }

  startMeasurement(name: string): void {
    if (typeof window === 'undefined') return
    performance.mark(`${name}-start`)
  }

  endMeasurement(name: string): number {
    if (typeof window === 'undefined') return 0

    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)

    const entries = performance.getEntriesByName(name, 'measure')
    const duration = entries.length > 0 ? entries[entries.length - 1]?.duration || 0 : 0

    // Clean up marks
    performance.clearMarks(`${name}-start`)
    performance.clearMarks(`${name}-end`)
    performance.clearMeasures(name)

    return duration
  }

  recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      renderTime: 0,
      blockCount: 0,
      componentCount: 0,
      timestamp: Date.now(),
      contentLength: 0,
      blockTypes: [],
      ...metrics,
    }

    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      fullMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
    }

    this.metrics.push(fullMetrics)

    // Keep only last 100 measurements
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Log performance warnings
    this.checkThresholds(fullMetrics)
  }

  private checkThresholds(metrics: PerformanceMetrics): void {
    const warnings: string[] = []

    if (metrics.renderTime > this.thresholds.renderTime) {
      warnings.push(
        `Render time exceeded threshold: ${metrics.renderTime}ms > ${this.thresholds.renderTime}ms`,
      )
    }

    if (metrics.blockCount > this.thresholds.blockCount) {
      warnings.push(
        `Block count exceeded threshold: ${metrics.blockCount} > ${this.thresholds.blockCount}`,
      )
    }

    if (metrics.contentLength > this.thresholds.contentLength) {
      warnings.push(
        `Content length exceeded threshold: ${metrics.contentLength} > ${this.thresholds.contentLength}`,
      )
    }

    if (metrics.memoryUsage && metrics.memoryUsage > this.thresholds.memoryUsage) {
      warnings.push(
        `Memory usage exceeded threshold: ${metrics.memoryUsage.toFixed(2)}MB > ${this.thresholds.memoryUsage}MB`,
      )
    }

    if (warnings.length > 0) {
      console.warn('RichText Performance Warnings:', warnings)
    }
  }

  generateReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        metrics: {
          renderTime: 0,
          blockCount: 0,
          componentCount: 0,
          timestamp: Date.now(),
          contentLength: 0,
          blockTypes: [],
        },
        thresholds: this.thresholds,
        warnings: ['No performance data available'],
        recommendations: ['Start using RichText components to collect performance data'],
        score: 0,
      }
    }

    const latestMetrics = this.metrics[this.metrics.length - 1]
    const averageMetrics = this.calculateAverageMetrics()

    const warnings: string[] = []
    const recommendations: string[] = []

    // Analyze performance
    if (averageMetrics.renderTime > this.thresholds.renderTime) {
      warnings.push(`Average render time is high: ${averageMetrics.renderTime.toFixed(2)}ms`)
      recommendations.push('Consider implementing lazy loading for blocks')
      recommendations.push('Reduce the number of blocks per page')
    }

    if (averageMetrics.blockCount > this.thresholds.blockCount) {
      warnings.push(`High block count detected: ${averageMetrics.blockCount}`)
      recommendations.push('Consider pagination or virtual scrolling')
    }

    if (
      latestMetrics &&
      latestMetrics.memoryUsage &&
      latestMetrics.memoryUsage > this.thresholds.memoryUsage
    ) {
      warnings.push(`High memory usage: ${latestMetrics.memoryUsage.toFixed(2)}MB`)
      recommendations.push('Check for memory leaks in block components')
      recommendations.push('Implement component cleanup in useEffect')
    }

    // Calculate performance score (0-100)
    const score = this.calculatePerformanceScore(averageMetrics)

    return {
      metrics: latestMetrics || {
        renderTime: 0,
        blockCount: 0,
        componentCount: 0,
        timestamp: Date.now(),
        contentLength: 0,
        blockTypes: [],
      },
      thresholds: this.thresholds,
      warnings,
      recommendations,
      score,
    }
  }

  private calculateAverageMetrics(): PerformanceMetrics {
    const sum = this.metrics.reduce(
      (acc, metrics) => ({
        renderTime: acc.renderTime + metrics.renderTime,
        blockCount: acc.blockCount + metrics.blockCount,
        componentCount: acc.componentCount + metrics.componentCount,
        memoryUsage: acc.memoryUsage + (metrics.memoryUsage || 0),
        contentLength: acc.contentLength + metrics.contentLength,
      }),
      { renderTime: 0, blockCount: 0, componentCount: 0, memoryUsage: 0, contentLength: 0 },
    )

    const count = this.metrics.length
    const allBlockTypes = [...new Set(this.metrics.flatMap((m) => m.blockTypes))]

    return {
      renderTime: sum.renderTime / count,
      blockCount: sum.blockCount / count,
      componentCount: sum.componentCount / count,
      memoryUsage: sum.memoryUsage / count,
      contentLength: sum.contentLength / count,
      timestamp: Date.now(),
      blockTypes: allBlockTypes,
    }
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100

    // Deduct points for performance issues
    if (metrics.renderTime > this.thresholds.renderTime) {
      const excess = metrics.renderTime - this.thresholds.renderTime
      score -= Math.min(30, (excess / this.thresholds.renderTime) * 30)
    }

    if (metrics.blockCount > this.thresholds.blockCount) {
      const excess = metrics.blockCount - this.thresholds.blockCount
      score -= Math.min(20, (excess / this.thresholds.blockCount) * 20)
    }

    if (metrics.memoryUsage && metrics.memoryUsage > this.thresholds.memoryUsage) {
      const excess = metrics.memoryUsage - this.thresholds.memoryUsage
      score -= Math.min(25, (excess / this.thresholds.memoryUsage) * 25)
    }

    if (metrics.contentLength > this.thresholds.contentLength) {
      const excess = metrics.contentLength - this.thresholds.contentLength
      score -= Math.min(15, (excess / this.thresholds.contentLength) * 15)
    }

    return Math.max(0, Math.round(score))
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  clearMetrics(): void {
    this.metrics = []
  }

  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.metrics = []
  }
}

// Export singleton instance
export const performanceMonitor = RichTextPerformanceMonitor.getInstance()

// Utility functions for easy integration
export const measureRichTextRender = (name: string) => {
  performanceMonitor.startMeasurement(`richtext-${name}`)

  return () => {
    const duration = performanceMonitor.endMeasurement(`richtext-${name}`)
    return duration
  }
}

export const recordRichTextMetrics = (metrics: Partial<PerformanceMetrics>) => {
  performanceMonitor.recordMetrics(metrics)
}

export const getRichTextPerformanceReport = (): PerformanceReport => {
  return performanceMonitor.generateReport()
}

// React hook for performance monitoring
export const useRichTextPerformance = () => {
  return {
    startMeasurement: (name: string) => performanceMonitor.startMeasurement(`richtext-${name}`),
    endMeasurement: (name: string) => performanceMonitor.endMeasurement(`richtext-${name}`),
    recordMetrics: (metrics: Partial<PerformanceMetrics>) =>
      performanceMonitor.recordMetrics(metrics),
    getReport: () => performanceMonitor.generateReport(),
    measureRender: measureRichTextRender,
  }
}
