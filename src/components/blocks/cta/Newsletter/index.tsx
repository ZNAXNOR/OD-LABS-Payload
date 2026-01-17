'use client'

import React, { useState } from 'react'

interface NewsletterBlockProps {
  blockType: 'newsletter'
  heading: string
  description?: string | null
  placeholder?: string | null
  buttonText: string
  style?: 'inline' | 'card' | 'minimal' | null
  showPrivacyNote?: boolean | null
  privacyText?: string | null
  successMessage: string
  provider?: 'custom' | 'mailchimp' | 'convertkit' | null
}

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  heading,
  description,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  style = 'inline',
  showPrivacyNote = true,
  privacyText = 'We respect your privacy. Unsubscribe at any time.',
  successMessage = 'Thanks for subscribing!',
}) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      // TODO: Integrate with actual email service provider
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8"
            role="status"
            aria-live="polite"
          >
            <svg
              className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              // ✅ Added proper alt text for decorative icon
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3
              className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2"
              // ✅ Added heading level context
              role="heading"
              aria-level="3"
            >
              {successMessage}
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Check your inbox for a confirmation email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (style === 'inline') {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 rounded-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                {heading && (
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{heading}</h3>
                )}
                {description && <p className="text-white/90">{description}</p>}
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 max-w-md"
                // ✅ Added form accessibility attributes
                role="form"
                aria-label="Newsletter subscription form"
              >
                <div className="flex gap-2">
                  <label htmlFor="newsletter-email-inline" className="sr-only">
                    Email address for newsletter subscription
                  </label>
                  <input
                    id="newsletter-email-inline"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder || undefined}
                    className="flex-1 px-4 py-3 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    disabled={isSubmitting}
                    // ✅ Added comprehensive ARIA attributes
                    aria-label="Email address"
                    aria-describedby={
                      error
                        ? 'newsletter-error-inline'
                        : showPrivacyNote
                          ? 'newsletter-privacy-inline'
                          : undefined
                    }
                    aria-invalid={error ? 'true' : 'false'}
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    // ✅ Added button accessibility attributes
                    aria-label={
                      isSubmitting
                        ? 'Subscribing to newsletter, please wait'
                        : 'Subscribe to newsletter'
                    }
                    aria-describedby={error ? 'newsletter-error-inline' : undefined}
                  >
                    {isSubmitting ? 'Subscribing...' : buttonText}
                  </button>
                </div>

                {/* ✅ Added proper error announcement for screen readers */}
                {error && (
                  <p
                    id="newsletter-error-inline"
                    className="text-red-200 text-sm mt-2"
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </p>
                )}

                {/* ✅ Added proper privacy note association */}
                {showPrivacyNote && (
                  <p id="newsletter-privacy-inline" className="text-white/70 text-sm mt-2">
                    {privacyText}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (style === 'card') {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
            {heading && (
              <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {heading}
              </h3>
            )}
            {description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">{description}</p>
            )}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder || undefined}
                  className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : buttonText}
                </button>
              </div>
              {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
              {showPrivacyNote && (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4">{privacyText}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Minimal style
  return (
    <div className="container py-12">
      <div className="max-w-xl mx-auto text-center">
        {heading && (
          <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            {heading}
          </h3>
        )}
        {description && <p className="text-zinc-600 dark:text-zinc-400 mb-6">{description}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder || undefined}
              className="flex-1 px-4 py-2 border-b-2 border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:border-brand-primary"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-brand-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : buttonText}
            </button>
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
          {showPrivacyNote && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4">{privacyText}</p>
          )}
        </form>
      </div>
    </div>
  )
}
