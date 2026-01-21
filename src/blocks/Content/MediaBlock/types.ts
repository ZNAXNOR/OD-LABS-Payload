import type { MediaBlock } from '@/payload-types'
import type { StaticImageData } from 'next/image'

export interface MediaBlockProps extends MediaBlock {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}
