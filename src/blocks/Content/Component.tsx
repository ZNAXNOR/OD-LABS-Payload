import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Media as MediaComponent } from '@/components/Media'
import { FeatureCard } from '@/components/FeatureCard'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, appearance, media, features } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      {appearance === 'grid' && (
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { enableLink, link, richText, size } = col

              return (
                <div
                  className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                    'md:col-span-2': size !== 'full',
                  })}
                  key={index}
                >
                  <div className="space-y-4">
                    {richText && <RichText data={richText} enableGutter={false} />}

                    {enableLink && <CMSLink {...link} />}
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {appearance === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div className="lg:sticky top-24 self-start">
            {typeof media === 'object' && media !== null && (
              <MediaComponent resource={media} imgClassName="rounded-xl border border-border" />
            )}
          </div>
          <ul role="list" className="space-y-8">
            {features?.map((feature, i) => (
              <FeatureCard key={feature.id || i} {...feature} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
