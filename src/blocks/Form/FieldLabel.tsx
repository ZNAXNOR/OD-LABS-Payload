import React from 'react'

import { Label } from '@/components/ui/label'

const Requirement: React.FC<{ required?: boolean | null }> = ({ required }) => (
  <span className={`font-mono text-[9px] font-normal uppercase tracking-[0.14em] ${required ? 'text-odl' : 'text-zinc-500'}`}>
    {required ? 'Required' : 'Optional'}
  </span>
)

export const FieldLabel: React.FC<{
  htmlFor?: string
  label?: string | null
  required?: boolean | null
}> = ({ htmlFor, label, required }) =>
  htmlFor ? (
    <Label htmlFor={htmlFor} className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{label}</span>
      <Requirement required={required} />
    </Label>
  ) : (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{label}</span>
      <Requirement required={required} />
    </span>
  )
