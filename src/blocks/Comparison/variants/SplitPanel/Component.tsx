import React from 'react'

import { CircleCheck, CircleX } from 'lucide-react'

import RichText from '@/components/RichText'

import type { ComparisonBlockProps } from '../../types'

import { ComparisonColumn } from '../../components/ComparisonColumn'

export const SplitPanelComparison: React.FC<
  ComparisonBlockProps
> = (props) => {
  const {
    heading,
    left,
    right,
    note,
    positiveSide,
  } = props

  const leftPositive = positiveSide === 'left'
  const rightPositive = positiveSide === 'right'

  return (
    <section className="max-w-7xl mx-auto px-8 py-20 bg-neutral-800 text-white rounded-3xl">
      <div className="px-4 md:px-32 lg:px-40">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          {heading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT */}
          <div>
            <h4
              className={[
                'text-xl font-bold mb-6 flex items-center gap-3',
                leftPositive ? 'text-white' : 'text-gray-400',
              ].join(' ')}
            >
              {leftPositive ? (
                <CircleCheck className="h-5 w-5" />
              ) : (
                <CircleX className="h-5 w-5" />
              )}

              {left.title}
            </h4>

            <ComparisonColumn
              column={left}
              compact
              itemIconClassName={
                leftPositive
                  ? 'text-white'
                  : 'text-gray-400'
              }
              titleClassName={[
                'font-bold',
                leftPositive
                  ? 'text-white'
                  : 'text-gray-400',
              ].join(' ')}
              descriptionClassName={[
                'prose prose-sm max-w-none mt-2 prose-invert',
                leftPositive
                  ? 'text-gray-400 prose-p:text-gray-400'
                  : 'text-gray-500 prose-p:text-gray-500',
              ].join(' ')}
            />
          </div>

          {/* RIGHT */}
          <div>
            <h4
              className={[
                'text-xl font-bold mb-6 flex items-center gap-3',
                rightPositive
                  ? 'text-white'
                  : 'text-gray-400',
              ].join(' ')}
            >
              {rightPositive ? (
                <CircleCheck className="h-5 w-5" />
              ) : (
                <CircleX className="h-5 w-5" />
              )}

              {right.title}
            </h4>

            <ComparisonColumn
              column={right}
              compact
              itemIconClassName={
                rightPositive
                  ? 'text-white'
                  : 'text-gray-400'
              }
              titleClassName={[
                'font-bold',
                rightPositive
                  ? 'text-white'
                  : 'text-gray-400',
              ].join(' ')}
              descriptionClassName={[
                'prose prose-sm max-w-none mt-2 prose-invert',
                rightPositive
                  ? 'text-gray-400 prose-p:text-gray-400'
                  : 'text-gray-500 prose-p:text-gray-500',
              ].join(' ')}
            />
          </div>
        </div>

        {note && (
          <div className="mt-16 pt-12 border-t border-gray-700 text-center space-y-4">
            <RichText
              data={note}
              enableGutter={false}
              className="text-gray-400 italic max-w-2xl mx-auto prose-invert prose-strong:text-gray-300"
            />
          </div>
        )}
      </div>
    </section>
  )
}
