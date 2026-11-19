import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import logoSrc from './ODLABS-full.svg'
import darkLogoSrc from './ODLABS-full-dark.svg'
import squareLogoSrc from './OD-small-white.svg'
import darkSquareLogoSrc from './OD-small-dark.svg'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

const imageClass = (className?: string) =>
  twMerge(clsx('max-w-[9.375rem] w-full h-[34px]', className))

export const Logo = ({ loading = 'lazy', priority = 'low', className }: Props) => (
  <>
    <img
      alt="OD LABS Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={imageClass(className) + ' odl-logo-light'}
      src={logoSrc.src || logoSrc}
    />
    <img
      alt=""
      aria-hidden="true"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={imageClass(className) + ' odl-logo-dark'}
      src={darkLogoSrc.src || darkLogoSrc}
    />
  </>
)

export const SquareLogo = ({ loading = 'lazy', priority = 'low', className }: Props) => (
  <>
    <img
      alt="OD LABS"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={imageClass(className) + ' odl-logo-light'}
      src={squareLogoSrc.src || squareLogoSrc}
    />
    <img
      alt=""
      aria-hidden="true"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={imageClass(className) + ' odl-logo-dark'}
      src={darkSquareLogoSrc.src || darkSquareLogoSrc}
    />
  </>
)
