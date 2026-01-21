import type { BannerBlock } from '@/payload-types'

export interface BannerBlockProps extends BannerBlock {
  className?: string
}

export type BannerStyle = 'info' | 'warning' | 'error' | 'success'
