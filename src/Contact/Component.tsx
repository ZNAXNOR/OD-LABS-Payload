import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

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
    <div className={className}>
      {showAddress && contact?.address && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Address</h3>
          <address className="not-italic">
            {contact.address.street && <div>{contact.address.street}</div>}
            {(contact.address.city || contact.address.state || contact.address.postalCode) && (
              <div>
                {contact.address.city}
                {contact.address.state && `, ${contact.address.state}`} {contact.address.postalCode}
              </div>
            )}
            {contact.address.country && <div>{contact.address.country}</div>}
          </address>
        </div>
      )}

      {showEmail && contact?.email && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Email</h3>
          <a href={`mailto:${contact.email}`} className="hover:underline">
            {contact.email}
          </a>
        </div>
      )}

      {showPhone && contact?.phone && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Phone</h3>
          <a href={`tel:${contact.phone}`} className="hover:underline">
            {contact.phone}
          </a>
        </div>
      )}

      {showBusinessHours && contact?.businessHours && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Business Hours</h3>
          <p className="whitespace-pre-line">{contact.businessHours}</p>
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

  const socialPlatforms = [
    { name: 'Facebook', url: contact?.facebook, icon: '📘' },
    { name: 'Instagram', url: contact?.instagram, icon: '📷' },
    { name: 'Twitter', url: contact?.twitter, icon: '🐦' },
    { name: 'LinkedIn', url: contact?.linkedin, icon: '💼' },
    { name: 'YouTube', url: contact?.youtube, icon: '📺' },
    { name: 'GitHub', url: contact?.github, icon: '💻' },
    { name: 'TikTok', url: contact?.tiktok, icon: '🎵' },
  ]

  const customSocials = contact?.customSocial || []

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {socialPlatforms.map(
        (platform) =>
          platform.url && (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center gap-2"
              aria-label={platform.name}
            >
              <span className={sizeClasses[iconSize]}>{platform.icon}</span>
              {showLabels && <span>{platform.name}</span>}
            </a>
          ),
      )}

      {customSocials.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity flex items-center gap-2"
          aria-label={social.platform}
        >
          <span className={sizeClasses[iconSize]}>🔗</span>
          {showLabels && <span>{social.platform}</span>}
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
