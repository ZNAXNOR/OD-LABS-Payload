import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroDefaultType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHeroDefault: React.FC<LowImpactHeroDefaultType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-3xl">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
