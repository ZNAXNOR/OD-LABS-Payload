import * as React from 'react'

const getSpan = (width?: number | string) => {
  const w = typeof width === 'string' ? Number(width.replace('%', '')) : Number(width)

  switch (w) {
    case 25:
      return 'md:col-span-3'

    case 33:
      return 'md:col-span-4'

    case 50:
      return 'md:col-span-6'

    case 66:
      return 'md:col-span-8'

    case 75:
      return 'md:col-span-9'

    default:
      return 'md:col-span-12'
  }
}

export const Width: React.FC<{
  children: React.ReactNode
  width?: number | string
}> = ({ children, width }) => {
  return <div className={`col-span-12 ${getSpan(width)}`}>{children}</div>
}
