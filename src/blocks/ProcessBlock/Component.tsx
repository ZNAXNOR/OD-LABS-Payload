import React from 'react'

export type ProcessStep = {
  id?: string | null
  title: string
  description: string
  isFinal?: boolean | null
}

export type ProcessBlockProps = {
  title: string
  steps: ProcessStep[]
}

export const ProcessBlockComponent: React.FC<ProcessBlockProps> = ({ title, steps }) => {
  // Safe mapping for Tailwind grid columns (up to 4 as per requirements)
  const gridColsClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[steps?.length || 1] || 'md:grid-cols-4';

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {title}
        </h2>
      )}

      {steps && steps.length > 0 && (
        <div className={`relative grid grid-cols-1 gap-8 ${gridColsClass} group/list`}>
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border z-0 pointer-events-none"></div>

          {steps.map((step, index) => {
            const stepNumber = String(index + 1).padStart(2, '0')
            const isFinal = step.isFinal

            return (
              <div key={step.id || index} className="group/step flex flex-col items-center text-center relative z-10 transition-transform duration-300 hover:-translate-y-1">
                <div 
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold mb-6 transition-all duration-300 group-hover/step:shadow-md ${
                    isFinal 
                      ? 'bg-primary text-primary-foreground border-primary group-has-[:hover]/list:bg-background group-has-[:hover]/list:text-foreground group-hover/step:bg-primary/90! group-hover/step:text-primary-foreground!' 
                      : 'bg-background text-foreground border-primary group-hover/step:bg-primary group-hover/step:text-primary-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground max-w-50">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
