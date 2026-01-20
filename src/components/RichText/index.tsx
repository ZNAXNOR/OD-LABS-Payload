import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import React, { useEffect, useMemo, useRef } from 'react'

import { cn } from '@/utilities/ui'

// Import enhanced types and utilities
import type { EnhancedRichTextProps } from './types'
import {
  generateSectionAriaAttrs,
  generateLiveRegionAttrs,
  generateSkipLinkAttrs,
} from './utils/accessibilityUtils'
import { createSkipLinkNavigation } from './utils/keyboardNavigation'
import { generateContentSummary } from './utils/screenReaderUtils'
import {
  getResponsiveClassName,
  getResponsiveContainerClass,
  getResponsiveProseClass,
} from './utils'
import {
  getProseTypographyClasses,
  getA11yTypographyClasses,
  getOptimizedTypographyClasses,
} from './utils/typographyUtils'
import { defaultBlockConverters, mergeBlockConverters } from './converters/blockConverters'
import { createEnhancedLinkConverter } from './converters/linkConverters'
import { mediaConverters } from './converters/mediaConverters'

// Import container query utilities
import {
  createContainerQueryWrapper,
  supportsContainerQueries,
  createProgressiveContainerClasses,
} from './utils/containerQueryUtils'

// Import container query styles
import './styles/containerQueries.css'

// Import graceful degradation styles
import './styles/gracefulDegradation.css'

// Import performance monitoring
import { usePerformanceMonitoring, useContentMetrics } from './hooks/usePerformanceMonitoring'
import { PerformanceMonitor, PerformanceIndicator } from './components/PerformanceMonitor'

// Import graceful degradation utilities
import {
  withGracefulDegradation,
  GracefulDegradationManager,
  ProgressiveEnhancement,
  SimpleFallbacks,
  createDegradationAwareBlockRenderer,
  type DegradationContext,
} from './utils/gracefulDegradation'

// Import error logging and monitoring
import { logRichTextError } from './utils/errorLogging'
import ErrorMonitoringDashboard from './components/ErrorMonitoringDashboard'

// Enhanced JSX converters with error boundaries and custom converter support
const createDefaultConverters = (props: EnhancedRichTextProps) => {
  const { blockWhitelist, customConverters, linkConverterConfig, imageOptimization } = props

  // Get image optimization configuration (commented out as unused)
  // const optimizationConfig = getImageOptimizationConfig().getConfig()
  // const performanceMonitor = getImagePerformanceMonitor()

  // Use default block converters or merge with custom ones
  const blockConverters = customConverters?.blocks
    ? mergeBlockConverters(customConverters.blocks)
    : defaultBlockConverters

  // Apply block whitelisting if provided
  const filteredBlocks =
    blockWhitelist && blockWhitelist.length > 0
      ? Object.fromEntries(
          Object.entries(blockConverters).filter(([key]) => blockWhitelist.includes(key)),
        )
      : blockConverters

  // Log filtered blocks for debugging
  if (blockWhitelist && process.env.NODE_ENV === 'development') {
    console.log('RichText: Applied block whitelist', {
      whitelist: blockWhitelist,
      availableBlocks: Object.keys(blockConverters),
      filteredBlocks: Object.keys(filteredBlocks),
    })
  }

  // Create enhanced link converter
  const linkConverter = createEnhancedLinkConverter(linkConverterConfig)

  // Select appropriate media converters based on optimization settings
  const selectedMediaConverters = {
    upload:
      imageOptimization?.strategy === 'critical'
        ? mediaConverters.criticalImage
        : imageOptimization?.strategy === 'progressive'
          ? mediaConverters.progressiveImage
          : imageOptimization?.strategy === 'performance'
            ? mediaConverters.highPerformanceImage
            : imageOptimization?.strategy === 'bandwidth-aware'
              ? mediaConverters.bandwidthAwareImage
              : mediaConverters.optimizedImage,

    media: mediaConverters.responsiveImage,
    image: mediaConverters.optimizedImage,
    video: mediaConverters.video,
    file: mediaConverters.file,
    gallery: mediaConverters.gallery,
  }

  return ({ defaultConverters }: { defaultConverters: any }) => ({
    ...defaultConverters,
    ...linkConverter,
    ...selectedMediaConverters,
    blocks: filteredBlocks,
    // Merge any additional custom converters
    ...(customConverters
      ? Object.fromEntries(Object.entries(customConverters).filter(([key]) => key !== 'blocks'))
      : {}),
  })
}

// Enhanced RichText component with full feature support, performance monitoring, container queries, and graceful degradation
function RichTextComponent(props: EnhancedRichTextProps) {
  const {
    className,
    enableProse = true,
    enableGutter = true,
    enableBlocks = true,
    blockWhitelist,
    converters,
    customConverters,
    responsive,
    data,
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
    performanceThresholds,
    enableContainerQueries = true,
    containerName = 'richtext',
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    role = 'region',
    enableKeyboardNavigation = true,
    keyboardConfig,
    ...rest
  } = props

  // Refs for keyboard navigation
  const containerRef = useRef<HTMLDivElement>(null)

  // Graceful degradation manager
  const [degradationManager] = React.useState(
    () =>
      new GracefulDegradationManager({
        enableFallbacks: true,
        fallbackStrategy: 'replace',
        maxDegradationLevel: 'moderate',
        logDegradation: process.env.NODE_ENV === 'development',
        showDegradationNotice: process.env.NODE_ENV === 'development',
        onDegradation: (context: DegradationContext) => {
          console.warn('[RichText] Graceful degradation activated:', context)

          // Log degradation as an error
          logRichTextError({
            severity:
              context.level === 'critical'
                ? 'critical'
                : context.level === 'severe'
                  ? 'high'
                  : 'medium',
            category: 'rendering',
            message: `Graceful degradation activated: ${context.reason}`,
            componentName: 'RichText',
            additionalData: {
              degradationLevel: context.level,
              failedComponents: context.failedComponents,
              availableFeatures: context.availableFeatures,
              fallbackStrategy: context.fallbackStrategy,
            },
          })
        },
      }),
  )

  const [degradationContext, setDegradationContext] = React.useState<DegradationContext | null>(
    null,
  )

  // Error logger instance (commented out as unused)
  // const errorLogger = React.useMemo(
  //   () =>
  //     getErrorLogger({
  //       enabled: process.env.NODE_ENV === 'development' || enablePerformanceMonitoring,
  //       enableConsoleLogging: process.env.NODE_ENV === 'development',
  //       enableAnalytics: process.env.NODE_ENV === 'production',
  //       severityThreshold: 'medium',
  //     }),
  //   [enablePerformanceMonitoring],
  // )

  // Check features on mount
  React.useEffect(() => {
    const checkFeatures = async () => {
      try {
        const context = await degradationManager.checkFeatures()
        setDegradationContext(context)
      } catch (error) {
        console.error('[RichText] Feature detection failed:', error)
        setDegradationContext({
          level: 'moderate',
          reason: 'Feature detection failed',
          failedComponents: [],
          availableFeatures: [],
          fallbackStrategy: 'replace',
          timestamp: Date.now(),
        })
      }
    }

    checkFeatures()
  }, [degradationManager])

  // Generate unique ID for accessibility
  const componentId = useMemo(
    () => id || `richtext-${Math.random().toString(36).substr(2, 9)}`,
    [id],
  )

  // Generate ARIA attributes for the main container
  const containerAriaAttrs = useMemo(() => {
    const attrs = generateSectionAriaAttrs(role as any, ariaLabel || 'Rich text content', {
      landmark: role === 'main',
    })

    if (ariaLabelledBy) {
      delete attrs['aria-label']
      attrs['aria-labelledby'] = ariaLabelledBy
    }

    return attrs
  }, [role, ariaLabel, ariaLabelledBy])

  // Generate live region for dynamic content updates
  const liveRegionAttrs = useMemo(
    () => generateLiveRegionAttrs('polite', { atomic: false, relevant: 'additions' }),
    [],
  )

  // Setup keyboard navigation (commented out due to type issues)
  // const keyboardNavigation = useKeyboardNavigation(
  //   containerRef,
  //   { ...DEFAULT_KEYBOARD_CONFIG, ...keyboardConfig },
  //   {
  //     onEscape: () => {
  //       // Focus the container itself on escape
  //       containerRef.current?.focus()
  //     },
  //   },
  // )

  // Create skip links for major sections
  const skipLinks = useMemo(() => {
    const targets = [{ id: `${componentId}-content`, label: 'rich text content' }]

    // Add skip links for blocks if enabled
    if (enableBlocks && data?.root?.children) {
      const blockTargets = data.root.children
        .filter((child: any) => child.type === 'block')
        .map((child: any, index: number) => ({
          id: `${componentId}-block-${index}`,
          label: `${child.fields?.blockType || 'block'} ${index + 1}`,
        }))

      targets.push(...blockTargets)
    }

    return createSkipLinkNavigation(targets)
  }, [componentId, enableBlocks, data])

  // Create screen reader context and content summary (commented out as unused)
  // const screenReaderContext = useMemo(() => {
  //   if (!data?.root?.children) return null

  //   const blocks = data.root.children
  //     .filter((child: any) => child.type === 'block')
  //     .map((child: any) => ({
  //       blockType: child.fields?.blockType || 'unknown',
  //       fields: child.fields || {},
  //     }))

  //   return createScreenReaderContext(blocks)
  // }, [data])

  const contentSummary = useMemo(() => {
    if (!data?.root?.children) return ''

    const blocks = data.root.children
      .filter((child: any) => child.type === 'block')
      .map((child: any) => ({
        blockType: child.fields?.blockType || 'unknown',
        fields: child.fields || {},
      }))

    return generateContentSummary(blocks)
  }, [data])

  // Create live region for screen reader announcements
  const liveRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (liveRegionRef.current && contentSummary) {
      // Announce content summary when component loads
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = contentSummary
        }
      }, 1000) // Delay to allow screen reader to focus on component first
    }
  }, [contentSummary])

  // Performance monitoring hooks
  const performanceHook = usePerformanceMonitoring({
    componentName: 'RichText',
    trackMemory: true,
    trackRenderTime: true,
    trackContentMetrics: true,
    reportInterval: 5000,
  })

  // Content metrics monitoring
  const contentMetrics = useContentMetrics(data)

  // Render performance monitoring (commented out as unused)
  // const renderTime = useRenderPerformance('RichText')

  // Check container query support
  const hasContainerQuerySupport = useMemo(() => supportsContainerQueries(), [])

  // Start performance measurement
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      performanceHook.startMeasurement('richtext-render')
    }
  }, [enablePerformanceMonitoring, performanceHook])

  // Record performance metrics after render
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      const endTime = performanceHook.endMeasurement('richtext-render')

      performanceHook.recordMetrics({
        renderTime: endTime,
        blockCount: contentMetrics.blockCount,
        contentLength: contentMetrics.contentLength,
        blockTypes: contentMetrics.blockTypes,
        componentCount: 1,
        timestamp: Date.now(),
      })
    }
  }, [enablePerformanceMonitoring, performanceHook, contentMetrics])

  // Create converters based on configuration (memoized for performance)
  const jsxConverters = useMemo(() => {
    const baseConverters = converters || createDefaultConverters(props)

    // Apply graceful degradation to block converters if degradation is detected
    if (degradationContext && degradationContext.level !== 'none') {
      const baseConverterResult =
        typeof baseConverters === 'function'
          ? baseConverters({ defaultConverters: {} })
          : baseConverters

      const degradationAwareRenderer = createDegradationAwareBlockRenderer(
        baseConverterResult.blocks || {},
        SimpleFallbacks.Block,
      )

      return ({ defaultConverters }: { defaultConverters: any }) => {
        const baseResult =
          typeof baseConverters === 'function'
            ? baseConverters({ defaultConverters })
            : baseConverters

        return {
          ...baseResult,
          blocks: degradationAwareRenderer,
        }
      }
    }

    return baseConverters
  }, [converters, props, degradationContext])

  // Generate container query wrapper props (memoized)
  const containerQueryProps = useMemo(() => {
    if (!enableContainerQueries) return {}

    return createContainerQueryWrapper({
      name: containerName,
      type: 'inline-size',
      className: hasContainerQuerySupport ? 'richtext-container' : '',
    })
  }, [enableContainerQueries, containerName, hasContainerQuerySupport])

  // Generate responsive className with enhanced utilities and container queries (memoized)
  const responsiveClassName = useMemo(() => {
    const containerClass = responsive
      ? getResponsiveContainerClass(enableGutter, responsive)
      : enableGutter
        ? 'container'
        : 'max-w-none'

    const proseClass = responsive
      ? getResponsiveProseClass(enableProse, responsive)
      : enableProse
        ? getProseTypographyClasses()
        : ''

    const typographyClasses = cn(getA11yTypographyClasses(), getOptimizedTypographyClasses())

    // Container query aware classes
    const containerAwareClasses = enableContainerQueries
      ? createProgressiveContainerClasses({
          base: 'richtext-responsive',
          container: {
            narrow: 'text-sm leading-tight',
            compact: 'text-base leading-normal',
            comfortable: 'text-lg leading-relaxed',
            spacious: 'text-xl leading-loose',
            wide: 'text-2xl leading-loose',
          },
          viewport: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
          },
          containerName,
        })
      : ''

    return getResponsiveClassName(
      cn(
        'payload-richtext',
        containerClass,
        proseClass,
        typographyClasses,
        containerAwareClasses,
        className,
      ),
      responsive,
    )
  }, [
    className,
    enableProse,
    enableGutter,
    responsive,
    enableContainerQueries,
    containerName,
    hasContainerQuerySupport,
  ])

  // Container query wrapper component
  const WrapperComponent = enableContainerQueries ? 'div' : React.Fragment
  const wrapperProps = enableContainerQueries ? containerQueryProps : {}

  return (
    <>
      {/* Skip links for keyboard navigation */}
      {enableKeyboardNavigation &&
        skipLinks.map((skipLink) => (
          <a
            key={skipLink.id}
            {...generateSkipLinkAttrs(skipLink.href.substring(1), skipLink.label)}
            onClick={skipLink.onClick}
            onKeyDown={skipLink.onKeyDown}
          >
            {skipLink.label}
          </a>
        ))}

      {/* Screen reader live region for announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
        aria-label="Content announcements"
      />

      <WrapperComponent {...wrapperProps}>
        <ProgressiveEnhancement
          requiredFeatures={['javascript']}
          enhancedFeatures={['intersectionObserver', 'css-grid', 'css-custom-properties']}
          fallback={
            <div className="richtext-fallback">
              <div className="richtext-fallback-title">Rich Text Content</div>
              <div className="richtext-fallback-content">
                This content requires JavaScript to display properly. Please enable JavaScript in
                your browser.
              </div>
            </div>
          }
        >
          <div
            ref={containerRef}
            id={componentId}
            tabIndex={enableKeyboardNavigation ? 0 : undefined}
            data-degradation-level={degradationContext?.level || 'none'}
            {...containerAriaAttrs}
            {...liveRegionAttrs}
          >
            <ConvertRichText
              converters={jsxConverters}
              className={responsiveClassName}
              data={data}
              {...rest}
            />
          </div>
        </ProgressiveEnhancement>
      </WrapperComponent>

      {/* Performance monitoring components */}
      {enablePerformanceMonitoring && (
        <>
          <PerformanceMonitor enabled={enablePerformanceMonitoring} updateInterval={2000} />
          <PerformanceIndicator
            enabled={enablePerformanceMonitoring}
            threshold={performanceThresholds?.renderTime || 100}
          />
        </>
      )}

      {/* Container query debug info (development only) */}
      {process.env.NODE_ENV === 'development' && enableContainerQueries && (
        <div
          className="richtext-container-debug"
          data-container-size={hasContainerQuerySupport ? 'supported' : 'fallback'}
          data-container-name={containerName}
          data-degradation-level={degradationContext?.level || 'none'}
          aria-hidden="true"
        />
      )}

      {/* Degradation debug info (development only) */}
      {process.env.NODE_ENV === 'development' &&
        degradationContext &&
        degradationContext.level !== 'none' && (
          <div
            className="richtext-degradation-debug"
            data-degradation-level={degradationContext.level}
            data-failed-components={degradationContext.failedComponents.join(',')}
            aria-hidden="true"
            style={{
              position: 'fixed',
              bottom: '10px',
              left: '10px',
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              padding: '8px 12px',
              fontSize: '12px',
              borderRadius: '4px',
              zIndex: 9998,
            }}
          >
            <div>Degradation: {degradationContext.level}</div>
            <div>Failed: {degradationContext.failedComponents.join(', ')}</div>
          </div>
        )}

      {/* Error monitoring dashboard (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <ErrorMonitoringDashboard enabled={true} position="bottom-right" minimized={true} />
      )}
    </>
  )
}

// Default export with graceful degradation wrapper
export default withGracefulDegradation(RichTextComponent, {
  requiredFeatures: ['javascript'],
  fallbackComponent: ({ data, className, ...props }) => (
    <div className={cn('richtext-fallback', className)} {...props}>
      <div className="richtext-fallback-title">Rich Text Content</div>
      <div className="richtext-fallback-content">
        {data?.root?.children ? (
          <div>
            Content available but requires JavaScript for full functionality.
            {data.root.children.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '11px' }}>
                Contains {data.root.children.length} content blocks.
              </div>
            )}
          </div>
        ) : (
          'This content requires JavaScript to display properly.'
        )}
      </div>
    </div>
  ),
  degradationOptions: {
    enableFallbacks: true,
    fallbackStrategy: 'replace',
    maxDegradationLevel: 'moderate',
    logDegradation: process.env.NODE_ENV === 'development',
    showDegradationNotice: true,
  },
})

// Named export for compatibility
export const RichText = withGracefulDegradation(RichTextComponent, {
  requiredFeatures: ['javascript'],
  fallbackComponent: ({ children }: any) => (
    <SimpleFallbacks.Text>{children || 'Content unavailable'}</SimpleFallbacks.Text>
  ),
  degradationOptions: {
    enableFallbacks: true,
    fallbackStrategy: 'simplify',
    maxDegradationLevel: 'severe',
    logDegradation: process.env.NODE_ENV === 'development',
  },
})
