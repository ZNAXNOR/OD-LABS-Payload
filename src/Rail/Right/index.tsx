import { Menu as MenuIcon } from 'lucide-react'

type RightRailProps = {
  onMenuOpen: () => void
}

export const RightRail = ({ onMenuOpen }: RightRailProps) => {
  return (
    <aside
      className="hidden lg:flex items-center border-l border-[#4B525F] top-0 right-0 z-40 flex-col pt-6 "
      aria-label="Site navigation"
    >
      <button
        className="group flex flex-col items-center p-1.5 sticky top-6 text-zinc-400 hover:text-[#FF3B30] transition-colors focus:outline-none"
        aria-label="Explore Site"
      >
        <MenuIcon />
        <span className="font-mono text-sm uppercase tracking-wide [writing-mode:vertical-rl] rotate-180 pb-2">
          Explore Site
        </span>
      </button>
    </aside>
  )
}
