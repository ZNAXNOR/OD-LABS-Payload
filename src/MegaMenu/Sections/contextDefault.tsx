export const MegaMenu_ContextDefault = () => {
  const time = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <aside className="flex flex-col justify-between pt-8 lg:pt-0">
      <div className="space-y-8">
        {/* Local Time */}
        <section className="space-y-4">
          <div className="font-mono text-xs tracking-widest uppercase text-zinc-400">
            Local time
          </div>

          <div className="font-mono text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            {time}
          </div>

          <div className="text-xs font-mono text-zinc-400">Asia / Kolkata (UTC +05:30)</div>
        </section>

        {/* Availability */}
        <section className="space-y-3 pt-6 border-t border-zinc-600/60">
          <div className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
            Availability
          </div>
          <div className="font-mono text-xs text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse uppercase"></span>
            Open for Projects
          </div>
          <p className="text-xs font-sans text-zinc-400 leading-relaxed pt-1">
            I’m currently available for freelance and contract work. If you’d like to collaborate,
            say hi.
          </p>
        </section>

        {/* Contact & Dorect Inquiries */}
        <a
          href="mailto:omkar@odtechlab.com"
          className="text-xs font-mono text-zinc-400 transition-colors flex items-center gap-2"
        >
          <span className="group w-1 h-1 bg-red-500 inline-block" />
          <span> omkar@odtechlab.com </span>
        </a>
      </div>
    </aside>
  )
}
