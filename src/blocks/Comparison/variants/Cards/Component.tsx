import React from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import RichText from '@/components/RichText'
import type { ComparisonBlockProps } from '../../types'

export const CardsComparison: React.FC<ComparisonBlockProps> = (props) => {
  const { eyebrow, heading, intro, left, right, note } = props

  return (
    <section className="max-w-7xl mx-auto px-8 py-20 bg-white text-neutral-900">
      <div className="text-center max-w-3xl mx-auto mb-16">
        {eyebrow && (
          <span className="text-red-700 font-semibold tracking-wide uppercase text-sm mb-4 block">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-5xl font-bold mb-6">{heading}</h2>
        {intro && <p className="text-lg text-neutral-600">{intro}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left Card (Negative/Bad Fit) */}
        <div className="border border-neutral-200 rounded-3xl p-8 bg-neutral-50/50 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-neutral-500">
              <CircleX className="h-6 w-6 text-neutral-400" />
              {left.title}
            </h3>
          </div>

          <ul className="space-y-6 grow">
            {left.items?.map((item, i) => (
              <li key={item.id || i} className="flex gap-4">
                <span className="text-neutral-400 mt-1 shrink-0">
                  <CircleX className="h-5 w-5 opacity-50" />
                </span>
                <div>
                  <p className="font-bold text-neutral-600">{item.title}</p>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Card (Positive/Good Fit) */}
        <div className="border-1 border-red-700 p-8 bg-blue-50/10 flex flex-col shadow-xl shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
               Recommended
             </div>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-neutral-900">
              <CircleCheck className="h-6 w-6 text-red-700" />
              {right.title}
            </h3>
          </div>

          <ul className="space-y-6 grow">
            {right.items?.map((item, i) => (
              <li key={item.id || i} className="flex gap-4">
                <span className="text-red-700 mt-1 shrink-0">
                  <CircleCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      {note && (
        <div className="mt-16 text-center">
          <RichText
            data={note}
            enableGutter={false}
            className="text-neutral-500 italic max-w-2xl mx-auto prose-strong:text-neutral-700"
          />
        </div>
      )}
    </section>
  )
}
