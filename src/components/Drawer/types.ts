import type { HTMLAttributes } from 'react'

export interface Props {
  children: React.ReactNode
  className?: string
  description?: string
  header?: React.ReactNode
  size?: 'large' | 'medium' | 'small'
  slug: string

  title?: React.ReactNode | string
}

export type TogglerProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  slug: string
} & HTMLAttributes<HTMLButtonElement>