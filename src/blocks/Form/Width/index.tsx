import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const isFullWidth = width ? Number(width) >= 100 : true

  return (
    <div
      className={`${className} ${isFullWidth ? 'sm:col-span-2' : ''}`}
      style={{ maxWidth: undefined }}
    >
      {children}
    </div>
  )
}
