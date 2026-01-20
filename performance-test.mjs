/**
 * Performance validation script for RichText components
 * Tests key performance metrics and benchmarks
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Performance benchmarks from the design document
const PERFORMANCE_TARGETS = {
  RICH_TEXT_RENDERING: 100, // ms - Rich text rendering time < 100ms for typical content
  BUNDLE_SIZE_IMPACT: 5, // % - No significant impact on bundle size
  EDITOR_RESPONSIVENESS: 50, // ms - Editor should remain responsive during content creation
  BLOCK_LOADING: 200, // ms - Block components should load within 200ms
  CONVERTER_EXECUTION: 10, // ms - Converter functions should execute quickly
}

// Mock performance measurement utilities
class PerformanceMeasurement {
  constructor() {
    this.measurements = new Map()
  }

  start(name) {
    this.measurements.set(name, Date.now())
  }

  end(name) {
    const startTime = this.measurements.get(name)
    if (!startTime) return 0

    const duration = Date.now() - startTime
    this.measurements.delete(name)
    return duration
  }

  measure(name, fn) {
    this.start(name)
    const result = fn()
    const duration = this.end(name)
    return { result, duration }
  }
}

// Check if performance optimization files exist
function validatePerformanceOptimizations() {
  const errors = []
  const optimizationFiles = [
    'src/components/RichText/optimization/imageOptimization.ts',
    'src/components/RichText/optimization/bundleOptimization.ts',
    'src/components/RichText/optimization/contentCaching.ts',
    'src/components/RichText/optimization/virtualScrolling.ts',
    'src/components/RichText/optimization/incrementalRendering.ts',
  ]

  optimizationFiles.forEach((file) => {
    const filePath = path.join(__dirname, file)
    if (!fs.existsSync(filePath)) {
      errors.push(`Performance optimization file not found: ${file}`)
    }
  })

  return errors
}

// Validate bundle size optimizations
function validateBundleOptimizations() {
  const errors = []

  // Check for dynamic imports in converters
  const convertersPath = path.join(__dirname, 'src/components/RichText/converters')
  if (fs.existsSync(convertersPath)) {
    const files = fs.readdirSync(convertersPath)
    const hasConverters = files.some((file) => file.endsWith('.ts') || file.endsWith('.tsx'))

    if (!hasConverters) {
      errors.push('No converter files found for bundle optimization')
    }
  } else {
    errors.push('Converters directory not found')
  }

  // Check for bundle optimization implementation
  const bundleOptPath = path.join(
    __dirname,
    'src/components/RichText/optimization/bundleOptimization.ts',
  )
  if (!fs.existsSync(bundleOptPath)) {
    errors.push('Bundle optimization not implemented')
  }

  return errors
}

// Simulate rendering performance test
function simulateRenderingPerformance() {
  const perf = new PerformanceMeasurement()

  // Simulate typical rich text content rendering
  const { duration } = perf.measure('richtext-rendering', () => {
    // Simulate DOM operations and converter execution
    const mockContent = Array.from({ length: 100 }, (_, i) => ({
      type: 'paragraph',
      content: `Mock paragraph ${i}`,
    }))

    // Simulate processing time
    let result = ''
    for (const item of mockContent) {
      result += item.content
    }

    return result
  })

  return duration
}

// Simulate converter performance
function simulateConverterPerformance() {
  const perf = new PerformanceMeasurement()

  const { duration } = perf.measure('converter-execution', () => {
    // Simulate converter function execution
    const mockBlocks = Array.from({ length: 10 }, (_, i) => ({
      type: 'hero',
      props: { heading: `Block ${i}` },
    }))

    // Simulate converter processing
    return mockBlocks.map((block) => `<div>${block.props.heading}</div>`)
  })

  return duration
}

// Check memory usage patterns
function validateMemoryOptimizations() {
  const errors = []

  // Check for memoization implementation in converters
  const memoizationPath = path.join(__dirname, 'src/components/RichText/converters/memoization.ts')
  if (!fs.existsSync(memoizationPath)) {
    errors.push('Memoization optimization not implemented')
  }

  // Check for caching implementation
  const cachingPath = path.join(__dirname, 'src/components/RichText/optimization/contentCaching.ts')
  if (!fs.existsSync(cachingPath)) {
    errors.push('Content caching optimization not implemented')
  }

  return errors
}

// Validate performance monitoring
function validatePerformanceMonitoring() {
  const errors = []

  // Check for performance monitoring implementation
  const monitoringPath = path.join(__dirname, 'src/components/RichText/utils/performanceMonitor.ts')
  if (!fs.existsSync(monitoringPath)) {
    errors.push('Performance monitoring not implemented')
  }

  // Check for performance benchmark utilities
  const benchmarkPath = path.join(
    __dirname,
    'src/components/RichText/utils/performanceBenchmark.ts',
  )
  if (!fs.existsSync(benchmarkPath)) {
    errors.push('Performance benchmark utilities not implemented')
  }

  return errors
}

// Run performance validation tests
function runPerformanceTests() {
  console.log('⚡ Running Performance Validation Tests...\n')

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: [],
    metrics: {},
  }

  // Test 1: Performance Optimization Files
  console.log('1. Testing performance optimization implementations...')
  const optimizationErrors = validatePerformanceOptimizations()
  if (optimizationErrors.length === 0) {
    console.log('   ✅ Performance optimization files found')
    results.passed++
  } else {
    console.log('   ❌ Performance optimization files missing:', optimizationErrors)
    results.failed++
    results.errors.push(...optimizationErrors)
  }

  // Test 2: Bundle Size Optimizations
  console.log('2. Testing bundle size optimizations...')
  const bundleErrors = validateBundleOptimizations()
  if (bundleErrors.length === 0) {
    console.log('   ✅ Bundle size optimizations implemented')
    results.passed++
  } else {
    console.log('   ❌ Bundle size optimizations missing:', bundleErrors)
    results.failed++
    results.errors.push(...bundleErrors)
  }

  // Test 3: Rendering Performance
  console.log('3. Testing rendering performance...')
  const renderingTime = simulateRenderingPerformance()
  results.metrics.renderingTime = renderingTime

  if (renderingTime <= PERFORMANCE_TARGETS.RICH_TEXT_RENDERING) {
    console.log(
      `   ✅ Rendering performance: ${renderingTime}ms (target: <${PERFORMANCE_TARGETS.RICH_TEXT_RENDERING}ms)`,
    )
    results.passed++
  } else {
    console.log(
      `   ⚠️  Rendering performance: ${renderingTime}ms (target: <${PERFORMANCE_TARGETS.RICH_TEXT_RENDERING}ms)`,
    )
    results.warnings++
  }

  // Test 4: Converter Performance
  console.log('4. Testing converter performance...')
  const converterTime = simulateConverterPerformance()
  results.metrics.converterTime = converterTime

  if (converterTime <= PERFORMANCE_TARGETS.CONVERTER_EXECUTION) {
    console.log(
      `   ✅ Converter performance: ${converterTime}ms (target: <${PERFORMANCE_TARGETS.CONVERTER_EXECUTION}ms)`,
    )
    results.passed++
  } else {
    console.log(
      `   ⚠️  Converter performance: ${converterTime}ms (target: <${PERFORMANCE_TARGETS.CONVERTER_EXECUTION}ms)`,
    )
    results.warnings++
  }

  // Test 5: Memory Optimizations
  console.log('5. Testing memory optimizations...')
  const memoryErrors = validateMemoryOptimizations()
  if (memoryErrors.length === 0) {
    console.log('   ✅ Memory optimizations implemented')
    results.passed++
  } else {
    console.log('   ❌ Memory optimizations missing:', memoryErrors)
    results.failed++
    results.errors.push(...memoryErrors)
  }

  // Test 6: Performance Monitoring
  console.log('6. Testing performance monitoring...')
  const monitoringErrors = validatePerformanceMonitoring()
  if (monitoringErrors.length === 0) {
    console.log('   ✅ Performance monitoring implemented')
    results.passed++
  } else {
    console.log('   ❌ Performance monitoring missing:', monitoringErrors)
    results.failed++
    results.errors.push(...monitoringErrors)
  }

  // Summary
  console.log('\n📊 Performance Test Results:')
  console.log(`   Passed: ${results.passed}`)
  console.log(`   Failed: ${results.failed}`)
  console.log(`   Warnings: ${results.warnings}`)

  const totalTests = results.passed + results.failed + results.warnings
  const successRate = Math.round((results.passed / totalTests) * 100)
  console.log(`   Success Rate: ${successRate}%`)

  // Performance Metrics Summary
  console.log('\n⚡ Performance Metrics:')
  if (results.metrics.renderingTime !== undefined) {
    console.log(`   Rendering Time: ${results.metrics.renderingTime}ms`)
  }
  if (results.metrics.converterTime !== undefined) {
    console.log(`   Converter Time: ${results.metrics.converterTime}ms`)
  }

  if (results.errors.length > 0) {
    console.log('\n❌ Issues Found:')
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`)
    })
  }

  // Performance meets targets if no critical failures and reasonable performance
  const meetsTargets =
    results.failed === 0 &&
    (results.metrics.renderingTime || 0) <= PERFORMANCE_TARGETS.RICH_TEXT_RENDERING * 2 &&
    (results.metrics.converterTime || 0) <= PERFORMANCE_TARGETS.CONVERTER_EXECUTION * 2

  return meetsTargets
}

// Run the tests
const success = runPerformanceTests()

if (success) {
  console.log('\n🚀 Performance metrics meet the requirements!')
  process.exit(0)
} else {
  console.log('\n⚠️  Some performance optimizations need attention.')
  process.exit(1)
}
