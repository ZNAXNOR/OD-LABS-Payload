import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import Eyebrow from '@/components/Eyebrow'
import { cn } from '@/utilities/ui'

const formatPadding = (val?: number | string | null): string | undefined => {
  if (val === undefined || val === null) return undefined
  const str = String(val).trim()
  if (!str) return undefined
  return /^\d+(\.\d+)?$/.test(str) ? `${str}px` : str
}

type LowImpactHeroType =
  | {
      addPadding?: boolean | null
      children?: React.ReactNode
      eyebrow?: string[] | null
      paddingX?: number | string | null
      paddingY?: number | string | null
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      addPadding?: boolean | null
      children?: never
      paddingX?: number | string | null
      paddingY?: number | string | null
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  addPadding,
  children,
  eyebrow,
  paddingX,
  paddingY,
  richText,
}) => {
  const hasCustomPadding = Boolean(addPadding)
  const px = hasCustomPadding ? formatPadding(paddingX) : undefined
  const py = hasCustomPadding ? formatPadding(paddingY) : undefined

  const style: React.CSSProperties = {
    ...(px ? { paddingLeft: px, paddingRight: px } : {}),
    ...(py ? { paddingTop: py, paddingBottom: py } : {}),
  }

  const hasCustomX = Boolean(px)
  const hasCustomY = Boolean(py)

  return (
    <div
      className={cn(
        !hasCustomY && 'mt-16',
        !hasCustomX && 'px-6 md:px-10',
      )}
      style={style}
    >
      <Eyebrow eyebrow={eyebrow} sectionNumber="01" className="mb-0" />
      <div className="max-w-[48rem]">
        {children ||
          (richText && (
            <RichText
              data={richText}
              enableGutter={false}
              enableProse={false}
              className={[
                '[&_h1]:mt-4 [&_h1]:max-w-3xl [&_h1]:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight sm:[&_h1]:text-5xl',
                '[&_h2]:mt-4 [&_h2]:max-w-3xl [&_h2]:text-4xl [&_h2]:font-medium [&_h2]:tracking-tight sm:[&_h2]:text-5xl',
                '[&_p]:mt-5 [&_p]:max-w-2xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-zinc-400',
              ].join(' ')}
            />
          ))}
      </div>
    </div>
  )
}
