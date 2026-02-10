import type { Page } from '@/payload-types'
import React from 'react'

import { LowImpactHeroDefault } from './Default_LowImpactHero'
import { LowImpactHeroRating } from './Rating_LowImpactHero'

export const LowImpactHero: React.FC<Page['hero']> = (props) => {
  const { lowImpactVariant } = props

  if (lowImpactVariant === 'rating') {
    return <LowImpactHeroRating {...props} />
  }

  return <LowImpactHeroDefault {...props} />
}
