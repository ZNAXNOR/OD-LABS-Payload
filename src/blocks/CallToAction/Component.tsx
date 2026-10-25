import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section
      id="contact"
      data-purpose="conversational-cta"
      className="relative"
    >
      <div className="studio-grid w-full">
        <div className="hidden border-r border-[#262D3D] lg:block" aria-hidden="true" />

        <div className="border-r border-[#262D3D] px-6 py-20 lg:px-12 lg:py-28">
          <div className="mb-8 font-mono text-xs tracking-wider text-[#687182] uppercase">
            <span className="text-[#FF3B30]">04 — </span>
            START A PROJECT
          </div>

          <div className="relative space-y-8 border border-[#232a3b] p-8 sm:p-14 lg:p-16">
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#687182]" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#687182]" />

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
                    className={cn(
                      link?.appearance === 'default' &&
                        'h-auto rounded-none px-8 py-4 font-mono text-xs font-semibold tracking-wider text-white uppercase',
                      link?.appearance === 'underline' &&
                        'font-mono text-xs text-[#A6ABB8] decoration-[#232a3b] hover:text-[#F4F4F0] hover:decoration-[#A6ABB8]',
                    )}
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
