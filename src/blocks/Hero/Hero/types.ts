import type { HeroBlock } from '@/payload-types'

export interface HeroBlockProps extends HeroBlock {
  className?: string
}

export interface HeroVariant {
  value: 'default' | 'centered' | 'minimal' | 'split' | 'gradient' | 'codeTerminal'
  label: string
}

export interface HeroSettings {
  theme: 'light' | 'dark' | 'auto'
  height: 'small' | 'medium' | 'large' | 'auto'
  enableParallax: boolean
  overlay?: {
    enabled: boolean
    opacity: number
    color: 'black' | 'white' | 'primary'
  }
}

export interface HeroAction {
  link: {
    type?: 'reference' | 'custom'
    newTab?: boolean
    reference?: {
      relationTo: string
      value: string | any
    }
    url?: string
    label?: string
  }
  priority: 'primary' | 'secondary'
}
