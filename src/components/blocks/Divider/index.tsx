import React from 'react'
import type { DividerBlock as DividerBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'

interface DividerBlockProps {
  block: DividerBlockType
  className?: string
}

export const DividerBlock: React.FC<DividerBlockProps> = ({ block, className }) => {
  const {
    style = 'solid',
    thickness = '1',
    color = 'zinc-200',
    width = 'full',
    alignment = 'center',
    spacingTop = 'md',
    spacingBottom = 'md',
  } = block

  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    gradient: 'border-none bg-gradient-to-r from-transparent via-brand-primary to-transparent',
  }

  const thicknessClasses = {
    '1': style === 'gradient' ? 'h-px' : 'border-t',
    '2': style === 'gradient' ? 'h-0.5' : 'border-t-2',
    '3': style === 'gradient' ? 'h-1' : 'border-t-[3px]',
    '4': style === 'gradient' ? 'h-1' : 'border-t-4',
  }

  const colorClasses = {
    'zinc-200': 'border-zinc-200 dark:border-zinc-800',
    'zinc-300': 'border-zinc-300 dark:border-zinc-700',
    'zinc-400': 'border-zinc-400 dark:border-zinc-600',
    'zinc-800': 'border-zinc-800 dark:border-zinc-200',
    'brand-primary': 'border-brand-primary',
  }

  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
  }

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  const spacingTopClasses = {
    none: 'mt-0',
    sm: 'mt-4',
    md: 'mt-8',
    lg: 'mt-12',
    xl: 'mt-16',
  }

  const spacingBottomClasses = {
    none: 'mb-0',
    sm: 'mb-4',
    md: 'mb-8',
    lg: 'mb-12',
    xl: 'mb-16',
  }

  return (
    <div
      className={cn(
        'px-4',
        spacingTopClasses[spacingTop as keyof typeof spacingTopClasses],
        spacingBottomClasses[spacingBottom as keyof typeof spacingBottomClasses],
        className,
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <hr
          className={cn(
            widthClasses[width as keyof typeof widthClasses],
            width !== 'full' && alignmentClasses[alignment as keyof typeof alignmentClasses],
            styleClasses[style as keyof typeof styleClasses],
            thicknessClasses[thickness as keyof typeof thicknessClasses],
            style !== 'gradient' && colorClasses[color as keyof typeof colorClasses],
          )}
        />
      </div>
    </div>
  )
}

export default DividerBlock
