'use client'
import React, { useState, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ChevronRight, ChevronLeft, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface MobileMenuModalProps {
  tabs: NonNullable<HeaderType['tabs']>
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  menuCta: HeaderType['menuCta']
}

export function MobileMenuModal({ tabs, isOpen, setIsOpen, menuCta }: MobileMenuModalProps) {
  const [activeTabIdx, setActiveTabIdx] = useState<number | null>(null)

  // Reset sub-menu state when closing modal
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setActiveTabIdx(null), 500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOpen])

  const activeTab = activeTabIdx !== null ? tabs[activeTabIdx] : null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[400] bg-[#0A0A0A] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden flex flex-col',
        isOpen
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible translate-y-8 pointer-events-none',
      )}
    >
      {/* Modal Top Bar */}
      <div className="flex justify-between items-center px-6 h-20 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl shrink-0">
        <Logo loading="eager" priority="high" className="h-6 w-auto brightness-0 invert" />

        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
          onClick={() => setIsOpen(false)}
          aria-label="Close Menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          className={cn(
            'flex h-full w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
            activeTabIdx !== null ? '-translate-x-1/2' : 'translate-x-0',
          )}
        >
          {/* View 1: Main Categories */}
          <div className="w-1/2 h-full overflow-y-auto px-6 py-10 custom-scrollbar flex flex-col">
            <div className="space-y-1">
              {tabs.map((tab, i) => {
                const hasDropdown = tab.enableDropdown && tab.dropdown
                const hasDirectLink = tab.enableDirectLink && tab.directLink?.link

                return (
                  <div key={i} className="group">
                    {hasDropdown ? (
                      /* If it has a dropdown, ALWAYS open the sub-menu on mobile */
                      <button
                        className="w-full flex justify-between items-center py-5 text-2xl font-bold text-white/90 hover:text-white transition-colors border-b border-white/[0.03]"
                        onClick={() => setActiveTabIdx(i)}
                      >
                        {tab.label}
                        <div className="w-8 h-8 rounded-full bg-[#E94235]/10 flex items-center justify-center group-active:scale-90 transition-transform">
                          <ChevronRight size={18} className="text-[#E94235]" />
                        </div>
                      </button>
                    ) : hasDirectLink ? (
                      /* Only link directly if there is NO dropdown */
                      <CMSLink
                        {...tab.directLink!.link!}
                        className="flex justify-between items-center py-5 text-2xl font-bold text-white/90 hover:text-white transition-colors border-b border-white/[0.03]"
                        onClick={() => setIsOpen(false)}
                        label={null}
                      >
                        {tab.label}
                        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={18} />
                        </div>
                      </CMSLink>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {/* Mobile Footer CTA */}
            <div className="mt-auto pt-16 pb-8">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 text-center">
                Ready to start?
              </p>
              {menuCta && (
                <CMSLink
                  {...menuCta}
                  appearance="default"
                  className="!w-full !bg-[#E94235] !text-white !py-5 !rounded-2xl !text-lg !font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-[#E94235]/20"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>
          </div>

          {/* View 2: Sub-navigation */}
          <div className="w-1/2 h-full overflow-hidden flex flex-col bg-zinc-900/10">
            {activeTab && (
              <>
                {/* Sub-header with Back button */}
                <div className="px-6 py-6 border-b border-white/5 flex items-center gap-4 shrink-0">
                  <button
                    className="p-3 -ml-3 rounded-full hover:bg-white/5 transition-colors text-[#E94235]"
                    onClick={() => setActiveTabIdx(null)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-[#E94235] uppercase tracking-widest">
                      Back
                    </div>
                    <h2 className="text-xl font-bold text-white">{activeTab.label}</h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-10 custom-scrollbar space-y-12 pb-20">
                  {/* Add Direct Link as 'Overview' if it exists alongside dropdown */}
                  {activeTab.enableDirectLink && activeTab.directLink?.link && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <CMSLink
                        {...activeTab.directLink.link}
                        className="flex justify-between items-center py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-xl font-bold text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                        label={null}
                      >
                        View {activeTab.label}
                        <ChevronRight size={18} className="text-[#E94235]" />
                      </CMSLink>
                    </div>
                  )}
                  {activeTab.dropdown?.navItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both"
                      style={{
                        animationDelay: `${(idx + (activeTab.enableDirectLink ? 1 : 0)) * 80}ms`,
                      }}
                    >
                      {item.style === 'default' && item.defaultLink?.link && (
                        <div className="space-y-3 group/item">
                          <CMSLink
                            {...item.defaultLink.link}
                            className="text-2xl font-bold text-white block hover:text-[#E94235] transition-colors"
                            onClick={() => setIsOpen(false)}
                          />
                          {item.defaultLink.description && (
                            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                              {item.defaultLink.description}
                            </p>
                          )}
                        </div>
                      )}

                      {item.style === 'list' && (
                        <div className="space-y-6">
                          {item.listLinks?.tag && (
                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                              {item.listLinks.tag}
                            </div>
                          )}
                          <div className="grid gap-6">
                            {item.listLinks?.links?.map((ll, lidx) => (
                              <CMSLink
                                key={lidx}
                                {...ll.link}
                                className="text-lg font-medium text-white/60 hover:text-white flex items-center justify-between group/ll transition-colors"
                                onClick={() => setIsOpen(false)}
                                label={null}
                              >
                                {ll.link.label}
                                <ChevronRight
                                  size={18}
                                  className="text-[#E94235] opacity-0 group-hover/ll:opacity-100 transition-all -translate-x-4 group-hover/ll:translate-x-0"
                                />
                              </CMSLink>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.style === 'featured' && item.featuredLink && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
                          <div className="text-[#E94235] text-[10px] font-black uppercase tracking-[0.4em]">
                            {item.featuredLink.tag}
                          </div>
                          <h4 className="text-2xl font-bold text-white leading-tight">
                            {item.featuredLink.label}
                          </h4>
                          <div className="grid gap-4">
                            {item.featuredLink.links?.map((fl, fidx) => (
                              <CMSLink
                                key={fidx}
                                {...fl.link}
                                className="text-base text-white/50 hover:text-white transition-colors flex items-center gap-3 group/f"
                                onClick={() => setIsOpen(false)}
                                label={null}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E94235]/30 group-hover/f:bg-[#E94235] transition-colors" />
                                {fl.link.label}
                              </CMSLink>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="h-20" /> {/* Spacer */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
