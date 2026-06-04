import React from 'react'
import { Download } from 'lucide-react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const LargeCTA: React.FC<CTABlockProps> = ({
  links,
  richText,
  availabilityText,
  enableHelperLink,
  helperLink,
  showBackground,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className={`${showBackground !== false ? 'bg-gray-100' : ''} rounded-3xl py-24 px-8 text-center`}>
        {richText && (
          <div className="max-w-2xl mx-auto mb-12">
            <RichText
              data={richText}
              enableGutter={false}
              enableProse={false}
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-extrabold [&_h1]:mb-8 [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:mb-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-4 [&_p]:text-xl [&_p]:text-gray-600"
            />
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          {(links || []).map(({ link }, i) => (
            <CMSLink key={i} {...link} className="px-10 py-5 h-auto text-lg font-bold" />
          ))}
        </div>

        {/* Availability */}
        {availabilityText && (
          <p className="text-xs uppercase font-bold text-red-600 tracking-widest mb-6">
            {availabilityText}
          </p>
        )}

        {/* Secondary CTA / Helper Link */}
        {enableHelperLink && helperLink && (
          <CMSLink
            {...helperLink}
            type={helperLink.reference ? 'reference' : 'custom'}
            newTab={true}
            download={true}
            label={null}
            className="group text-red-600 font-bold inline-flex items-center gap-2 underline-offset-2 hover:underline"
          >
            <Download className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" />
            <span>{helperLink.label}</span>
          </CMSLink>
        )}
      </div>
    </section>
  )
}
