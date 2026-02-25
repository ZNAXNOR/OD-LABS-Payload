import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import React from 'react'
import { ContentBlock as DefaultContentBlock } from './Default_Content/Component'
import { IconCardBlock as IconCardBlock } from './IconCard_Content/Component'

export const colsSpanClasses = {
  full: '12',
  half: '6',
  oneThird: '4',
  twoThirds: '8',
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { variant } = props

  if (variant === 'iconCard') {
    return <IconCardBlock {...props} />
  }

  return <DefaultContentBlock {...props} />
}
