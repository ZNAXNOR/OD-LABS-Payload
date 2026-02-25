import React from 'react'
import { InlineRelatedServices } from './InlineVarient/Component'
import { SideRelatedServices } from './SideVarient/Component'
import type { Page } from '@/payload-types'

type RelatedServicesProps = NonNullable<Page['relatedServices']> & {
  variant?: 'inline' | 'side'
}

export const RelatedServices: React.FC<RelatedServicesProps> = (props) => {
  const { variant = 'inline' } = props

  if (variant === 'side') {
    return <SideRelatedServices {...props} />
  }

  return <InlineRelatedServices {...props} />
}
