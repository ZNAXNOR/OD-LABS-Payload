import React from 'react'

import type { ComparisonBlockProps } from './types'

import { CardsComparison } from './variants/Cards/Component'
import { SplitPanelComparison } from './variants/SplitPanel/Component'

export const ComparisonBlockComponent: React.FC<
  ComparisonBlockProps
> = (props) => {
  const { variant } = props

  switch (variant) {
    case 'cards':
      return <CardsComparison {...props} />

    case 'splitPanel':
    default:
      return <SplitPanelComparison {...props} />
  }
}
