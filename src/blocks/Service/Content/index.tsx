import type { ExpertiseContentBlock as ExpertiseContentBlockProps } from '@/payload-types'
import React from 'react'
import { LowImpactExpertise } from './InlineVarient/LowImpact/Component'
import { MediumImpactExpertise } from './InlineVarient/MediumImpact/Component'
import { HighImpactExpertise } from './InlineVarient/HighImpact/Component'
import { SideVarientExpertise } from './SideVarient/Component'

export const ExpertiseContentBlock: React.FC<ExpertiseContentBlockProps> = (props) => {
  const { variant, size } = props

  if (variant === 'sideVarient') {
    return <SideVarientExpertise {...props} />
  }

  if ((variant as any) === 'highImpact') {
    return <HighImpactExpertise {...props} />
  }

  // Handle Inline Variants based on size
  switch (size) {
    case 'large':
      return <MediumImpactExpertise {...props} />
    case 'small':
    default:
      return <LowImpactExpertise {...props} />
  }
}
