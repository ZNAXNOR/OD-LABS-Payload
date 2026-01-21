import React from 'react'
import type { BlockConverter, SerializedBlockNode, AllBlockTypes } from '../types'

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

/**
 * Cache for memoized converter functions
 */
const converterCache = new Map<string, React.ReactElement>()

/**
 * Cache for memoized component instances
 */
const componentCache = new WeakMap<React.ComponentType<any>, React.ComponentType<any>>()

/**
 * Performance metrics for cache analysis
 */
interface CacheMetrics {
  hits: number
  misses: number
  size: number
  maxSize: number
  evictions: number
}

const cacheMetrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  size: 0,
  maxSize: 1000, // Configurable cache size limit
  evictions: 0,
}

// ============================================================================
// CACHE KEY GENERATION
// ============================================================================

/**
 * Generate a stable cache key for block node data
 */
const generateBlockCacheKey = (node: { fields: any }, converterName: string): string => {
  try {
    // Create a deterministic key based on the block data
    const fieldsKey = JSON.stringify(node.fields, Object.keys(node.fields).sort())
    return `${converterName}:${fieldsKey}`
  } catch (error) {
    // Fallback to a less optimal but safe key
    console.warn('[RichText] Failed to generate cache key, using fallback:', error)
    return `${converterName}:${Date.now()}-${Math.random()}`
  }
}

/**
 * Generate cache key with additional context
 */
const generateContextualCacheKey = (
  node: { fields: any },
  converterName: string,
  context?: {
    theme?: string
    locale?: string
    viewport?: string
    userId?: string
  },
): string => {
  const baseKey = generateBlockCacheKey(node, converterName)

  if (!context) return baseKey

  const contextKey = Object.entries(context)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|')

  return contextKey ? `${baseKey}@${contextKey}` : baseKey
}

/**
 * Generate cache key for props-based memoization
 */
const generatePropsCacheKey = (props: Record<string, any>): string => {
  try {
    // Sort keys for consistent hashing
    const sortedProps = Object.keys(props)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = props[key]
          return acc
        },
        {} as Record<string, any>,
      )

    return JSON.stringify(sortedProps)
  } catch (error) {
    console.warn('[RichText] Failed to generate props cache key:', error)
    return `props:${Date.now()}-${Math.random()}`
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Add item to cache with size management
 */
const addToCache = (key: string, element: React.ReactElement): void => {
  // Check if we need to evict items
  if (converterCache.size >= cacheMetrics.maxSize) {
    // Simple LRU: remove the first (oldest) item
    const firstKey = converterCache.keys().next().value
    if (firstKey) {
      converterCache.delete(firstKey)
      cacheMetrics.evictions++
    }
  }

  converterCache.set(key, element)
  cacheMetrics.size = converterCache.size
}

/**
 * Get item from cache
 */
const getFromCache = (key: string): React.ReactElement | undefined => {
  const element = converterCache.get(key)

  if (element) {
    cacheMetrics.hits++
    // Move to end for LRU (re-insert)
    converterCache.delete(key)
    converterCache.set(key, element)
  } else {
    cacheMetrics.misses++
  }

  return element
}

/**
 * Clear cache with optional filter
 */
export const clearConverterCache = (filter?: (key: string) => boolean): void => {
  if (filter) {
    for (const key of converterCache.keys()) {
      if (filter(key)) {
        converterCache.delete(key)
      }
    }
  } else {
    converterCache.clear()
  }

  cacheMetrics.size = converterCache.size
  console.log('[RichText] Converter cache cleared')
}

/**
 * Get cache performance metrics
 */
export const getCacheMetrics = (): CacheMetrics & { hitRate: number } => ({
  ...cacheMetrics,
  hitRate:
    cacheMetrics.hits + cacheMetrics.misses > 0
      ? cacheMetrics.hits / (cacheMetrics.hits + cacheMetrics.misses)
      : 0,
})

/**
 * Configure cache settings
 */
export const configureCacheSettings = (settings: {
  maxSize?: number
  enableMetrics?: boolean
}): void => {
  if (settings.maxSize !== undefined) {
    cacheMetrics.maxSize = settings.maxSize
  }

  console.log('[RichText] Cache settings updated:', settings)
}

// ============================================================================
// MEMOIZED CONVERTER CREATION
// ============================================================================

/**
 * Create a memoized converter function with advanced caching
 */
export const createMemoizedConverter = <T extends Record<string, any>>(
  converter: ({ node }: { node: { fields: T } }) => React.ReactElement,
  converterName: string,
  options: {
    enableCache?: boolean
    contextual?: boolean
    maxAge?: number // Cache TTL in milliseconds
    keyGenerator?: (node: { fields: T }) => string
  } = {},
): (({ node }: { node: { fields: T } }) => React.ReactElement) => {
  const { enableCache = true, contextual = false, maxAge, keyGenerator } = options

  // If caching is disabled, return original converter
  if (!enableCache) {
    return converter
  }

  // Cache for TTL tracking
  const ttlCache = new Map<string, number>()

  return ({ node }: { node: { fields: T } }) => {
    // Generate cache key
    const cacheKey = keyGenerator
      ? `${converterName}:${keyGenerator(node)}`
      : contextual
        ? generateContextualCacheKey(node, converterName)
        : generateBlockCacheKey(node, converterName)

    // Check TTL if configured
    if (maxAge && ttlCache.has(cacheKey)) {
      const timestamp = ttlCache.get(cacheKey)!
      if (Date.now() - timestamp > maxAge) {
        converterCache.delete(cacheKey)
        ttlCache.delete(cacheKey)
      }
    }

    // Try to get from cache
    const cachedElement = getFromCache(cacheKey)
    if (cachedElement) {
      return cachedElement
    }

    // Generate new element
    const element = converter({ node })

    // Add to cache
    addToCache(cacheKey, element)

    // Track TTL if configured
    if (maxAge) {
      ttlCache.set(cacheKey, Date.now())
    }

    return element
  }
}

/**
 * Create a memoized component wrapper
 */
export const createMemoizedComponent = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  compareProps?: (prevProps: T, nextProps: T) => boolean,
): React.ComponentType<T> => {
  // Check if already memoized
  if (componentCache.has(Component)) {
    return componentCache.get(Component)!
  }

  // Create memoized component
  const MemoizedComponent = React.memo(Component, compareProps)

  // Set display name for debugging
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`

  // Cache the memoized component
  componentCache.set(Component, MemoizedComponent)

  return MemoizedComponent
}

/**
 * Deep comparison function for complex props
 */
export const deepCompareProps = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
): boolean => {
  try {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
  } catch (error) {
    console.warn('[RichText] Deep comparison failed, falling back to shallow:', error)
    return shallowCompareProps(prevProps, nextProps)
  }
}

/**
 * Shallow comparison function for simple props
 */
export const shallowCompareProps = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
): boolean => {
  const prevKeys = Object.keys(prevProps)
  const nextKeys = Object.keys(nextProps)

  if (prevKeys.length !== nextKeys.length) {
    return false
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false
    }
  }

  return true
}

/**
 * Smart comparison that chooses between shallow and deep based on prop complexity
 */
export const smartCompareProps = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
): boolean => {
  // Use shallow comparison for simple props
  const hasComplexProps =
    Object.values(prevProps).some((value) => typeof value === 'object' && value !== null) ||
    Object.values(nextProps).some((value) => typeof value === 'object' && value !== null)

  return hasComplexProps
    ? deepCompareProps(prevProps, nextProps)
    : shallowCompareProps(prevProps, nextProps)
}

// ============================================================================
// BLOCK-SPECIFIC MEMOIZATION
// ============================================================================

/**
 * Create memoized converter specifically for block components
 */
export const createMemoizedBlockConverter = <T extends Record<string, any>>(
  Component: React.ComponentType<{ block: T; className?: string }>,
  converterName: string,
  options: {
    compareBlock?: (prevBlock: T, nextBlock: T) => boolean
    enablePropsMemoization?: boolean
    cacheOptions?: Parameters<typeof createMemoizedConverter>[2]
  } = {},
): (({ node }: { node: { fields: T } }) => React.ReactElement) => {
  const {
    compareBlock = smartCompareProps,
    enablePropsMemoization = true,
    cacheOptions = {},
  } = options

  // Create memoized component if enabled
  const FinalComponent = enablePropsMemoization
    ? createMemoizedComponent(Component, (prevProps, nextProps) => {
        // Compare block data
        if (!compareBlock(prevProps.block, nextProps.block)) {
          return false
        }

        // Compare className
        return prevProps.className === nextProps.className
      })
    : Component

  // Create the converter function
  const converter = ({ node }: { node: { fields: T } }) => {
    return React.createElement(FinalComponent, {
      block: node.fields,
      className: undefined, // Will be set by the calling code
    })
  }

  // Apply converter-level memoization
  return createMemoizedConverter(converter, converterName, cacheOptions)
}

// ============================================================================
// CONVERTER REGISTRY MEMOIZATION
// ============================================================================

/**
 * Apply memoization to an entire converter registry
 */
export const memoizeConverterRegistry = (
  converters: BlockConverter,
  options: {
    globalCacheOptions?: Parameters<typeof createMemoizedConverter>[2]
    perConverterOptions?: Record<string, Parameters<typeof createMemoizedConverter>[2]>
    enableComponentMemoization?: boolean
  } = {},
): BlockConverter => {
  const { globalCacheOptions = {}, perConverterOptions = {} } = options

  const memoizedConverters: BlockConverter = {}

  for (const [converterName, converter] of Object.entries(converters)) {
    const cacheOptions = {
      ...globalCacheOptions,
      ...(perConverterOptions[converterName] || {}),
    }

    memoizedConverters[converterName] = createMemoizedConverter(
      // Type assertion to match expected signature
      converter as any,
      converterName,
      cacheOptions,
    )
  }

  return memoizedConverters
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Monitor converter performance
 */
export const createConverterPerformanceMonitor = () => {
  const performanceData = new Map<
    string,
    {
      calls: number
      totalTime: number
      averageTime: number
      lastCall: number
    }
  >()

  const monitor = <T extends any[], R>(
    fn: (...args: T) => R,
    name: string,
  ): ((...args: T) => R) => {
    return (...args: T): R => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      const duration = end - start

      // Update performance data
      const existing = performanceData.get(name) || {
        calls: 0,
        totalTime: 0,
        averageTime: 0,
        lastCall: 0,
      }

      const updated = {
        calls: existing.calls + 1,
        totalTime: existing.totalTime + duration,
        averageTime: (existing.totalTime + duration) / (existing.calls + 1),
        lastCall: Date.now(),
      }

      performanceData.set(name, updated)

      return result
    }
  }

  const getPerformanceData = () => {
    return Object.fromEntries(performanceData.entries())
  }

  const resetPerformanceData = () => {
    performanceData.clear()
  }

  return {
    monitor,
    getPerformanceData,
    resetPerformanceData,
  }
}

// ============================================================================
// CACHE WARMING
// ============================================================================

/**
 * Warm up the cache with common block configurations
 */
export const warmupConverterCache = async (
  converters: BlockConverter,
  commonConfigurations: Array<{
    blockType: string
    fields: any
  }>,
): Promise<void> => {
  console.log('[RichText] Starting cache warmup...')

  const warmupPromises = commonConfigurations.map(async ({ blockType, fields }) => {
    const converter = converters[blockType]
    if (converter) {
      try {
        // Pre-render common configurations
        converter({ node: { fields, type: 'block' } as SerializedBlockNode<AllBlockTypes> })
        console.log(`[RichText] Warmed up cache for ${blockType}`)
      } catch (error) {
        console.warn(`[RichText] Failed to warm up cache for ${blockType}:`, error)
      }
    }
  })

  await Promise.allSettled(warmupPromises)
  console.log('[RichText] Cache warmup completed')
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  generateBlockCacheKey,
  generateContextualCacheKey,
  generatePropsCacheKey,
  addToCache,
  getFromCache,
}

// Performance monitoring instance
export const converterPerformanceMonitor = createConverterPerformanceMonitor()

// Default export
export default {
  createMemoizedConverter,
  createMemoizedComponent,
  createMemoizedBlockConverter,
  memoizeConverterRegistry,
  clearConverterCache,
  getCacheMetrics,
  configureCacheSettings,
  warmupConverterCache,
}
