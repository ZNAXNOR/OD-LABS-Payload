'use client'

import { useEffect, useState } from 'react'
import type { FC } from 'react'

import type { CalBookingBlock as CalBookingBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

type BookingOption = NonNullable<CalBookingBlockProps['options']>[number]

type CalCall = (...args: unknown[]) => void

type CalNamespace = CalCall & {
  q?: unknown[][]
}

type CalFunction = CalCall & {
  loaded?: boolean
  ns?: Record<string, CalNamespace>
  q?: unknown[][]
}

declare global {
  interface Window {
    Cal?: CalFunction
  }
}

function loadCalEmbed() {
  if (window.Cal) return window.Cal

  const queue = (target: { q?: unknown[][] }, args: unknown[]) => {
    target.q = target.q || []
    target.q.push(args)
  }

  const cal = ((...args: unknown[]) => {
    const current = window.Cal!
    if (!current.loaded) {
      current.ns = {}
      current.q = []
      const script = document.createElement('script')
      script.src = 'https://app.cal.com/embed/embed.js'
      script.async = true
      document.head.appendChild(script)
      current.loaded = true
    }

    if (args[0] === 'init') {
      const namespace = args[1]
      if (typeof namespace === 'string') {
        let api = current.ns![namespace]
        if (!api) {
          api = ((...apiArgs: unknown[]) => queue(api!, apiArgs)) as CalNamespace
        }
        api.q = api.q || []
        current.ns![namespace] = api
        queue(api, args)
        queue(current, ['initNamespace', namespace])
      } else {
        queue(current, args)
      }
      return
    }

    queue(current, args)
  }) as CalFunction

  window.Cal = cal
  return cal
}

const getPlainText = (data: unknown): string => {
  if (!data || typeof data !== 'object') return ''
  const node = data as { root?: { children?: Array<Record<string, unknown>> } }

  const walk = (children?: Array<Record<string, unknown>>): string =>
    (children || [])
      .map((child) => {
        if (typeof child.text === 'string') return child.text
        return walk(child.children as Array<Record<string, unknown>> | undefined)
      })
      .join('')

  return walk(node.root?.children)
}

export const CalBookingBlock: FC<CalBookingBlockProps> = ({ options }) => {
  const validOptions = (options || []).filter(
    (option): option is BookingOption =>
      Boolean(option && option.calLink && option.heading && option.description),
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedOption = validOptions[selectedIndex]

  useEffect(() => {
    if (!selectedOption?.calLink) return

    const elementId = `cal-inline-option-${selectedIndex}`
    const namespace = `odLabsBooking${selectedIndex}`
    const cal = loadCalEmbed()

    cal('init', namespace, { origin: 'https://app.cal.com' })

    const namespaceApi = cal.ns?.[namespace]
    if (!namespaceApi) return

    namespaceApi('inline', {
      elementOrSelector: `#${elementId}`,
      calLink: selectedOption.calLink,
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
      },
    })

    namespaceApi('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  }, [selectedIndex, selectedOption?.calLink])

  if (!validOptions.length) return null

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <div
        aria-label="Choose a booking option"
        className="flex flex-col gap-3 sm:flex-row"
        role="group"
      >
        {validOptions.map((option, index) => {
          const isSelected = selectedIndex === index

          return (
            <button
              key={option.id || option.calLink}
              aria-pressed={isSelected}
              className={`flex min-h-24 flex-1 items-center justify-between gap-4 border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl ${
                isSelected
                  ? 'border-odl bg-odl/5'
                  : 'border-zinc-800 hover:border-zinc-600'
              }`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-6 text-zinc-100 [&_p]:m-0">
                  <RichText
                    data={option.heading}
                    enableGutter={false}
                    enableProse={false}
                  />
                </span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500 [&_p]:m-0">
                  <RichText
                    data={option.description}
                    enableGutter={false}
                    enableProse={false}
                  />
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`ml-4 shrink-0 text-lg ${isSelected ? 'text-odl' : 'text-zinc-600'}`}
              >
                {isSelected ? '●' : '○'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 border border-zinc-800">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-medium">{getPlainText(selectedOption.heading)}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Select an available date and time. Times are shown according to your Cal.com booking settings.
          </p>
        </div>
        <div
          key={selectedIndex}
          className="min-h-[680px] w-full"
          id={`cal-inline-option-${selectedIndex}`}
        />
      </div>

      {selectedOption.directLink && (
        <p className="mt-4 text-sm text-zinc-500">
          Prefer a separate booking page?{' '}
          <a
            className="underline underline-offset-4"
            href={selectedOption.directLink}
            rel="noreferrer"
            target="_blank"
          >
            Open Cal.com directly
          </a>
          .
        </p>
      )}
    </section>
  )
}
