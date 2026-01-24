import type {
  ArchiveBlock,
  BannerBlock,
  BeforeAfterBlock,
  CallToActionBlock,
  CaseStudyBlock,
  CodeBlock,
  ContactFormBlock,
  ContainerBlock,
  ContentBlock,
  DividerBlock,
  FAQAccordionBlock,
  FeatureGridBlock,
  HeroBlock,
  MediaBlock,
  NewsletterBlock,
  ProjectShowcaseBlock,
  SocialProofBlock,
  SpacerBlock,
  StatsCounterBlock,
  TestimonialBlock,
  TimelineBlock,
} from '@/payload-types'
import type { PricingTableBlock } from '@/types/services-blocks'
import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

// Re-export for use in other files
export type { SerializedBlockNode }

// Import keyboard navigation types
import type { KeyboardNavConfig } from './utils/keyboardNavigation'

// All available block types in the system
export type AllBlockTypes =
  | ArchiveBlock
  | BannerBlock
  | BeforeAfterBlock
  | CallToActionBlock
  | CaseStudyBlock
  | CodeBlock
  | ContactFormBlock
  | ContainerBlock
  | ContentBlock
  | DividerBlock
  | FAQAccordionBlock
  | FeatureGridBlock
  | HeroBlock
  | MediaBlock
  | NewsletterBlock
  | PricingTableBlock
  // | ProcessStepsBlock // Temporarily disabled due to database relation issue
  | ProjectShowcaseBlock
  // | ServicesGridBlock // Temporarily disabled due to database relation issue
  | SocialProofBlock
  | SpacerBlock
  | StatsCounterBlock
  // | TechStackBlock // Temporarily disabled due to database relation issue
  | TestimonialBlock
  | TimelineBlock

// Extended node types including all blocks
export type ExtendedNodeTypes = DefaultNodeTypes | SerializedBlockNode<AllBlockTypes>

// Enhanced RichText component props
export interface RichTextProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  enableBlocks?: boolean
  blockWhitelist?: string[]
  converters?: Partial<JSXConvertersFunction<ExtendedNodeTypes>>
  // Accessibility props
  'aria-label'?: string
  'aria-labelledby'?: string
  role?: 'main' | 'article' | 'section' | 'region' | 'complementary'
}

// Block converter function type
export interface BlockConverter {
  [blockType: string]: ({
    node,
  }: {
    node: SerializedBlockNode<AllBlockTypes>
  }) => React.ReactElement
}

// Custom converters interface that includes blocks
export interface CustomConverters {
  blocks?: Partial<BlockConverter>
  [key: string]: any
}

// Link validation types
export interface LinkValidationResult {
  isValid: boolean
  error?: string
  warning?: string
}

export interface LinkValidationRules {
  allowedDomains?: string[]
  blockedDomains?: string[]
  requireHttps?: boolean
  maxUrlLength?: number
  validateInternalLinks?: boolean
}

// Link converter configuration
export interface LinkConverterConfig {
  internalDocToHref?: ({ linkNode }: { linkNode: SerializedLinkNode }) => string
  externalLinkProps?: (linkNode: SerializedLinkNode) => Record<string, any>
}

// Enhanced link converter configuration
export interface EnhancedLinkConverterConfig extends LinkConverterConfig {
  validationRules?: LinkValidationRules
  enablePreview?: boolean
  enableAnalytics?: boolean
  onLinkClick?: (url: string, type: 'internal' | 'external') => void
  onValidationError?: (error: string, linkNode: SerializedLinkNode) => void
}

// Media converter configuration
export interface MediaConverterConfig {
  enableCaption?: boolean
  enableZoom?: boolean
  className?: string
  imgClassName?: string
  captionClassName?: string
}

// Image optimization configuration
export interface ImageOptimizationOptions {
  strategy?: 'default' | 'critical' | 'progressive' | 'performance' | 'bandwidth-aware'
  enableWebP?: boolean
  enableAVIF?: boolean
  quality?: number
  enableBlurPlaceholder?: boolean
  enableIntersectionObserver?: boolean
  enablePerformanceMonitoring?: boolean
  loadingStrategy?: 'lazy' | 'eager' | 'progressive' | 'intersection'
  enablePreload?: boolean
  enableRetry?: boolean
  maxRetries?: number
}

// Responsive design options
export interface ResponsiveOptions {
  mobile?: {
    enableGutter?: boolean
    enableProse?: boolean
    className?: string
  }
  tablet?: {
    enableGutter?: boolean
    enableProse?: boolean
    className?: string
  }
  desktop?: {
    enableGutter?: boolean
    enableProse?: boolean
    className?: string
  }
}

// Enhanced RichText props with all options
export interface EnhancedRichTextProps extends RichTextProps {
  responsive?: ResponsiveOptions
  customConverters?: CustomConverters
  blockConverterConfig?: Record<string, any>
  linkConverterConfig?: EnhancedLinkConverterConfig
  mediaConverterConfig?: MediaConverterConfig
  imageOptimization?: ImageOptimizationOptions
  enablePerformanceMonitoring?: boolean
  performanceThresholds?: PerformanceThresholds
  enableContainerQueries?: boolean
  containerName?: string
  containerQueryConfig?: ContainerQueryConfig
  // Keyboard navigation props
  enableKeyboardNavigation?: boolean
  keyboardConfig?: KeyboardNavConfig
}

// Container query configuration
export interface ContainerQueryConfig {
  name?: string
  type?: 'inline-size' | 'block-size' | 'size'
  breakpoints?: Record<string, number>
  className?: string
  enableFallback?: boolean
  debugMode?: boolean
}

// Container query breakpoint configuration
export interface ContainerBreakpoint {
  name: string
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

// Container query responsive classes
export interface ContainerQueryClasses {
  container: string
  queries: Record<string, string>
}

// Performance monitoring types
export interface PerformanceThresholds {
  renderTime?: number // ms
  memoryUsage?: number // MB
  blockCount?: number
  contentLength?: number // characters
}

export interface PerformanceMetrics {
  renderTime: number
  blockCount: number
  componentCount: number
  memoryUsage?: number
  bundleSize?: number
  timestamp: number
  contentLength: number
  blockTypes: string[]
}

export interface PerformanceReport {
  metrics: PerformanceMetrics
  thresholds: PerformanceThresholds
  warnings: string[]
  recommendations: string[]
  score: number // 0-100
}

// Utility types for block filtering
export type BlockTypeString =
  | 'archive'
  | 'banner'
  | 'beforeAfter'
  | 'cta'
  | 'caseStudy'
  | 'code'
  | 'contactForm'
  | 'container'
  | 'content'
  | 'divider'
  | 'faqAccordion'
  | 'featureGrid'
  | 'hero'
  | 'mediaBlock'
  | 'newsletter'
  | 'pricingTable'
  | 'processSteps'
  | 'projectShowcase'
  | 'servicesGrid'
  | 'socialProof'
  | 'spacer'
  | 'statsCounter'
  | 'techStack'
  | 'testimonial'
  | 'timeline'

// Block category types for organization
export type BlockCategory =
  | 'content'
  | 'layout'
  | 'cta'
  | 'portfolio'
  | 'services'
  | 'technical'
  | 'hero'

// Block metadata for enhanced functionality
export interface BlockMetadata {
  category: BlockCategory
  description: string
  icon?: string
  previewImage?: string
  isInline?: boolean
  supportsRichText?: boolean
}

// Registry type for block metadata
export type BlockRegistry = Record<BlockTypeString, BlockMetadata>

// Re-export DefaultTypedEditorState for external use
export type { DefaultTypedEditorState }
