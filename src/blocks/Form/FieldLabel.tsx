import React from 'react'

import { Label } from '@/components/ui/label'

export const FieldLabel: React.FC<{
  htmlFor?: string
  label?: string | null
  required?: boolean | null
}> = ({ htmlFor, label, required }) => (
  <Label htmlFor={htmlFor} className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
    <span>{label}</span>
    <span className="font-mono text-[9px] font-normal uppercase tracking-[0.14em] text-zinc-500">
      {required ? 'Required' : 'Optional'}
    </span>
  </Label>
)
