// Block duplication utilities
export * from './blockDuplication'

// Performance monitoring utilities
export * from './performanceMonitor'
export * from './performanceBenchmark'

// Re-export types
export type { BlockDuplicationResult, BatchDuplicationResult } from './blockDuplication'
export type {
  PerformanceMetrics,
  PerformanceReport,
  PerformanceThresholds,
  BenchmarkConfig,
  BenchmarkResult,
} from './performanceMonitor'
