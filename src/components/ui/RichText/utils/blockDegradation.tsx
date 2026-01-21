/**
 * Block-specific graceful degradation utilities
 * Provides fallback rendering for different block types
 */

import React from 'react'
import {
  SimpleFallbacks,
  withGracefulDegradation,
  type DegradationContext,
  type DegradationLevel,
} from './gracefulDegradation'

// Block-specific fallback components
export const BlockFallbacks = {
  // Hero block fallback
  Hero: ({ heading, subheading, backgroundImage, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-hero" {...props}>
      <div className="richtext-fallback-title">Hero Section</div>
      <div className="richtext-fallback-content">
        {heading && (
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {heading}
          </h1>
        )}
        {subheading && <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>{subheading}</p>}
        {backgroundImage && (
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            Background image: {backgroundImage.alt || 'Hero background'}
          </div>
        )}
      </div>
    </div>
  ),

  // Content block fallback
  Content: ({ content, columns, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-content" {...props}>
      <div className="richtext-fallback-title">Content Block</div>
      <div className="richtext-fallback-content">
        {content && (
          <div style={{ lineHeight: 1.6 }}>
            {typeof content === 'string' ? content : 'Rich text content available'}
          </div>
        )}
        {columns && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            Layout: {columns} columns
          </div>
        )}
      </div>
    </div>
  ),

  // Media block fallback
  MediaBlock: ({ media, caption, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-media" {...props}>
      <div className="richtext-fallback-title">Media Block</div>
      <div className="richtext-fallback-content">
        {media && (
          <SimpleFallbacks.Image
            src={media.url || media.filename}
            alt={media.alt || caption || 'Media content'}
          />
        )}
        {caption && (
          <div style={{ fontSize: '0.875rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  ),

  // Call to Action block fallback
  CallToAction: ({ heading, description, links, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-cta" {...props}>
      <div className="richtext-fallback-title">Call to Action</div>
      <div className="richtext-fallback-content">
        {heading && (
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {heading}
          </h2>
        )}
        {description && <p style={{ marginBottom: '1rem' }}>{description}</p>}
        {links && links.length > 0 && (
          <div>
            {links.map((link: any, index: number) => (
              <SimpleFallbacks.Link key={index} href={link.url || link.href}>
                {link.label || link.text || `Link ${index + 1}`}
              </SimpleFallbacks.Link>
            ))}
          </div>
        )}
      </div>
    </div>
  ),

  // Code block fallback
  Code: ({ code, language, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-code" {...props}>
      <div className="richtext-fallback-title">Code Block</div>
      <div className="richtext-fallback-content">
        {language && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
            Language: {language}
          </div>
        )}
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {code || 'Code content'}
        </pre>
      </div>
    </div>
  ),

  // Banner block fallback
  Banner: ({ content, type, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-banner" {...props}>
      <div className="richtext-fallback-title">Banner</div>
      <div className="richtext-fallback-content">
        {type && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
            Type: {type}
          </div>
        )}
        {content && <div>{content}</div>}
      </div>
    </div>
  ),

  // Archive block fallback
  Archive: ({ relationTo, populateBy, ...props }: any) => (
    <div className="richtext-fallback richtext-fallback-archive" {...props}>
      <div className="richtext-fallback-title">Archive</div>
      <div className="richtext-fallback-content">
        <div style={{ fontSize: '0.875rem' }}>Archive of {relationTo || 'content'}</div>
        {populateBy && (
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            Populated by: {populateBy}
          </div>
        )}
      </div>
    </div>
  ),

  // Generic block fallback
  Generic: ({ blockType, ...data }: { blockType: string; [key: string]: any }) => (
    <SimpleFallbacks.Block blockType={blockType} data={data} />
  ),
}

/**
 * Get appropriate fallback component for a block type
 */
export const getBlockFallback = (blockType: string): React.ComponentType<any> => {
  const fallbackMap: Record<string, React.ComponentType<any>> = {
    hero: BlockFallbacks.Hero,
    content: BlockFallbacks.Content,
    mediaBlock: BlockFallbacks.MediaBlock,
    callToAction: BlockFallbacks.CallToAction,
    code: BlockFallbacks.Code,
    banner: BlockFallbacks.Banner,
    archive: BlockFallbacks.Archive,
  }

  return fallbackMap[blockType] || BlockFallbacks.Generic
}

/**
 * Create a degradation-aware block component
 */
export const createDegradationAwareBlock = <P extends Record<string, any>>(
  BlockComponent: React.ComponentType<P>,
  blockType: string,
  options?: {
    requiredFeatures?: string[]
    customFallback?: React.ComponentType<P>
    degradationLevel?: 'strict' | 'moderate' | 'permissive'
  },
) => {
  const {
    requiredFeatures = ['javascript'],
    customFallback,
    degradationLevel = 'moderate',
  } = options || {}

  const FallbackComponent = customFallback || getBlockFallback(blockType)

  return withGracefulDegradation(BlockComponent, {
    requiredFeatures,
    fallbackComponent: (props: P) => <FallbackComponent blockType={blockType} {...props} />,
    degradationOptions: {
      enableFallbacks: true,
      fallbackStrategy: 'replace',
      maxDegradationLevel: degradationLevel as DegradationLevel,
      logDegradation: process.env.NODE_ENV === 'development',
      onDegradation: (context: DegradationContext) => {
        console.warn(`[Block:${blockType}] Graceful degradation activated:`, context)
      },
    },
  })
}

/**
 * Block degradation configuration
 */
export const blockDegradationConfig = {
  // Blocks that require JavaScript
  interactive: ['callToAction', 'form', 'search', 'filter'],

  // Blocks that can work without JavaScript
  static: ['content', 'hero', 'banner', 'archive'],

  // Blocks that require advanced features
  advanced: ['video', 'gallery', 'carousel', 'map'],

  // Critical blocks that should always render
  critical: ['content', 'hero'],
}

/**
 * Determine if a block should be rendered based on degradation context
 */
export const shouldRenderBlock = (
  blockType: string,
  degradationContext: DegradationContext | null,
): boolean => {
  if (!degradationContext || degradationContext.level === 'none') {
    return true
  }

  const { level, failedComponents } = degradationContext

  // Always render critical blocks
  if (blockDegradationConfig.critical.includes(blockType)) {
    return true
  }

  // Skip interactive blocks if JavaScript is not available
  if (
    blockDegradationConfig.interactive.includes(blockType) &&
    failedComponents.includes('javascript')
  ) {
    return false
  }

  // Skip advanced blocks on severe degradation
  if (
    blockDegradationConfig.advanced.includes(blockType) &&
    ['severe', 'critical'].includes(level)
  ) {
    return false
  }

  // Render static blocks unless critical degradation
  if (blockDegradationConfig.static.includes(blockType) && level !== 'critical') {
    return true
  }

  // Default behavior based on degradation level
  switch (level) {
    case 'minimal':
      return true
    case 'moderate':
      return !blockDegradationConfig.advanced.includes(blockType)
    case 'severe':
      return (
        blockDegradationConfig.static.includes(blockType) ||
        blockDegradationConfig.critical.includes(blockType)
      )
    case 'critical':
      return blockDegradationConfig.critical.includes(blockType)
    default:
      return true
  }
}

/**
 * Filter blocks based on degradation context
 */
export const filterBlocksByDegradation = (
  blocks: Array<{ blockType: string; [key: string]: any }>,
  degradationContext: DegradationContext | null,
): Array<{ blockType: string; [key: string]: any }> => {
  if (!degradationContext || degradationContext.level === 'none') {
    return blocks
  }

  return blocks.filter((block) => shouldRenderBlock(block.blockType, degradationContext))
}

/**
 * Create degradation-aware block renderer with filtering
 */
export const createDegradationAwareBlockRendererWithFiltering = (
  blockRenderers: Record<string, React.ComponentType<any>>,
  degradationContext: DegradationContext | null,
) => {
  return (blockType: string, data: any) => {
    // Check if block should be rendered
    if (!shouldRenderBlock(blockType, degradationContext)) {
      return null
    }

    const Renderer = blockRenderers[blockType]
    const FallbackRenderer = getBlockFallback(blockType)

    if (!Renderer) {
      return <FallbackRenderer blockType={blockType} {...data} />
    }

    // Apply degradation awareness to the renderer
    const DegradationAwareRenderer = createDegradationAwareBlock(Renderer, blockType)

    return <DegradationAwareRenderer {...data} />
  }
}

/**
 * Hook for block degradation context
 */
export const useBlockDegradation = (blockType: string) => {
  const [shouldRender, setShouldRender] = React.useState(true)
  const [fallbackComponent, setFallbackComponent] = React.useState<React.ComponentType<any> | null>(
    null,
  )

  React.useEffect(() => {
    // This would be connected to the global degradation context
    // For now, we'll use a simple feature detection
    const checkFeatures = () => {
      const hasJavaScript = typeof window !== 'undefined'
      const hasAdvancedFeatures = typeof IntersectionObserver !== 'undefined'

      let degradationLevel: DegradationContext['level'] = 'none'

      if (!hasJavaScript) {
        degradationLevel = 'critical'
      } else if (!hasAdvancedFeatures && blockDegradationConfig.advanced.includes(blockType)) {
        degradationLevel = 'moderate'
      }

      const mockContext: DegradationContext = {
        level: degradationLevel,
        reason: 'Feature detection',
        failedComponents: hasJavaScript ? [] : ['javascript'],
        availableFeatures: hasJavaScript ? ['javascript'] : [],
        fallbackStrategy: 'replace',
        timestamp: Date.now(),
      }

      const canRenderBlock = shouldRenderBlock(blockType, mockContext)
      setShouldRender(canRenderBlock)

      if (!canRenderBlock) {
        setFallbackComponent(() => getBlockFallback(blockType))
      }
    }

    checkFeatures()
  }, [blockType])

  return {
    shouldRender,
    fallbackComponent,
    createDegradationAware: (Component: React.ComponentType<any>) =>
      createDegradationAwareBlock(Component, blockType),
  }
}
