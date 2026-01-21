// ============================================================================
// OPTIMIZED CSS ASSET ORGANIZATION
// ============================================================================

// Critical CSS that should be loaded immediately
export const criticalStyles = {
  // Base styles that affect layout
  base: () => import('./base.css'),

  // Theme and color system
  theme: () => import('./theme.css'),

  // Typography system
  typography: () => import('./typography.css'),

  // Layout utilities
  layout: () => import('./layout.css'),
} as const

// Non-critical CSS that can be loaded lazily
export const lazyStyles = {
  // Accessibility styles
  accessibility: () => import('../utilities/accessibility.css'),

  // Animation styles
  animations: () => import('../utilities/animations.css'),

  // Component-specific styles
  components: () => import('./components.css'),

  // Utility classes
  utilities: () => import('./utilities.css'),
} as const

// Component-specific CSS modules
export const componentStyles = {
  // UI component styles
  button: () => import('../components/ui/Button/styles.module.css'),
  card: () => import('../components/ui/Card/styles.module.css'),
  input: () => import('../components/ui/Input/styles.module.css'),

  // Block component styles
  hero: () => import('../blocks/Hero/Hero/styles.module.scss'),
  content: () => import('../blocks/Content/Content/styles.module.scss'),
  cta: () => import('../blocks/cta/CallToAction/styles.module.scss'),
} as const

// ============================================================================
// STYLE LOADING UTILITIES
// ============================================================================

// Load critical styles immediately
export async function loadCriticalStyles(): Promise<void> {
  const criticalPromises = Object.values(criticalStyles).map((loader) => loader())
  await Promise.all(criticalPromises)
}

// Load non-critical styles with priority
export async function loadLazyStyles(priority: 'high' | 'low' = 'low'): Promise<void> {
  const delay = priority === 'high' ? 0 : 100

  setTimeout(async () => {
    const lazyPromises = Object.values(lazyStyles).map((loader) => loader())
    await Promise.all(lazyPromises)
  }, delay)
}

// Load component-specific styles on demand
export async function loadComponentStyle(component: keyof typeof componentStyles): Promise<void> {
  const loader = componentStyles[component]
  if (loader) {
    await loader()
  }
}

// ============================================================================
// STYLE PRELOADING
// ============================================================================

// Preload critical styles for better performance
export function preloadCriticalStyles(): void {
  if (typeof window !== 'undefined') {
    Object.values(criticalStyles).forEach((_loader) => {
      // Create link preload for CSS
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      // Note: In a real implementation, you'd need the actual CSS file paths
      document.head.appendChild(link)
    })
  }
}

// ============================================================================
// RESPONSIVE STYLE LOADING
// ============================================================================

// Load styles based on viewport size
export function loadResponsiveStyles(): void {
  if (typeof window !== 'undefined') {
    const mediaQueries = {
      mobile: '(max-width: 768px)',
      tablet: '(min-width: 769px) and (max-width: 1024px)',
      desktop: '(min-width: 1025px)',
    }

    Object.entries(mediaQueries).forEach(([breakpoint, query]) => {
      const mediaQuery = window.matchMedia(query)

      if (mediaQuery.matches) {
        // Load breakpoint-specific styles
        import(`./responsive/${breakpoint}.css`)
      }
    })
  }
}

// ============================================================================
// THEME-BASED STYLE LOADING
// ============================================================================

// Load theme-specific styles
export async function loadThemeStyles(theme: 'light' | 'dark'): Promise<void> {
  try {
    await import(`./themes/${theme}.css`)
  } catch (error) {
    console.warn(`Theme styles for ${theme} not found`)
  }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

// Monitor CSS loading performance
export function monitorStylePerformance(): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      const entries = performance.getEntriesByType('resource')
      const cssEntries = entries.filter(
        (entry) => entry.name.endsWith('.css') || entry.name.includes('css'),
      )

      console.log('CSS Loading Performance:', {
        totalCSSFiles: cssEntries.length,
        totalLoadTime: cssEntries.reduce((sum, entry) => sum + entry.duration, 0),
        largestCSS: cssEntries.reduce((largest, entry) => {
          const resourceEntry = entry as PerformanceResourceTiming
          const largestResourceEntry = largest as PerformanceResourceTiming | undefined
          return resourceEntry.transferSize > (largestResourceEntry?.transferSize || 0)
            ? entry
            : largest
        }),
      })
    })
  }
}
