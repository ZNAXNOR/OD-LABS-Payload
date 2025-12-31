'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  textAlignment: textAlignmentProp = 'center',
  emphasizeText = false,
}) => {
  const textAlignment = textAlignmentProp || 'center'
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  // Map alignment to CSS classes
  const alignmentClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  // Determine text alignment class
  const alignClass = alignmentClasses[textAlignment || 'center']

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className={`container mb-8 z-10 relative flex items-center ${alignClass}`}>
        <div className="max-w-[36.5rem]">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul
              className={`flex gap-4 ${
                textAlignment === 'center'
                  ? 'justify-center'
                  : textAlignment === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              }`}
            >
              {links.map(({ link, id }, i) => {
                return (
                  <li key={id || i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <React.Fragment>
            <Media
              fill
              imgClassName={`-z-10 object-cover ${
                emphasizeText && textAlignment === 'center' ? 'blur-sm' : ''
              }`}
              priority
              resource={media}
            />
            {emphasizeText && textAlignment !== 'center' && (
              <div
                className={`absolute inset-0 -z-10 ${
                  textAlignment === 'left'
                    ? 'bg-gradient-to-r from-black/80 to-transparent'
                    : 'bg-gradient-to-l from-black/80 to-transparent'
                }`}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
