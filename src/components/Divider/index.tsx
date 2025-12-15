import React from 'react'

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative before:absolute after:absolute before:bg-od-brand-primary after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-6 after:top-0 after:right-0 after:left-8 after:h-px ${className}`}
    />
  )
}
