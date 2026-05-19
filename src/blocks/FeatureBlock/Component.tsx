import React from 'react'

import type { FeatureBlock as FeatureBlockProps } from '@/payload-types'

import { DefaultFeatureBlock } from './Default/Component'
import { StackedListFeatureBlock } from './StackedList/Component'

export const FeatureBlock: React.FC<FeatureBlockProps> = (props) => {
  const { variant = 'default' } = props

  switch (variant) {
    case 'stackedList':
      return <StackedListFeatureBlock {...props} />

    case 'default':
    default:
      return <DefaultFeatureBlock {...props} />
  }
}
