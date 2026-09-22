export const MegaMenuFooter = () => {
  return (
    <footer>
      <div className="w-full border-t border-[#4B525F] px-6 lg:px-12 py-5 flex items-center justify-between shrink-0 font-mono">
        <div className="text-zinc-500 text-sm flex items-center gap-1.5">
          <span>© {new Date().getFullYear()} OD LABS</span>
          <span className="hidden md:inline">• All rights reserved.</span>
        </div>

        <div className="text-zinc-500 text-sm hidden sm:block md:block">ESC to close</div>
      </div>
    </footer>
  )
}
