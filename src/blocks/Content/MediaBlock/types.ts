import type { Media } from '@/payload-types'
import type { StaticImageData } from 'next/image'

// Define MediaBlock type locally since it's not in the main blocks
export interface MediaBlock {
  blockType: 'mediaBlock'
  media: Media
  caption?: string
  enableZoom?: boolean
}

export interface MediaBlockProps extends MediaBlock {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}
