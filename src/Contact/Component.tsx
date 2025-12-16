import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { Divider } from '@/components/Divider'
import { SocialIcon } from '@/components/SocialIcon'

import type { Contact } from '@/payload-types'

export async function getContactData(): Promise<Contact> {
  const contactData = (await getCachedGlobal('contact', 1)()) as Contact
  return contactData
}

interface ContactInfoProps {
  showAddress?: boolean
  showEmail?: boolean
  showPhone?: boolean
  showBusinessHours?: boolean
  className?: string
}

export async function ContactInfo({
  showAddress = true,
  showEmail = true,
  showPhone = true,
  showBusinessHours = false,
  className = '',
}: ContactInfoProps) {
  const contact = await getContactData()

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {showAddress && contact?.offices && contact.offices.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4 text-neutral-950 dark:text-white">Our Offices</h3>
          <ul className="space-y-6">
            {contact.offices.map((office: any, index: number) => (
              <li key={index}>
                <address className="not-italic text-neutral-600 dark:text-neutral-400">
                  <strong className="block text-neutral-950 dark:text-white">{office.label}</strong>
                  {office.street && <div>{office.street}</div>}
                  {(office.city || office.state || office.postalCode) && (
                    <div>
                      {office.city}
                      {office.state && `, ${office.state}`} {office.postalCode}
                    </div>
                  )}
                  {office.country && <div>{office.country}</div>}
                  {office.email && (
                    <a
                      href={`mailto:${office.email}`}
                      className="block mt-1 hover:text-od-brand-primary transition-colors"
                    >
                      {office.email}
                    </a>
                  )}
                  {office.phone && (
                    <a
                      href={`tel:${office.phone}`}
                      className="block mt-1 hover:text-od-brand-primary transition-colors"
                    >
                      {office.phone}
                    </a>
                  )}
                </address>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showEmail && contact?.email && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-2 text-neutral-950 dark:text-white">General Email</h3>
          <a
            href={`mailto:${contact.email}`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-od-brand-primary transition-colors"
          >
            {contact.email}
          </a>
        </div>
      )}

      {showPhone && contact?.phone && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-2 text-neutral-950 dark:text-white">General Phone</h3>
          <a
            href={`tel:${contact.phone}`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-od-brand-primary transition-colors"
          >
            {contact.phone}
          </a>
        </div>
      )}

      {showBusinessHours && contact?.workingHours && contact.workingHours.length > 0 && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-4 text-neutral-950 dark:text-white">Working Hours</h3>
          <ul className="space-y-2">
            {contact.workingHours.map((hours: any, index: number) => (
              <li
                key={index}
                className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400"
              >
                <span className="capitalize">{hours.day}</span>
                <span>
                  {hours.openTime ? (
                    <>
                      {new Date(hours.openTime).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(hours.closeTime).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </>
                  ) : (
                    'Closed'
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface SocialLinksProps {
  className?: string
  iconSize?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

export async function SocialLinks({
  className = '',
  iconSize = 'md',
  showLabels = false,
}: SocialLinksProps) {
  const contact = await getContactData()

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  // Get links from socialLinks array
  const links = contact?.socialLinks || []

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {links.map((link: any, index: number) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-neutral-950 dark:text-white hover:text-od-brand-primary transition-colors"
          aria-label={link.platform}
        >
          <div className={`${sizeClasses[iconSize]} transition-transform group-hover:scale-110`}>
            <SocialIcon platform={link.platform} />
          </div>
          {showLabels && <span className="font-medium capitalize">{link.platform}</span>}
        </a>
      ))}
    </div>
  )
}

interface ContactPageLinkProps {
  className?: string
  appearance?: 'inline' | 'default' | 'outline'
  children?: React.ReactNode
  label?: string
}

export async function ContactPageLink({
  className = '',
  appearance = 'inline',
  children,
  label = 'Contact Us',
}: ContactPageLinkProps) {
  const contact = await getContactData()

  if (!contact?.contactPageLink) return null

  // Dynamically import CMSLink to avoid circular dependencies
  const { CMSLink } = await import('@/components/Link')

  return (
    <CMSLink
      className={className}
      appearance={appearance}
      {...contact.contactPageLink}
      label={label}
    >
      {children}
    </CMSLink>
  )
}
