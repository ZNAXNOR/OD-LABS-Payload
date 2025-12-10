import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  theme?: 'light' | 'dark' | 'auto'
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    theme = 'auto',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // For auto theme, we'll use CSS to show/hide based on theme
  if (theme === 'auto') {
    return (
      <>
        {/* Light mode logo (black) */}
        <img
          alt="Payload Logo"
          width={193}
          height={34}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className={clsx('max-w-[9.375rem] w-full h-[34px] dark:hidden', className)}
          src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg"
        />
        {/* Dark mode logo (white) */}
        <img
          alt="Payload Logo"
          width={193}
          height={34}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className={clsx('max-w-[9.375rem] w-full h-[34px] hidden dark:block', className)}
          src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
        />
      </>
    )
  }

  // For explicit theme, show the appropriate logo
  const logoSrc =
    theme === 'dark'
      ? 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'
      : 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={logoSrc}
    />
  )
}
