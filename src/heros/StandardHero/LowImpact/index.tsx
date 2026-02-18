import type { Page } from '@/payload-types'
import React from 'react'

import { LowImpactHeroDefault } from './Default_LowImpactHero'
import { LowImpactHeroRating } from './Rating_LowImpactHero'

type Props = NonNullable<Page['hero']>

export const LowImpactHero: React.FC<Props> = (props) => {
  const { lowImpactVariant } = props as any

  if (lowImpactVariant === 'rating') {
    return <LowImpactHeroRating {...(props as any)} />
  }

  return <LowImpactHeroDefault {...(props as any)} />
}
