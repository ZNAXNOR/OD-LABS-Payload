'use client'

import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex cursor-pointer items-center gap-1.5 border border-transparent px-3 py-2 transition-all duration-300 ease-in-out hover:border-[#FF3B30] hover:bg-zinc-950 hover:text-white"
    >
      <ArrowUp className="h-3 w-3" />
      Back to top
    </button>
  )
}
