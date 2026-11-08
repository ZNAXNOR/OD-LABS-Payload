'use client'

import type { UIMessage } from 'ai'

import { useConversationNavigator } from './Logic'

import { SectionPanel } from '../SectionPanel/Component'

type ConversationNavigatorProps = {
  messages: UIMessage[]
}

export const ConversationNavigator = ({
  messages,
}: ConversationNavigatorProps) => {
  const {
    railRef,
    sections,
    visibleSections,
    activeIndex,
    currentSection,
    hasMoreBefore,
    hasMoreAfter,
    isExpanded,
    setIsExpanded,
    keyboardNavigation,
    setKeyboardNavigation,
    scrollToSection,
  } = useConversationNavigator(messages)

  const hasNavigation = sections.length >= 2

  return (
    <>
      <div
        className={[
          'pointer-events-none absolute inset-y-0 right-0 z-40 hidden sm:block',
          'bottom-16',
          !hasNavigation ? 'invisible' : '',
        ].join(' ')}
        aria-label="Conversation navigation"
        aria-hidden={!hasNavigation}
      >
        <div className="sticky top-1/2 -translate-y-1/2 pr-6 lg:pr-8">
          <div ref={railRef} className="flex items-center gap-3">
            <div className="flex flex-col items-end justify-center">
              {hasMoreBefore && (
                <div className="h-px w-1 bg-zinc-700" aria-hidden="true" />
              )}

              {visibleSections.map((section, index) => {
                const active = section.index === activeIndex

                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-label={`Go to section ${section.index + 1}: ${section.text}`}
                    aria-current={active ? 'location' : undefined}
                    title={section.text}
                    onClick={() => scrollToSection(section)}
                    className={[
                      'group pointer-events-auto relative flex h-7 w-6 shrink-0',
                      'items-center justify-end',
                      'cursor-pointer',
                      'focus-visible:ring-odl/60 focus-visible:ring-2 focus-visible:outline-none',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'block h-1 rounded-full transition-all duration-200',
                        active
                          ? 'bg-odl w-5'
                          : 'w-2 bg-zinc-600 group-hover:w-5 group-hover:bg-zinc-400',
                      ].join(' ')}
                    />
                  </button>
                )
              })}

              {hasMoreAfter && (
                <div className="h-px w-1 bg-zinc-700" aria-hidden="true" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className={[
                'pointer-events-auto cursor-pointer',
                'px-1 py-2',
                'text-xs font-medium tracking-[0.25em]',
                '[writing-mode:vertical-rl]',
                'text-zinc-600 transition-colors',
                'hover:text-zinc-300',
                'focus-visible:text-odl focus-visible:outline-none',
              ].join(' ')}
              aria-label="Expand conversation sections"
            >
              EXPAND
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <SectionPanel
          sections={visibleSections}
          currentSection={currentSection}
          activeIndex={activeIndex}
          keyboardNavigation={keyboardNavigation}
          setKeyboardNavigation={setKeyboardNavigation}
          onClose={() => setIsExpanded(false)}
          onSelect={scrollToSection}
        />
      )}
    </>
  )
}
