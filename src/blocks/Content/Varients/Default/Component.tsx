import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import { ArrowRight } from 'lucide-react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Header, Eyebrow } from '@/blocks/Content/Varients/Header'

type Props = ContentBlockProps & {
  blockIndex?: number
}

export const Default_ContentBlock: React.FC<Props> = (props) => {
  const { eyebrow, richText, linkGroup, columns, blockIndex = 0 } = props

  const colsSpanClasses: Record<string, string> = {
    zero: 'hidden lg:hidden',
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <div className="container my-16">
      <Eyebrow eyebrow={eyebrow} blockIndex={blockIndex} />

      <Header
        richText={richText}
        linkGroup={linkGroup}
        className="mb-12"
      />

      {columns && columns.length > 0 && (
        <div className="grid grid-cols-4 gap-x-16 gap-y-8 lg:grid-cols-12">
          {columns.map((col, index) => {
            const { enableLink, link, richText: colRichText, size } = col

            if (size === 'zero') return null

            return (
              <div
                className={cn(
                  'col-span-4',
                  colsSpanClasses[size || 'oneThird'],
                  {
                    'md:col-span-2': size !== 'full',
                  },
                )}
                key={col.id ?? index}
              >
                {colRichText && (
                  <RichText data={colRichText} enableGutter={false} />
                )}
                {enableLink && link && <CMSLink {...link} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
