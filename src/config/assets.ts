// ============================================================================
// ASSET OPTIMIZATION CONFIGURATION
// ============================================================================

export interface AssetConfig {
  // Image optimization settings
  images: {
    formats: string[]
    deviceSizes: number[]
    imageSizes: number[]
    quality: number
    minimumCacheTTL: number
  }

  // CSS optimization settings
  css: {
    criticalPath: string[]
    lazyLoad: string[]
    minify: boolean
    purge: boolean
  }

  // JavaScript optimization settings
  js: {
    splitChunks: boolean
    treeshaking: boolean
    minify: boolean
    compression: boolean
  }

  // Font optimization settings
  fonts: {
    preload: string[]
    display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
    subset: boolean
  }

  // Caching settings
  cache: {
    staticAssets: number
    images: number
    fonts: number
    css: number
    js: number
  }
}

export const assetConfig: AssetConfig = {
  images: {
    formats: ['image/avif', 'image/webp', 'image/jpeg'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    quality: 85,
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  css: {
    criticalPath: ['/styles/base.css', '/styles/theme.css', '/styles/typography.css'],
    lazyLoad: [
      '/utilities/accessibility.css',
      '/utilities/animations.css',
      '/styles/components.css',
    ],
    minify: true,
    purge: true,
  },

  js: {
    splitChunks: true,
    treeshaking: true,
    minify: true,
    compression: true,
  },

  fonts: {
    preload: ['/fonts/inter-var.woff2'],
    display: 'swap',
    subset: true,
  },

  cache: {
    staticAssets: 60 * 60 * 24 * 365, // 1 year
    images: 60 * 60 * 24 * 30, // 30 days
    fonts: 60 * 60 * 24 * 365, // 1 year
    css: 60 * 60 * 24 * 30, // 30 days
    js: 60 * 60 * 24 * 30, // 30 days
  },
}

// ============================================================================
// ASSET LOADING STRATEGIES
// ============================================================================

export interface LoadingStrategy {
  priority: 'high' | 'low' | 'auto'
  loading: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export const assetLoadingStrategies: Record<string, LoadingStrategy> = {
  // Critical above-the-fold images
  hero: {
    priority: 'high',
    loading: 'eager',
    fetchPriority: 'high',
  },

  // Important content images
  content: {
    priority: 'high',
    loading: 'lazy',
    fetchPriority: 'auto',
  },

  // Decorative images
  decorative: {
    priority: 'low',
    loading: 'lazy',
    fetchPriority: 'low',
  },

  // Thumbnail images
  thumbnail: {
    priority: 'low',
    loading: 'lazy',
    fetchPriority: 'low',
  },
}

// ============================================================================
// RESPONSIVE IMAGE CONFIGURATIONS
// ============================================================================

export interface ResponsiveImageConfig {
  breakpoints: Record<string, number>
  aspectRatios: Record<string, string>
  sizes: Record<string, string>
}

export const responsiveImageConfig: ResponsiveImageConfig = {
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  aspectRatios: {
    square: '1:1',
    video: '16:9',
    photo: '4:3',
    portrait: '3:4',
    wide: '21:9',
  },

  sizes: {
    hero: '100vw',
    content: '(min-width: 1024px) 50vw, 100vw',
    thumbnail: '(min-width: 768px) 25vw, 50vw',
    avatar: '(min-width: 768px) 64px, 48px',
  },
}

// ============================================================================
// PERFORMANCE BUDGETS
// ============================================================================

export interface PerformanceBudget {
  // Bundle size limits (in KB)
  bundles: {
    initial: number
    async: number
    total: number
  }

  // Asset size limits (in KB)
  assets: {
    image: number
    font: number
    css: number
    js: number
    other: number
  }

  // Performance metrics
  metrics: {
    fcp: number // First Contentful Paint (ms)
    lcp: number // Largest Contentful Paint (ms)
    fid: number // First Input Delay (ms)
    cls: number // Cumulative Layout Shift
  }
}

export const performanceBudget: PerformanceBudget = {
  bundles: {
    initial: 250, // 250KB initial bundle
    async: 100, // 100KB per async chunk
    total: 500, // 500KB total JS
  },

  assets: {
    image: 500, // 500KB max per image
    font: 100, // 100KB max per font
    css: 50, // 50KB max per CSS file
    js: 100, // 100KB max per JS file
    other: 200, // 200KB max per other asset
  },

  metrics: {
    fcp: 1500, // 1.5s First Contentful Paint
    lcp: 2500, // 2.5s Largest Contentful Paint
    fid: 100, // 100ms First Input Delay
    cls: 0.1, // 0.1 Cumulative Layout Shift
  },
}

// ============================================================================
// ASSET OPTIMIZATION UTILITIES
// ============================================================================

// Generate responsive image srcset
export function generateSrcSet(basePath: string, sizes: number[], format: string = 'webp'): string {
  return sizes.map((size) => `${basePath}-${size}w.${format} ${size}w`).join(', ')
}

// Generate sizes attribute for responsive images
export function generateSizes(config: string): string {
  const sizeConfig = responsiveImageConfig.sizes[config]
  return sizeConfig || '100vw'
}

// Check if asset exceeds performance budget
export function checkAssetBudget(type: keyof PerformanceBudget['assets'], size: number): boolean {
  return size <= performanceBudget.assets[type] * 1024 // Convert KB to bytes
}

// Get loading strategy for asset type
export function getLoadingStrategy(type: string): LoadingStrategy {
  const strategy = assetLoadingStrategies[type as keyof typeof assetLoadingStrategies]
  if (!strategy) {
    return assetLoadingStrategies.content as LoadingStrategy
  }
  return strategy
}

// ============================================================================
// ASSET PRELOADING
// ============================================================================

export interface PreloadConfig {
  href: string
  as: 'image' | 'font' | 'style' | 'script'
  type?: string
  crossorigin?: 'anonymous' | 'use-credentials'
  media?: string
}

export const criticalAssets: PreloadConfig[] = [
  // Critical fonts
  {
    href: '/fonts/inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },

  // Critical CSS
  {
    href: '/styles/base.css',
    as: 'style',
  },

  {
    href: '/styles/theme.css',
    as: 'style',
  },

  // Hero image (if exists)
  {
    href: '/images/hero.webp',
    as: 'image',
    type: 'image/webp',
  },
]

// Generate preload links for critical assets
export function generatePreloadLinks(): string {
  return criticalAssets
    .map((asset) => {
      const attrs = Object.entries(asset)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
      return `<link rel="preload" ${attrs}>`
    })
    .join('\n')
}
