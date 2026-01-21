'use client'

import React, { useState, useCallback, useEffect } from 'react'
import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import { cn } from '@/utilities/ui'
import type { Props as MediaProps } from '../types'
import { cssVariables } from '@/cssVariables'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const { breakpoints } = cssVariables

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface OptimizedImageMediaProps extends MediaProps {
  enableProgressiveLoading?: boolean
  enableWebP?: boolean
  enableAVIF?: boolean
  enableBlurPlaceholder?: boolean
  enableIntersectionObserver?: boolean
  enablePreload?: boolean
  loadingStrategy?: 'lazy' | 'eager' | 'progressive' | 'intersection'
  quality?: number
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[]
  criticalResource?: boolean
  onLoadStart?: () => void
  onLoadComplete?: () => void
  onError?: (error: Error) => void
  enableBandwidthDetection?: boolean
  enableRetry?: boolean
  maxRetries?: number
}

interface ImageLoadingState {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  error?: Error
  retryCount: number
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_QUALITY = 85
const LOW_BANDWIDTH_QUALITY = 60
const HIGH_BANDWIDTH_QUALITY = 90
const MAX_RETRIES = 3

// Enhanced blur placeholder with better visual quality
const ENHANCED_BLUR_PLACEHOLDER =
  'data:image/png;base64,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'

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect connection quality
 */
const getConnectionQuality = (): 'slow' | 'fast' => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'fast' // Default to fast if not supported
  }

  const connection = (navigator as any).connection
  if (!connection) return 'fast'

  const effectiveType = connection.effectiveType
  const downlink = connection.downlink

  // Consider slow if 2g/slow-2g or downlink < 1.5 Mbps
  if (effectiveType?.includes('2g') || (downlink && downlink < 1.5)) {
    return 'slow'
  }

  return 'fast'
}

/**
 * Generate optimized image URL with format and quality
 * Currently unused but kept for future optimization features
 */
// const _getOptimizedImageUrl = (
//   src: string,
//   options: {
//     width?: number
//     height?: number
//     quality?: number
//     format?: string
//   } = {},
// ): string => {
//   const { width, height, quality, format } = options
//   const params = new URLSearchParams()

//   if (width) params.set('w', width.toString())
//   if (height) params.set('h', height.toString())
//   if (quality) params.set('q', quality.toString())
//   if (format) params.set('format', format)

//   const separator = src.includes('?') ? '&' : '?'
//   return `${src}${params.toString() ? separator + params.toString() : ''}`
// }

/**
 * Preload image for critical resources
 */
const preloadImage = (src: string, options?: { as?: string; crossOrigin?: string }) => {
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
 * Enhanced loading skeleton with shimmer effect
 */
const EnhancedLoadingSkeleton: React.FC<{
  className?: string
  aspectRatio?: string
  showShimmer?: boolean
}> = ({ className, aspectRatio = 'aspect-video', showShimmer = true }) => (
  <div
    className={cn(
      'bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden',
      aspectRatio,
      className,
      showShimmer && 'animate-pulse',
    )}
  >
    {showShimmer && (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    )}
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
 * Error fallback with retry functionality
 */
const ImageErrorFallback: React.FC<{
  error?: Error
  className?: string
  onRetry?: () => void
  retryCount?: number
  maxRetries?: number
}> = ({ error, className, onRetry, retryCount = 0, maxRetries = MAX_RETRIES }) => (
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
    {onRetry && retryCount < maxRetries && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry ({retryCount + 1}/{maxRetries})
      </button>
    )}
    {retryCount >= maxRetries && (
      <p className="text-sm text-gray-500">Maximum retry attempts reached</p>
    )}
  </div>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Optimized ImageMedia component with advanced loading strategies
 */
export const OptimizedImageMedia: React.FC<OptimizedImageMediaProps> = ({
  alt: altFromProps,
  fill,
  pictureClassName,
  imgClassName,
  priority,
  resource,
  size: sizeFromProps,
  src: srcFromProps,
  loading: loadingFromProps,
  enableProgressiveLoading = false,
  enableWebP = true,
  enableAVIF = false,
  enableBlurPlaceholder = true,
  enableIntersectionObserver = true,
  enablePreload = false,
  loadingStrategy = 'lazy',
  quality = DEFAULT_QUALITY,
  formats = ['webp', 'jpeg'],
  criticalResource = false,
  onLoadStart,
  onLoadComplete,
  onError,
  enableBandwidthDetection = true,
  enableRetry = true,
  maxRetries = MAX_RETRIES,
  className,
  ...props
}) => {
  // State management
  const [loadingState, setLoadingState] = useState<ImageLoadingState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    retryCount: 0,
  })

  const [_isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'slow' | 'fast'>('fast')

  // Refs
  const imgRef = React.useRef<HTMLPictureElement>(null)
  const divRef = React.useRef<HTMLDivElement>(null)
  const observerRef = React.useRef<IntersectionObserver | null>(null)

  // Extract image data
  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource
    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''
    const cacheTag = resource.updatedAt
    src = getMediaUrl(url, cacheTag)
  }

  // Detect connection quality
  useEffect(() => {
    if (enableBandwidthDetection) {
      setConnectionQuality(getConnectionQuality())
    }
  }, [enableBandwidthDetection])

  // Intersection Observer setup
  useEffect(() => {
    if (!enableIntersectionObserver || !imgRef.current) return

    observerRef.current = new IntersectionObserver(
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
      },
    )

    observerRef.current.observe(imgRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enableIntersectionObserver, hasIntersected])

  // Preload critical images
  useEffect(() => {
    if (enablePreload && (criticalResource || priority) && src) {
      preloadImage(src as string)
    }
  }, [enablePreload, criticalResource, priority, src])

  // Determine optimal quality based on connection
  const optimalQuality = enableBandwidthDetection
    ? connectionQuality === 'slow'
      ? LOW_BANDWIDTH_QUALITY
      : HIGH_BANDWIDTH_QUALITY
    : quality

  // Determine if image should load
  const shouldLoad =
    loadingStrategy === 'eager' ||
    priority ||
    criticalResource ||
    (loadingStrategy === 'intersection' && hasIntersected) ||
    loadingStrategy === 'lazy'

  // Generate responsive sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ')

  // Handle loading events
  // const _handleLoadStart = useCallback(() => {
  //   setLoadingState((prev) => ({ ...prev, isLoading: true, hasError: false }))
  //   onLoadStart?.()
  // }, [onLoadStart])

  const handleLoadComplete = useCallback(() => {
    setLoadingState((prev) => ({ ...prev, isLoading: false, isLoaded: true, hasError: false }))
    onLoadComplete?.()
  }, [onLoadComplete])

  const handleError = useCallback(
    (error: Error) => {
      setLoadingState((prev) => ({ ...prev, isLoading: false, hasError: true, error }))
      onError?.(error)
    },
    [onError],
  )

  const handleRetry = useCallback(() => {
    if (loadingState.retryCount < maxRetries) {
      setLoadingState((prev) => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        hasError: false,
        isLoading: true,
      }))
    }
  }, [loadingState.retryCount, maxRetries])

  // Show loading state
  if (!shouldLoad || (enableIntersectionObserver && !hasIntersected)) {
    return (
      <div ref={divRef} className={cn(pictureClassName, className)}>
        <EnhancedLoadingSkeleton
          className={imgClassName}
          aspectRatio={width && height ? `aspect-[${width}/${height}]` : 'aspect-video'}
          showShimmer={true}
        />
      </div>
    )
  }

  // Show error state
  if (loadingState.hasError) {
    return (
      <div ref={divRef} className={cn(pictureClassName, className)}>
        <ImageErrorFallback
          error={loadingState.error}
          className={imgClassName}
          onRetry={enableRetry ? handleRetry : undefined}
          retryCount={loadingState.retryCount}
          maxRetries={maxRetries}
        />
      </div>
    )
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  // Extract ref from props to avoid type conflicts with NextImage
  const { ref: _extractedRef, ...restProps } = props

  return (
    <picture ref={imgRef} className={cn(pictureClassName, className)}>
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName, {
          'transition-opacity duration-300': enableProgressiveLoading,
        })}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder={enableBlurPlaceholder ? 'blur' : 'empty'}
        blurDataURL={enableBlurPlaceholder ? ENHANCED_BLUR_PLACEHOLDER : undefined}
        priority={priority || criticalResource}
        quality={optimalQuality}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
        onLoadingComplete={handleLoadComplete}
        onError={(_e) => handleError(new Error('Image failed to load'))}
        {...restProps}
      />
    </picture>
  )
}

// Add shimmer animation to global styles (this would typically go in your CSS file)
const shimmerStyles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('shimmer-styles')) {
  const style = document.createElement('style')
  style.id = 'shimmer-styles'
  style.textContent = shimmerStyles
  document.head.appendChild(style)
}

export default OptimizedImageMedia
