import type { Metadata } from 'next'

import CalBooking from './CalBooking'

export const metadata: Metadata = {
  title: 'Book a Consultation | OD LABS',
  description:
    'Schedule a 15-minute introduction or a 30-minute consultation with OD LABS.',
}

export default function BookPage() {
  return (
    <article className="pt-16 pb-24">
      <section className="px-6 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-odl">
          Booking
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
          Let&apos;s talk about your project.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
          Choose a time that works for you. You can book a short introduction
          or a longer consultation below.
        </p>
      </section>

      <div className="mt-10 border-y border-zinc-800">
        <CalBooking />
      </div>
    </article>
  )
}
