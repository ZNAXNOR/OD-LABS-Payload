/**
 * Caching utilities for performance optimization
 */

import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, dirname } from 'path'

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
  persistToDisk?: boolean
  cacheDir?: string
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  hash: string
}

export class AnalysisCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 60 * 60 * 1000, // 1 hour default
      maxSize: options.maxSize || 1000,
      persistToDisk: options.persistToDisk || false,
      cacheDir: options.cacheDir || '.cache/analysis',
    }

    if (this.options.persistToDisk) {
      this.ensureCacheDir()
      this.loadFromDisk()
    }
  }

  /**
   * Get cached value by key
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(key)
      this.deleteFromDisk(key)
      return null
    }

    return entry.value
  }

  /**
   * Set cached value with optional content hash for invalidation
   */
  set(key: string, value: T, contentHash?: string): void {
    const hash = contentHash || this.generateHash(JSON.stringify(value))
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      hash,
    }

    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.getOldestKey()
      if (oldestKey) {
        this.cache.delete(oldestKey)
        this.deleteFromDisk(oldestKey)
      }
    }

    this.cache.set(key, entry)

    if (this.options.persistToDisk) {
      this.saveToDisk(key, entry)
    }
  }

  /**
   * Check if cached value is still valid based on file modification time
   */
  isValidForFile(key: string, filePath: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }

    try {
      const stats = statSync(filePath)
      const fileModTime = stats.mtime.getTime()
      return entry.timestamp > fileModTime
    } catch {
      return false
    }
  }

  /**
   * Get or compute cached value
   */
  async getOrCompute<R extends T>(
    key: string,
    computeFn: () => Promise<R>,
    contentHash?: string,
  ): Promise<R> {
    const cached = this.get(key)
    if (cached !== null) {
      return cached as R
    }

    const computed = await computeFn()
    this.set(key, computed, contentHash)
    return computed
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
    if (this.options.persistToDisk) {
      this.clearDisk()
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    hitRate: number
    memoryUsage: number
  } {
    return {
      size: this.cache.size,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0,
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  private hitCount = 0
  private missCount = 0

  private generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex')
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  private ensureCacheDir(): void {
    if (!existsSync(this.options.cacheDir)) {
      mkdirSync(this.options.cacheDir, { recursive: true })
    }
  }

  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_')
    return join(this.options.cacheDir, `${safeKey}.json`)
  }

  private saveToDisk(key: string, entry: CacheEntry<T>): void {
    try {
      const filePath = this.getCacheFilePath(key)
      const dir = dirname(filePath)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
      writeFileSync(filePath, JSON.stringify(entry))
    } catch (error) {
      console.warn(`Failed to save cache entry to disk: ${error}`)
    }
  }

  private loadFromDisk(): void {
    try {
      if (!existsSync(this.options.cacheDir)) {
        return
      }

      const fs = require('fs')
      const files = fs.readdirSync(this.options.cacheDir)

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = join(this.options.cacheDir, file)
            const content = readFileSync(filePath, 'utf-8')
            const entry: CacheEntry<T> = JSON.parse(content)

            // Check if entry is still valid
            if (Date.now() - entry.timestamp <= this.options.ttl) {
              const key = file.replace('.json', '').replace(/_/g, '/')
              this.cache.set(key, entry)
            } else {
              // Remove expired entry
              fs.unlinkSync(filePath)
            }
          } catch (error) {
            console.warn(`Failed to load cache entry ${file}: ${error}`)
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load cache from disk: ${error}`)
    }
  }

  private deleteFromDisk(key: string): void {
    if (!this.options.persistToDisk) {
      return
    }

    try {
      const filePath = this.getCacheFilePath(key)
      if (existsSync(filePath)) {
        const fs = require('fs')
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.warn(`Failed to delete cache entry from disk: ${error}`)
    }
  }

  private clearDisk(): void {
    try {
      if (existsSync(this.options.cacheDir)) {
        const fs = require('fs')
        const files = fs.readdirSync(this.options.cacheDir)
        for (const file of files) {
          if (file.endsWith('.json')) {
            fs.unlinkSync(join(this.options.cacheDir, file))
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to clear disk cache: ${error}`)
    }
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry).length * 2 // Rough estimate (UTF-16)
    }
    return totalSize
  }
}

/**
 * File-based cache that automatically invalidates when source files change
 */
export class FileCache<T> extends AnalysisCache<T> {
  /**
   * Get cached value if file hasn't changed since caching
   */
  getForFile(filePath: string): T | null {
    const key = this.getFileKey(filePath)
    if (!this.isValidForFile(key, filePath)) {
      return null
    }
    return this.get(key)
  }

  /**
   * Set cached value for a file
   */
  setForFile(filePath: string, value: T): void {
    const key = this.getFileKey(filePath)
    const fileHash = this.getFileHash(filePath)
    this.set(key, value, fileHash)
  }

  /**
   * Get or compute cached value for a file
   */
  async getOrComputeForFile<R extends T>(
    filePath: string,
    computeFn: () => Promise<R>,
  ): Promise<R> {
    const cached = this.getForFile(filePath)
    if (cached !== null) {
      return cached as R
    }

    const computed = await computeFn()
    this.setForFile(filePath, computed)
    return computed
  }

  private getFileKey(filePath: string): string {
    return `file:${filePath}`
  }

  private getFileHash(filePath: string): string {
    try {
      const stats = statSync(filePath)
      return `${stats.mtime.getTime()}-${stats.size}`
    } catch {
      return Date.now().toString()
    }
  }
}

// Global cache instances
export const blockConfigCache = new FileCache<any>({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 500,
  persistToDisk: true,
  cacheDir: '.cache/blocks',
})

export const componentCache = new FileCache<any>({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 500,
  persistToDisk: true,
  cacheDir: '.cache/components',
})

export const patternCache = new AnalysisCache<any>({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 100,
  persistToDisk: true,
  cacheDir: '.cache/patterns',
})

export const astCache = new FileCache<any>({
  ttl: 60 * 60 * 1000, // 1 hour
  maxSize: 200,
  persistToDisk: true,
  cacheDir: '.cache/ast',
})
