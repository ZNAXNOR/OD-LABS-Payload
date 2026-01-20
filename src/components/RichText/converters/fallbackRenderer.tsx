import React from 'react'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters?: Record<string, any>) => void
  }
}

// ============================================================================
// FALLBACK RENDERER TYPES
// ============================================================================

interface UnknownBlockData {
  blockType: string
  fields: Record<string, any>
  id?: string
}

interface FallbackRendererProps {
  blockType: string
  data: Record<string, any>
  showDetails?: boolean
  allowEdit?: boolean
  onEdit?: (blockType: string, data: Record<string, any>) => void
}

interface FallbackConfig {
  showInProduction?: boolean
  showDetails?: boolean
  allowDataInspection?: boolean
  customMessage?: string
  reportUnknownBlocks?: boolean
}

// Simple BlockConverter type to avoid import issues
type BlockConverter = Record<string, any>

// ============================================================================
// FALLBACK COMPONENTS
// ============================================================================

/**
 * Default fallback component for unknown block types
 */
const DefaultFallbackRenderer: React.FC<FallbackRendererProps> = ({
  blockType,
  data,
  showDetails = false,
  allowEdit = false,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [reportSent, setReportSent] = React.useState(false)

  const handleReport = React.useCallback(() => {
    if (reportSent) return

    // Report unknown block to analytics or error tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'unknown_block_encountered', {
        block_type: blockType,
        custom_map: {
          hasData: Object.keys(data).length > 0,
          dataKeys: Object.keys(data).join(','),
        },
      })
    }

    console.warn('[RichText] Unknown block type encountered:', {
      blockType,
      data,
      timestamp: new Date().toISOString(),
    })

    setReportSent(true)
  }, [blockType, data, reportSent])

  React.useEffect(() => {
    handleReport()
  }, [handleReport])

  return (
    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Unknown Block Type</h3>
          <p className="mt-1 text-sm text-yellow-600">
            Block type <code className="bg-yellow-100 px-1 rounded">{blockType}</code> is not
            recognized and cannot be rendered.
          </p>

          {showDetails && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-sm text-yellow-700 hover:text-yellow-800"
              >
                {isExpanded ? 'Hide' : 'Show'} block data
                <svg
                  className={`ml-1 h-4 w-4 transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="mt-2 p-3 bg-yellow-100 rounded text-xs">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {allowEdit && onEdit && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => onEdit(blockType, data)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Edit Block
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Minimal fallback component for production use
 */
const MinimalFallbackRenderer: React.FC<FallbackRendererProps> = ({ blockType }) => (
  <div className="p-2 border border-gray-200 bg-gray-50 rounded text-sm text-gray-600 mb-2">
    Content not available (block type: {blockType})
  </div>
)

/**
 * Development fallback with detailed debugging information
 */
const DevelopmentFallbackRenderer: React.FC<FallbackRendererProps> = ({ blockType, data }) => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(async () => {
    try {
      const debugInfo = {
        blockType,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy debug info:', error)
    }
  }, [blockType, data])

  return (
    <div className="p-4 border border-orange-300 bg-orange-50 rounded-md mb-4">
      <div className="mb-3">
        <h3 className="text-lg font-medium text-orange-800">Unknown Block Type (Development)</h3>
        <p className="text-sm text-orange-600 mt-1">
          Block type: <code className="bg-orange-100 px-1 rounded font-mono">{blockType}</code>
        </p>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-orange-800 mb-2">Available Data:</h4>
        <div className="bg-orange-100 p-3 rounded">
          <pre className="text-xs text-orange-700 overflow-auto max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-orange-800 mb-2">Debugging Tips:</h4>
        <ul className="text-sm text-orange-600 list-disc list-inside space-y-1">
          <li>Check if the block type is registered in the block converter registry</li>
          <li>Verify the block component is properly imported</li>
          <li>Ensure the block configuration matches the expected interface</li>
          <li>Check for typos in the block type name</li>
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {copied ? 'Copied!' : 'Copy Debug Info'}
        </button>
      </div>
    </div>
  )
}

/**
 * Silent fallback that renders nothing (for production where you want to hide unknown blocks)
 */
const SilentFallbackRenderer: React.FC<FallbackRendererProps> = () => null

// ============================================================================
// FALLBACK REGISTRY
// ============================================================================

/**
 * Registry of fallback renderers
 */
export const fallbackRenderers = {
  default: DefaultFallbackRenderer,
  minimal: MinimalFallbackRenderer,
  development: DevelopmentFallbackRenderer,
  silent: SilentFallbackRenderer,
} as const

export type FallbackRendererType = keyof typeof fallbackRenderers

// ============================================================================
// FALLBACK CONVERTER FACTORY
// ============================================================================

/**
 * Creates a fallback converter for unknown block types
 */
const createFallbackConverter = (
  blockType: string,
  config: FallbackConfig = {},
): (({ node }: { node: { fields: any } }) => React.ReactElement | null) => {
  const {
    showInProduction = false,
    showDetails = process.env.NODE_ENV === 'development',
    allowDataInspection = process.env.NODE_ENV === 'development',
    reportUnknownBlocks = true,
  } = config

  return ({ node }) => {
    // In production, optionally hide unknown blocks
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return React.createElement(SilentFallbackRenderer, {
        blockType,
        data: node.fields,
      })
    }

    // Choose appropriate fallback renderer
    const FallbackComponent =
      process.env.NODE_ENV === 'development'
        ? DevelopmentFallbackRenderer
        : showDetails
          ? DefaultFallbackRenderer
          : MinimalFallbackRenderer

    // Report unknown block if enabled
    if (reportUnknownBlocks && process.env.NODE_ENV === 'development') {
      console.warn(`[RichText] Unknown block type: ${blockType}`, node.fields)
    }

    return React.createElement(FallbackComponent, {
      blockType,
      data: node.fields,
      showDetails: allowDataInspection,
    })
  }
}

/**
 * Enhanced block converter registry with automatic fallback support
 */
const createFallbackAwareConverters = (
  baseConverters: BlockConverter,
  fallbackConfig?: FallbackConfig,
): BlockConverter => {
  // Create a proxy to handle unknown block types
  return new Proxy(baseConverters, {
    get(target, prop) {
      if (typeof prop === 'string' && !(prop in target)) {
        // Return fallback converter for unknown block types
        return createFallbackConverter(prop, fallbackConfig)
      }
      return target[prop as keyof BlockConverter]
    },

    has() {
      // Always return true so that any block type is considered "supported"
      return true
    },

    ownKeys(target) {
      // Return all known block types
      return Reflect.ownKeys(target)
    },
  })
}

// ============================================================================
// BLOCK TYPE VALIDATION
// ============================================================================

/**
 * Validates if a block type is known
 */
const isKnownBlockType = (blockType: string, converters: BlockConverter): boolean => {
  return blockType in converters
}

/**
 * Gets all known block types from a converter registry
 */
const getKnownBlockTypes = (converters: BlockConverter): string[] => {
  return Object.keys(converters)
}

/**
 * Validates block data structure
 */
const validateBlockData = (data: any): data is UnknownBlockData => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.blockType === 'string' &&
    data.fields &&
    typeof data.fields === 'object'
  )
}

// ============================================================================
// ANALYTICS AND REPORTING
// ============================================================================

/**
 * Reports unknown block encounters to analytics
 */
const reportUnknownBlock = (
  blockType: string,
  data: Record<string, any>,
  context?: Record<string, any>,
): void => {
  const report = {
    blockType,
    dataKeys: Object.keys(data),
    hasData: Object.keys(data).length > 0,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
    ...context,
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[RichText] Unknown block report:', report)
  }

  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'unknown_block_encountered', {
      block_type: blockType,
      custom_map: report,
    })
  }

  // You can also integrate with other analytics services here
  // Example: analytics.track('Unknown Block Encountered', report)
}

/**
 * Gets statistics about unknown block encounters
 */
const getUnknownBlockStats = (): {
  totalEncounters: number
  uniqueBlockTypes: string[]
  lastEncounter: string | null
} => {
  // This would typically be stored in a more persistent way
  const stats = {
    totalEncounters: 0,
    uniqueBlockTypes: [] as string[],
    lastEncounter: null as string | null,
  }

  // In a real implementation, you'd retrieve this from localStorage,
  // a state management system, or an analytics service
  return stats
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createFallbackConverter,
  createFallbackAwareConverters,
  fallbackRenderers,
  isKnownBlockType,
  getKnownBlockTypes,
  validateBlockData,
  reportUnknownBlock,
  getUnknownBlockStats,
}

export {
  DefaultFallbackRenderer,
  MinimalFallbackRenderer,
  DevelopmentFallbackRenderer,
  SilentFallbackRenderer,
  createFallbackConverter,
  createFallbackAwareConverters,
  isKnownBlockType,
  getKnownBlockTypes,
  validateBlockData,
  reportUnknownBlock,
  getUnknownBlockStats,
}

// Type exports
export type { FallbackRendererProps, FallbackConfig, UnknownBlockData }
