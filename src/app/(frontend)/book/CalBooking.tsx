'use client'

import { useEffect, useState } from 'react'

type CalNamespace = {
  (...args: unknown[]): void
  q?: IArguments[]
}

type CalFunction = {
  (...args: unknown[]): void
  loaded?: boolean
  ns?: Record<string, CalNamespace>
  q?: unknown[][]
}

declare global {
  interface Window {
    Cal?: CalFunction
  }
}

const eventTypes = {
  '15min': {
    label: '15-minute introduction',
    duration: '15 minutes',
    calLink: 'od-omkar-dalvi/15min',
    namespace: 'odLabs15min',
  },
  '30min': {
    label: '30-minute consultation',
    duration: '30 minutes',
    calLink: 'od-omkar-dalvi/30min',
    namespace: 'odLabs30min',
  },
} as const

type EventDuration = keyof typeof eventTypes

function initializeCalEmbed(
  namespace: string,
  calLink: string,
  elementId: string,
) {
  const cal = window.Cal

  if (!cal) return

  cal('init', namespace, { origin: 'https://app.cal.com' })

  const namespaceApi = cal.ns?.[namespace]
  if (!namespaceApi) return

  namespaceApi('inline', {
    elementOrSelector: `#${elementId}`,
    calLink,
    config: {
      layout: 'month_view',
      useSlotsViewOnSmallScreen: 'true',
    },
  })

  namespaceApi('ui', {
    hideEventTypeDetails: false,
    layout: 'month_view',
  })
}

export default function CalBooking() {
  const [duration, setDuration] = useState<EventDuration>('30min')

  useEffect(() => {
    const selectedEvent = eventTypes[duration]
    const elementId = `cal-inline-${duration}`

    const setup = () => {
      initializeCalEmbed(
        selectedEvent.namespace,
        selectedEvent.calLink,
        elementId,
      )
    }

    if (window.Cal?.loaded) {
      setup()
      return
    }

    // This is Cal.com's documented embed bootstrap, adapted to load once
    // from a client-side Next.js component.
    const cal = ((...args: unknown[]) => {
      const current = window.Cal as CalFunction
      const enqueue = (target: { q?: unknown[][] }, call: unknown[]) => {
        target.q = target.q || []
        target.q.push(call)
      }

      if (!current.loaded) {
        current.ns = {}
        current.q = current.q || []
        const script = document.createElement('script')
        script.src = 'https://app.cal.com/embed/embed.js'
        script.async = true
        document.head.appendChild(script)
        current.loaded = true
      }

      if (args[0] === 'init') {
        const namespace = args[1]
        if (typeof namespace === 'string') {
          const api = current.ns?.[namespace] || ((...apiArgs: unknown[]) => {
            enqueue(api as { q?: unknown[][] }, apiArgs)
          }) as CalNamespace
          api.q = api.q || []
          if (current.ns) current.ns[namespace] = api
          enqueue(api, args)
          enqueue(current as { q?: unknown[][] }, ['initNamespace', namespace])
        } else {
          enqueue(current as { q?: unknown[][] }, args)
        }
        return
      }

      enqueue(current as { q?: unknown[][] }, args)
    }) as CalFunction

    window.Cal = cal
    setup()
  }, [duration])

  const selectedEvent = eventTypes[duration]

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <div
        aria-label="Choose consultation duration"
        className="flex flex-col gap-3 sm:flex-row"
        role="group"
      >
        {(Object.keys(eventTypes) as EventDuration[]).map((eventDuration) => {
          const event = eventTypes[eventDuration]
          const isSelected = duration === eventDuration

          return (
            <button
              key={eventDuration}
              aria-pressed={isSelected}
              className={`flex min-h-20 flex-1 items-center justify-between border px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl ${
                isSelected
                  ? 'border-odl bg-odl/5'
                  : 'border-zinc-800 hover:border-zinc-600'
              }`}
              onClick={() => setDuration(eventDuration)}
              type="button"
            >
              <span>
                <span className="block text-sm font-medium">{event.label}</span>
                <span className="mt-1 block font-mono text-xs text-zinc-500">
                  {event.duration}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`ml-4 text-lg ${isSelected ? 'text-odl' : 'text-zinc-600'}`}
              >
                {isSelected ? '●' : '○'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 border border-zinc-800">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-medium">{selectedEvent.label}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Select an available date and time. Times are shown according to
            your Cal.com booking settings.
          </p>
        </div>
        <div
          key={duration}
          className="min-h-[680px] w-full"
          id={`cal-inline-${duration}`}
        />
      </div>

      <noscript>
        <p className="mt-4 text-sm text-zinc-500">
          JavaScript is required to book online. You can also book directly:
          {' '}
          <a
            className="underline underline-offset-4"
            href={`https://cal.com/${selectedEvent.calLink}`}
          >
            open the Cal.com booking page
          </a>
          .
        </p>
      </noscript>
    </section>
  )
}
