/**
 * Image Performance Monitoring Utilities
 *
 * This module provides utilities for monitoring and optimizing image loading performance
 * in the RichText editor and components.
 */

import React from 'react'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImagePerformanceMetrics {
  loadTime: number
  fileSize?: number
  format: string
  dimensions: {
    width: number
    height: number
  }
  quality?: number
  isOptimized: boolean
  cacheHit: boolean
  connectionType?: string
  devicePixelRatio: number
  timestamp: number
}

export interface ImageLoadingEvent {
  type: 'start' | 'progress' | 'complete' | 'error' | 'retry'
  src: string
  timestamp: number
  metrics?: Partial<ImagePerformanceMetrics>
  error?: Error
}

export interface PerformanceThresholds {
  loadTime: {
    good: number
    needs_improvement: number
    poor: number
  }
  fileSize: {
    small: number
    medium: number
    large: number
  }
  quality: {
    low: number
    medium: number
    high: number
  }
}

export interface OptimizationRecommendation {
  type: 'format' | 'quality' | 'dimensions' | 'lazy_loading' | 'preload'
  priority: 'low' | 'medium' | 'high'
  description: string
  expectedImprovement: string
  implementation: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  loadTime: {
    good: 1000, // 1 second
    needs_improvement: 2500, // 2.5 seconds
    poor: 4000, // 4 seconds
  },
  fileSize: {
    small: 100 * 1024, // 100KB
    medium: 500 * 1024, // 500KB
    large: 1024 * 1024, // 1MB
  },
  quality: {
    low: 60,
    medium: 80,
    high: 90,
  },
}

// ============================================================================
// PERFORMANCE MONITORING CLASS
// ============================================================================

export class ImagePerformanceMonitor {
  private metrics: Map<string, ImagePerformanceMetrics> = new Map()
  private events: ImageLoadingEvent[] = []
  private thresholds: PerformanceThresholds
  private isEnabled: boolean = true

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds }

    // Initialize performance observer if available
    this.initializePerformanceObserver()
  }

  /**
   * Initialize Performance Observer for resource timing
   */
  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.initiatorType === 'img' || resourceEntry.initiatorType === 'image') {
            this.recordResourceTiming(resourceEntry)
          }
        }
      })

      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Failed to initialize PerformanceObserver:', error)
    }
  }

  /**
   * Record resource timing data
   */
  private recordResourceTiming(entry: PerformanceResourceTiming): void {
    const src = entry.name
    const loadTime = entry.responseEnd - entry.startTime
    const transferSize = entry.transferSize || 0

    const metrics: Partial<ImagePerformanceMetrics> = {
      loadTime,
      fileSize: transferSize,
      cacheHit: transferSize === 0,
      timestamp: Date.now(),
    }

    this.updateMetrics(src, metrics)
  }

  /**
   * Start monitoring an image load
   */
  public startImageLoad(
    src: string,
    options?: {
      dimensions?: { width: number; height: number }
      quality?: number
      format?: string
    },
  ): void {
    if (!this.isEnabled) return

    const event: ImageLoadingEvent = {
      type: 'start',
      src,
      timestamp: Date.now(),
      metrics: {
        dimensions: options?.dimensions,
        quality: options?.quality,
        format: options?.format || this.extractFormat(src),
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        connectionType: this.getConnectionType(),
      },
    }

    this.events.push(event)
  }

  /**
   * Record image load completion
   */
  public completeImageLoad(
    src: string,
    additionalMetrics?: Partial<ImagePerformanceMetrics>,
  ): void {
    if (!this.isEnabled) return

    const startEvent = this.events.reverse().find((e) => e.src === src && e.type === 'start')

    if (!startEvent) return

    const loadTime = Date.now() - startEvent.timestamp
    const metrics: ImagePerformanceMetrics = {
      loadTime,
      format: additionalMetrics?.format || this.extractFormat(src),
      dimensions: additionalMetrics?.dimensions || { width: 0, height: 0 },
      quality: additionalMetrics?.quality,
      isOptimized: this.isImageOptimized(src),
      cacheHit: additionalMetrics?.cacheHit || false,
      connectionType: this.getConnectionType(),
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      timestamp: Date.now(),
      ...additionalMetrics,
    }

    this.metrics.set(src, metrics)

    const event: ImageLoadingEvent = {
      type: 'complete',
      src,
      timestamp: Date.now(),
      metrics,
    }

    this.events.push(event)
  }

  /**
   * Record image load error
   */
  public recordImageError(src: string, error: Error): void {
    if (!this.isEnabled) return

    const event: ImageLoadingEvent = {
      type: 'error',
      src,
      timestamp: Date.now(),
      error,
    }

    this.events.push(event)
  }

  /**
   * Update metrics for an image
   */
  private updateMetrics(src: string, newMetrics: Partial<ImagePerformanceMetrics>): void {
    const existing = this.metrics.get(src)
    const updated = { ...existing, ...newMetrics } as ImagePerformanceMetrics
    this.metrics.set(src, updated)
  }

  /**
   * Get performance metrics for a specific image
   */
  public getImageMetrics(src: string): ImagePerformanceMetrics | undefined {
    return this.metrics.get(src)
  }

  /**
   * Get all performance metrics
   */
  public getAllMetrics(): Map<string, ImagePerformanceMetrics> {
    return new Map(this.metrics)
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    totalImages: number
    averageLoadTime: number
    cacheHitRate: number
    formatDistribution: Record<string, number>
    performanceGrade: 'good' | 'needs_improvement' | 'poor'
  } {
    const metrics = Array.from(this.metrics.values())

    if (metrics.length === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        formatDistribution: {},
        performanceGrade: 'good',
      }
    }

    const totalImages = metrics.length
    const averageLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / totalImages
    const cacheHits = metrics.filter((m) => m.cacheHit).length
    const cacheHitRate = (cacheHits / totalImages) * 100

    const formatDistribution = metrics.reduce(
      (acc, m) => {
        acc[m.format] = (acc[m.format] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const performanceGrade = this.calculatePerformanceGrade(averageLoadTime)

    return {
      totalImages,
      averageLoadTime,
      cacheHitRate,
      formatDistribution,
      performanceGrade,
    }
  }

  /**
   * Generate optimization recommendations
   */
  public getOptimizationRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    const metrics = Array.from(this.metrics.values())

    // Analyze format usage
    const formatCounts = metrics.reduce(
      (acc, m) => {
        acc[m.format] = (acc[m.format] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const jpegCount = formatCounts['jpeg'] || 0
    const webpCount = formatCounts['webp'] || 0
    const avifCount = formatCounts['avif'] || 0

    if (jpegCount > webpCount + avifCount) {
      recommendations.push({
        type: 'format',
        priority: 'high',
        description: 'Consider using WebP format for better compression',
        expectedImprovement: '25-35% smaller file sizes',
        implementation: 'Enable WebP in image optimization settings',
      })
    }

    // Analyze load times
    const slowImages = metrics.filter(
      (m) => m.loadTime > this.thresholds.loadTime.needs_improvement,
    )
    if (slowImages.length > 0) {
      recommendations.push({
        type: 'lazy_loading',
        priority: 'medium',
        description: 'Implement lazy loading for below-the-fold images',
        expectedImprovement: 'Faster initial page load',
        implementation: 'Use intersection observer for lazy loading',
      })
    }

    // Analyze file sizes
    const largeImages = metrics.filter(
      (m) => m.fileSize && m.fileSize > this.thresholds.fileSize.large,
    )
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        description: 'Reduce quality for large images',
        expectedImprovement: '20-40% smaller file sizes',
        implementation: 'Lower quality setting for non-critical images',
      })
    }

    // Analyze dimensions
    const oversizedImages = metrics.filter((m) => {
      const { width, height } = m.dimensions
      return width > 1920 || height > 1080
    })

    if (oversizedImages.length > 0) {
      recommendations.push({
        type: 'dimensions',
        priority: 'high',
        description: 'Resize oversized images',
        expectedImprovement: 'Significant file size reduction',
        implementation: 'Set maximum dimensions based on display requirements',
      })
    }

    return recommendations
  }

  /**
   * Extract format from image URL
   */
  private extractFormat(src: string): string {
    const url = new URL(src, window.location.origin)
    const pathname = url.pathname.toLowerCase()

    if (pathname.includes('.webp')) return 'webp'
    if (pathname.includes('.avif')) return 'avif'
    if (pathname.includes('.png')) return 'png'
    if (pathname.includes('.jpg') || pathname.includes('.jpeg')) return 'jpeg'
    if (pathname.includes('.gif')) return 'gif'
    if (pathname.includes('.svg')) return 'svg'

    // Check format parameter
    const format = url.searchParams.get('format')
    if (format) return format

    return 'unknown'
  }

  /**
   * Check if image is optimized
   */
  private isImageOptimized(src: string): boolean {
    const url = new URL(src, window.location.origin)

    // Check if it's using Next.js image optimization
    if (url.pathname.startsWith('/_next/image')) return true

    // Check for optimization parameters
    const hasQuality = url.searchParams.has('q')
    const hasWidth = url.searchParams.has('w')
    const hasFormat = url.searchParams.has('format')

    return hasQuality || hasWidth || hasFormat
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string | undefined {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return undefined
    }

    const connection = (navigator as any).connection
    return connection?.effectiveType || connection?.type
  }

  /**
   * Calculate performance grade
   */
  private calculatePerformanceGrade(
    averageLoadTime: number,
  ): 'good' | 'needs_improvement' | 'poor' {
    if (averageLoadTime <= this.thresholds.loadTime.good) {
      return 'good'
    } else if (averageLoadTime <= this.thresholds.loadTime.needs_improvement) {
      return 'needs_improvement'
    } else {
      return 'poor'
    }
  }

  /**
   * Export metrics as JSON
   */
  public exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: Object.fromEntries(this.metrics),
        events: this.events,
        summary: this.getPerformanceSummary(),
        recommendations: this.getOptimizationRecommendations(),
        timestamp: Date.now(),
      },
      null,
      2,
    )
  }

  /**
   * Clear all metrics
   */
  public clearMetrics(): void {
    this.metrics.clear()
    this.events.length = 0
  }

  /**
   * Enable/disable monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let globalMonitor: ImagePerformanceMonitor | null = null

/**
 * Get the global performance monitor instance
 */
export const getImagePerformanceMonitor = (): ImagePerformanceMonitor => {
  if (!globalMonitor) {
    globalMonitor = new ImagePerformanceMonitor()
  }
  return globalMonitor
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Monitor image loading performance
 */
export const monitorImageLoad = (
  src: string,
  options?: {
    dimensions?: { width: number; height: number }
    quality?: number
    format?: string
  },
) => {
  const monitor = getImagePerformanceMonitor()
  monitor.startImageLoad(src, options)

  return {
    complete: (metrics?: Partial<ImagePerformanceMetrics>) => {
      monitor.completeImageLoad(src, metrics)
    },
    error: (error: Error) => {
      monitor.recordImageError(src, error)
    },
  }
}

/**
 * Get performance insights for debugging
 */
export const getPerformanceInsights = () => {
  const monitor = getImagePerformanceMonitor()
  return {
    summary: monitor.getPerformanceSummary(),
    recommendations: monitor.getOptimizationRecommendations(),
    export: () => monitor.exportMetrics(),
  }
}

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV !== 'development') return

  const insights = getPerformanceInsights()

  console.group('🖼️ Image Performance Metrics')
  console.log('Summary:', insights.summary)
  console.log('Recommendations:', insights.recommendations)
  console.groupEnd()
}

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * React hook for monitoring image performance
 */
export const useImagePerformanceMonitor = () => {
  const monitor = React.useMemo(() => getImagePerformanceMonitor(), [])

  const startMonitoring = React.useCallback(
    (
      src: string,
      options?: {
        dimensions?: { width: number; height: number }
        quality?: number
        format?: string
      },
    ) => {
      return monitorImageLoad(src, options)
    },
    [],
  )

  const getInsights = React.useCallback(() => {
    return getPerformanceInsights()
  }, [])

  return {
    startMonitoring,
    getInsights,
    monitor,
  }
}

// Auto-log metrics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Log metrics every 30 seconds in development
  setInterval(logPerformanceMetrics, 30000)
}

export default ImagePerformanceMonitor
