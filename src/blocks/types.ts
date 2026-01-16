/**
 * Block Type Definitions
 *
 * This file contains TypeScript interfaces for all block types used in the Pages collection.
 * These types are generated from the block configurations and provide type safety throughout the application.
 */

// ============================================================================
// HERO BLOCK TYPES
// ============================================================================

export interface HeroBlock {
  blockType: 'hero'
  variant: 'default' | 'centered' | 'minimal' | 'split' | 'gradient' | 'codeTerminal'
  eyebrow?: string
  heading: string
  subheading?: string
  media?: string | Media
  videoUrl?: string
  codeSnippet?: {
    language: string
    code: string
    theme: 'dark' | 'light'
  }
  splitLayout?: {
    contentSide: 'left' | 'right'
    mediaType: 'image' | 'video' | 'code'
  }
  gradientConfig?: {
    colors: Array<{ color: string }>
    animation: 'wave' | 'pulse' | 'rotate'
  }
  actions?: Array<{
    link: Link
    priority: 'primary' | 'secondary'
  }>
  settings: {
    theme: 'light' | 'dark' | 'auto'
    height: 'small' | 'medium' | 'large' | 'auto'
    enableParallax: boolean
    overlay?: {
      enabled: boolean
      opacity: number
      color: 'black' | 'white' | 'primary'
    }
  }
}

// ============================================================================
// CONTENT BLOCK TYPES
// ============================================================================

export interface ContentBlock {
  blockType: 'content'
  columns: Array<{
    width: 'oneThird' | 'half' | 'twoThirds' | 'full' | 'auto'
    content: any // Rich text
    enableLink: boolean
    link?: Link
    backgroundColor?: string
    padding?: 'none' | 'small' | 'medium' | 'large'
  }>
  gap: 'none' | 'small' | 'medium' | 'large'
  alignment: 'top' | 'center' | 'bottom'
}

export interface MediaBlock {
  blockType: 'mediaBlock'
  media: string | Media
}

export interface ArchiveBlock {
  blockType: 'archive'
  introContent?: any // Rich text
  populateBy: 'collection' | 'selection'
  relationTo?: string
  categories?: string[]
  limit?: number
  selectedDocs?: Array<string | any>
  populatedDocs?: any[]
  populatedDocsTotal?: number
}

export interface BannerBlock {
  blockType: 'banner'
  style: 'info' | 'warning' | 'error' | 'success'
  content: any // Rich text
}

// ============================================================================
// SERVICES BLOCK TYPES
// ============================================================================

export interface ServicesGridBlock {
  blockType: 'servicesGrid'
  heading?: string
  description?: string
  columns: '2' | '3' | '4'
  services: Array<{
    icon?: string
    title: string
    description: string
    features?: Array<{ feature: string }>
    link?: Link
    highlighted?: boolean
  }>
  style: 'cards' | 'minimal' | 'bordered'
  showIcons: boolean
  ctaText?: string
  ctaLink?: Link
}

export interface TechStackBlock {
  blockType: 'techStack'
  heading?: string
  description?: string
  layout: 'grid' | 'carousel' | 'list'
  technologies: Array<{
    name: string
    icon?: string | Media
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other'
    description?: string
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    yearsExperience?: number
  }>
  showDescriptions: boolean
}

export interface ProcessStepsBlock {
  blockType: 'processSteps'
  heading?: string
  description?: string
  layout: 'vertical' | 'horizontal' | 'grid'
  steps: Array<{
    number?: number
    icon?: string
    title: string
    description: string
    duration?: string
    details?: string
  }>
  style: 'numbered' | 'icons' | 'timeline'
}

export interface PricingTableBlock {
  blockType: 'pricingTable'
  heading?: string
  description?: string
  billingPeriod: 'monthly' | 'yearly' | 'both'
  tiers: Array<{
    name: string
    description?: string
    price: number
    currency: string
    period: 'month' | 'year' | 'project' | 'hour'
    features: Array<{
      text: string
      included: boolean
      tooltip?: string
    }>
    highlighted?: boolean
    ctaText: string
    ctaLink?: Link
    badge?: string
  }>
  showComparison: boolean
}

// ============================================================================
// PORTFOLIO BLOCK TYPES
// ============================================================================

export interface ProjectShowcaseBlock {
  blockType: 'projectShowcase'
  heading?: string
  description?: string
  layout: 'grid' | 'masonry' | 'carousel'
  columns: '2' | '3' | '4'
  projects: Array<{
    title: string
    description: string
    image: string | Media
    technologies: string[]
    category: string
    link?: Link
    githubUrl?: string
    liveUrl?: string
    featured?: boolean
  }>
  enableFiltering: boolean
  filterCategories?: string[]
  showLoadMore: boolean
  itemsPerPage: number
}

export interface CaseStudyBlock {
  blockType: 'caseStudy'
  client: string
  project: string
  duration?: string
  role?: string
  challenge: {
    heading: string
    content: string
    image?: string | Media
  }
  approach: {
    heading: string
    content: string
    steps?: Array<{ step: string }>
  }
  solution: {
    heading: string
    content: string
    technologies: Array<{ technology: string }>
    image?: string | Media
  }
  results: {
    heading: string
    metrics: Array<{
      label: string
      value: string
      change?: string
      icon?: string
    }>
    testimonial?: {
      quote: string
      author: string
      role: string
    }
  }
}

export interface BeforeAfterBlock {
  blockType: 'beforeAfter'
  heading?: string
  description?: string
  beforeImage: string | Media
  afterImage: string | Media
  beforeLabel?: string
  afterLabel?: string
  orientation: 'horizontal' | 'vertical'
  defaultPosition: number
}

export interface TestimonialBlock {
  blockType: 'testimonial'
  heading?: string
  layout: 'single' | 'grid' | 'carousel'
  testimonials: Array<{
    quote: string
    author: string
    role: string
    company?: string
    avatar?: string | Media
    rating?: number
    date?: string
    projectType?: string
  }>
  showRatings: boolean
}

// ============================================================================
// TECHNICAL BLOCK TYPES
// ============================================================================

export interface CodeBlock {
  blockType: 'code'
  language: string
  code: string
  filename?: string
  showLineNumbers: boolean
  highlightLines?: string
  theme: 'auto' | 'dark' | 'light'
  enableCopy: boolean
  caption?: string
}

export interface FeatureGridBlock {
  blockType: 'featureGrid'
  heading?: string
  description?: string
  columns: '2' | '3' | '4' | '6'
  features: Array<{
    icon: string
    title: string
    description: string
    link?: Link
  }>
  style: 'cards' | 'minimal' | 'icons'
}

export interface StatsCounterBlock {
  blockType: 'statsCounter'
  heading?: string
  layout: 'row' | 'grid'
  stats: Array<{
    value: number
    suffix?: string
    prefix?: string
    label: string
    description?: string
    icon?: string
  }>
  animateOnScroll: boolean
  duration: number
}

export interface FAQAccordionBlock {
  blockType: 'faqAccordion'
  heading?: string
  description?: string
  faqs: Array<{
    question: string
    answer: string // Rich text
    category?: string
  }>
  allowMultipleOpen: boolean
  defaultOpen?: number[]
  showSearch: boolean
}

export interface TimelineBlock {
  blockType: 'timeline'
  heading?: string
  orientation: 'vertical' | 'horizontal'
  items: Array<{
    date: string
    title: string
    description: string
    icon?: string
    image?: string | Media
    link?: Link
  }>
  style: 'default' | 'minimal' | 'detailed'
}

// ============================================================================
// CTA & CONVERSION BLOCK TYPES
// ============================================================================

export interface CallToActionBlock {
  blockType: 'cta'
  variant: 'centered' | 'split' | 'banner' | 'card'
  heading: string
  description?: string
  richText?: any // Rich text
  links?: Array<{
    link: Link
    appearance?: 'default' | 'outline'
  }>
  media?: string | Media
  backgroundColor?: 'default' | 'primary' | 'dark' | 'light'
  pattern?: 'none' | 'dots' | 'grid' | 'waves'
}

export interface ContactFormBlock {
  blockType: 'contactForm'
  heading?: string
  description?: string
  form: string // Relationship to forms collection
  layout: 'single' | 'split'
  showContactInfo: boolean
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
    hours?: string
  }
}

export interface NewsletterBlock {
  blockType: 'newsletter'
  heading: string
  description?: string
  placeholder: string
  buttonText: string
  style: 'inline' | 'card' | 'minimal'
  showPrivacyNote: boolean
  privacyText?: string
  successMessage: string
  provider?: 'mailchimp' | 'convertkit' | 'custom'
}

export interface SocialProofBlock {
  blockType: 'socialProof'
  heading?: string
  type: 'logos' | 'stats' | 'badges' | 'combined'
  logos?: Array<{
    image: string | Media
    name: string
    link?: string
  }>
  stats?: Array<{
    value: string
    label: string
  }>
  badges?: Array<{
    image: string | Media
    title: string
  }>
  layout: 'row' | 'grid'
  grayscale: boolean
}

// ============================================================================
// LAYOUT BLOCK TYPES
// ============================================================================

export interface ContainerBlock {
  blockType: 'container'
  content?: any // RichText content
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  backgroundColor?: 'none' | 'white' | 'zinc-50' | 'zinc-100' | 'zinc-900' | 'brand-primary'
  backgroundImage?: string | Media
  paddingTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface DividerBlock {
  blockType: 'divider'
  style: 'solid' | 'dashed' | 'dotted' | 'gradient'
  thickness: 1 | 2 | 3 | 4
  color?: string
  width: 'full' | 'half' | 'quarter'
  alignment: 'left' | 'center' | 'right'
  spacingTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  spacingBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface SpacerBlock {
  blockType: 'spacer'
  heightMobile: number
  heightTablet: number
  heightDesktop: number
}

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface Media {
  id: string
  alt?: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
}

export interface Link {
  type?: 'reference' | 'custom'
  newTab?: boolean
  reference?: {
    relationTo: string
    value: string | any
  }
  url?: string
  label?: string
}

// ============================================================================
// UNION TYPE FOR ALL BLOCKS
// ============================================================================

export type PageBlock =
  | HeroBlock
  | ContentBlock
  | MediaBlock
  | ArchiveBlock
  | BannerBlock
  | ServicesGridBlock
  | TechStackBlock
  | ProcessStepsBlock
  | PricingTableBlock
  | ProjectShowcaseBlock
  | CaseStudyBlock
  | BeforeAfterBlock
  | TestimonialBlock
  | CodeBlock
  | FeatureGridBlock
  | StatsCounterBlock
  | FAQAccordionBlock
  | TimelineBlock
  | CallToActionBlock
  | ContactFormBlock
  | NewsletterBlock
  | SocialProofBlock
  | ContainerBlock
  | DividerBlock
  | SpacerBlock
