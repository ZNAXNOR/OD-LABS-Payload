import type { HeroBlock as HeroBlockType } from '@/payload-types'

export interface HeroVariantProps {
  block: HeroBlockType
  className?: string
}

export type ThemeType = 'light' | 'dark' | 'auto'
export type HeightType = 'small' | 'medium' | 'large' | 'auto'
