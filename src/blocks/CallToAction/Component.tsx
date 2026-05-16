import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { SmallCTA } from './Small/Component'
import { LargeCTA } from './Large/Component'

export const CallToActionBlock: React.FC<CTABlockProps> = (props) => {
  const { variant = 'small' } = props

  if (variant === 'large') {
    return <LargeCTA {...props} />
  }

  return <SmallCTA {...props} />
}
