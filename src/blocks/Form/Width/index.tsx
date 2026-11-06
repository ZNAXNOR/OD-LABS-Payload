import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const spansFullWidth = width === 100 || width === '100'

  return (
    <div className={[spansFullWidth ? 'sm:col-span-2' : 'sm:col-span-1', 'min-w-0', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
