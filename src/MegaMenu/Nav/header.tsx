import { X } from 'lucide-react'
import Link from 'next/link'

interface MegaMenuHeaderProps {
  onClose: () => void
}

export const MegaMenuHeader = ({ onClose }: MegaMenuHeaderProps) => {
  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-[#4B525F] px-6 py-5 lg:px-12">
      <Link
        href="/"
        className="item-center group flex gap-2.5"
        onClick={onClose}
      >
        <span className="text-odl select-none">■</span>

        <span className="text-md font-mono font-semibold tracking-tight text-white transition-colors select-none">
          OD LABS
        </span>

        <span className="hidden text-zinc-600 select-none sm:inline">//</span>

        <span className="text-md hidden font-mono text-zinc-400 sm:inline">
          Megamenu
        </span>
      </Link>

      <button
        type="button"
        onClick={onClose}
        className="group flex cursor-pointer text-zinc-400 hover:text-white sm:-mr-8 md:-mr-6 lg:-mr-8"
      >
        <span className="mr-1 pr-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          {'['}
        </span>
        <span className="text-md mt-1 mr-1 font-mono">Close</span>
        <X className="mt-1" />
        <span className="mr-1 pl-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          {']'}
        </span>
      </button>
    </header>
  )
}
