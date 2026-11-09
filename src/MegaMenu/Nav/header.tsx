import { X } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'

interface MegaMenuHeaderProps {
  onClose: () => void
}

export const MegaMenuHeader = ({ onClose }: MegaMenuHeaderProps) => (
  <header className="flex w-full shrink-0 items-center justify-between border-b border-[#4B525F] px-6 py-5 lg:px-12">
    <Link href="/" className="flex items-center gap-2" onClick={onClose} aria-label="OD LABS home">
      <Logo loading="eager" priority="high" className="h-[18px]" />
    </Link>
    <button
      type="button"
      data-menu-close
      onClick={onClose}
      aria-label="Close navigation"
      className="group flex cursor-pointer items-center text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl"
    >
      <span className="mr-1 pr-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100" aria-hidden="true">[</span>
      <span className="mt-1 mr-1 font-mono text-md">Close</span>
      <X className="mt-1" aria-hidden="true" />
      <span className="mr-1 pl-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100" aria-hidden="true">]</span>
    </button>
  </header>
)
