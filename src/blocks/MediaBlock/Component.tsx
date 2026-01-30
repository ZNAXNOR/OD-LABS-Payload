import type { StaticImageData } from 'next/image'

import { Media as MediaComponent } from '@/components/ui/Media'
import RichText from '@/components/ui/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { Media } from '@/payload-types'

// Define MediaBlock type locally since it's not in the main blocks
interface MediaBlock {
  blockType: 'mediaBlock'
  media: Media
  caption?: string
  enableZoom?: boolean
}

export interface MediaBlockProps {
  block: MediaBlock
}

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  media?: Media
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <MediaComponent
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
