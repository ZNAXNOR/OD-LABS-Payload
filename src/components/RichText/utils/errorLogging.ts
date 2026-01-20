/**
 * Error logging and monitoring utilities for RichText components
 * Provides comprehensive error tracking, reporting, and analytics
 */

import React from 'react'

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Error categories
export type ErrorCategory =
  | 'rendering'
  | 'security'
  | 'performance'
  | 'accessibility'
  | 'validation'
  | 'network'
  | 'user_interaction'
  | 'configuration'
  | 'unknown'

// Error context information
export interface ErrorContext {
  componentName: string
  blockType?: string
  userId?: string
  sessionId?: string
  timestamp: number
  url: string
  userAgent: string
  viewport: {
    width: number
    height: number
  }
  performance?: {
    memory?: number
    renderTime?: number
    loadTime?: number
  }
  additionalData?: Record<string, any>
}

// Error log entry
export interface ErrorLogEntry {
  id: string
  severity: ErrorSeverity
  category: ErrorCategory
  message: string
  stack?: string
  context: ErrorContext
  resolved: boolean
  reportedAt: number
  resolvedAt?: number
  occurrenceCount: number
  lastOccurrence: number
}

// Error reporting configuration
export interface ErrorReportingConfig {
  enabled: boolean
  endpoint?: string
  apiKey?: string
  maxRetries: number
  retryDelay: number
  batchSize: number
  flushInterval: number
  enableLocalStorage: boolean
  enableConsoleLogging: boolean
  enableAnalytics: boolean
  severityThreshold: ErrorSeverity
  categories: ErrorCategory[]
  excludePatterns: RegExp[]
  includeStackTrace: boolean
  includeUserAgent: boolean
  includePerformanceData: boolean
  onError?: (entry: ErrorLogEntry) => void
  onBatch?: (entries: ErrorLogEntry[]) => void
}

// Default configuration
const defaultConfig: ErrorReportingConfig = {
  enabled: process.env.NODE_ENV === 'production',
  maxRetries: 3,
  retryDelay: 1000,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  enableLocalStorage: true,
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  severityThreshold: 'medium',
  categories: [
    'rendering',
    'security',
    'performance',
    'accessibility',
    'validation',
    'network',
    'user_interaction',
    'configuration',
  ],
  excludePatterns: [
    /Script error/i,
    /Non-Error promise rejection captured/i,
    /ResizeObserver loop limit exceeded/i,
  ],
  includeStackTrace: true,
  includeUserAgent: true,
  includePerformanceData: true,
}

/**
 * Error logging and monitoring manager
 */
export class ErrorLogger {
  private config: ErrorReportingConfig
  private errorQueue: ErrorLogEntry[] = []
  private errorCache: Map<string, ErrorLogEntry> = new Map()
  private flushTimer: NodeJS.Timeout | null = null
  private retryQueue: ErrorLogEntry[] = []
  private sessionId: string

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.sessionId = this.generateSessionId()

    if (this.config.enabled) {
      this.initializeErrorHandling()
      this.startFlushTimer()
      this.loadFromLocalStorage()
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `richtext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Initialize global error handling
   */
  private initializeErrorHandling() {
    if (typeof window === 'undefined') return

    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      this.logError({
        severity: 'high',
        category: 'unknown',
        message: event.message,
        stack: event.error?.stack,
        context: this.createErrorContext('window', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }),
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        severity: 'medium',
        category: 'unknown',
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: this.createErrorContext('promise'),
      })
    })
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Create error context
   */
  private createErrorContext(
    componentName: string,
    additionalData?: Record<string, any>,
  ): ErrorContext {
    const context: ErrorContext = {
      componentName,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      },
    }

    // Add performance data if enabled
    if (this.config.includePerformanceData && typeof performance !== 'undefined') {
      context.performance = {
        memory: (performance as any).memory?.usedJSHeapSize,
        renderTime: performance.now(),
      }
    }

    // Add additional data
    if (additionalData) {
      context.additionalData = additionalData
    }

    return context
  }

  /**
   * Log an error
   */
  logError(params: {
    severity: ErrorSeverity
    category: ErrorCategory
    message: string
    stack?: string
    context: ErrorContext
    blockType?: string
    userId?: string
  }) {
    const { severity, category, message, stack, context, blockType, userId } = params

    // Check if error should be logged
    if (!this.shouldLogError(severity, category, message)) {
      return
    }

    // Create error ID for deduplication
    const errorId = this.createErrorId(message, stack, context.componentName)

    // Check if error already exists
    const existingError = this.errorCache.get(errorId)
    if (existingError) {
      // Update existing error
      existingError.occurrenceCount++
      existingError.lastOccurrence = Date.now()
      this.errorCache.set(errorId, existingError)
    } else {
      // Create new error entry
      const errorEntry: ErrorLogEntry = {
        id: errorId,
        severity,
        category,
        message,
        stack: this.config.includeStackTrace ? stack : undefined,
        context: {
          ...context,
          blockType,
          userId,
          userAgent: this.config.includeUserAgent ? context.userAgent : '',
        },
        resolved: false,
        reportedAt: Date.now(),
        occurrenceCount: 1,
        lastOccurrence: Date.now(),
      }

      this.errorCache.set(errorId, errorEntry)
      this.errorQueue.push(errorEntry)

      // Log to console if enabled
      if (this.config.enableConsoleLogging) {
        this.logToConsole(errorEntry)
      }

      // Call error handler if provided
      if (this.config.onError) {
        this.config.onError(errorEntry)
      }

      // Flush immediately for critical errors
      if (severity === 'critical') {
        this.flush()
      }
    }

    // Save to local storage if enabled
    if (this.config.enableLocalStorage) {
      this.saveToLocalStorage()
    }
  }

  /**
   * Check if error should be logged
   */
  private shouldLogError(
    severity: ErrorSeverity,
    category: ErrorCategory,
    message: string,
  ): boolean {
    // Check if logging is enabled
    if (!this.config.enabled) {
      return false
    }

    // Check severity threshold
    const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 }
    if (severityLevels[severity] < severityLevels[this.config.severityThreshold]) {
      return false
    }

    // Check category filter
    if (!this.config.categories.includes(category)) {
      return false
    }

    // Check exclude patterns
    for (const pattern of this.config.excludePatterns) {
      if (pattern.test(message)) {
        return false
      }
    }

    return true
  }

  /**
   * Create error ID for deduplication
   */
  private createErrorId(message: string, stack?: string, componentName?: string): string {
    const content = `${message}-${componentName}-${stack?.split('\n')[0] || ''}`
    return btoa(content)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, 16)
  }

  /**
   * Log to console
   */
  private logToConsole(entry: ErrorLogEntry) {
    const logLevel = entry.severity === 'critical' || entry.severity === 'high' ? 'error' : 'warn'

    console.group(`[RichText Error] ${entry.category} - ${entry.severity}`)
    console[logLevel](entry.message)

    if (entry.stack) {
      console.error('Stack trace:', entry.stack)
    }

    console.log('Context:', entry.context)
    console.log('Occurrences:', entry.occurrenceCount)
    console.groupEnd()
  }

  /**
   * Flush error queue
   */
  async flush() {
    if (this.errorQueue.length === 0 && this.retryQueue.length === 0) {
      return
    }

    const batch = [...this.errorQueue, ...this.retryQueue].slice(0, this.config.batchSize)
    this.errorQueue = this.errorQueue.slice(batch.length)
    this.retryQueue = []

    if (batch.length === 0) {
      return
    }

    // Call batch handler if provided
    if (this.config.onBatch) {
      this.config.onBatch(batch)
    }

    // Send to analytics if enabled
    if (this.config.enableAnalytics) {
      this.sendToAnalytics(batch)
    }

    // Send to endpoint if configured
    if (this.config.endpoint) {
      try {
        await this.sendToEndpoint(batch)
      } catch (error) {
        console.warn('[ErrorLogger] Failed to send errors to endpoint:', error)
        // Add failed entries to retry queue
        this.retryQueue.push(...batch)
      }
    }
  }

  /**
   * Send errors to analytics service
   */
  private sendToAnalytics(entries: ErrorLogEntry[]) {
    if (typeof window === 'undefined') return

    entries.forEach((entry) => {
      // Google Analytics 4
      if ((window as any).gtag) {
        ;(window as any).gtag('event', 'richtext_error', {
          event_category: 'error',
          event_label: entry.category,
          custom_map: {
            severity: entry.severity,
            component: entry.context.componentName,
            blockType: entry.context.blockType,
            occurrences: entry.occurrenceCount,
          },
        })
      }

      // Custom analytics
      if ((window as any).analytics) {
        ;(window as any).analytics.track('RichText Error', {
          severity: entry.severity,
          category: entry.category,
          component: entry.context.componentName,
          blockType: entry.context.blockType,
          message: entry.message,
          occurrences: entry.occurrenceCount,
          sessionId: entry.context.sessionId,
        })
      }
    })
  }

  /**
   * Send errors to endpoint
   */
  private async sendToEndpoint(entries: ErrorLogEntry[]) {
    if (!this.config.endpoint) return

    const payload = {
      errors: entries.map((entry) => ({
        ...entry,
        // Remove sensitive data
        context: {
          ...entry.context,
          userAgent: this.config.includeUserAgent ? entry.context.userAgent : undefined,
        },
      })),
      sessionId: this.sessionId,
      timestamp: Date.now(),
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  /**
   * Save errors to local storage
   */
  private saveToLocalStorage() {
    if (typeof localStorage === 'undefined') return

    try {
      const errors = Array.from(this.errorCache.values())
      localStorage.setItem('richtext-errors', JSON.stringify(errors))
    } catch (error) {
      console.warn('[ErrorLogger] Failed to save to localStorage:', error)
    }
  }

  /**
   * Load errors from local storage
   */
  private loadFromLocalStorage() {
    if (typeof localStorage === 'undefined') return

    try {
      const stored = localStorage.getItem('richtext-errors')
      if (stored) {
        const errors: ErrorLogEntry[] = JSON.parse(stored)
        errors.forEach((error) => {
          this.errorCache.set(error.id, error)
        })
      }
    } catch (error) {
      console.warn('[ErrorLogger] Failed to load from localStorage:', error)
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errors = Array.from(this.errorCache.values())

    const stats = {
      total: errors.length,
      unresolved: errors.filter((e) => !e.resolved).length,
      bySeverity: {
        low: errors.filter((e) => e.severity === 'low').length,
        medium: errors.filter((e) => e.severity === 'medium').length,
        high: errors.filter((e) => e.severity === 'high').length,
        critical: errors.filter((e) => e.severity === 'critical').length,
      },
      byCategory: {} as Record<ErrorCategory, number>,
      byComponent: {} as Record<string, number>,
      recentErrors: errors.filter((e) => Date.now() - e.lastOccurrence < 24 * 60 * 60 * 1000) // Last 24 hours
        .length,
    }

    // Count by category
    this.config.categories.forEach((category) => {
      stats.byCategory[category] = errors.filter((e) => e.category === category).length
    })

    // Count by component
    errors.forEach((error) => {
      const component = error.context.componentName
      stats.byComponent[component] = (stats.byComponent[component] || 0) + 1
    })

    return stats
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errorCache.clear()
    this.errorQueue = []
    this.retryQueue = []

    if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
      localStorage.removeItem('richtext-errors')
    }
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string) {
    const error = this.errorCache.get(errorId)
    if (error) {
      error.resolved = true
      error.resolvedAt = Date.now()
      this.errorCache.set(errorId, error)
      this.saveToLocalStorage()
    }
  }

  /**
   * Get all errors
   */
  getAllErrors(): ErrorLogEntry[] {
    return Array.from(this.errorCache.values())
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): ErrorLogEntry[] {
    return Array.from(this.errorCache.values()).filter((e) => e.category === category)
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return Array.from(this.errorCache.values()).filter((e) => e.severity === severity)
  }

  /**
   * Destroy the error logger
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    // Final flush
    this.flush()
  }
}

// Global error logger instance
let globalErrorLogger: ErrorLogger | null = null

/**
 * Get or create global error logger
 */
export const getErrorLogger = (config?: Partial<ErrorReportingConfig>): ErrorLogger => {
  if (!globalErrorLogger) {
    globalErrorLogger = new ErrorLogger(config)
  }
  return globalErrorLogger
}

/**
 * Log error helper function
 */
export const logRichTextError = (params: {
  severity: ErrorSeverity
  category: ErrorCategory
  message: string
  error?: Error
  componentName: string
  blockType?: string
  userId?: string
  additionalData?: Record<string, any>
}) => {
  const logger = getErrorLogger()
  const context = logger['createErrorContext'](params.componentName, params.additionalData)

  logger.logError({
    severity: params.severity,
    category: params.category,
    message: params.message,
    stack: params.error?.stack,
    context,
    blockType: params.blockType,
    userId: params.userId,
  })
}

/**
 * Error boundary integration
 */
export const createErrorBoundaryLogger = (componentName: string, blockType?: string) => {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    logRichTextError({
      severity: 'high',
      category: 'rendering',
      message: error.message,
      error,
      componentName,
      blockType,
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    })
  }
}

/**
 * Performance monitoring integration
 */
export const logPerformanceIssue = (params: {
  componentName: string
  blockType?: string
  metric: string
  value: number
  threshold: number
  additionalData?: Record<string, any>
}) => {
  const severity: ErrorSeverity = params.value > params.threshold * 2 ? 'high' : 'medium'

  logRichTextError({
    severity,
    category: 'performance',
    message: `Performance issue: ${params.metric} (${params.value}ms) exceeded threshold (${params.threshold}ms)`,
    componentName: params.componentName,
    blockType: params.blockType,
    additionalData: {
      metric: params.metric,
      value: params.value,
      threshold: params.threshold,
      ...params.additionalData,
    },
  })
}

/**
 * Security issue logging
 */
export const logSecurityIssue = (params: {
  componentName: string
  blockType?: string
  threatType: string
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  blockedContent?: string
  additionalData?: Record<string, any>
}) => {
  logRichTextError({
    severity: params.threatLevel,
    category: 'security',
    message: `Security threat detected: ${params.threatType}`,
    componentName: params.componentName,
    blockType: params.blockType,
    additionalData: {
      threatType: params.threatType,
      threatLevel: params.threatLevel,
      blockedContent: params.blockedContent?.substring(0, 100), // Limit sensitive data
      ...params.additionalData,
    },
  })
}

/**
 * Accessibility issue logging
 */
export const logAccessibilityIssue = (params: {
  componentName: string
  blockType?: string
  issueType: string
  severity: ErrorSeverity
  element?: string
  recommendation?: string
  additionalData?: Record<string, any>
}) => {
  logRichTextError({
    severity: params.severity,
    category: 'accessibility',
    message: `Accessibility issue: ${params.issueType}`,
    componentName: params.componentName,
    blockType: params.blockType,
    additionalData: {
      issueType: params.issueType,
      element: params.element,
      recommendation: params.recommendation,
      ...params.additionalData,
    },
  })
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (globalErrorLogger) {
      globalErrorLogger.destroy()
    }
  })
}
