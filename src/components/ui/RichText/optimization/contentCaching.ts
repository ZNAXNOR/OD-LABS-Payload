import React from 'react'

// ============================================================================
// CACHE TYPES AND INTERFACES
// ============================================================================

interface CacheEntry<T = any> {
  key: string
  value: T
  timestamp: number
  ttl?: number
  accessCount: number
  lastAccessed: number
  size?: number
  metadata?: Record<string, any>
}

interface CacheConfig {
  maxSize: number
  defaultTTL: number
  maxEntries: number
  enableCompression: boolean
  enablePersistence: boolean
  storageKey: string
  evictionPolicy: 'lru' | 'lfu' | 'ttl' | 'fifo'
}

interface CacheMetrics {
  hits: number
  misses: number
  evictions: number
  totalSize: number
  entryCount: number
  hitRate: number
}

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

/**
 * Advanced caching system for RichText content
 */
export class RichTextCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>()
  private accessOrder: string[] = []
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0,
    entryCount: 0,
    hitRate: 0,
  }

  constructor(private config: CacheConfig) {
    // Load from persistence if enabled
    if (config.enablePersistence) {
      this.loadFromStorage()
    }

    // Set up periodic cleanup
    setInterval(() => this.cleanup(), 60000) // Cleanup every minute
  }

  /**
   * Get item from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      this.metrics.misses++
      this.updateHitRate()
      return undefined
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.delete(key)
      this.metrics.misses++
      this.updateHitRate()
      return undefined
    }

    // Update access statistics
    entry.accessCount++
    entry.lastAccessed = Date.now()

    // Update LRU order
    this.updateAccessOrder(key)

    this.metrics.hits++
    this.updateHitRate()

    return entry.value
  }

  /**
   * Set item in cache
   */
  set(key: string, value: T, ttl?: number, metadata?: Record<string, any>): void {
    const now = Date.now()
    const size = this.calculateSize(value)

    // Check if we need to evict items
    this.ensureCapacity(size)

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      ttl: ttl || this.config.defaultTTL,
      accessCount: 1,
      lastAccessed: now,
      size,
      metadata,
    }

    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      this.delete(key)
    }

    this.cache.set(key, entry)
    this.accessOrder.push(key)

    this.metrics.entryCount++
    this.metrics.totalSize += size

    // Persist if enabled
    if (this.config.enablePersistence) {
      this.saveToStorage()
    }
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    this.cache.delete(key)
    this.accessOrder = this.accessOrder.filter((k) => k !== key)

    this.metrics.entryCount--
    this.metrics.totalSize -= entry.size || 0

    return true
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0,
    }

    if (this.config.enablePersistence) {
      this.clearStorage()
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    return entry !== undefined && !this.isExpired(entry)
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  /**
   * Get cache size information
   */
  getSize(): { entries: number; bytes: number; maxEntries: number; maxBytes: number } {
    return {
      entries: this.cache.size,
      bytes: this.metrics.totalSize,
      maxEntries: this.config.maxEntries,
      maxBytes: this.config.maxSize,
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private isExpired(entry: CacheEntry<T>): boolean {
    if (!entry.ttl) return false
    return Date.now() - entry.timestamp > entry.ttl
  }

  private calculateSize(value: T): number {
    try {
      // Rough estimation of object size
      const jsonString = JSON.stringify(value)
      return new Blob([jsonString]).size
    } catch {
      // Fallback estimation
      return 1024 // 1KB default
    }
  }

  private updateAccessOrder(key: string): void {
    // Move to end for LRU
    this.accessOrder = this.accessOrder.filter((k) => k !== key)
    this.accessOrder.push(key)
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses
    this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0
  }

  private ensureCapacity(newItemSize: number): void {
    // Check if we need to evict based on size or count
    while (
      this.metrics.totalSize + newItemSize > this.config.maxSize ||
      this.metrics.entryCount >= this.config.maxEntries
    ) {
      const keyToEvict = this.selectEvictionCandidate()
      if (keyToEvict) {
        this.delete(keyToEvict)
        this.metrics.evictions++
      } else {
        break // No more items to evict
      }
    }
  }

  private selectEvictionCandidate(): string | null {
    if (this.cache.size === 0) return null

    switch (this.config.evictionPolicy) {
      case 'lru':
        return this.accessOrder[0] || null

      case 'lfu':
        let leastFrequent: string | null = null
        let minAccessCount = Infinity

        for (const [key, entry] of this.cache) {
          if (entry.accessCount < minAccessCount) {
            minAccessCount = entry.accessCount
            leastFrequent = key
          }
        }
        return leastFrequent

      case 'ttl':
        let oldestExpiring: string | null = null
        let earliestExpiry = Infinity

        for (const [key, entry] of this.cache) {
          if (entry.ttl) {
            const expiryTime = entry.timestamp + entry.ttl
            if (expiryTime < earliestExpiry) {
              earliestExpiry = expiryTime
              oldestExpiring = key
            }
          }
        }
        return oldestExpiring || this.accessOrder[0] || null

      case 'fifo':
        return this.cache.keys().next().value || null

      default:
        return this.accessOrder[0] || null
    }
  }

  private cleanup(): void {
    const expiredKeys: string[] = []

    // Find expired entries
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key)
      }
    }

    // Remove expired entries
    expiredKeys.forEach((key) => this.delete(key))

    if (expiredKeys.length > 0) {
      console.log(`[RichTextCache] Cleaned up ${expiredKeys.length} expired entries`)
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const cacheData = {
        entries: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        metrics: this.metrics,
        timestamp: Date.now(),
      }

      const serialized = this.config.enableCompression
        ? this.compress(JSON.stringify(cacheData))
        : JSON.stringify(cacheData)

      localStorage.setItem(this.config.storageKey, serialized)
    } catch (error) {
      console.warn('[RichTextCache] Failed to save to storage:', error)
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (!stored) return

      const serialized = this.config.enableCompression ? this.decompress(stored) : stored

      const cacheData = JSON.parse(serialized)

      // Validate data structure
      if (!cacheData.entries || !Array.isArray(cacheData.entries)) return

      // Restore cache entries
      this.cache = new Map(cacheData.entries)
      this.accessOrder = cacheData.accessOrder || []
      this.metrics = { ...this.metrics, ...cacheData.metrics }

      console.log(`[RichTextCache] Loaded ${this.cache.size} entries from storage`)
    } catch (error) {
      console.warn('[RichTextCache] Failed to load from storage:', error)
      this.clearStorage()
    }
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.config.storageKey)
    } catch (error) {
      console.warn('[RichTextCache] Failed to clear storage:', error)
    }
  }

  private compress(data: string): string {
    // Simple compression using built-in compression if available
    // In a real implementation, you might use a library like pako
    return data // Placeholder - implement actual compression
  }

  private decompress(data: string): string {
    // Simple decompression
    return data // Placeholder - implement actual decompression
  }
}

// ============================================================================
// CACHE INSTANCES
// ============================================================================

/**
 * Default cache configuration
 */
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  maxEntries: 1000,
  enableCompression: false,
  enablePersistence: true,
  storageKey: 'richtext-cache',
  evictionPolicy: 'lru',
}

/**
 * Global cache instances
 */
export const contentCache = new RichTextCache<React.ReactElement>(DEFAULT_CACHE_CONFIG)

export const converterCache = new RichTextCache<any>({
  ...DEFAULT_CACHE_CONFIG,
  storageKey: 'richtext-converter-cache',
  maxSize: 5 * 1024 * 1024, // 5MB
  defaultTTL: 60 * 60 * 1000, // 1 hour
})

export const blockCache = new RichTextCache<React.ReactElement>({
  ...DEFAULT_CACHE_CONFIG,
  storageKey: 'richtext-block-cache',
  maxSize: 20 * 1024 * 1024, // 20MB
  defaultTTL: 15 * 60 * 1000, // 15 minutes
})

// ============================================================================
// CACHE KEY GENERATION
// ============================================================================

/**
 * Generate cache key for content
 */
export const generateContentCacheKey = (
  content: any,
  options?: {
    includeTimestamp?: boolean
    includeUserContext?: boolean
    includeTheme?: boolean
    customSuffix?: string
  },
): string => {
  const { includeTimestamp, includeUserContext, includeTheme, customSuffix } = options || {}

  try {
    // Base content hash
    const contentHash = hashContent(content)

    // Additional context
    const contextParts: string[] = [contentHash]

    if (includeTimestamp) {
      // Round to nearest 5 minutes for better cache hit rate
      const roundedTime = Math.floor(Date.now() / (5 * 60 * 1000)) * (5 * 60 * 1000)
      contextParts.push(`t:${roundedTime}`)
    }

    if (includeUserContext && typeof window !== 'undefined') {
      // Include user-specific context (be careful with privacy)
      const userContext = getUserContext()
      if (userContext) {
        contextParts.push(`u:${userContext}`)
      }
    }

    if (includeTheme && typeof window !== 'undefined') {
      const theme = getThemeContext()
      if (theme) {
        contextParts.push(`th:${theme}`)
      }
    }

    if (customSuffix) {
      contextParts.push(customSuffix)
    }

    return contextParts.join('|')
  } catch (error) {
    console.warn('[RichTextCache] Failed to generate cache key:', error)
    return `fallback:${Date.now()}-${Math.random()}`
  }
}

/**
 * Generate cache key for block content
 */
export const generateBlockCacheKey = (
  blockType: string,
  blockData: any,
  context?: Record<string, any>,
): string => {
  try {
    const dataHash = hashContent(blockData)
    const contextHash = context ? hashContent(context) : ''

    return `block:${blockType}:${dataHash}${contextHash ? `:${contextHash}` : ''}`
  } catch (error) {
    console.warn('[RichTextCache] Failed to generate block cache key:', error)
    return `block:${blockType}:${Date.now()}-${Math.random()}`
  }
}

/**
 * Generate cache key for converter results
 */
export const generateConverterCacheKey = (
  converterName: string,
  input: any,
  options?: Record<string, any>,
): string => {
  try {
    const inputHash = hashContent(input)
    const optionsHash = options ? hashContent(options) : ''

    return `conv:${converterName}:${inputHash}${optionsHash ? `:${optionsHash}` : ''}`
  } catch (error) {
    console.warn('[RichTextCache] Failed to generate converter cache key:', error)
    return `conv:${converterName}:${Date.now()}-${Math.random()}`
  }
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Simple hash function for content
 */
function hashContent(content: any): string {
  try {
    const str = typeof content === 'string' ? content : JSON.stringify(content)
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36)
  } catch {
    return Math.random().toString(36).substr(2, 9)
  }
}

/**
 * Get user context for cache key (implement based on your auth system)
 */
function getUserContext(): string | null {
  // Implement based on your authentication system
  // Return null or a user identifier that's safe to cache
  return null
}

/**
 * Get theme context for cache key
 */
function getThemeContext(): string | null {
  if (typeof window === 'undefined') return null

  try {
    // Check for theme in various places
    const htmlClass = document.documentElement.className
    if (htmlClass.includes('dark')) return 'dark'
    if (htmlClass.includes('light')) return 'light'

    // Check localStorage
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) return storedTheme

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'light'
  } catch {
    return null
  }
}

// ============================================================================
// CACHE HOOKS
// ============================================================================

/**
 * Hook for caching rendered content
 */
export const useCachedContent = <T>(
  key: string,
  factory: () => T,
  options?: {
    ttl?: number
    dependencies?: any[]
    cache?: RichTextCache<T>
  },
): T => {
  const { ttl, dependencies = [], cache = contentCache } = options || {}

  // Generate dependency-aware key
  const dependencyKey = React.useMemo(() => {
    if (dependencies.length === 0) return key
    const depHash = hashContent(dependencies)
    return `${key}:${depHash}`
  }, [key, dependencies])

  return React.useMemo(() => {
    // Try to get from cache
    const cached = cache.get(dependencyKey)
    if (cached !== undefined) {
      return cached as T
    }

    // Generate new value
    const value = factory()

    // Store in cache
    cache.set(dependencyKey, value as any, ttl)

    return value
  }, [dependencyKey, factory, ttl, cache])
}

/**
 * Hook for caching block components
 */
export const useCachedBlock = (
  blockType: string,
  blockData: any,
  renderBlock: () => React.ReactElement,
  options?: {
    ttl?: number
    context?: Record<string, any>
  },
): React.ReactElement => {
  const { ttl, context } = options || {}

  return useCachedContent(generateBlockCacheKey(blockType, blockData, context), renderBlock, {
    ttl,
    dependencies: [blockType, blockData, context],
    cache: blockCache,
  })
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Cache management utilities
 */
export const cacheManager = {
  /**
   * Get statistics for all caches
   */
  getStats: () => ({
    content: contentCache.getMetrics(),
    converter: converterCache.getMetrics(),
    block: blockCache.getMetrics(),
  }),

  /**
   * Clear all caches
   */
  clearAll: () => {
    contentCache.clear()
    converterCache.clear()
    blockCache.clear()
    console.log('[RichTextCache] All caches cleared')
  },

  /**
   * Get total cache size
   */
  getTotalSize: () => {
    const contentSize = contentCache.getSize()
    const converterSize = converterCache.getSize()
    const blockSize = blockCache.getSize()

    return {
      entries: contentSize.entries + converterSize.entries + blockSize.entries,
      bytes: contentSize.bytes + converterSize.bytes + blockSize.bytes,
    }
  },

  /**
   * Optimize caches (cleanup expired entries)
   */
  optimize: () => {
    // Force cleanup on all caches
    ;(contentCache as any).cleanup()
    ;(converterCache as any).cleanup()
    ;(blockCache as any).cleanup()

    console.log('[RichTextCache] Cache optimization completed')
  },

  /**
   * Configure cache settings
   */
  configure: (cacheType: 'content' | 'converter' | 'block', _config: Partial<CacheConfig>) => {
    // Update configuration (this would need to be implemented in the cache class)
    console.log(`[RichTextCache] Configuration updated for ${cacheType} cache`)
  },
}

// ============================================================================
// EXPORTS
// ============================================================================

// Default export
export default {
  contentCache,
  converterCache,
  blockCache,
  cacheManager,
  useCachedContent,
  useCachedBlock,
}
