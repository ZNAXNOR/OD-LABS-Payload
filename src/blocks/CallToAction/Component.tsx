import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import Eyebrow from '@/components/Eyebrow'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section
      id="contact"
      data-purpose="conversational-cta"
      className="relative"
    >
      <div className="grid w-full grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)_72px]">
        <div className="hidden border-r border-[#262D3D] lg:block" aria-hidden="true" />

        <div className="border-r border-[#262D3D] px-6 py-20 lg:px-12 lg:py-28">
          <Eyebrow eyebrow="START A PROJECT" blockIndex={2} />

          <div className="relative space-y-8 border border-[#232a3b] p-8 sm:p-14 lg:p-16">
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-full z-10 h-3 w-3 -translate-y-full border-b border-l border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute right-0 top-full z-10 h-3 w-3 -translate-y-full border-b border-r border-[#687182]" />

            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
                enableProse={false}
                className={cn(
                  'max-w-3xl space-y-4 text-[#F4F4F0]',
                  '[&_h1]:m-0 [&_h1]:text-3xl [&_h1]:font-normal [&_h1]:leading-[1.1] [&_h1]:tracking-tight sm:[&_h1]:text-5xl lg:[&_h1]:text-6xl',
                  '[&_h2]:m-0 [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-[1.1] [&_h2]:tracking-tight sm:[&_h2]:text-5xl lg:[&_h2]:text-6xl',
                  '[&_h3]:m-0 [&_h3]:text-3xl [&_h3]:font-normal [&_h3]:leading-[1.1] [&_h3]:tracking-tight sm:[&_h3]:text-5xl lg:[&_h3]:text-6xl',
                  '[&_h4]:m-0 [&_h4]:text-3xl [&_h4]:font-normal [&_h4]:leading-[1.1] [&_h4]:tracking-tight sm:[&_h4]:text-5xl lg:[&_h4]:text-6xl',
                  '[&_p]:m-0 [&_p]:pt-1 [&_p]:font-sans [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-[#A6ABB8] sm:[&_p]:text-lg',
                )}
              />
            )}

            {links?.length ? (
              <div className="flex flex-col gap-8 pt-2 sm:flex-row sm:items-center">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={link?.url ?? link?.label ?? index}
                    {...link}
                    size="lg"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  )
}
