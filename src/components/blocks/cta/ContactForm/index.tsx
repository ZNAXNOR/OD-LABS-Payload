import React from 'react'

interface ContactFormBlockProps {
  blockType: 'contactForm'
  heading?: string | null
  description?: string | null
  layout?: 'single' | 'split' | null
  form?: any
  showContactInfo?: boolean | null
  contactInfo?: {
    email?: string | null
    phone?: string | null
    address?: string | null
    hours?: string | null
  } | null
}

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
  heading,
  description,
  layout = 'single',
  form,
  showContactInfo,
  contactInfo,
}) => {
  const renderContactInfo = () => {
    if (!showContactInfo || !contactInfo) return null

    return (
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-8 space-y-6">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Get in Touch</h3>

        {contactInfo.email && (
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Email</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-brand-primary hover:underline"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        )}

        {contactInfo.phone && (
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Phone</p>
              <a href={`tel:${contactInfo.phone}`} className="text-brand-primary hover:underline">
                {contactInfo.phone}
              </a>
            </div>
          </div>
        )}

        {contactInfo.address && (
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Address</p>
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                {contactInfo.address}
              </p>
            </div>
          </div>
        )}

        {contactInfo.hours && (
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Hours</p>
              <p className="text-zinc-600 dark:text-zinc-400">{contactInfo.hours}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderForm = () => {
    // Note: This is a placeholder. Actual form rendering would integrate with
    // the Form Builder plugin when it's installed
    if (!form) {
      return (
        <div className="bg-card border border-border rounded-lg p-8">
          <p className="text-zinc-600 dark:text-zinc-400">
            Form integration requires the Form Builder plugin to be installed.
          </p>
        </div>
      )
    }

    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          {(heading || description) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {renderForm()}
            {renderContactInfo()}
          </div>
        </div>
      </div>
    )
  }

  // Single column layout
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
            )}
          </div>
        )}

        {renderForm()}

        {showContactInfo && <div className="mt-8">{renderContactInfo()}</div>}
      </div>
    </div>
  )
}
