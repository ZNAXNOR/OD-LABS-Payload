'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import NextImage from 'next/image'
import type { ImageProps } from 'next/image'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface OptimizedImageProps extends Omit<
  ImageProps,
  'src' | 'alt' | 'onError' | 'resource'
> {
  resource?: MediaType | string | number | null
  src?: string
  alt?: string
  className?: string
  pictureClassName?: string
  imgClassName?: string
  containerClassName?: string
  enableProgressiveLoading?: boolean
  enableWebP?: boolean
  enableAVIF?: boolean
  enableBlurPlaceholder?: boolean
  enableIntersectionObserver?: boolean
  enablePreload?: boolean
  loadingStrategy?: 'lazy' | 'eager' | 'progressive' | 'intersection'
  errorFallback?: React.ReactNode
  loadingFallback?: React.ReactNode
  onLoadStart?: () => void
  onLoadComplete?: () => void
  onError?: (error: Error) => void
  quality?: number
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[]
  breakpoints?: Record<string, number>
  criticalResource?: boolean
}

export interface ImageLoadingState {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  error?: Error
  loadProgress?: number
}

export interface ResponsiveImageConfig {
  breakpoints: Record<string, number>
  sizes: string
  quality: number
  formats: string[]
}

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const DEFAULT_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1920,
}

const DEFAULT_QUALITY = 85
const DEFAULT_FORMATS = ['webp', 'jpeg']

const BLUR_PLACEHOLDER =
  'data:image/png;base64,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'

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook for managing image loading state
 */
export const useImageLoadingState = (initialState?: Partial<ImageLoadingState>) => {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    loadProgress: 0,
    ...initialState,
  })

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, hasError: false }))
  }, [])

  const setLoaded = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: false, isLoaded: true, hasError: false }))
  }, [])

  const setError = useCallback((error: Error) => {
    setState((prev) => ({ ...prev, isLoading: false, hasError: true, error }))
  }, [])

  const setProgress = useCallback((loadProgress: number) => {
    setState((prev) => ({ ...prev, loadProgress }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isLoaded: false,
      hasError: false,
      loadProgress: 0,
    })
  }, [])

  return {
    state,
    setLoading,
    setLoaded,
    setError,
    setProgress,
    reset,
  }
}

/**
 * Hook for intersection observer-based lazy loading
 */
export const useIntersectionObserver = (
  enabled: boolean = true,
  options?: IntersectionObserverInit,
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsIntersecting(entry.isIntersecting)
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true)
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    )

    observer.observe(elementRef.current)

    return () => observer.disconnect()
  }, [enabled, hasIntersected, options])

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  }
}

/**
 * Hook for progressive image loading
 */
export const useProgressiveImage = (src: string, lowQualitySrc?: string) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
    }
    img.src = src
  }, [src])

  return { currentSrc, isLoaded }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate responsive image sizes string
 */
export const generateSizes = (breakpoints: Record<string, number>): string => {
  return Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([, value]) => `(max-width: ${value}px) ${value}px`)
    .join(', ')
}

/**
 * Generate srcSet for different formats
 */
export const generateSrcSet = (
  src: string,
  formats: string[],
  breakpoints: Record<string, number>,
): string => {
  return formats
    .map((format) =>
      Object.values(breakpoints)
        .map((width) => `${src}?format=${format}&w=${width} ${width}w`)
        .join(', '),
    )
    .join(', ')
}

/**
 * Get optimized image URL with format and quality
 */
export const getOptimizedImageUrl = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {},
): string => {
  const { width, height, quality = DEFAULT_QUALITY, format } = options
  const params = new URLSearchParams()

  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (quality !== DEFAULT_QUALITY) params.set('q', quality.toString())
  if (format) params.set('format', format)

  return `${src}${params.toString() ? '?' + params.toString() : ''}`
}

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options?: { as?: string; crossOrigin?: string }) => {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = options?.as || 'image'
  link.href = src
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin

  document.head.appendChild(link)
}

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

/**
 * Image loading skeleton
 */
export const ImageLoadingSkeleton: React.FC<{
  className?: string
  aspectRatio?: string
}> = ({ className, aspectRatio = 'aspect-video' }) => (
  <div
    className={cn('animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg', aspectRatio, className)}
  >
    <div className="flex items-center justify-center h-full">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
)

/**
 * Progressive loading overlay
 */
export const ProgressiveLoadingOverlay: React.FC<{
  progress: number
  className?: string
}> = ({ progress, className }) => (
  <div
    className={cn(
      'absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-opacity duration-300',
      progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100',
      className,
    )}
  >
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2" />
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Loading... {Math.round(progress)}%
      </div>
    </div>
  </div>
)

/**
 * Image error fallback
 */
export const ImageErrorFallback: React.FC<{
  error?: Error
  className?: string
  onRetry?: () => void
}> = ({ error, className, onRetry }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600',
      className,
    )}
  >
    <svg
      className="w-12 h-12 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
      Failed to load image
      {error && <span className="block text-sm text-gray-500 mt-1">{error.message}</span>}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
)

// ============================================================================
// MAIN OPTIMIZED IMAGE COMPONENT
// ============================================================================

/**
 * Optimized image component with advanced loading strategies
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  resource,
  src: srcProp,
  alt: altProp,
  className,
  pictureClassName,
  imgClassName,
  containerClassName,
  enableProgressiveLoading = false,
  enableWebP = true,
  enableAVIF = false,
  enableBlurPlaceholder = true,
  enableIntersectionObserver = true,
  enablePreload = false,
  loadingStrategy = 'lazy',
  errorFallback,
  loadingFallback,
  onLoadStart,
  onLoadComplete,
  onError,
  quality = DEFAULT_QUALITY,
  formats = DEFAULT_FORMATS,
  breakpoints = DEFAULT_BREAKPOINTS,
  criticalResource = false,
  priority,
  sizes: sizesProp,
  fill,
  width: widthProp,
  height: heightProp,
  ...nextImageProps
}) => {
  // State management
  const loadingState = useImageLoadingState({ isLoading: true })
  const { elementRef, hasIntersected } = useIntersectionObserver(
    enableIntersectionObserver && loadingStrategy === 'intersection',
  )

  // Extract image data
  let width = widthProp
  let height = heightProp
  let alt = altProp || ''
  let src = srcProp || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource
    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''
    const cacheTag = resource.updatedAt
    src = getMediaUrl(url, cacheTag)
  }

  // Progressive loading
  const lowQualitySrc = enableProgressiveLoading
    ? getOptimizedImageUrl(src, {
        quality: 20,
        width: Math.min(typeof width === 'number' ? width : 100, 100),
      })
    : undefined
  const { currentSrc, isLoaded: progressiveLoaded } = useProgressiveImage(src, lowQualitySrc)

  // Generate responsive sizes
  const sizes = sizesProp || generateSizes(breakpoints)

  // Preload critical images
  useEffect(() => {
    if (enablePreload && criticalResource && src) {
      preloadImage(src)
    }
  }, [enablePreload, criticalResource, src])

  // Handle loading events
  const handleLoadComplete = useCallback(() => {
    loadingState.setLoaded()
    onLoadComplete?.()
  }, [loadingState, onLoadComplete])

  const handleError = useCallback(
    (error: Error) => {
      loadingState.setError(error)
      onError?.(error)
    },
    [loadingState, onError],
  )

  // Determine if image should load
  const shouldLoad =
    loadingStrategy === 'eager' ||
    priority ||
    criticalResource ||
    (loadingStrategy === 'intersection' && hasIntersected) ||
    loadingStrategy === 'lazy'

  // Show loading state
  if (!shouldLoad || (enableIntersectionObserver && !hasIntersected)) {
    return (
      <div ref={elementRef} className={cn(containerClassName, className)}>
        {loadingFallback || (
          <ImageLoadingSkeleton
            className={imgClassName}
            aspectRatio={width && height ? `aspect-[${width}/${height}]` : 'aspect-video'}
          />
        )}
      </div>
    )
  }

  // Show error state
  if (loadingState.state.hasError) {
    return (
      <div className={cn(containerClassName, className)}>
        {errorFallback || (
          <ImageErrorFallback
            error={loadingState.state.error}
            className={imgClassName}
            onRetry={loadingState.reset}
          />
        )}
      </div>
    )
  }

  // Main image component
  const imageElement = (
    <NextImage
      src={enableProgressiveLoading ? currentSrc : src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority || criticalResource}
      placeholder={enableBlurPlaceholder ? 'blur' : 'empty'}
      blurDataURL={enableBlurPlaceholder ? BLUR_PLACEHOLDER : undefined}
      className={cn(imgClassName, {
        'transition-opacity duration-300': enableProgressiveLoading,
        'opacity-0': enableProgressiveLoading && !progressiveLoaded,
        'opacity-100': !enableProgressiveLoading || progressiveLoaded,
      })}
      onLoadingComplete={handleLoadComplete}
      onError={() => handleError(new Error('Image failed to load'))}
      {...nextImageProps}
    />
  )

  return (
    <div ref={elementRef} className={cn(containerClassName, className)}>
      <picture className={cn(pictureClassName, 'relative')}>
        {imageElement}
        {enableProgressiveLoading && !progressiveLoaded && (
          <ProgressiveLoadingOverlay progress={loadingState.state.loadProgress || 0} />
        )}
      </picture>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default OptimizedImage
