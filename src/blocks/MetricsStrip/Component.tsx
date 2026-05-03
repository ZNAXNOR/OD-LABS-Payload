import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  items: {
    value: string
    label: string
  }[]
}

export const MetricsStripComponent: React.FC<Props> = ({ items }) => {
  return (
    <section className="py-12 border-y bg-background/50 backdrop-blur-sm overflow-hidden">
      <div className="container px-4 md:px-6">
        <div
          className={cn(
            'grid gap-y-8 gap-x-12',
            items?.length === 2 && 'grid-cols-1 md:grid-cols-2',
            items?.length === 3 && 'grid-cols-1 md:grid-cols-3',
            items?.length >= 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="flex-1 text-right">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold leading-tight group-hover:text-foreground transition-colors duration-300">
                  {item.label}
                </p>
              </div>
              <div className="w-0.5 h-6 bg-border group-hover:bg-primary/50 transition-colors duration-300" />
              <div className="flex-[0.6] text-left">
                <p className="text-xl md:text-2xl font-bold tracking-tight tabular-nums">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
