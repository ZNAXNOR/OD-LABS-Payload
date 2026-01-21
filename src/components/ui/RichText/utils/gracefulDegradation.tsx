/**
 * Graceful degradation utilities for RichText components
 * Provides fallback rendering and progressive enhancement capabilities
 */

import React from 'react'

// Degradation levels
export type DegradationLevel = 'none' | 'minimal' | 'moderate' | 'severe' | 'critical'

// Degradation context
export interface DegradationContext {
  level: DegradationLevel
  reason: string
  failedComponents: string[]
  availableFeatures: string[]
  fallbackStrategy: 'hide' | 'simplify' | 'replace' | 'disable'
  timestamp: number
}

// Graceful degradation options
export interface GracefulDegradationOptions {
  enableFallbacks?: boolean
  fallbackStrategy?: 'hide' | 'simplify' | 'replace' | 'disable'
  maxDegradationLevel?: DegradationLevel
  onDegradation?: (context: DegradationContext) => void
  logDegradation?: boolean
  showDegradationNotice?: boolean
}

// Feature availability checker
export interface FeatureChecker {
  name: string
  check: () => boolean | Promise<boolean>
  fallback?: React.ComponentType<any>
  required?: boolean
}

/**
 * Feature availability detection
 */
export const createFeatureChecker = (
  name: string,
  check: () => boolean | Promise<boolean>,
  options?: {
    fallback?: React.ComponentType<any>
    required?: boolean
  },
): FeatureChecker => ({
  name,
  check,
  fallback: options?.fallback,
  required: options?.required || false,
})

/**
 * Common feature checkers
 */
export const commonFeatureCheckers: FeatureChecker[] = [
  createFeatureChecker('javascript', () => typeof window !== 'undefined'),
  createFeatureChecker('localStorage', () => {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null
    } catch {
      return false
    }
  }),
  createFeatureChecker('fetch', () => typeof fetch !== 'undefined'),
  createFeatureChecker('intersectionObserver', () => typeof IntersectionObserver !== 'undefined'),
  createFeatureChecker('resizeObserver', () => typeof ResizeObserver !== 'undefined'),
  createFeatureChecker('webGL', () => {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  }),
  createFeatureChecker('css-grid', () => {
    if (typeof window === 'undefined') return false
    return CSS.supports('display', 'grid')
  }),
  createFeatureChecker('css-flexbox', () => {
    if (typeof window === 'undefined') return false
    return CSS.supports('display', 'flex')
  }),
  createFeatureChecker('css-custom-properties', () => {
    if (typeof window === 'undefined') return false
    return CSS.supports('--custom', 'property')
  }),
]

/**
 * Graceful degradation manager
 */
export class GracefulDegradationManager {
  private options: Required<GracefulDegradationOptions>
  private featureCheckers: FeatureChecker[]
  private degradationContext: DegradationContext | null = null
  private availableFeatures: Set<string> = new Set()
  private failedFeatures: Set<string> = new Set()

  constructor(options: GracefulDegradationOptions = {}) {
    this.options = {
      enableFallbacks: true,
      fallbackStrategy: 'replace',
      maxDegradationLevel: 'moderate',
      onDegradation: () => {},
      logDegradation: true,
      showDegradationNotice: false,
      ...options,
    }
    this.featureCheckers = [...commonFeatureCheckers]
  }

  /**
   * Add custom feature checker
   */
  addFeatureChecker(checker: FeatureChecker) {
    this.featureCheckers.push(checker)
  }

  /**
   * Check all features and determine degradation level
   */
  async checkFeatures(): Promise<DegradationContext> {
    const results = await Promise.allSettled(
      this.featureCheckers.map(async (checker) => {
        try {
          const result = await checker.check()
          return { name: checker.name, available: result, required: checker.required }
        } catch (error) {
          return { name: checker.name, available: false, required: checker.required }
        }
      }),
    )

    // Process results
    const failedComponents: string[] = []
    const availableFeatures: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { name, available, required } = result.value
        if (available) {
          availableFeatures.push(name)
          this.availableFeatures.add(name)
        } else {
          if (required) {
            failedComponents.push(name)
          }
          this.failedFeatures.add(name)
        }
      } else {
        const checker = this.featureCheckers[index]
        if (checker) {
          failedComponents.push(checker.name)
          this.failedFeatures.add(checker.name)
        }
      }
    })

    // Determine degradation level
    const level = this.calculateDegradationLevel(failedComponents, availableFeatures)

    // Create degradation context
    this.degradationContext = {
      level,
      reason: this.getDegradationReason(failedComponents),
      failedComponents,
      availableFeatures,
      fallbackStrategy: this.options.fallbackStrategy,
      timestamp: Date.now(),
    }

    // Handle degradation
    if (level !== 'none') {
      this.handleDegradation(this.degradationContext)
    }

    return this.degradationContext
  }

  /**
   * Calculate degradation level based on failed features
   */
  private calculateDegradationLevel(
    failedComponents: string[],
    _availableFeatures: string[],
  ): DegradationLevel {
    const totalFeatures = this.featureCheckers.length
    const failedCount = failedComponents.length
    const failureRate = failedCount / totalFeatures

    // Check for critical failures
    const criticalFeatures = ['javascript']
    const hasCriticalFailure = criticalFeatures.some((feature) =>
      failedComponents.includes(feature),
    )

    if (hasCriticalFailure) {
      return 'critical'
    }

    // Check failure rate
    if (failureRate >= 0.7) {
      return 'severe'
    } else if (failureRate >= 0.4) {
      return 'moderate'
    } else if (failureRate >= 0.2) {
      return 'minimal'
    } else {
      return 'none'
    }
  }

  /**
   * Get human-readable degradation reason
   */
  private getDegradationReason(failedComponents: string[]): string {
    if (failedComponents.length === 0) {
      return 'All features available'
    }

    if (failedComponents.includes('javascript')) {
      return 'JavaScript is disabled or unavailable'
    }

    if (failedComponents.length === 1) {
      return `${failedComponents[0]} is not available`
    }

    if (failedComponents.length <= 3) {
      return `${failedComponents.join(', ')} are not available`
    }

    return `Multiple features are not available (${failedComponents.length} total)`
  }

  /**
   * Handle degradation based on context
   */
  private handleDegradation(context: DegradationContext) {
    // Log degradation
    if (this.options.logDegradation) {
      console.warn('[GracefulDegradation] Degradation detected:', {
        level: context.level,
        reason: context.reason,
        failedComponents: context.failedComponents,
        strategy: context.fallbackStrategy,
      })
    }

    // Call degradation handler
    this.options.onDegradation(context)

    // Show degradation notice if enabled
    if (this.options.showDegradationNotice && typeof document !== 'undefined') {
      this.showDegradationNotice(context)
    }
  }

  /**
   * Show degradation notice to user
   */
  private showDegradationNotice(context: DegradationContext) {
    const notice = document.createElement('div')
    notice.className = 'richtext-degradation-notice'
    notice.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `

    notice.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">Limited Functionality</div>
      <div style="font-size: 12px;">${context.reason}. Some features may be unavailable.</div>
      <button onclick="this.parentElement.remove()" style="
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #856404;
      ">&times;</button>
    `

    document.body.appendChild(notice)

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notice.parentElement) {
        notice.remove()
      }
    }, 10000)
  }

  /**
   * Check if a feature is available
   */
  isFeatureAvailable(featureName: string): boolean {
    return this.availableFeatures.has(featureName)
  }

  /**
   * Get current degradation context
   */
  getDegradationContext(): DegradationContext | null {
    return this.degradationContext
  }

  /**
   * Get fallback component for a feature
   */
  getFallbackComponent(featureName: string): React.ComponentType<any> | null {
    const checker = this.featureCheckers.find((c) => c.name === featureName)
    return checker?.fallback || null
  }
}

/**
 * Graceful degradation HOC
 */
export const withGracefulDegradation = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options: {
    requiredFeatures?: string[]
    fallbackComponent?: React.ComponentType<P>
    degradationOptions?: GracefulDegradationOptions
  } = {},
) => {
  const { requiredFeatures = [], fallbackComponent, degradationOptions = {} } = options

  return React.forwardRef<any, P>((props, ref) => {
    const [degradationManager] = React.useState(
      () => new GracefulDegradationManager(degradationOptions),
    )
    const [degradationContext, setDegradationContext] = React.useState<DegradationContext | null>(
      null,
    )
    const [isChecking, setIsChecking] = React.useState(true)

    React.useEffect(() => {
      const checkFeatures = async () => {
        try {
          const context = await degradationManager.checkFeatures()
          setDegradationContext(context)
        } catch (error) {
          console.error('[GracefulDegradation] Feature check failed:', error)
          // Assume severe degradation on error
          setDegradationContext({
            level: 'severe',
            reason: 'Feature detection failed',
            failedComponents: requiredFeatures,
            availableFeatures: [],
            fallbackStrategy: 'replace',
            timestamp: Date.now(),
          })
        } finally {
          setIsChecking(false)
        }
      }

      checkFeatures()
    }, [degradationManager, requiredFeatures])

    // Show loading state while checking
    if (isChecking) {
      return <div className="richtext-loading">Loading...</div>
    }

    // Check if required features are available
    const hasRequiredFeatures = requiredFeatures.every((feature) =>
      degradationManager.isFeatureAvailable(feature),
    )

    // Use fallback if required features are missing
    if (!hasRequiredFeatures && fallbackComponent) {
      const FallbackComponent = fallbackComponent
      return <FallbackComponent {...(props as any)} ref={ref} />
    }

    // Render original component with degradation context
    return (
      <GracefulDegradationContext.Provider value={{ degradationContext, degradationManager }}>
        <Component {...(props as any)} ref={ref} />
      </GracefulDegradationContext.Provider>
    )
  })
}

/**
 * Simple fallback components
 */
export const SimpleFallbacks = {
  // Simple text fallback
  Text: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props} style={{ fontFamily: 'serif', lineHeight: 1.6 }}>
      {children}
    </div>
  ),

  // Simple image fallback
  Image: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <div
      {...props}
      style={{
        border: '1px solid #ddd',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666' }}>Image: {alt || 'Untitled'}</div>
      {src && <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{src}</div>}
    </div>
  ),

  // Simple video fallback
  Video: ({ src, title, ...props }: { src: string; title?: string }) => (
    <div
      {...props}
      style={{
        border: '1px solid #ddd',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666' }}>Video: {title || 'Untitled'}</div>
      {src && (
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          <a href={src} target="_blank" rel="noopener noreferrer">
            View Video
          </a>
        </div>
      )}
    </div>
  ),

  // Simple link fallback
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a {...props} href={href} style={{ color: '#0066cc', textDecoration: 'underline' }}>
      {children}
    </a>
  ),

  // Simple block fallback
  Block: ({ blockType, data }: { blockType: string; data: any }) => (
    <div
      style={{
        border: '1px dashed #ccc',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: '#fafafa',
      }}
    >
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Block: {blockType}</div>
      {data && typeof data === 'object' && (
        <pre style={{ fontSize: '11px', color: '#888', overflow: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  ),
}

/**
 * Progressive enhancement wrapper
 */
export const ProgressiveEnhancement: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredFeatures?: string[]
  enhancedFeatures?: string[]
}> = ({ children, fallback, requiredFeatures = [], enhancedFeatures = [] }) => {
  const { degradationContext, degradationManager } = useGracefulDegradation()

  // Check if required features are available
  const hasRequiredFeatures = requiredFeatures.every(
    (feature) => degradationManager?.isFeatureAvailable(feature) ?? false,
  )

  // If required features are missing, show fallback
  if (!hasRequiredFeatures) {
    return <>{fallback || <div>Content unavailable</div>}</>
  }

  // Check enhanced features for progressive enhancement
  const hasEnhancedFeatures = enhancedFeatures.every(
    (feature) => degradationManager?.isFeatureAvailable(feature) ?? false,
  )

  // Add class for CSS-based progressive enhancement
  return (
    <div
      className={`progressive-enhancement ${hasEnhancedFeatures ? 'enhanced' : 'basic'}`}
      data-degradation-level={degradationContext?.level || 'none'}
    >
      {children}
    </div>
  )
}

/**
 * Graceful degradation context
 */
export const GracefulDegradationContext = React.createContext<{
  degradationContext: DegradationContext | null
  degradationManager: GracefulDegradationManager | null
}>({
  degradationContext: null,
  degradationManager: null,
})

/**
 * Hook to use graceful degradation context
 */
export const useGracefulDegradation = () => {
  return React.useContext(GracefulDegradationContext)
}

/**
 * Hook for feature detection
 */
export const useFeatureDetection = (features: string[]) => {
  const { degradationManager } = useGracefulDegradation()

  const availableFeatures = React.useMemo(() => {
    if (!degradationManager) return []
    return features.filter((feature) => degradationManager.isFeatureAvailable(feature))
  }, [degradationManager, features])

  const missingFeatures = React.useMemo(() => {
    return features.filter((feature) => !availableFeatures.includes(feature))
  }, [features, availableFeatures])

  return {
    availableFeatures,
    missingFeatures,
    hasAllFeatures: missingFeatures.length === 0,
    hasAnyFeature: availableFeatures.length > 0,
  }
}

/**
 * Conditional rendering based on feature availability
 */
export const FeatureGate: React.FC<{
  features: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
  requireAll?: boolean
}> = ({ features, fallback, children, requireAll = true }) => {
  const { hasAllFeatures, hasAnyFeature } = useFeatureDetection(features)

  const shouldRender = requireAll ? hasAllFeatures : hasAnyFeature

  return <>{shouldRender ? children : fallback || null}</>
}

/**
 * Create degradation-aware block renderer
 */
export const createDegradationAwareBlockRenderer = (
  blockRenderers: Record<string, React.ComponentType<any>>,
  fallbackRenderer?: React.ComponentType<{ blockType: string; data: any }>,
) => {
  const FallbackRenderer = fallbackRenderer || SimpleFallbacks.Block

  return (blockType: string, data: any) => {
    const Renderer = blockRenderers[blockType]

    if (!Renderer) {
      return <FallbackRenderer blockType={blockType} data={data} />
    }

    // Wrap with graceful degradation
    const DegradationAwareRenderer = withGracefulDegradation(Renderer, {
      fallbackComponent: () => <FallbackRenderer blockType={blockType} data={data} />,
      degradationOptions: {
        enableFallbacks: true,
        fallbackStrategy: 'replace',
        maxDegradationLevel: 'moderate',
        logDegradation: process.env.NODE_ENV === 'development',
      },
    })

    return <DegradationAwareRenderer {...data} />
  }
}
