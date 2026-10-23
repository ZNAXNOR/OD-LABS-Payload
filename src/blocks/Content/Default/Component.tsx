import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import { ArrowRight } from 'lucide-react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type Props = ContentBlockProps & {
  blockIndex?: number
}

export const Default_ContentBlock: React.FC<Props> = (props) => {
  const { eyebrow, richText, linkGroup, columns, blockIndex = 0 } = props
  const blockNumber = String(blockIndex + 2).padStart(2, '0')

  const eyebrowPhrases = (
    Array.isArray(eyebrow)
      ? eyebrow
      : typeof eyebrow === 'string'
        ? [eyebrow]
        : []
  ).filter((phrase): phrase is string => Boolean(phrase && phrase.trim()))

  const colsSpanClasses: Record<string, string> = {
    zero: 'hidden lg:hidden',
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <div className="container my-16">
      {eyebrowPhrases.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-medium tracking-[0.18em] text-white/45 uppercase">
            <span className="bg-odl size-2 shrink-0" aria-hidden="true" />

            {eyebrowPhrases.map((phrase, index) => {
              const displayPhrase =
                index === 0
                  ? /^\d{2}\s*—\s*/.test(phrase)
                    ? phrase
                    : `${blockNumber} — ${phrase}`
                  : phrase

              return (
                <React.Fragment key={`${phrase}-${index}`}>
                  {index > 1 && (
                    <span className="text-odl" aria-hidden="true">
                      •
                    </span>
                  )}

                  <span className={index === 0 ? 'text-odl' : 'text-white/60'}>
                    {index === 0
                      ? eyebrowPhrases.length > 1
                        ? `${displayPhrase} //`
                        : displayPhrase
                      : displayPhrase}
                  </span>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}

      {(richText || linkGroup?.length) && (
        <div className="mb-12 space-y-6">
          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className={[
                '[&_h2]:text-3xl [&_h2]:leading-[1.15] [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-zinc-200 sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl',
                '[&_h3]:text-2xl [&_h3]:leading-snug [&_h3]:font-normal [&_h3]:tracking-tight [&_h3]:text-zinc-200 sm:[&_h3]:text-3xl',
                '[&_h4]:text-xl [&_h4]:leading-snug [&_h4]:font-normal [&_h4]:tracking-tight [&_h4]:text-zinc-200',
                '[&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-zinc-400',
                '[&_a]:text-odl [&_a:hover]:text-odl/60',
              ].join(' ')}
            />
          )}

          {linkGroup?.length ? (
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {linkGroup.map((entry, index) => (
                <CMSLink
                  key={entry.id ?? index}
                  {...entry.link}
                  label={entry.link.label}
                  appearance="inline"
                  className="group inline-flex items-center gap-2 font-mono text-xs text-zinc-300 transition-colors hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="text-odl transition-transform group-hover:translate-x-1"
                  >
                    <ArrowRight size={16} />
                  </span>
                </CMSLink>
              ))}
            </div>
          ) : null}
        </div>
      )}

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
