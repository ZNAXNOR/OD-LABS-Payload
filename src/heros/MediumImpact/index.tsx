import React from 'react'
import type { Page } from '@/payload-types'
import { DefaultHero } from './Default'
import { SidePanelHero } from './SidePanel'

export const MediumImpactHero: React.FC<Page['hero']> = (props) => {
  const { variant } = props

  if (variant === 'sidePanel') {
    return <SidePanelHero {...props} />
  }

  return <DefaultHero {...props} />
}
