'use client'

import { X, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import type { ConversationSection } from '../ConversationNavigator/Logic'

type SectionPanelProps = {
  sections: ConversationSection[]
  currentSection: ConversationSection | null
  activeIndex: number
  keyboardNavigation: boolean
  setKeyboardNavigation: (value: boolean) => void
  onClose: () => void
  onSelect: (section: ConversationSection) => void
}

export const SectionPanel = ({
  sections,
  currentSection,
  activeIndex,
  keyboardNavigation,
  setKeyboardNavigation,
  onClose,
  onSelect,
}: SectionPanelProps) => {
  return (
    <div className="fixed inset-0 isolate z-[60]">
      {/* Smoky Backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[1px]"
        aria-label="Close conversation sections"
        onClick={onClose}
      />

      {/* Side panel */}
      <aside
        className={[
          'absolute inset-y-0 right-0',
          'w-[min(24rem,82vw)]',
          'overflow-hidden',
          'border-l border-zinc-700/40',
          'bg-zinc-950/75',
          'shadow-[-20px_0_60px_rgba(0,0,0,0.45)]',
          'backdrop-blur-xl',

          // Soft smoky transition into conversation
          'before:pointer-events-none',
          'before:absolute before:inset-y-0 before:-left-16',
          'before:w-16',
          'before:bg-linear-to-r',
          'before:from-transparent before:to-zinc-950/70',
          'before:content-[""]',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Conversation sections"
      >
        <div className="relative flex h-full flex-col">
          {/* Header */}
          <header className="flex shrink-0 items-start justify-between border-b border-zinc-800/70 px-6 py-5">
            <div className="min-w-0">
              <p className="text-[9px] tracking-[0.3em] text-zinc-600 uppercase">
                Conversation
              </p>

              <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-300">
                {currentSection?.text ?? 'Sections'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="group flex cursor-pointer items-center pt-2 text-zinc-400 hover:text-white"
            >
              <span className="text-odl mr-1 pr-1 text-2xl font-bold opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                {'['}
              </span>

              <span className="mr-1 font-mono text-sm">Close</span>

              <X className="size-5" />

              <span className="text-odl mr-1 pl-1 text-2xl font-bold opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                {']'}
              </span>
            </button>
          </header>

          {/* Sections */}
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-1">
              {sections.map((section) => {
                const active = section.index === activeIndex

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onSelect(section)}
                    className={[
                      'group flex w-full min-w-0 gap-4',
                      'border-l py-3 pl-4 text-left',
                      'transition-colors',
                      active
                        ? 'border-odl'
                        : 'border-zinc-800 hover:border-zinc-600',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'mt-1 shrink-0 font-mono text-[9px]',
                        active ? 'text-odl' : 'text-zinc-700',
                      ].join(' ')}
                    >
                      {String(section.index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={[
                        'min-w-0 text-sm leading-6 transition-colors',
                        active
                          ? 'text-odl'
                          : 'text-zinc-500 group-hover:text-zinc-200',
                      ].join(' ')}
                    >
                      {section.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <footer className="shrink-0 border-t border-zinc-800/70 px-6 py-4">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span className="min-w-0">
                <span className="block text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Section navigation
                </span>

                <span className="mt-1 flex gap-2 text-xs text-zinc-700">
                  Arrow keys jump between questions
                  <ChevronUpIcon className="size-3" />
                  <ChevronDownIcon className="size-3" />
                </span>
              </span>

              <input
                type="checkbox"
                checked={keyboardNavigation}
                onChange={(event) =>
                  setKeyboardNavigation(event.target.checked)
                }
                className="accent-odl size-3.5 shrink-0"
              />
            </label>
          </footer>
        </div>
      </aside>
    </div>
  )
}
