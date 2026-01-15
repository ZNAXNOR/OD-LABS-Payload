import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const BackgroundPattern: React.FC<{ pattern: string }> = ({ pattern }) => {
  if (pattern === 'none') return null

  const patternClasses = {
    dots: 'bg-[radial-gradient(circle,_rgba(0,0,0,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)]',
    grid: 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,0,0,0.05)_1px,_transparent_1px)] bg-[length:20px_20px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)]',
    waves:
      "bg-[url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30c10 0 10-10 20-10s10 10 20 10 10-10 20-10 10 10 20 10v10H0z' fill='rgba(0,0,0,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E\")] dark:bg-[url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30c10 0 10-10 20-10s10 10 20 10 10-10 20-10 10 10 20 10v10H0z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E\")]",
  }

  return <div className={`absolute inset-0 ${patternClasses[pattern] || ''}`} />
}

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  variant = 'centered',
  heading,
  description,
  richText,
  links,
  media,
  backgroundColor = 'default',
  pattern = 'none',
}) => {
  const bgColorClasses = {
    default: 'bg-card border-border border',
    primary: 'bg-brand-primary text-white',
    dark: 'bg-zinc-900 text-white dark:bg-zinc-950',
    light: 'bg-zinc-50 dark:bg-zinc-800',
  }

  const renderLinks = () => (
    <div className="flex flex-wrap gap-4">
      {(links || []).map(({ link }, i) => (
        <CMSLink key={i} size="lg" {...link} />
      ))}
    </div>
  )

  const renderContent = () => (
    <div className="flex flex-col gap-4">
      {heading && <h2 className="text-3xl md:text-4xl font-bold">{heading}</h2>}
      {description && <p className="text-lg opacity-90">{description}</p>}
      {richText && variant === 'card' && (
        <RichText className="mb-0" data={richText} enableGutter={false} />
      )}
      {renderLinks()}
    </div>
  )

  if (variant === 'centered') {
    return (
      <div className="container">
        <div
          className={`relative overflow-hidden rounded-lg p-8 md:p-12 ${bgColorClasses[backgroundColor]}`}
        >
          <BackgroundPattern pattern={pattern} />
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'split') {
    return (
      <div className="container">
        <div className={`relative overflow-hidden rounded-lg ${bgColorClasses[backgroundColor]}`}>
          <BackgroundPattern pattern={pattern} />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12">{renderContent()}</div>
            {media && typeof media !== 'string' && (
              <div className="relative h-64 md:h-full min-h-[400px]">
                <Media resource={media} className="object-cover w-full h-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className="relative w-full">
        {media && typeof media !== 'string' && (
          <div className="absolute inset-0">
            <Media resource={media} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <BackgroundPattern pattern={pattern} />
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-3xl text-white">{renderContent()}</div>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="container">
        <div
          className={`relative overflow-hidden rounded-lg p-8 md:p-12 max-w-2xl mx-auto ${bgColorClasses[backgroundColor]}`}
        >
          <BackgroundPattern pattern={pattern} />
          <div className="relative z-10">{renderContent()}</div>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="container">
      <div className={`rounded-lg p-8 ${bgColorClasses[backgroundColor]}`}>
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
          <div className="max-w-[48rem] flex items-center">
            {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
          </div>
          {renderLinks()}
        </div>
      </div>
    </div>
  )
}
