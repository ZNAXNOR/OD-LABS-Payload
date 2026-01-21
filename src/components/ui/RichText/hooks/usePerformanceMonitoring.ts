/**
 * React hooks for RichText performance monitoring
 * Provides easy integration with React components
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import {
  performanceMonitor,
  type PerformanceMetrics,
  type PerformanceReport,
} from '../utils/performanceMonitor'

export interface UsePerformanceMonitoringOptions {
  componentName: string
  trackMemory?: boolean
  trackRenderTime?: boolean
  trackContentMetrics?: boolean
  reportInterval?: number // ms
}

export interface PerformanceHookResult {
  startMeasurement: (name?: string) => void
  endMeasurement: (name?: string) => number
  recordMetrics: (metrics: Partial<PerformanceMetrics>) => void
  getReport: () => PerformanceReport
  isMonitoring: boolean
  currentMetrics: PerformanceMetrics | null
}

/**
 * Hook for monitoring RichText component performance
 */
export const usePerformanceMonitoring = (
  options: UsePerformanceMonitoringOptions,
): PerformanceHookResult => {
  const {
    componentName,
    trackMemory = true,
    trackRenderTime = true,
    reportInterval = 5000,
  } = options

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null)
  const measurementRef = useRef<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startMeasurement = useCallback(
    (name?: string) => {
      if (!trackRenderTime) return

      const measurementName = name || componentName
      measurementRef.current = measurementName
      performanceMonitor.startMeasurement(`richtext-${measurementName}`)
      setIsMonitoring(true)
    },
    [componentName, trackRenderTime],
  )

  const endMeasurement = useCallback(
    (name?: string) => {
      if (!trackRenderTime) return 0

      const measurementName = name || measurementRef.current || componentName
      const duration = performanceMonitor.endMeasurement(`richtext-${measurementName}`)
      measurementRef.current = null
      setIsMonitoring(false)

      return duration
    },
    [componentName, trackRenderTime],
  )

  const recordMetrics = useCallback(
    (metrics: Partial<PerformanceMetrics>) => {
      const enhancedMetrics = {
        ...metrics,
        timestamp: Date.now(),
      }

      // Add memory usage if tracking is enabled
      if (trackMemory && typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory
        enhancedMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
      }

      performanceMonitor.recordMetrics(enhancedMetrics)
      setCurrentMetrics(enhancedMetrics as PerformanceMetrics)
    },
    [trackMemory],
  )

  const getReport = useCallback(() => {
    return performanceMonitor.generateReport()
  }, [])

  // Set up periodic reporting
  useEffect(() => {
    if (reportInterval > 0) {
      intervalRef.current = setInterval(() => {
        const report = getReport()
        if (report.warnings.length > 0) {
          console.warn(`RichText Performance Report for ${componentName}:`, report)
        }
      }, reportInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [reportInterval, getReport, componentName])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (measurementRef.current) {
        endMeasurement()
      }
    }
  }, [endMeasurement])

  return {
    startMeasurement,
    endMeasurement,
    recordMetrics,
    getReport,
    isMonitoring,
    currentMetrics,
  }
}

/**
 * Hook for measuring render performance of a component
 */
export const useRenderPerformance = (componentName: string) => {
  const renderStartRef = useRef<number>(0)
  const [renderTime, setRenderTime] = useState<number>(0)

  useEffect(() => {
    renderStartRef.current = performance.now()
  })

  useEffect(() => {
    const renderEnd = performance.now()
    const duration = renderEnd - renderStartRef.current
    setRenderTime(duration)

    performanceMonitor.recordMetrics({
      renderTime: duration,
      componentCount: 1,
      timestamp: Date.now(),
      blockTypes: [componentName],
    })

    if (duration > 100) {
      // 100ms threshold
      console.warn(`${componentName} render time exceeded threshold: ${duration.toFixed(2)}ms`)
    }
  })

  return renderTime
}

/**
 * Hook for monitoring content metrics (block count, content length, etc.)
 */
export const useContentMetrics = (content: any) => {
  const [metrics, setMetrics] = useState<{
    blockCount: number
    contentLength: number
    blockTypes: string[]
  }>({
    blockCount: 0,
    contentLength: 0,
    blockTypes: [],
  })

  useEffect(() => {
    if (!content) return

    const calculateMetrics = () => {
      let blockCount = 0
      let contentLength = 0
      const blockTypes: string[] = []

      const traverseContent = (node: any) => {
        if (!node) return

        if (typeof node === 'string') {
          contentLength += node.length
          return
        }

        if (Array.isArray(node)) {
          node.forEach(traverseContent)
          return
        }

        if (typeof node === 'object') {
          if (node.type) {
            blockCount++
            if (!blockTypes.includes(node.type)) {
              blockTypes.push(node.type)
            }
          }

          if (node.children) {
            traverseContent(node.children)
          }

          if (node.text) {
            contentLength += node.text.length
          }
        }
      }

      traverseContent(content)

      return { blockCount, contentLength, blockTypes }
    }

    const newMetrics = calculateMetrics()
    setMetrics(newMetrics)

    // Record metrics with performance monitor
    performanceMonitor.recordMetrics({
      blockCount: newMetrics.blockCount,
      contentLength: newMetrics.contentLength,
      blockTypes: newMetrics.blockTypes,
      timestamp: Date.now(),
    })
  }, [content])

  return metrics
}

/**
 * Hook for monitoring memory usage
 */
export const useMemoryMonitoring = (interval: number = 5000) => {
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return
    }

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory
      const usageMB = memory.usedJSHeapSize / 1024 / 1024
      setMemoryUsage(usageMB)
    }

    // Initial measurement
    updateMemoryUsage()

    // Set up interval
    intervalRef.current = setInterval(updateMemoryUsage, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [interval])

  return memoryUsage
}

/**
 * Hook for performance debugging in development
 */
export const usePerformanceDebug = (
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === 'development',
) => {
  const renderCountRef = useRef(0)
  const lastRenderTimeRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    renderCountRef.current++
    const now = performance.now()
    const timeSinceLastRender = now - lastRenderTimeRef.current
    lastRenderTimeRef.current = now

    console.log(
      `[${componentName}] Render #${renderCountRef.current}, Time since last: ${timeSinceLastRender.toFixed(2)}ms`,
    )
  })

  const logPerformanceData = useCallback(() => {
    if (!enabled) return

    const report = performanceMonitor.generateReport()
    console.group(`Performance Debug: ${componentName}`)
    console.log('Render count:', renderCountRef.current)
    console.log('Performance report:', report)
    console.log('Current metrics:', report.metrics)
    console.log('Warnings:', report.warnings)
    console.log('Recommendations:', report.recommendations)
    console.log('Performance score:', report.score)
    console.groupEnd()
  }, [componentName, enabled])

  return { logPerformanceData, renderCount: renderCountRef.current }
}
