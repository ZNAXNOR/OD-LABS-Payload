import type { CallToActionBlock } from '@/payload-types'

export interface CallToActionBlockProps extends CallToActionBlock {
  className?: string
}

export type CTAVariant = 'centered' | 'split' | 'banner' | 'card'
export type CTABackgroundColor = 'default' | 'primary' | 'dark' | 'light'
export type CTAPattern = 'none' | 'dots' | 'grid' | 'waves'
