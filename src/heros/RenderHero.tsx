import React from 'react'
import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/StandardHero/HighImpact'
import { LowImpactHero } from '@/heros/StandardHero/LowImpact'
import { MediumImpactHero } from '@/heros/StandardHero/MediumImpact'

import { ServicesHeroLowImpact } from '@/heros/ServicesHero/LowImpact'
import { ServicesHeroMediumImpact } from '@/heros/ServicesHero/MediumImpact'
import { ServicesHeroHighImpact } from '@/heros/ServicesHero/HighImpact'

import { LegalHero } from '@/heros/LegalHero'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

const servicesHeroes = {
  highImpact: ServicesHeroHighImpact,
  lowImpact: ServicesHeroLowImpact,
  mediumImpact: ServicesHeroMediumImpact,
}

type Props = Partial<Page>

export const RenderHero: React.FC<Props> = (props) => {
  const { hero, servicesHero, pageType, icon } = props || {}

  const isServices = pageType === 'services'
  const isLegal = pageType === 'legal'

  if (isLegal && props.legalHero) {
    return <LegalHero title={props.title || ''} legalHero={props.legalHero} />
  }

  const heroData = isServices ? servicesHero : hero
  const heroMap = isServices ? servicesHeroes : heroes

  if (heroData) {
    const { type } = heroData as any
    if (!type || type === 'none') return null

    const HeroToRender = heroMap[type as keyof typeof heroMap]

    if (!HeroToRender) return null

    return (
      <HeroToRender
        {...(heroData as any)}
        title={isServices ? props.title : (heroData as any).title}
        icon={isServices ? icon : (heroData as any).icon}
      />
    )
  }

  return null
}
