// Temporary type definitions for services blocks until they're properly generated

export interface PricingTableBlock {
  blockType: 'pricingTable'
  heading?: string
  description?: string
  billingPeriod?: 'monthly' | 'yearly' | 'both'
  showComparison?: boolean
  tiers?: Array<{
    name: string
    price: string
    features?: Array<{
      text: string
      included: boolean
    }>
  }>
}

export interface ProcessStepsBlock {
  blockType: 'processSteps'
  heading?: string
  description?: string
  layout?: 'vertical' | 'horizontal' | 'grid'
  style?: 'numbered' | 'icons' | 'timeline'
  showConnectors?: boolean
  steps?: Array<{
    title: string
    description: string
    icon?: string
    duration?: string
    details?: string
  }>
}

export interface ServicesGridBlock {
  blockType: 'servicesGrid'
  heading?: string
  description?: string
  columns?: '2' | '3' | '4'
  style?: 'cards' | 'list'
  showIcons?: boolean
  ctaText?: string
  ctaLink?: any
  services?: Array<{
    title: string
    description: string
    icon?: string
    link?: any
    highlighted?: boolean
    features: Array<{
      text: string
      feature?: string
    }>
  }>
}

export interface TechStackBlock {
  blockType: 'techStack'
  heading?: string
  description?: string
  layout?: 'grid' | 'list' | 'carousel'
  showDescriptions?: boolean
  enableFiltering?: boolean
  technologies?: Array<{
    name: string
    category: string
    icon?: string
    proficiency?: string
    description?: string
    yearsExperience?: number
  }>
}
