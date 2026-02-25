import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import React from 'react'
import { cn } from '@/utilities/ui'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { colsSpanClasses } from '../index'

export const IconCardBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, intro, title } = props

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        {intro && <p className="mb-4 text-sm text-muted-foreground lg:text-base">{intro}</p>}
        {title && <h2 className="mb-14 text-3xl font-medium lg:text-4xl">{title}</h2>}
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8">
          {columns?.map((col, index) => {
            const { icon, richText, size, enableLink, link } = col

            // Determine icon to use:
            // Manual icon field (Media)
            let iconToUse = typeof icon === 'object' ? icon : null

            return (
              <div
                className={cn(
                  `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                  {
                    'md:col-span-2': size !== 'full',
                  },
                  'rounded-lg bg-accent p-5',
                )}
                key={index}
              >
                {iconToUse && (
                  <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background overflow-hidden">
                    <Media
                      resource={iconToUse}
                      className="size-6 text-muted-foreground group-hover:text-primary transition-colors dark:invert"
                    />
                  </span>
                )}
                {richText && <RichText data={richText} enableGutter={false} />}
                {enableLink && link && (
                  <div className="mt-4">
                    <CMSLink {...link} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
