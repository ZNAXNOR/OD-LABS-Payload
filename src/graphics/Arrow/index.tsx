import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
}

const Arrow: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-od-antique', className)}
    >
      <path
        d="M2.45898 30.95L57.6507 30.95M57.6507 30.95L48.7007 22M57.6507 30.95L48.7007 39.9"
        strokeWidth="2"
        strokeMiterlimit="16"
        strokeLinecap="square"
        stroke="currentColor"
      />
    </svg>
  )
}

export default Arrow
