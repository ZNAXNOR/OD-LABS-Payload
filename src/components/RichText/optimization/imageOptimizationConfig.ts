/**
 * Image Optimization Configuration
 *
 * This module provides configuration utilities for optimizing image loading
 * and rendering in the RichText editor and components.
 */

import React from 'react'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImageOptimizationConfig {
  // Loading strategies
  defaultLoadingStrategy: 'lazy' | 'eager' | 'progressive' | 'intersection'
  criticalImageStrategy: 'eager' | 'preload'

  // Format preferences
  enableWebP: boolean
  enableAVIF: boolean
  fallbackFormat: 'jpeg' | 'png'

  // Quality settings
  defaultQuality: number
  criticalImageQuality: number
  lowBandwidthQuality: number
  highBandwidthQuality: number

  // Responsive settings
  breakpoints: Record<string, number>
  devicePixelRatioThreshold: number

  // Performance settings
  enableBlurPlaceholder: boolean
  enableIntersectionObserver: boolean
  enableBandwidthDetection: boolean
  enablePerformanceMonitoring: boolean

  // Preloading settings
  enablePreload: boolean
  preloadCriticalImages: boolean
  maxPreloadImages: number

  // Error handling
  enableRetry: boolean
  maxRetries: number
  retryDelay: number

  // Caching
  enableCaching: boolean
  cacheMaxAge: number

  // Progressive loading
  enableProgressiveLoading: boolean
  progressiveQualitySteps: number[]

  // Lazy loading
  intersectionThreshold: number
  intersectionRootMargin: string

  // File size limits
  maxFileSize: number
  warnFileSize: number

  // Dimension limits
  maxWidth: number
  maxHeight: number

  // Development settings
  enableDebugMode: boolean
  logPerformanceMetrics: boolean
}

export interface ResponsiveImageConfig {
  breakpoint: string
  width: number
  quality?: number
  format?: string
}

export interface ImageOptimizationPreset {
  name: string
  description: string
  config: Partial<ImageOptimizationConfig>
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_IMAGE_OPTIMIZATION_CONFIG: ImageOptimizationConfig = {
  // Loading strategies
  defaultLoadingStrategy: 'intersection',
  criticalImageStrategy: 'eager',

  // Format preferences
  enableWebP: true,
  enableAVIF: false,
  fallbackFormat: 'jpeg',

  // Quality settings
  defaultQuality: 85,
  criticalImageQuality: 90,
  lowBandwidthQuality: 60,
  highBandwidthQuality: 90,

  // Responsive settings
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
    ultrawide: 1920,
  },
  devicePixelRatioThreshold: 2,

  // Performance settings
  enableBlurPlaceholder: true,
  enableIntersectionObserver: true,
  enableBandwidthDetection: true,
  enablePerformanceMonitoring: true,

  // Preloading settings
  enablePreload: true,
  preloadCriticalImages: true,
  maxPreloadImages: 3,

  // Error handling
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,

  // Caching
  enableCaching: true,
  cacheMaxAge: 31536000, // 1 year

  // Progressive loading
  enableProgressiveLoading: false,
  progressiveQualitySteps: [20, 40, 60, 85],

  // Lazy loading
  intersectionThreshold: 0.1,
  intersectionRootMargin: '50px',

  // File size limits
  maxFileSize: 5 * 1024 * 1024, // 5MB
  warnFileSize: 1 * 1024 * 1024, // 1MB

  // Dimension limits
  maxWidth: 1920,
  maxHeight: 1080,

  // Development settings
  enableDebugMode: process.env.NODE_ENV === 'development',
  logPerformanceMetrics: process.env.NODE_ENV === 'development',
}

// ============================================================================
// OPTIMIZATION PRESETS
// ============================================================================

export const IMAGE_OPTIMIZATION_PRESETS: ImageOptimizationPreset[] = [
  {
    name: 'performance',
    description: 'Optimized for maximum performance and fast loading',
    config: {
      defaultLoadingStrategy: 'intersection',
      enableWebP: true,
      enableAVIF: true,
      defaultQuality: 75,
      lowBandwidthQuality: 50,
      enableBlurPlaceholder: true,
      enableProgressiveLoading: true,
      maxPreloadImages: 2,
    },
  },
  {
    name: 'quality',
    description: 'Optimized for maximum image quality',
    config: {
      defaultLoadingStrategy: 'lazy',
      enableWebP: true,
      enableAVIF: false,
      defaultQuality: 95,
      criticalImageQuality: 100,
      lowBandwidthQuality: 85,
      enableBlurPlaceholder: false,
      enableProgressiveLoading: false,
    },
  },
  {
    name: 'balanced',
    description: 'Balanced approach between performance and quality',
    config: {
      defaultLoadingStrategy: 'intersection',
      enableWebP: true,
      enableAVIF: false,
      defaultQuality: 85,
      criticalImageQuality: 90,
      lowBandwidthQuality: 70,
      enableBlurPlaceholder: true,
      enableProgressiveLoading: false,
    },
  },
  {
    name: 'mobile-first',
    description: 'Optimized for mobile devices and slow connections',
    config: {
      defaultLoadingStrategy: 'intersection',
      enableWebP: true,
      enableAVIF: true,
      defaultQuality: 70,
      lowBandwidthQuality: 50,
      enableBandwidthDetection: true,
      enableBlurPlaceholder: true,
      enableProgressiveLoading: true,
      intersectionRootMargin: '100px',
    },
  },
  {
    name: 'development',
    description: 'Development-friendly settings with debugging enabled',
    config: {
      defaultLoadingStrategy: 'lazy',
      enableWebP: false,
      enableAVIF: false,
      defaultQuality: 85,
      enableDebugMode: true,
      logPerformanceMetrics: true,
      enablePerformanceMonitoring: true,
      enableRetry: true,
      maxRetries: 1,
    },
  },
]

// ============================================================================
// CONFIGURATION MANAGER
// ============================================================================

export class ImageOptimizationConfigManager {
  private config: ImageOptimizationConfig
  private listeners: Set<(config: ImageOptimizationConfig) => void> = new Set()

  constructor(initialConfig?: Partial<ImageOptimizationConfig>) {
    this.config = {
      ...DEFAULT_IMAGE_OPTIMIZATION_CONFIG,
      ...initialConfig,
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): ImageOptimizationConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<ImageOptimizationConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
    }
    this.notifyListeners()
  }

  /**
   * Apply a preset configuration
   */
  public applyPreset(presetName: string): void {
    const preset = IMAGE_OPTIMIZATION_PRESETS.find((p) => p.name === presetName)
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`)
    }

    this.updateConfig(preset.config)
  }

  /**
   * Reset to default configuration
   */
  public resetToDefaults(): void {
    this.config = { ...DEFAULT_IMAGE_OPTIMIZATION_CONFIG }
    this.notifyListeners()
  }

  /**
   * Subscribe to configuration changes
   */
  public subscribe(listener: (config: ImageOptimizationConfig) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of configuration changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.config))
  }

  /**
   * Get responsive image configurations
   */
  public getResponsiveConfigs(): ResponsiveImageConfig[] {
    return Object.entries(this.config.breakpoints).map(([breakpoint, width]) => ({
      breakpoint,
      width,
      quality: this.getQualityForBreakpoint(breakpoint),
      format: this.getFormatForBreakpoint(breakpoint),
    }))
  }

  /**
   * Get quality setting for a specific breakpoint
   */
  private getQualityForBreakpoint(breakpoint: string): number {
    switch (breakpoint) {
      case 'mobile':
        return this.config.lowBandwidthQuality
      case 'tablet':
        return Math.round((this.config.lowBandwidthQuality + this.config.defaultQuality) / 2)
      case 'desktop':
      case 'wide':
      case 'ultrawide':
        return this.config.defaultQuality
      default:
        return this.config.defaultQuality
    }
  }

  /**
   * Get format preference for a specific breakpoint
   */
  private getFormatForBreakpoint(breakpoint: string): string {
    if (breakpoint === 'mobile' && this.config.enableAVIF) {
      return 'avif'
    }
    if (this.config.enableWebP) {
      return 'webp'
    }
    return this.config.fallbackFormat
  }

  /**
   * Generate sizes attribute for responsive images
   */
  public generateSizesAttribute(): string {
    return Object.entries(this.config.breakpoints)
      .sort(([, a], [, b]) => a - b)
      .map(([, width]) => `(max-width: ${width}px) ${width}px`)
      .join(', ')
  }

  /**
   * Validate configuration
   */
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate quality settings
    if (this.config.defaultQuality < 1 || this.config.defaultQuality > 100) {
      errors.push('defaultQuality must be between 1 and 100')
    }

    if (this.config.lowBandwidthQuality < 1 || this.config.lowBandwidthQuality > 100) {
      errors.push('lowBandwidthQuality must be between 1 and 100')
    }

    if (this.config.highBandwidthQuality < 1 || this.config.highBandwidthQuality > 100) {
      errors.push('highBandwidthQuality must be between 1 and 100')
    }

    // Validate breakpoints
    const breakpointValues = Object.values(this.config.breakpoints)
    if (breakpointValues.some((value) => value <= 0)) {
      errors.push('All breakpoint values must be positive')
    }

    // Validate file size limits
    if (this.config.maxFileSize <= 0) {
      errors.push('maxFileSize must be positive')
    }

    if (this.config.warnFileSize <= 0) {
      errors.push('warnFileSize must be positive')
    }

    if (this.config.warnFileSize > this.config.maxFileSize) {
      errors.push('warnFileSize should not exceed maxFileSize')
    }

    // Validate retry settings
    if (this.config.maxRetries < 0) {
      errors.push('maxRetries must be non-negative')
    }

    if (this.config.retryDelay < 0) {
      errors.push('retryDelay must be non-negative')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Export configuration as JSON
   */
  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  /**
   * Import configuration from JSON
   */
  public importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson)
      this.updateConfig(importedConfig)
    } catch (error) {
      throw new Error('Invalid configuration JSON')
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let globalConfigManager: ImageOptimizationConfigManager | null = null

/**
 * Get the global configuration manager instance
 */
export const getImageOptimizationConfig = (): ImageOptimizationConfigManager => {
  if (!globalConfigManager) {
    globalConfigManager = new ImageOptimizationConfigManager()
  }
  return globalConfigManager
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current image optimization configuration
 */
export const getCurrentConfig = (): ImageOptimizationConfig => {
  return getImageOptimizationConfig().getConfig()
}

/**
 * Update global image optimization configuration
 */
export const updateGlobalConfig = (updates: Partial<ImageOptimizationConfig>): void => {
  getImageOptimizationConfig().updateConfig(updates)
}

/**
 * Apply a configuration preset
 */
export const applyConfigPreset = (presetName: string): void => {
  getImageOptimizationConfig().applyPreset(presetName)
}

/**
 * Get available configuration presets
 */
export const getAvailablePresets = (): ImageOptimizationPreset[] => {
  return [...IMAGE_OPTIMIZATION_PRESETS]
}

/**
 * Create a custom configuration based on device capabilities
 */
export const createDeviceOptimizedConfig = (): Partial<ImageOptimizationConfig> => {
  if (typeof window === 'undefined') {
    return {}
  }

  const config: Partial<ImageOptimizationConfig> = {}

  // Detect device capabilities
  const devicePixelRatio = window.devicePixelRatio || 1
  const isHighDPI = devicePixelRatio >= 2

  // Detect connection quality
  const connection = (navigator as any).connection
  const isSlowConnection =
    connection?.effectiveType?.includes('2g') || (connection?.downlink && connection.downlink < 1.5)

  // Detect device type
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

  // Configure based on device capabilities
  if (isSlowConnection) {
    config.defaultQuality = 60
    config.enableAVIF = true
    config.enableProgressiveLoading = true
    config.defaultLoadingStrategy = 'intersection'
    config.intersectionRootMargin = '100px'
  }

  if (isMobile) {
    config.defaultQuality = isSlowConnection ? 50 : 75
    config.enableBlurPlaceholder = true
    config.maxPreloadImages = 1
  }

  if (isHighDPI) {
    config.defaultQuality = Math.min(config.defaultQuality || 85, 90)
    config.devicePixelRatioThreshold = devicePixelRatio
  }

  return config
}

/**
 * Initialize image optimization with device-specific settings
 */
export const initializeImageOptimization = (
  customConfig?: Partial<ImageOptimizationConfig>,
): void => {
  const deviceConfig = createDeviceOptimizedConfig()
  const finalConfig = {
    ...deviceConfig,
    ...customConfig,
  }

  updateGlobalConfig(finalConfig)

  // Log configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🖼️ Image optimization initialized:', finalConfig)
  }
}

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * React hook for using image optimization configuration
 */
export const useImageOptimizationConfig = () => {
  const [config, setConfig] = React.useState<ImageOptimizationConfig>(() =>
    getImageOptimizationConfig().getConfig(),
  )

  React.useEffect(() => {
    const configManager = getImageOptimizationConfig()
    const unsubscribe = configManager.subscribe(setConfig)
    return unsubscribe
  }, [])

  const updateConfig = React.useCallback((updates: Partial<ImageOptimizationConfig>) => {
    getImageOptimizationConfig().updateConfig(updates)
  }, [])

  const applyPreset = React.useCallback((presetName: string) => {
    getImageOptimizationConfig().applyPreset(presetName)
  }, [])

  return {
    config,
    updateConfig,
    applyPreset,
    presets: IMAGE_OPTIMIZATION_PRESETS,
  }
}

// Auto-initialize with device-optimized settings
if (typeof window !== 'undefined') {
  // Initialize after a short delay to allow for proper device detection
  setTimeout(() => {
    initializeImageOptimization()
  }, 100)
}

export default ImageOptimizationConfigManager
