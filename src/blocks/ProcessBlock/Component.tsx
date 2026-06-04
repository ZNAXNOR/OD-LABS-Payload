import React from 'react'

import { NumberedPanels } from './NumberedPanels'
import { Journey } from './Journey'

export type ProcessStep = {
  id?: string | null
  title: string
  description: any
  isHighlighted?: boolean | null
}

export type ProcessBlockProps = {
  blockType: 'process'
  blockVariant?: 'numberedPanels' | 'journey'
  eyebrow?: string
  heading?: string
  stepShape?: 'circle' | 'rectangle'
  steps?: ProcessStep[]
}

export const ProcessBlockComponent: React.FC<ProcessBlockProps> = (props) => {
  const { blockVariant = 'journey' } = props

  if (blockVariant === 'numberedPanels') {
    return <NumberedPanels {...props} />
  }

  return <Journey {...props} />
}
