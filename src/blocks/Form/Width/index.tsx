import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const occupiesHalfWidth = width === 50 || width === '50'

  return (
    <div className={[occupiesHalfWidth ? 'sm:col-span-1' : 'sm:col-span-2', 'min-w-0', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
