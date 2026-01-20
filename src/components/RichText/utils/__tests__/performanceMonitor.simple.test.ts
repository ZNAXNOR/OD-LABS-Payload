/**
 * Simple tests for RichText performance monitoring utilities
 */

// Mock performance API for testing
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

describe('Performance Monitor Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create performance monitor instance', () => {
    // Import after mocking
    const { performanceMonitor } = require('../performanceMonitor')

    expect(performanceMonitor).toBeDefined()
    expect(typeof performanceMonitor.generateReport).toBe('function')
    expect(typeof performanceMonitor.recordMetrics).toBe('function')
  })

  it('should record basic metrics', () => {
    const { performanceMonitor } = require('../performanceMonitor')

    performanceMonitor.clearMetrics()

    performanceMonitor.recordMetrics({
      renderTime: 50,
      blockCount: 5,
      contentLength: 1000,
      blockTypes: ['content', 'hero'],
    })

    const report = performanceMonitor.generateReport()

    expect(report.metrics.renderTime).toBe(50)
    expect(report.metrics.blockCount).toBe(5)
    expect(report.metrics.contentLength).toBe(1000)
    expect(report.metrics.blockTypes).toEqual(['content', 'hero'])
  })

  it('should generate performance score', () => {
    const { performanceMonitor } = require('../performanceMonitor')

    performanceMonitor.clearMetrics()

    // Good performance
    performanceMonitor.recordMetrics({
      renderTime: 50,
      blockCount: 10,
      contentLength: 5000,
      blockTypes: ['content'],
    })

    const report = performanceMonitor.generateReport()
    expect(report.score).toBeGreaterThan(80)
  })

  it('should measure render time', () => {
    const { measureRichTextRender } = require('../performanceMonitor')

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

  it('should handle missing performance API gracefully', () => {
    const originalPerformance = global.performance

    // Remove performance API
    delete (global as any).performance

    const { measureRichTextRender } = require('../performanceMonitor')
    const endMeasurement = measureRichTextRender('test')
    const duration = endMeasurement()

    expect(duration).toBe(0)

    // Restore performance API
    global.performance = originalPerformance
  })
})
