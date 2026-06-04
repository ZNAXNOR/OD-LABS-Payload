import React from 'react'

import RichText from '@/components/RichText'

import type { ProcessStep } from '../Component'

type Props = {
  eyebrow?: string
  heading?: string
  steps?: ProcessStep[]
}

export const NumberedPanels: React.FC<Props> = ({ eyebrow, heading, steps }) => {
  const stepsArray = steps || []

  return (
    <section className="py-40 border-b border-border">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-20">
          {eyebrow && (
            <p className="text-xl font-bold uppercase tracking-wide font-mono text-muted-foreground mb-4">
              {eyebrow}
            </p>
          )}

          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            {heading}
          </h2>
        </div>

        {/* Numbered Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-border rounded-md overflow-hidden shadow-sm">
          {stepsArray.map((step, index) => (
            <div
              key={step.id || index}
              className={[
                'relative p-12',
                index < stepsArray.length - 1
                  ? 'border-b md:border-b-0 md:border-r border-border'
                  : '',
              ].join(' ')}
            >
              <span className="absolute top-8 right-8 font-mono text-4xl font-light text-muted-foreground/30">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="text-2xl font-bold mb-6 uppercase tracking-wider font-mono">
                {step.title}
              </h3>

              <RichText
                data={step.description}
                enableGutter={false}
                className="text-lg text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
