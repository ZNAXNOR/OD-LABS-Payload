import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import ChatGPTLogoSrc from './ChatGPT.svg'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const ChatGPTLogo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="ChatGPT Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={twMerge(
        clsx('h-[34px] w-full max-w-[9.375rem]', className),
      )}
      src={ChatGPTLogoSrc.src || ChatGPTLogoSrc}
    />
  )
}
