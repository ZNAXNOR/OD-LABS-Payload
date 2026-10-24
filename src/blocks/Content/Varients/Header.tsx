import React from 'react'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

type HeaderProps = {
  richText?: ContentBlockProps['richText']
  linkGroup?: ContentBlockProps['linkGroup']
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  richText,
  linkGroup,
  className,
}) => {
  if (!richText && !linkGroup?.length) {
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {richText && (
        <RichText
          data={richText}
          enableGutter={false}
          className={[
            '[&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:leading-[1.15] [&_h2]:font-normal [&_h2]:tracking-tight [&_h2]:text-zinc-200 sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl',
            '[&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:leading-snug [&_h3]:font-normal [&_h3]:tracking-tight [&_h3]:text-zinc-200 sm:[&_h3]:text-3xl',
            '[&_h4]:mb-3 [&_h4]:text-xl [&_h4]:leading-snug [&_h4]:font-normal [&_h4]:tracking-tight [&_h4]:text-zinc-200',
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
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Header
export { Eyebrow } from './Eyebrow'
