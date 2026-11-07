import React from 'react'
import type { PagesData } from '../../getPagesData'
import { MegaMenu_ContextDefault } from './contextDefault'
import { MegaMenu_ContextErrorPreview } from './contextErrorPreview'
import type { CurrentPageInfo } from '../types'
import type { ContactSocial } from '@/payload-types'

interface MegaMenu_ContextPreviewProps {
  page: PagesData | null
  currentPage?: CurrentPageInfo | PagesData | null
  contactSocials?: ContactSocial | null
}

export const MegaMenu_ContextPreview = ({
  page,
  currentPage,
  contactSocials,
}: MegaMenu_ContextPreviewProps) => {
  const isErrorState =
    currentPage && 'errorCode' in currentPage && Boolean(currentPage.errorCode)

  return (
    <div className="relative h-full min-h-[400px]">
      {/* Default Context or Error Diagnostic Preview */}
      <div
        className={[
          'absolute inset-0 transition-opacity duration-300 ease-out',
          page ? 'pointer-events-none opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        {isErrorState ? (
          <MegaMenu_ContextErrorPreview
            errorInfo={currentPage as CurrentPageInfo}
            contactSocials={contactSocials}
          />
        ) : (
          <MegaMenu_ContextDefault contactSocials={contactSocials} />
        )}
      </div>

      {/* Hovered Page Preview Context */}
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
                      key={section.id || `${section.href}-${index}`}
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
