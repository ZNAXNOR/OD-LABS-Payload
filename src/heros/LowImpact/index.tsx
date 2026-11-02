import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import Eyebrow from '@/components/Eyebrow'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      eyebrow?: string[] | null
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, eyebrow }) => {
  return (
    <div className="mt-16 px-6 md:px-10">
      <Eyebrow eyebrow={eyebrow} sectionNumber="01" className="mb-0" />
      <div className="max-w-[48rem]">
        {children ||
          (richText && (
            <RichText
              data={richText}
              enableGutter={false}
              enableProse={false}
              className={[
                '[&_h1]:mt-4 [&_h1]:max-w-3xl [&_h1]:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight sm:[&_h1]:text-5xl',
                '[&_h2]:mt-4 [&_h2]:max-w-3xl [&_h2]:text-4xl [&_h2]:font-medium [&_h2]:tracking-tight sm:[&_h2]:text-5xl',
                '[&_p]:mt-5 [&_p]:max-w-2xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-zinc-400',
              ].join(' ')}
            />
          ))}
      </div>
    </div>
  )
}
