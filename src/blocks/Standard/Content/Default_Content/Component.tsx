import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../../../components/Link'

import { colsSpanClasses } from '../index'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, intro, title } = props

  return (
    <div className="container my-16">
      {intro && <p className="mb-4 text-sm text-muted-foreground lg:text-base">{intro}</p>}
      {title && <h2 className="mb-14 text-3xl font-medium lg:text-4xl">{title}</h2>}
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
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
