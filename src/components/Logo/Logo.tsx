import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import React from 'react'
import logoSrc from './ODLABS-full.svg'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="OD LABS Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={twMerge(clsx('max-w-[9.375rem] w-full h-[34px]', className))}
      src={logoSrc.src || logoSrc}
    />
  )
}
