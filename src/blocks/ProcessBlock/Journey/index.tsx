import React from 'react'

import RichText from '@/components/RichText'

import type { ProcessBlockProps } from '../Component'

export const Journey: React.FC<ProcessBlockProps> = ({
  eyebrow,
  heading,
  stepShape = 'circle',
  steps,
}) => {
  const stepsArray = steps || []
  const shapeClass = stepShape === 'circle' ? 'rounded-full' : 'rounded'

  return (
    <section className="py-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        {eyebrow || heading ? (
          <div className="max-w-4xl mx-auto text-center mb-20">
            {eyebrow && (
              <p className="text-xl font-bold uppercase tracking-wide font-mono text-muted-foreground mb-4">
                {eyebrow}
              </p>
            )}

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {heading}
            </h2>
          </div>
        ) : null}

        {/* Steps — Desktop: single grid, each cell is a full column */}
        {stepsArray.length > 0 && (
          <div className="max-w-5xl mx-auto">
            {/* Desktop layout */}
            <div className="hidden md:block relative">
              {/* Connector line */}
              <div className="absolute top-8 left-0 w-full h-0.5 bg-border z-0 pointer-events-none" />

              <div className="relative grid grid-cols-4 gap-8 group/list">
                {stepsArray.map((step, index) => {
                  const stepNumber = String(index + 1).padStart(2, '0')
                  const isHighlighted = step.isHighlighted

                  return (
                    <div
                      key={step.id || index}
                      className="group/step flex flex-col items-center text-center relative z-10 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`w-16 h-16 ${shapeClass} border-2 flex items-center justify-center font-light font-mono text-2xl mb-6 transition-all duration-300 group-hover/step:shadow-md ${
                          isHighlighted
                            ? 'bg-primary text-primary-foreground border-primary group-has-[:hover]/list:bg-background group-has-[:hover]/list:text-foreground group-hover/step:bg-primary/90! group-hover/step:text-primary-foreground!'
                            : 'bg-card text-foreground border-border group-hover/step:bg-primary group-hover/step:text-primary-foreground group-hover/step:border-primary'
                        }`}
                      >
                        {stepNumber}
                      </div>

                      <h3 className="font-bold text-xl mb-4 px-4">
                        {step.title}
                      </h3>

                      <RichText
                        data={step.description}
                        enableGutter={false}
                        className="text-center text-muted-foreground px-4 text-sm"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile: stacked layout */}
            <div className="md:hidden flex flex-col items-center gap-12">
              {stepsArray.map((step, index) => {
                const stepNumber = String(index + 1).padStart(2, '0')
                const isHighlighted = step.isHighlighted

                return (
                  <div
                    key={step.id || index}
                    className="flex flex-col items-center w-full"
                  >
                    <div
                      className={`w-16 h-16 ${shapeClass} border-2 flex items-center justify-center font-light font-mono text-2xl mb-6 transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-card text-foreground border-border'
                      }`}
                    >
                      {stepNumber}
                    </div>

                    <h3 className="font-bold text-xl mb-4 text-center">
                      {step.title}
                    </h3>

                    <RichText
                      data={step.description}
                      enableGutter={false}
                      className="text-center text-muted-foreground"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
