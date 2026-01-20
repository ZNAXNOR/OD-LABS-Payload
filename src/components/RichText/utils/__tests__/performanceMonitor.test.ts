/**
 * Tests for RichText performance monitoring utilities
 */

import {
  performanceMonitor,
  measureRichTextRender,
  recordRichTextMetrics,
} from '../performanceMonitor'
import type { PerformanceMetrics } from '../../types'

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => [{ duration: 50 }]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 10, // 10MB
  },
}

// Mock global performance
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
})

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics()
    jest.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should record performance metrics', () => {
      const metrics: Partial<PerformanceMetrics> = {
        renderTime: 50,
        blockCount: 5,
        contentLength: 1000,
        blockTypes: ['content', 'hero'],
      }

      recordRichTextMetrics(metrics)
      const report = performanceMonitor.generateReport()

      expect(report.metrics.renderTime).toBe(50)
      expect(report.metrics.blockCount).toBe(5)
      expect(report.metrics.contentLength).toBe(1000)
      expect(report.metrics.blockTypes).toEqual(['content', 'hero'])
    })

    it('should measure render time', () => {
      const endMeasurement = measureRichTextRender('test-component')

      expect(mockPerformance.mark).toHaveBeenCalledWith('richtext-test-component-start')

      const duration = endMeasurement()

      expect(mockPerformance.mark).toHaveBeenCalledWith('richtext-test-component-end')
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'richtext-test-component',
        'richtext-test-component-start',
        'richtext-test-component-end',
      )
      expect(duration).toBe(50)
    })

    it('should include memory usage when available', () => {
      const metrics: Partial<PerformanceMetrics> = {
        renderTime: 50,
        blockCount: 5,
      }

      recordRichTextMetrics(metrics)
      const report = performanceMonitor.generateReport()

      expect(report.metrics.memoryUsage).toBe(10) // 10MB
    })
  })

  describe('Performance Thresholds', () => {
    it('should generate warnings when thresholds are exceeded', () => {
      const metrics: Partial<PerformanceMetrics> = {
        renderTime: 150, // Above default 100ms threshold
        blockCount: 25, // Above default 20 threshold
        contentLength: 15000, // Above default 10k threshold
      }

      recordRichTextMetrics(metrics)
      const report = performanceMonitor.generateReport()

      expect(report.warnings.length).toBeGreaterThan(0)
      expect(report.warnings.some((w) => w.includes('Render time exceeded'))).toBe(true)
      expect(report.warnings.some((w) => w.includes('Block count exceeded'))).toBe(true)
      expect(report.warnings.some((w) => w.includes('Content length exceeded'))).toBe(true)
    })

    it('should generate recommendations for performance issues', () => {
      const metrics: Partial<PerformanceMetrics> = {
        renderTime: 200,
        blockCount: 30,
      }

      recordRichTextMetrics(metrics)
      const report = performanceMonitor.generateReport()

      expect(report.recommendations.length).toBeGreaterThan(0)
      expect(report.recommendations.some((r) => r.includes('lazy loading'))).toBe(true)
      expect(report.recommendations.some((r) => r.includes('pagination'))).toBe(true)
    })

    it('should calculate performance score correctly', () => {
      // Good performance
      recordRichTextMetrics({
        renderTime: 50,
        blockCount: 10,
        contentLength: 5000,
      })

      let report = performanceMonitor.generateReport()
      expect(report.score).toBeGreaterThan(80)

      // Clear and test poor performance
      performanceMonitor.clearMetrics()
      recordRichTextMetrics({
        renderTime: 300,
        blockCount: 50,
        contentLength: 20000,
      })

      report = performanceMonitor.generateReport()
      expect(report.score).toBeLessThan(50)
    })
  })

  describe('Metrics Management', () => {
    it('should limit stored metrics to 100 entries', () => {
      // Add 150 metrics
      for (let i = 0; i < 150; i++) {
        recordRichTextMetrics({
          renderTime: i,
          blockCount: 1,
          contentLength: 100,
          blockTypes: ['test'],
        })
      }

      const metrics = performanceMonitor.getMetrics()
      expect(metrics.length).toBe(100)
      expect(metrics[0].renderTime).toBe(50) // Should start from 50, not 0
    })

    it('should clear all metrics', () => {
      recordRichTextMetrics({
        renderTime: 50,
        blockCount: 5,
        contentLength: 1000,
        blockTypes: ['test'],
      })

      expect(performanceMonitor.getMetrics().length).toBe(1)

      performanceMonitor.clearMetrics()

      expect(performanceMonitor.getMetrics().length).toBe(0)
    })

    it('should handle empty metrics gracefully', () => {
      const report = performanceMonitor.generateReport()

      expect(report.warnings).toContain('No performance data available')
      expect(report.score).toBe(0)
    })
  })

  describe('Custom Thresholds', () => {
    it('should allow setting custom thresholds', () => {
      performanceMonitor.setThresholds({
        renderTime: 200,
        blockCount: 50,
      })

      recordRichTextMetrics({
        renderTime: 150, // Below new threshold
        blockCount: 40, // Below new threshold
      })

      const report = performanceMonitor.generateReport()
      expect(report.warnings.length).toBe(0)
    })
  })

  describe('Average Calculations', () => {
    it('should calculate average metrics correctly', () => {
      const testMetrics = [
        { renderTime: 100, blockCount: 10, contentLength: 1000 },
        { renderTime: 200, blockCount: 20, contentLength: 2000 },
        { renderTime: 300, blockCount: 30, contentLength: 3000 },
      ]

      testMetrics.forEach((metrics) => {
        recordRichTextMetrics({
          ...metrics,
          blockTypes: ['test'],
        })
      })

      const report = performanceMonitor.generateReport()

      // Should use latest metrics for the report, but averages for scoring
      expect(report.metrics.renderTime).toBe(300) // Latest

      // Score should be based on averages (200ms average)
      expect(report.score).toBeLessThan(100) // Should be penalized for high average
    })
  })

  describe('Error Handling', () => {
    it('should handle missing performance API gracefully', () => {
      const originalPerformance = global.performance

      // Remove performance API
      delete (global as any).performance

      const endMeasurement = measureRichTextRender('test')
      const duration = endMeasurement()

      expect(duration).toBe(0)

      // Restore performance API
      global.performance = originalPerformance
    })

    it('should handle missing memory API gracefully', () => {
      const originalMemory = mockPerformance.memory
      delete mockPerformance.memory

      recordRichTextMetrics({
        renderTime: 50,
        blockCount: 5,
        contentLength: 1000,
        blockTypes: ['test'],
      })

      const report = performanceMonitor.generateReport()
      expect(report.metrics.memoryUsage).toBeUndefined()

      // Restore memory API
      mockPerformance.memory = originalMemory
    })
  })

  describe('Block Type Tracking', () => {
    it('should track unique block types across measurements', () => {
      recordRichTextMetrics({
        renderTime: 50,
        blockTypes: ['content', 'hero'],
      })

      recordRichTextMetrics({
        renderTime: 60,
        blockTypes: ['hero', 'cta'],
      })

      const report = performanceMonitor.generateReport()
      expect(report.metrics.blockTypes).toEqual(['hero', 'cta']) // Latest measurement
    })
  })
})

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should measure render time with utility function', () => {
    const endMeasurement = measureRichTextRender('utility-test')

    expect(mockPerformance.mark).toHaveBeenCalledWith('richtext-utility-test-start')

    const duration = endMeasurement()

    expect(mockPerformance.mark).toHaveBeenCalledWith('richtext-utility-test-end')
    expect(duration).toBe(50)
  })

  it('should record metrics with utility function', () => {
    recordRichTextMetrics({
      renderTime: 75,
      blockCount: 8,
      contentLength: 1500,
      blockTypes: ['content'],
    })

    const report = performanceMonitor.generateReport()
    expect(report.metrics.renderTime).toBe(75)
    expect(report.metrics.blockCount).toBe(8)
  })
})
