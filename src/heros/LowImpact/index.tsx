import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/CMSLink'
import { RichText } from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        <div className="container">{richText && <RichText content={richText as any} />}</div>
      </div>
    </div>
  )
}
