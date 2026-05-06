import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X } from 'lucide-react'
import { cn } from '@/utilities/ui'

type WarningBlockProps = {
  title?: string | null
  description?: string | null
  warningItems?: { text: string; id?: string | null }[] | null
}

export const WarningBlock: React.FC<WarningBlockProps> = ({ title, description, warningItems }) => {
  return (
    <Alert
      className={cn(
        'border-l-4 rounded-r-xl max-w-6xl mx-auto rounded-l-none border-t-0 border-r-0 border-b-0',
        'border-red-700 bg-red-50/40 text-red-700',
      )}
    >
      <AlertTitle className="text-2xl font-bold mb-4">
        {title}
      </AlertTitle>
      <AlertDescription className="text-base">
        {description && (
          <p className="leading-relaxed max-w-3xl mb-6 text-slate-700">{description}</p>
        )}
        {warningItems && warningItems.length > 0 && (
          <div className="flex flex-col gap-4">
            {warningItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-red-600"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
