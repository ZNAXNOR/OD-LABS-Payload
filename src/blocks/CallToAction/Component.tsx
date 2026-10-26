import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import Eyebrow from '@/components/Eyebrow'
import { CMSLink } from '@/components/Link'

type Props = CTABlockProps & { blockIndex?: number }

export const CallToActionBlock: React.FC<Props> = ({
  eyebrow,
  links,
  richText,
  blockIndex = 0,
}) => {
  return (
    <section
      id="contact"
      data-purpose="conversational-cta"
      className="relative"
    >
      <div className="px-6 py-20 lg:px-10 lg:py-28">
        <Eyebrow eyebrow={eyebrow} blockIndex={blockIndex} />

        <div className="relative border border-zinc-800">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-px z-10 m-0! h-3 w-3 border-t border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -right-px z-10 m-0! h-3 w-3 border-t border-r border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px z-10 m-0! h-3 w-3 border-b border-l border-zinc-500"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-px -bottom-px z-10 m-0! h-3 w-3 border-r border-b border-zinc-500"
          />

          <div className="space-y-8 p-8 sm:p-14 lg:p-16">
            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
                enableProse={false}
                className={cn(
                  'max-w-3xl space-y-4 text-zinc-200',
                  '[&_h1]:m-0 [&_h1]:text-3xl [&_h1]:leading-[1.1] [&_h1]:font-normal [&_h1]:tracking-tight sm:[&_h1]:text-5xl lg:[&_h1]:text-6xl',
                  '[&_h2]:m-0 [&_h2]:text-3xl [&_h2]:leading-[1.1] [&_h2]:font-normal [&_h2]:tracking-tight sm:[&_h2]:text-5xl lg:[&_h2]:text-6xl',
                  '[&_h3]:m-0 [&_h3]:text-3xl [&_h3]:leading-[1.1] [&_h3]:font-normal [&_h3]:tracking-tight sm:[&_h3]:text-5xl lg:[&_h3]:text-6xl',
                  '[&_h4]:m-0 [&_h4]:text-3xl [&_h4]:leading-[1.1] [&_h4]:font-normal [&_h4]:tracking-tight sm:[&_h4]:text-5xl lg:[&_h4]:text-6xl',
                  '[&_p]:m-0 [&_p]:pt-1 [&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-zinc-400 sm:[&_p]:text-lg',
                )}
              />
            )}

            {links?.length ? (
              <div className="flex flex-col gap-8 pt-2 sm:flex-row sm:items-center">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={link?.url ?? link?.label ?? index}
                    size="lg"
                    {...link}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
