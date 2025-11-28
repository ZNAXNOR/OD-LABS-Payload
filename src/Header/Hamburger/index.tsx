import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  active?: boolean
  className?: string
}

const Hamburger: React.FC<Props> = ({ active, className }) => {
  return (
    <svg
      className={cn(
        'w-4 h-4 fill-current pointer-events-none transition-transform duration-300',
        active && 'scale-110',
        className,
      )}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        className={cn(
          'origin-center -translate-y-[5px] translate-x-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]',
          active && 'translate-x-0 translate-y-0 rotate-[315deg]',
        )}
        y="7"
        width="9"
        height="2"
        rx="1"
      />
      <rect
        className={cn(
          'origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]',
          active && 'rotate-45',
        )}
        y="7"
        width="16"
        height="2"
        rx="1"
      />
      <rect
        className={cn(
          'origin-center translate-y-[5px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]',
          active && 'translate-y-0 rotate-[135deg]',
        )}
        y="7"
        width="9"
        height="2"
        rx="1"
      />
    </svg>
  )
}

export default Hamburger
