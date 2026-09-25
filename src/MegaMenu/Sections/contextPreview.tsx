import { PagesData } from '../../getPagesData'
import { MegaMenu_ContextDefault } from './contextDefault'

interface MegaMenu_ContextPreviewProps {
  page: PagesData | null
}

export const MegaMenu_ContextPreview = ({ page }: MegaMenu_ContextPreviewProps) => {
  return (
    <div className="relative h-full min-h-[400px]">
      {/* Default Context */}
      <div
        className={[
          'absolute inset-0 transition-opacity duration-300 ease-out',
          page ? 'opacity-0 pointer-events-none' : 'opacity-100',
        ].join(' ')}
      >
        <MegaMenu_ContextDefault />
      </div>

      {/* Preview Context */}
      <div
        className={[
          'absolute inset-0 transition-opacity duration-200 ease-out',
          page ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        {page && (
          <aside className="flex flex-col justify-between pt-8 lg:pt-0 h-full">
            <div className="space-y-8">
              {/* Page Content Preview */}
              <section className="space-y-3">
                <div className="font-mono text-[11px] tracking-widest uppercase text-[#FF3B30]">
                  OD LABS //
                </div>

                <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {page.title}
                </div>

                <div className="text-xs sm:text-sm font-sans leading-relaxed text-zinc-400">
                  {page.description}
                </div>
              </section>

              {/* Page Sections */}
              <section className="space-y-2 flex-1 pt-4 ">
                <div className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase border-b border-zinc-700/60 pb-2">
                  On This Page
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {page.sections.map((section, index) => (
                    <div
                      key={section.href ?? section.label}
                      className="flex p-2 h-9 bg-zinc-900 border border-zinc-700 text-white"
                    >
                      <span className="text-[#FF3B30] mr-2 select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span>{section.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
