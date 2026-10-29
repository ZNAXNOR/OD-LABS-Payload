import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import { ArrowRight } from 'lucide-react'
import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | 'underline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${reference.value.slug}`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  if (appearance === 'underline') {
    return (
      <Link
        className={cn(
          'group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 underline decoration-white/30 underline-offset-8 transition-colors hover:text-white',
          className,
        )}
        href={href || url || ''}
        {...newTabProps}
      >
        {label && label}
        {children && children}
        <ArrowRight
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className="group-hover:text-odl shrink-0 transition-transform duration-200 text-shadow-zinc-300 group-hover:translate-x-1"
        />
      </Link>
    )
  }

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  // The CMS "Fill" appearance maps to the tailored editorial button style.
  const buttonVariant = appearance === 'default' ? 'fill' : appearance

  const renderedLabel =
    appearance && ['default', 'outline'].includes(appearance) && label
      ? `[ ${label} ]`
      : label


  return (
    <Button asChild className={className} size={size} variant={buttonVariant}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {renderedLabel && renderedLabel}
        {children && children}
      </Link>
    </Button>
  )
}
