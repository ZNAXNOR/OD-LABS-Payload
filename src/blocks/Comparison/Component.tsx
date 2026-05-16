import React from 'react'
import type { ComparisonBlockProps } from './types'
import { LargeComparison } from './variants/Large/Component'
import { CardsComparison } from './variants/Cards/Component'

export const ComparisonBlockComponent: React.FC<ComparisonBlockProps> = (props) => {
  const { variant } = props

  switch (variant) {
    case 'cards':
      return <CardsComparison {...props} />
    case 'large':
    default:
      return <LargeComparison {...props} />
  }
}
