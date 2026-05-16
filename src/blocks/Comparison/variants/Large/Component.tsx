import React from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import RichText from '@/components/RichText'
import type { ComparisonBlockProps } from '../../types'

export const LargeComparison: React.FC<ComparisonBlockProps> = (props) => {
  const { heading, left, right, note } = props

  return (
    <section className="max-w-7xl mx-auto px-8 py-20 bg-neutral-800 text-white rounded-3xl">
      <div className="px-4 md:px-32 lg:px-40">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">{heading}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column (Positive) */}
          <div>
            <h4 className="text-xl font-bold mb-6">{left.title}</h4>

            <ul className="space-y-6">
              {left.items?.map((item, i) => (
                <li key={item.id || i} className="flex gap-4">
                  <span className="text-white mt-1 shrink-0">
                    <CircleCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column (Negative) */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-gray-400">{right.title}</h4>

            <ul className="space-y-6">
              {right.items?.map((item, i) => (
                <li key={item.id || i} className="flex gap-4">
                  <span className="text-gray-400 mt-1 shrink-0">
                    <CircleX className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-gray-400">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
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
