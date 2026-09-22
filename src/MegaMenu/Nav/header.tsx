import { X } from 'lucide-react'
import Link from 'next/link'

interface MegaMenuHeaderProps {
  onClose: () => void
}

export const MegaMenuHeader = ({ onClose }: MegaMenuHeaderProps) => {
  return (
    <header className="w-full border-b border-[#4B525F] px-6 lg:px-12 py-5 flex items-center justify-between shrink-0">
      <Link href="/" className="flex item-center gap-2.5 group" onClick={onClose}>
        <span className="text-[#FF3B30] select-none">■</span>

        <span className="font-mono text-md tracking-tight font-semibold text-white transition-colors select-none">
          OD LABS
        </span>

        <span className="text-zinc-600 select-none hidden sm:inline">//</span>

        <span className="text-zinc-400 font-mono text-md hidden sm:inline">Megamenu</span>
      </Link>

      <button
        type="button"
        onClick={onClose}
        className="group text-zinc-400 hover:text-white flex cursor-pointer lg:-mr-8 md:-mr-6 sm:-mr-8"
      >
        <span className="text-red-500 text-2xl pr-1 font-bold mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          {'['}
        </span>
        <span className="font-mono text-md mr-1 mt-1">Close</span>
        <X className="mt-1" />
        <span className="text-red-500 text-2xl pl-1 font-bold mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          {']'}
        </span>
      </button>
    </header>
  )
}
