'use client'

import { useEffect, useState } from 'react'
import { ServiceStatus } from '@/components/ServiceStatus'
import { ContactActions } from '@/components/Contact/ContactActions'
import { SocialLinks } from '@/components/Contact/SocialLinks'
import { ReportIssue } from '@/components/ReportIssue'
import { formatContactActions, formatSocialLinks } from '@/components/Contact/utils'
import { formatZonedDate, formatZonedTime, useZonedClock } from '@/hooks/useZonedClock'
import type { ContactSocial } from '@/payload-types'

export const MegaMenu_ContextDefault = ({
  contactSocials: initialContactSocials,
  active,
}: {
  contactSocials?: ContactSocial | null
  active: boolean
}) => {
  const { now } = useZonedClock({ enabled: active, intervalMs: 1000 })
  const [contactSocials, setContactSocials] = useState<ContactSocial | null | undefined>(initialContactSocials)

  useEffect(() => {
    if (initialContactSocials !== undefined) {
      setContactSocials(initialContactSocials)
      return
    }
    let cancelled = false
    fetch('/api/globals/contact-socials?depth=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && data) setContactSocials(data) })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [initialContactSocials])

  const contactActions = formatContactActions(contactSocials?.contactActions)
  const socialLinks = formatSocialLinks(contactSocials?.socialLinks)

  return (
    <aside className="flex flex-col justify-between pt-8 lg:pt-0">
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Local time</div>
          <div className="font-mono text-2xl font-semibold tracking-tight text-white tabular-nums sm:text-3xl" aria-live="off">
            {now ? formatZonedTime(now, { second: '2-digit' }) : '--:--:-- --'}<span className="hidden text-white sm:inline"> IST</span>
          </div>
          <div className="font-mono text-xs tracking-wide text-zinc-300" aria-live="off">
            {now ? formatZonedDate(now) : 'Loading date...'}
          </div>
          <div className="font-mono text-xs text-zinc-500">Asia / Kolkata (UTC +05:30)</div>
        </section>

        {(contactActions.length > 0 || socialLinks.length > 0) && (
          <div className="space-y-6 border-t border-zinc-600/60 pt-6">
            {contactActions.length > 0 && (
              <section className="space-y-3">
                <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Contacts</div>
                <ContactActions actions={contactActions} />
              </section>
            )}
            {socialLinks.length > 0 && (
              <section className="space-y-3">
                <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Socials</div>
                <SocialLinks links={socialLinks} />
              </section>
            )}
          </div>
        )}
        <div className="space-y-4">
          <ReportIssue variant="link" label="Report a bug" className="text-xs text-zinc-400" />
          <ServiceStatus variant="block" />
        </div>
      </div>
    </aside>
  )
}
