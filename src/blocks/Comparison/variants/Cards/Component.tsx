import React from 'react'

import { CircleCheck, CircleX } from 'lucide-react'

import type { ComparisonBlockProps } from '../../types'

import { ComparisonColumn } from '../../components/ComparisonColumn'

export const CardsComparison: React.FC<ComparisonBlockProps> = (
  props,
) => {
  const {
    eyebrow,
    heading,
    intro,
    left,
    right,
    note,
    positiveSide,
    itemStyle,
  } = props
  const leftPositive = positiveSide === 'left'
  const rightPositive = positiveSide === 'right'

  const leftClasses = leftPositive
    ? 'border border-border p-8 bg-background flex flex-col rounded-xl shadow-sm relative overflow-hidden'
    : 'border border-border p-8 bg-muted/30 flex flex-col rounded-xl'

  const rightClasses = rightPositive
    ? 'border border-border p-8 bg-background flex flex-col rounded-xl shadow-sm relative overflow-hidden'
    : 'border border-border p-8 bg-muted/30 flex flex-col rounded-xl'

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        {eyebrow && (
          <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-4 block">
            {eyebrow}
          </span>
        )}

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          {heading}
        </h2>

        {intro && (
          <p className="text-muted-foreground text-lg leading-relaxed">
            {intro}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT */}
        <div className={leftClasses}>
          <h4
            className={[
              'text-xl font-bold mb-6 flex items-center gap-3',
              leftPositive ? '' : 'text-foreground/70',
            ].join(' ')}
          >
            {leftPositive ? (
              <CircleCheck className="h-5 w-5 text-primary" />
            ) : (
              <CircleX className="h-5 w-5 text-gray-400" />
            )}

            {left.title}
          </h4>

          <ComparisonColumn
            column={left}
            compact
            showDescription={false}
            useBulletPoints={itemStyle === 'bulletPoints'}
            itemIconClassName={
              leftPositive
                ? 'text-primary'
                : 'text-gray-400'
            }
            titleClassName={[
              'font-bold',
              leftPositive
                ? ''
                : 'text-foreground/70',
            ].join(' ')}
          />
        </div>

        {/* RIGHT */}
        <div className={rightClasses}>
          <h4
            className={[
              'text-xl font-bold mb-6 flex items-center gap-3',
              rightPositive ? '' : 'text-foreground/70',
            ].join(' ')}
          >
            {rightPositive ? (
              <CircleCheck className="h-5 w-5 text-primary" />
            ) : (
              <CircleX className="h-5 w-5 text-gray-400" />
            )}

            {right.title}
          </h4>

          <ComparisonColumn
            column={right}
            compact
            showDescription={false}
            useBulletPoints={itemStyle === 'bulletPoints'}
            itemIconClassName={
              rightPositive
                ? 'text-primary'
                : 'text-gray-400'
            }
            titleClassName={[
              'font-bold',
              rightPositive
                ? ''
                : 'text-foreground/70',
            ].join(' ')}
          />
        </div>
      </div>
    </section>
  )
}
