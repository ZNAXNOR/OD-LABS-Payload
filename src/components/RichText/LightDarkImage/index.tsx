'use client'
import type { Media } from '@/payload-types'

import { usePopulateDocument } from '@/hooks/usePopulateDocument'
import { useThemePreference } from '@/providers/Theme'
import React from 'react'

import { RichText } from '..'
import classes from './index.module.scss'

export type Props = {
  alt: string
  caption?: any
  srcDark?: string
  srcDarkId?: string
  srcLight?: string
  srcLightId?: string
}

export type LightDarkImageBlock = {
  blockType: 'lightDarkImage'
  fields: Props
}

export const LightDarkImage: (props: Props) => null | React.JSX.Element = ({
  alt,
  caption,
  srcDark,
  srcDarkId,
  srcLight,
  srcLightId,
}) => {
  const { theme } = useThemePreference()
  const isDark = theme === 'dark'

  const directSrc = isDark ? srcDark : srcLight
  const mediaId = isDark ? srcDarkId : srcLightId

  const { data: media } = usePopulateDocument<Media>({
    id: mediaId,
    collection: 'media',
    enabled: !directSrc && !!mediaId,
  })

  const src = directSrc ?? media?.url

  if (!src) {
    return null
  }

  return (
    <div className={classes.imageWrap}>
      <img alt={alt} src={src} />
      {caption && (
        <div className={classes.caption}>
          {typeof caption === 'string' ? caption : <RichText content={caption} />}
        </div>
      )}
    </div>
  )
}
