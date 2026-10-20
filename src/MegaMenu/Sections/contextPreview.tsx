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
          page ? 'pointer-events-none opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <MegaMenu_ContextDefault />
      </div>

      {/* Preview Context */}
      <div
        className={[
          'absolute inset-0 transition-opacity duration-200 ease-out',
          page ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        {page && (
          <aside className="flex h-full flex-col justify-between pt-8 lg:pt-0">
            <div className="space-y-8">
              {/* Page Content Preview */}
              <section className="space-y-3">
                <div className="font-mono text-[11px] tracking-widest text-odl uppercase">
                  OD LABS //
                </div>

                <div className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {page.title}
                </div>

                <div className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {page.description}
                </div>
              </section>

              {/* Page Sections */}
              <section className="flex-1 space-y-2 pt-4">
                <div className="border-b border-zinc-700/60 pb-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
                  On This Page
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {page.sections.map((section, index) => (
                    <div
                      key={section.href ?? section.label}
                      className="flex h-9 border border-zinc-700 bg-zinc-900 p-2 text-white"
                    >
                      <span className="mr-2 text-odl select-none">
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
