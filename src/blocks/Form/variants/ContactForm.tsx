'use client'

import React from 'react'
import {
  MessageSquare,
  Clock,
  CalendarCheck,
  MapPin,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { FormRenderer } from '../components/FormRenderer'
import type { FormVariantProps } from './types'

const defaultIconMap: Record<string, LucideIcon> = {
  record_voice_over: MessageSquare,
  schedule: Clock,
  event_available: CalendarCheck,
  location_on: MapPin,
  mail: Mail,
}

type Props = FormVariantProps & {
  trustPanel?: {
    heading?: string
    items?: {
      icon?: string
      title?: string
      description?: string
    }[]
    email?: string
  }
}

export function ContactForm({ trustPanel, ...formProps }: Props) {
  const IconComponent = (iconName?: string) => {
    if (!iconName) return null
    const Icon = defaultIconMap[iconName]
    if (Icon) return <Icon className="text-primary w-5 h-5 shrink-0 mt-0.5" />
    return null
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start py-10">
        <section className="lg:col-span-7">
          <FormRenderer {...formProps} />
        </section>

        <aside className="lg:col-span-5">
          {trustPanel && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
              <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-on-surface mb-8 border-b border-surface-container pb-4">
                {trustPanel.heading || 'Direct Contact'}
              </h3>
              <ul className="space-y-8">
                {trustPanel.items?.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    {item.icon && IconComponent(item.icon)}
                    <div>
                      <h4 className="font-bold text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
                {trustPanel.email && (
                  <li className="flex items-start gap-4 mt-8 pt-8 border-t border-surface-container">
                    <Mail className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base mb-1">Email</h4>
                      <a
                        className="text-sm text-primary font-mono font-medium hover:underline"
                        href={`mailto:${trustPanel.email}`}
                      >
                        {trustPanel.email}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
