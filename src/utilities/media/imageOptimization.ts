// ============================================================================
// IMAGE OPTIMIZATION UTILITIES
// ============================================================================

import { assetConfig, generateSrcSet, generateSizes } from '@/config/assets'

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  blur?: number
  sharpen?: boolean
  grayscale?: boolean
}

export interface ResponsiveImageProps {
  src: string
  srcSet?: string
  alt: string
  sizes?: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

// ============================================================================
// IMAGE URL GENERATION
// ============================================================================

export function generateOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {},
): string {
  const url = new URL(src, window.location.origin)
  const params = new URLSearchParams()

  // Add optimization parameters
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.quality) params.set('q', options.quality.toString())
  if (options.format) params.set('f', options.format)
  if (options.fit) params.set('fit', options.fit)
  if (options.position) params.set('pos', options.position)
  if (options.blur) params.set('blur', options.blur.toString())
  if (options.sharpen) params.set('sharpen', 'true')
  if (options.grayscale) params.set('grayscale', 'true')

  // Add parameters to URL
  url.search = params.toString()
  return url.toString()
}

// ============================================================================
// RESPONSIVE IMAGE GENERATION
// ============================================================================

export function generateResponsiveImageProps(
  src: string,
  alt: string,
  sizeConfig: string = 'content',
  options: Partial<ResponsiveImageProps> = {},
): ResponsiveImageProps {
  const deviceSizes: number[] = assetConfig.images.deviceSizes
  // const formats = ['webp', 'jpeg'] // Fallback formats - unused

  // Generate srcSet for different formats
  const srcSet = ['webp', 'jpeg']
    .map((format: string) => generateSrcSet(src.replace(/\.[^.]+$/, ''), deviceSizes, format))
    .join(', ')

  return {
    src,
    srcSet,
    alt,
    sizes: generateSizes(sizeConfig),
    loading: options.priority ? 'eager' : 'lazy',
    ...options,
  }
}

// ============================================================================
// IMAGE PRELOADING
// ============================================================================

export function preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))

    // Set optimized source
    img.src = generateOptimizedImageUrl(src, options)

    // Preload responsive images
    if (options.width) {
      const deviceSizes = assetConfig.images.deviceSizes
      const srcSet = generateSrcSet(src.replace(/\.[^.]+$/, ''), deviceSizes, 'webp')
      img.srcset = srcSet
    }
  })
}

// ============================================================================
// IMAGE FORMAT DETECTION
// ============================================================================

export function getSupportedImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg'

  // Check AVIF support
  const avifCanvas = document.createElement('canvas')
  avifCanvas.width = 1
  avifCanvas.height = 1
  const avifSupported = avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0

  if (avifSupported) return 'avif'

  // Check WebP support
  const webpCanvas = document.createElement('canvas')
  webpCanvas.width = 1
  webpCanvas.height = 1
  const webpSupported = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0

  if (webpSupported) return 'webp'

  return 'jpeg'
}

// ============================================================================
// IMAGE LAZY LOADING
// ============================================================================

export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null
  private images: Set<HTMLImageElement> = new Set()

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined') return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.observer?.unobserve(img)
            this.images.delete(img)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
        ...options,
      },
    )
  }

  observe(img: HTMLImageElement): void {
    if (!this.observer) return

    this.images.add(img)
    this.observer.observe(img)
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src
    const srcset = img.dataset.srcset

    if (src) {
      img.src = src
      img.removeAttribute('data-src')
    }

    if (srcset) {
      img.srcset = srcset
      img.removeAttribute('data-srcset')
    }

    // Add loaded class for CSS transitions
    img.classList.add('loaded')
  }

  disconnect(): void {
    this.observer?.disconnect()
    this.images.clear()
  }
}

// ============================================================================
// IMAGE PERFORMANCE MONITORING
// ============================================================================

export interface ImagePerformanceMetrics {
  src: string
  loadTime: number
  size: number
  format: string
  cached: boolean
  renderTime: number
}

export class ImagePerformanceMonitor {
  private metrics: ImagePerformanceMetrics[] = []

  constructor() {
    this.initializeObserver()
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined') return

    // Monitor image loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.entryType === 'resource' &&
          entry.name.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i)
        ) {
          this.recordImageMetric(entry as PerformanceResourceTiming)
        }
      }
    })

    observer.observe({ entryTypes: ['resource'] })
  }

  private recordImageMetric(entry: PerformanceResourceTiming): void {
    const url = new URL(entry.name)
    const extension = url.pathname.split('.').pop()?.toLowerCase() || 'unknown'

    const metric: ImagePerformanceMetrics = {
      src: entry.name,
      loadTime: entry.responseEnd - entry.startTime,
      size: entry.transferSize || 0,
      format: extension,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
      renderTime: entry.responseEnd - entry.requestStart,
    }

    this.metrics.push(metric)
    this.analyzePerformance(metric)
  }

  private analyzePerformance(metric: ImagePerformanceMetrics): void {
    // Check for performance issues
    if (metric.loadTime > 2000) {
      // 2 seconds
      console.warn(`Slow image loading detected: ${metric.src}`, {
        loadTime: `${metric.loadTime.toFixed(2)}ms`,
        size: `${(metric.size / 1024).toFixed(2)}KB`,
      })
    }

    if (metric.size > 500 * 1024) {
      // 500KB
      console.warn(`Large image detected: ${metric.src}`, {
        size: `${(metric.size / 1024).toFixed(2)}KB`,
        format: metric.format,
      })
    }
  }

  getMetrics(): ImagePerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0
    return this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0) / this.metrics.length
  }

  getTotalImageSize(): number {
    return this.metrics.reduce((sum, metric) => sum + metric.size, 0)
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0
    const cachedCount = this.metrics.filter((metric) => metric.cached).length
    return (cachedCount / this.metrics.length) * 100
  }
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

let lazyLoader: ImageLazyLoader | null = null
let performanceMonitor: ImagePerformanceMonitor | null = null

export function getImageLazyLoader(): ImageLazyLoader {
  if (!lazyLoader) {
    lazyLoader = new ImageLazyLoader()
  }
  return lazyLoader
}

export function getImagePerformanceMonitor(): ImagePerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new ImagePerformanceMonitor()
  }
  return performanceMonitor
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate optimal image dimensions for container
export function calculateOptimalDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: string = '16:9',
): { width: number; height: number } {
  const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number)

  if (!ratioWidth || !ratioHeight) {
    throw new Error('Invalid aspect ratio format. Expected format: "width:height"')
  }

  const ratio = ratioWidth / ratioHeight

  let width = containerWidth
  let height = containerWidth / ratio

  if (height > containerHeight) {
    height = containerHeight
    width = containerHeight * ratio
  }

  return { width: Math.round(width), height: Math.round(height) }
}

// Get optimal image quality based on connection speed
export function getOptimalQuality(): number {
  if (typeof navigator === 'undefined') return assetConfig.images.quality

  // Check connection speed
  const connection = (navigator as any).connection
  if (connection) {
    const effectiveType = connection.effectiveType

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 60 // Lower quality for slow connections
      case '3g':
        return 75 // Medium quality
      case '4g':
      default:
        return assetConfig.images.quality // High quality
    }
  }

  return assetConfig.images.quality
}

// Check if image should be preloaded
export function shouldPreloadImage(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // Preload if image is in viewport or within 100px below
  return rect.top < viewportHeight + 100
}
