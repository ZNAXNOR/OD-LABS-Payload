export const MegaMenuFooter = () => {
  return (
    <footer className="">
      <div className="w-full border-t border-[#4B525F] px-6 lg:px-12 py-5 flex items-center justify-between shrink-0 font-mono">
        <div className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} OD LABS • All rights reserved.
        </div>

        <div className="text-zinc-500 text-sm">ESC to close</div>
      </div>
    </footer>
  )
}
