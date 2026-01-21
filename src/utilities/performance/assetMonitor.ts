// ============================================================================
// ASSET PERFORMANCE MONITORING
// ============================================================================

import { performanceBudget } from '@/config/assets'

export interface AssetMetrics {
  name: string
  size: number
  loadTime: number
  type: 'css' | 'js' | 'image' | 'font' | 'other'
  cached: boolean
  compressed: boolean
}

export interface BundleMetrics {
  initial: number
  async: number
  total: number
  chunks: Array<{
    name: string
    size: number
    type: 'initial' | 'async'
  }>
}

export interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
  domContentLoaded: number
  loadComplete: number
}

// ============================================================================
// ASSET MONITORING
// ============================================================================

export class AssetMonitor {
  private metrics: AssetMetrics[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return

    // Resource timing observer
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.recordAssetMetric(entry as PerformanceResourceTiming)
          }
        }
      })

      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    }
  }

  private recordAssetMetric(entry: PerformanceResourceTiming): void {
    const url = new URL(entry.name)
    const extension = url.pathname.split('.').pop()?.toLowerCase()

    const metric: AssetMetrics = {
      name: entry.name,
      size: entry.transferSize || 0,
      loadTime: entry.responseEnd - entry.startTime,
      type: this.getAssetType(extension || ''),
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
      compressed: (entry.encodedBodySize || 0) < (entry.decodedBodySize || 0),
    }

    this.metrics.push(metric)
    this.checkBudgetViolations(metric)
  }

  private getAssetType(extension: string): AssetMetrics['type'] {
    const typeMap: Record<string, AssetMetrics['type']> = {
      css: 'css',
      js: 'js',
      mjs: 'js',
      ts: 'js',
      tsx: 'js',
      jsx: 'js',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      webp: 'image',
      avif: 'image',
      svg: 'image',
      gif: 'image',
      woff: 'font',
      woff2: 'font',
      ttf: 'font',
      otf: 'font',
      eot: 'font',
    }

    return typeMap[extension] || 'other'
  }

  private checkBudgetViolations(metric: AssetMetrics): void {
    const budgetLimit = performanceBudget.assets[metric.type]
    if (budgetLimit && metric.size > budgetLimit * 1024) {
      console.warn(`Asset budget violation: ${metric.name}`, {
        size: `${(metric.size / 1024).toFixed(2)}KB`,
        limit: `${budgetLimit}KB`,
        type: metric.type,
      })
    }
  }

  // Get metrics by type
  getMetricsByType(type: AssetMetrics['type']): AssetMetrics[] {
    return this.metrics.filter((metric) => metric.type === type)
  }

  // Get total size by type
  getTotalSizeByType(type: AssetMetrics['type']): number {
    return this.getMetricsByType(type).reduce((total, metric) => total + metric.size, 0)
  }

  // Get slowest loading assets
  getSlowestAssets(count: number = 10): AssetMetrics[] {
    return [...this.metrics].sort((a, b) => b.loadTime - a.loadTime).slice(0, count)
  }

  // Get largest assets
  getLargestAssets(count: number = 10): AssetMetrics[] {
    return [...this.metrics].sort((a, b) => b.size - a.size).slice(0, count)
  }

  // Get cache hit rate
  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0
    const cachedCount = this.metrics.filter((metric) => metric.cached).length
    return (cachedCount / this.metrics.length) * 100
  }

  // Get compression rate
  getCompressionRate(): number {
    if (this.metrics.length === 0) return 0
    const compressedCount = this.metrics.filter((metric) => metric.compressed).length
    return (compressedCount / this.metrics.length) * 100
  }

  // Generate performance report
  generateReport(): {
    summary: {
      totalAssets: number
      totalSize: number
      averageLoadTime: number
      cacheHitRate: number
      compressionRate: number
    }
    byType: Record<
      AssetMetrics['type'],
      {
        count: number
        totalSize: number
        averageLoadTime: number
      }
    >
    violations: Array<{
      asset: string
      type: AssetMetrics['type']
      size: number
      limit: number
    }>
    recommendations: string[]
  } {
    const totalSize = this.metrics.reduce((sum, metric) => sum + metric.size, 0)
    const averageLoadTime =
      this.metrics.length > 0
        ? this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0) / this.metrics.length
        : 0

    const byType = (['css', 'js', 'image', 'font', 'other'] as const).reduce(
      (acc, type) => {
        const typeMetrics = this.getMetricsByType(type)
        acc[type] = {
          count: typeMetrics.length,
          totalSize: this.getTotalSizeByType(type),
          averageLoadTime:
            typeMetrics.length > 0
              ? typeMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) / typeMetrics.length
              : 0,
        }
        return acc
      },
      {} as Record<AssetMetrics['type'], any>,
    )

    const violations = this.metrics
      .filter((metric) => {
        const limit = performanceBudget.assets[metric.type]
        return limit && metric.size > limit * 1024
      })
      .map((metric) => ({
        asset: metric.name,
        type: metric.type,
        size: metric.size,
        limit: performanceBudget.assets[metric.type] * 1024,
      }))

    const recommendations = this.generateRecommendations()

    return {
      summary: {
        totalAssets: this.metrics.length,
        totalSize,
        averageLoadTime,
        cacheHitRate: this.getCacheHitRate(),
        compressionRate: this.getCompressionRate(),
      },
      byType,
      violations,
      recommendations,
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    const cacheHitRate = this.getCacheHitRate()
    const compressionRate = this.getCompressionRate()

    if (cacheHitRate < 80) {
      recommendations.push('Improve caching strategy - cache hit rate is below 80%')
    }

    if (compressionRate < 90) {
      recommendations.push('Enable compression for more assets - compression rate is below 90%')
    }

    const largeImages = this.getMetricsByType('image').filter(
      (metric) => metric.size > 500 * 1024, // 500KB
    )
    if (largeImages.length > 0) {
      recommendations.push(`Optimize ${largeImages.length} large images (>500KB)`)
    }

    const slowAssets = this.metrics.filter((metric) => metric.loadTime > 1000) // 1s
    if (slowAssets.length > 0) {
      recommendations.push(`Optimize ${slowAssets.length} slow-loading assets (>1s)`)
    }

    return recommendations
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.metrics = []
  }
}

// ============================================================================
// PERFORMANCE METRICS COLLECTION
// ============================================================================

export class PerformanceMetricsCollector {
  private metrics: Partial<PerformanceMetrics> = {}

  constructor() {
    this.collectMetrics()
  }

  private collectMetrics(): void {
    if (typeof window === 'undefined') return

    // Collect navigation timing
    this.collectNavigationTiming()

    // Collect paint timing
    this.collectPaintTiming()

    // Collect layout shift
    this.collectLayoutShift()

    // Collect first input delay
    this.collectFirstInputDelay()
  }

  private collectNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart
    }
  }

  private collectPaintTiming(): void {
    const paintEntries = performance.getEntriesByType('paint')

    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    if (fcp) {
      this.metrics.fcp = fcp.startTime
    }

    // LCP requires PerformanceObserver
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  private collectLayoutShift(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.metrics.cls = clsValue
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  private collectFirstInputDelay(): void {
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime
        }
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  checkBudgetCompliance(): {
    compliant: boolean
    violations: Array<{
      metric: keyof PerformanceMetrics
      value: number
      budget: number
    }>
  } {
    const violations: Array<{
      metric: keyof PerformanceMetrics
      value: number
      budget: number
    }> = []

    Object.entries(performanceBudget.metrics).forEach(([metric, budget]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics]
      if (value !== undefined && value > budget) {
        violations.push({
          metric: metric as keyof PerformanceMetrics,
          value,
          budget,
        })
      }
    })

    return {
      compliant: violations.length === 0,
      violations,
    }
  }
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

let assetMonitor: AssetMonitor | null = null
let metricsCollector: PerformanceMetricsCollector | null = null

export function getAssetMonitor(): AssetMonitor {
  if (!assetMonitor) {
    assetMonitor = new AssetMonitor()
  }
  return assetMonitor
}

export function getMetricsCollector(): PerformanceMetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new PerformanceMetricsCollector()
  }
  return metricsCollector
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    assetMonitor?.destroy()
    assetMonitor = null
    metricsCollector = null
  })
}
