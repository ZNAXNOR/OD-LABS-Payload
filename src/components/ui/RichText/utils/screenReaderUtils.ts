/**
 * Screen reader utilities for RichText components
 * Provides comprehensive screen reader support and announcements
 */

import { announceToScreenReader, liveRegion } from '@/utilities/accessibility'

/**
 * Screen reader announcement priorities
 */
export type AnnouncementPriority = 'polite' | 'assertive'

/**
 * Screen reader context information
 */
export interface ScreenReaderContext {
  totalBlocks?: number
  currentBlock?: number
  blockType?: string
  hasInteractiveElements?: boolean
  hasMedia?: boolean
  hasHeadings?: boolean
}

/**
 * Generate screen reader descriptions for blocks
 */
export const generateScreenReaderDescription = (
  blockType: string,
  blockData: Record<string, any>,
  context?: ScreenReaderContext,
): string => {
  const descriptions: Record<string, (data: any, _ctx?: ScreenReaderContext) => string> = {
    hero: (data, _ctx) => {
      const parts = ['Hero section']
      if (data.heading) parts.push(`with heading "${data.heading}"`)
      if (data.subheading) parts.push(`and subheading`)
      if (data.actions?.length) parts.push(`containing ${data.actions.length} action buttons`)
      if (data.media || data.videoUrl) parts.push('with background media')
      return parts.join(' ')
    },

    content: (data, _ctx) => {
      const parts = ['Content section']
      if (data.richText) {
        const textLength = JSON.stringify(data.richText).length
        if (textLength > 1000) parts.push('with long text content')
        else if (textLength > 500) parts.push('with medium text content')
        else parts.push('with short text content')
      }
      return parts.join(' ')
    },

    mediaBlock: (data, _ctx) => {
      const parts = ['Media block']
      if (data.media?.mimeType?.startsWith('image/')) {
        parts.push('containing an image')
        if (data.media.alt) parts.push(`with alt text: ${data.media.alt}`)
      } else if (data.media?.mimeType?.startsWith('video/')) {
        parts.push('containing a video')
      }
      if (data.caption) parts.push('with caption')
      return parts.join(' ')
    },

    banner: (data, _ctx) => {
      const parts = ['Banner']
      if (data.type) parts.push(`of type ${data.type}`)
      if (data.content) parts.push('with content')
      return parts.join(' ')
    },

    code: (data, _ctx) => {
      const parts = ['Code block']
      if (data.language) parts.push(`in ${data.language}`)
      if (data.code) {
        const lines = data.code.split('\n').length
        parts.push(`with ${lines} lines of code`)
      }
      return parts.join(' ')
    },

    cta: (data, _ctx) => {
      const parts = ['Call to action']
      if (data.heading) parts.push(`with heading "${data.heading}"`)
      if (data.links?.length) parts.push(`containing ${data.links.length} action links`)
      return parts.join(' ')
    },

    contactForm: (data, _ctx) => {
      const parts = ['Contact form']
      if (data.fields?.length) parts.push(`with ${data.fields.length} form fields`)
      return parts.join(' ')
    },

    newsletter: (_data, _ctx) => {
      return 'Newsletter signup form'
    },

    socialProof: (data, _ctx) => {
      const parts = ['Social proof section']
      if (data.testimonials?.length) parts.push(`with ${data.testimonials.length} testimonials`)
      if (data.logos?.length) parts.push(`and ${data.logos.length} company logos`)
      return parts.join(' ')
    },

    servicesGrid: (data, _ctx) => {
      const parts = ['Services grid']
      if (data.services?.length) parts.push(`with ${data.services.length} services`)
      return parts.join(' ')
    },

    techStack: (data, _ctx) => {
      const parts = ['Technology stack']
      if (data.technologies?.length)
        parts.push(`featuring ${data.technologies.length} technologies`)
      return parts.join(' ')
    },

    processSteps: (data, _ctx) => {
      const parts = ['Process steps']
      if (data.steps?.length) parts.push(`with ${data.steps.length} steps`)
      return parts.join(' ')
    },

    pricingTable: (data, _ctx) => {
      const parts = ['Pricing table']
      if (data.plans?.length) parts.push(`with ${data.plans.length} pricing plans`)
      return parts.join(' ')
    },

    projectShowcase: (data, _ctx) => {
      const parts = ['Project showcase']
      if (data.project?.title) parts.push(`for project "${data.project.title}"`)
      return parts.join(' ')
    },

    caseStudy: (data, _ctx) => {
      const parts = ['Case study']
      if (data.title) parts.push(`titled "${data.title}"`)
      if (data.client) parts.push(`for client ${data.client}`)
      return parts.join(' ')
    },

    beforeAfter: (_data, _ctx) => {
      return 'Before and after comparison with two images'
    },

    testimonial: (data, _ctx) => {
      const parts = ['Testimonial']
      if (data.author) parts.push(`from ${data.author}`)
      if (data.company) parts.push(`at ${data.company}`)
      return parts.join(' ')
    },

    featureGrid: (data, _ctx) => {
      const parts = ['Features grid']
      if (data.features?.length) parts.push(`with ${data.features.length} features`)
      return parts.join(' ')
    },

    statsCounter: (data, _ctx) => {
      const parts = ['Statistics counter']
      if (data.stats?.length) parts.push(`with ${data.stats.length} statistics`)
      return parts.join(' ')
    },

    faqAccordion: (data, _ctx) => {
      const parts = ['Frequently asked questions']
      if (data.faqs?.length) parts.push(`with ${data.faqs.length} questions`)
      return parts.join(' ')
    },

    timeline: (data, _ctx) => {
      const parts = ['Timeline']
      if (data.events?.length) parts.push(`with ${data.events.length} events`)
      return parts.join(' ')
    },

    container: (data, _ctx) => {
      const parts = ['Content container']
      if (data.children?.length) parts.push(`containing ${data.children.length} child elements`)
      return parts.join(' ')
    },

    divider: (_data, _ctx) => {
      return 'Section divider'
    },

    spacer: (_data, _ctx) => {
      return 'Spacing element'
    },
  }

  const generator = descriptions[blockType]
  if (generator) {
    return generator(blockData, context)
  }

  return `${blockType} block`
}

/**
 * Generate navigation instructions for screen readers
 */
export const generateNavigationInstructions = (context: ScreenReaderContext): string => {
  const instructions = []

  if (context.totalBlocks && context.totalBlocks > 1) {
    instructions.push(`This content contains ${context.totalBlocks} blocks.`)
  }

  if (context.hasInteractiveElements) {
    instructions.push('Use Tab to navigate between interactive elements.')
  }

  if (context.hasHeadings) {
    instructions.push('Use heading navigation to jump between sections.')
  }

  if (context.hasMedia) {
    instructions.push('Media elements include descriptive text.')
  }

  instructions.push('Use arrow keys to navigate through content.')

  return instructions.join(' ')
}

/**
 * Announce block changes to screen readers
 */
export const announceBlockChange = (
  blockType: string,
  blockData: Record<string, any>,
  context?: ScreenReaderContext,
  priority: AnnouncementPriority = 'polite',
): void => {
  const description = generateScreenReaderDescription(blockType, blockData, context)

  let announcement = description

  if (context?.currentBlock && context?.totalBlocks) {
    announcement = `Block ${context.currentBlock} of ${context.totalBlocks}: ${description}`
  }

  announceToScreenReader(announcement, priority)
}

/**
 * Announce content loading states
 */
export const announceLoadingState = (
  state: 'loading' | 'loaded' | 'error',
  blockType?: string,
  priority: AnnouncementPriority = 'polite',
): void => {
  const messages = {
    loading: blockType ? `Loading ${blockType} block...` : 'Loading content...',
    loaded: blockType ? `${blockType} block loaded` : 'Content loaded',
    error: blockType ? `Error loading ${blockType} block` : 'Error loading content',
  }

  announceToScreenReader(messages[state], priority)
}

/**
 * Announce interactive element states
 */
export const announceInteractionState = (
  element: string,
  state: 'focused' | 'activated' | 'expanded' | 'collapsed' | 'selected' | 'deselected',
  context?: string,
  priority: AnnouncementPriority = 'polite',
): void => {
  const messages = {
    focused: `${element} focused`,
    activated: `${element} activated`,
    expanded: `${element} expanded`,
    collapsed: `${element} collapsed`,
    selected: `${element} selected`,
    deselected: `${element} deselected`,
  }

  let announcement = messages[state]
  if (context) {
    announcement += ` in ${context}`
  }

  announceToScreenReader(announcement, priority)
}

/**
 * Create live region for dynamic content updates
 */
export const createContentLiveRegion = (priority: AnnouncementPriority = 'polite') => {
  return liveRegion.create(priority)
}

/**
 * Update live region with content changes
 */
export const updateContentLiveRegion = (region: HTMLElement, message: string): void => {
  liveRegion.update(region, message)
}

/**
 * Screen reader friendly content summaries
 */
export const generateContentSummary = (
  blocks: Array<{ blockType: string; fields: any }>,
): string => {
  const summary = []

  summary.push(`This content contains ${blocks.length} sections.`)

  // Count different types of blocks
  const blockCounts: Record<string, number> = {}
  let hasInteractive = false
  let hasMedia = false
  let hasHeadings = false

  blocks.forEach((block) => {
    blockCounts[block.blockType] = (blockCounts[block.blockType] || 0) + 1

    // Check for interactive elements
    if (['cta', 'contactForm', 'newsletter'].includes(block.blockType)) {
      hasInteractive = true
    }

    // Check for media
    if (['mediaBlock', 'hero', 'beforeAfter'].includes(block.blockType)) {
      hasMedia = true
    }

    // Check for headings
    if (block.fields?.heading || block.fields?.title) {
      hasHeadings = true
    }
  })

  // Describe block types
  const blockTypes = Object.entries(blockCounts)
    .map(([type, count]) => (count > 1 ? `${count} ${type} blocks` : `1 ${type} block`))
    .join(', ')

  if (blockTypes) {
    summary.push(`Including: ${blockTypes}.`)
  }

  // Add navigation hints
  const context: ScreenReaderContext = {
    totalBlocks: blocks.length,
    hasInteractiveElements: hasInteractive,
    hasMedia,
    hasHeadings,
  }

  summary.push(generateNavigationInstructions(context))

  return summary.join(' ')
}

/**
 * Generate alt text for complex content
 */
export const generateComplexContentAlt = (
  blockType: string,
  blockData: Record<string, any>,
): string => {
  switch (blockType) {
    case 'statsCounter':
      if (blockData.stats?.length) {
        const statDescriptions = blockData.stats
          .map((stat: any) => `${stat.value} ${stat.label}`)
          .join(', ')
        return `Statistics: ${statDescriptions}`
      }
      break

    case 'pricingTable':
      if (blockData.plans?.length) {
        const planDescriptions = blockData.plans
          .map((plan: any) => `${plan.name} at ${plan.price}`)
          .join(', ')
        return `Pricing plans: ${planDescriptions}`
      }
      break

    case 'timeline':
      if (blockData.events?.length) {
        const eventDescriptions = blockData.events
          .map((event: any) => `${event.date}: ${event.title}`)
          .join(', ')
        return `Timeline events: ${eventDescriptions}`
      }
      break

    case 'featureGrid':
      if (blockData.features?.length) {
        const featureList = blockData.features
          .map((feature: any) => feature.title || feature.name)
          .filter(Boolean)
          .join(', ')
        return `Features: ${featureList}`
      }
      break
  }

  return generateScreenReaderDescription(blockType, blockData)
}

/**
 * Screen reader utilities for forms
 */
export const formScreenReaderUtils = {
  /**
   * Announce form validation errors
   */
  announceValidationError: (
    fieldName: string,
    errorMessage: string,
    priority: AnnouncementPriority = 'assertive',
  ) => {
    announceToScreenReader(`${fieldName}: ${errorMessage}`, priority)
  },

  /**
   * Announce form submission states
   */
  announceSubmissionState: (
    state: 'submitting' | 'success' | 'error',
    message?: string,
    priority: AnnouncementPriority = 'assertive',
  ) => {
    const defaultMessages = {
      submitting: 'Submitting form...',
      success: 'Form submitted successfully',
      error: 'Form submission failed',
    }

    const announcement = message || defaultMessages[state]
    announceToScreenReader(announcement, priority)
  },

  /**
   * Generate field descriptions
   */
  generateFieldDescription: (fieldType: string, fieldData: Record<string, any>): string => {
    const descriptions: Record<string, string> = {
      text: 'Text input field',
      email: 'Email address input field',
      textarea: 'Multi-line text input field',
      select: 'Dropdown selection field',
      checkbox: 'Checkbox field',
      radio: 'Radio button field',
    }

    let description = descriptions[fieldType] || 'Input field'

    if (fieldData.required) {
      description += ', required'
    }

    if (fieldData.placeholder) {
      description += `, placeholder: ${fieldData.placeholder}`
    }

    return description
  },
}

/**
 * Screen reader utilities for media
 */
export const mediaScreenReaderUtils = {
  /**
   * Generate comprehensive image descriptions
   */
  generateImageDescription: (imageData: Record<string, any>): string => {
    const parts = []

    if (imageData.alt) {
      parts.push(imageData.alt)
    }

    if (imageData.caption) {
      parts.push(`Caption: ${imageData.caption}`)
    }

    if (imageData.width && imageData.height) {
      parts.push(`Dimensions: ${imageData.width} by ${imageData.height} pixels`)
    }

    return parts.join('. ') || 'Image'
  },

  /**
   * Generate video descriptions
   */
  generateVideoDescription: (videoData: Record<string, any>): string => {
    const parts = ['Video content']

    if (videoData.title) {
      parts.push(`titled "${videoData.title}"`)
    }

    if (videoData.duration) {
      parts.push(`duration ${videoData.duration}`)
    }

    if (videoData.autoplay) {
      parts.push('autoplaying')
    }

    if (videoData.muted) {
      parts.push('muted')
    }

    return parts.join(', ')
  },

  /**
   * Announce media loading states
   */
  announceMediaState: (
    mediaType: 'image' | 'video' | 'audio',
    state: 'loading' | 'loaded' | 'error' | 'playing' | 'paused',
    priority: AnnouncementPriority = 'polite',
  ) => {
    const messages = {
      loading: `${mediaType} loading`,
      loaded: `${mediaType} loaded`,
      error: `${mediaType} failed to load`,
      playing: `${mediaType} playing`,
      paused: `${mediaType} paused`,
    }

    announceToScreenReader(messages[state], priority)
  },
}

/**
 * Create comprehensive screen reader context
 */
export const createScreenReaderContext = (
  blocks: Array<{ blockType: string; fields: any }>,
): ScreenReaderContext => {
  let hasInteractiveElements = false
  let hasMedia = false
  let hasHeadings = false

  blocks.forEach((block) => {
    // Check for interactive elements
    if (['cta', 'contactForm', 'newsletter', 'faqAccordion'].includes(block.blockType)) {
      hasInteractiveElements = true
    }

    // Check for media
    if (
      ['mediaBlock', 'hero', 'beforeAfter'].includes(block.blockType) ||
      block.fields?.media ||
      block.fields?.videoUrl
    ) {
      hasMedia = true
    }

    // Check for headings
    if (block.fields?.heading || block.fields?.title) {
      hasHeadings = true
    }
  })

  return {
    totalBlocks: blocks.length,
    hasInteractiveElements,
    hasMedia,
    hasHeadings,
  }
}
