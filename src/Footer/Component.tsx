import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer, Contact } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { SocialIcon } from '@/components/SocialIcon'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

const GridCorner = () => (
  <>
    <svg
      viewBox="0 0 15 15"
      aria-hidden="true"
      className="absolute size-[15px] fill-black/10 dark:fill-white/10 -top-2 -right-2"
    >
      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
    </svg>
  </>
)

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer
  const contactData = (await getCachedGlobal('contact', 1)()) as Contact

  const ctaHeading = footerData?.ctaHeading || 'Get started'
  const ctaTitle = footerData?.ctaTitle || 'Ready to dive in? Start your free trial today.'
  const ctaDescription =
    footerData?.ctaDescription ||
    "Get the cheat codes for selling and unlock your team's revenue potential."
  const ctaButton = footerData?.ctaButton
  const linkColumns = footerData?.linkColumns || []
  const copyrightText = footerData?.copyrightText || `© ${new Date().getFullYear()} Radiant Inc.`

  // Get social links from Contact global
  const socialLinks: Array<{ platform: string; url: string }> = []
  if (contactData?.facebook) socialLinks.push({ platform: 'facebook', url: contactData.facebook })
  if (contactData?.instagram)
    socialLinks.push({ platform: 'instagram', url: contactData.instagram })
  if (contactData?.twitter) socialLinks.push({ platform: 'twitter', url: contactData.twitter })
  if (contactData?.linkedin) socialLinks.push({ platform: 'linkedin', url: contactData.linkedin })
  if (contactData?.youtube) socialLinks.push({ platform: 'youtube', url: contactData.youtube })
  if (contactData?.github) socialLinks.push({ platform: 'github', url: contactData.github })
  if (contactData?.tiktok) socialLinks.push({ platform: 'tiktok', url: contactData.tiktok })

  return (
    <div className="relative bg-gradient-to-r from-[#FFDAB9] to-[hsl(var(--ring))]">
      <footer className="bg-white/95 dark:bg-black/95 backdrop-blur-sm relative overflow-hidden">
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-7xl">
            {/* CTA Section */}
            <div className="relative pt-20 pb-16 text-center sm:py-24">
              <hgroup>
                <h2 className="font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                  {ctaHeading}
                </h2>
                <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 dark:text-white sm:text-5xl">
                  {ctaTitle}
                </p>
              </hgroup>
              <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500 dark:text-gray-400">
                {ctaDescription}
              </p>
              {ctaButton?.link && (
                <div className="mt-6">
                  <CMSLink
                    {...ctaButton.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)] rounded-full border border-transparent bg-gray-950 dark:bg-white shadow-md text-base font-medium whitespace-nowrap text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className="pb-16">
              <div className="group/row relative isolate pt-[calc(theme(spacing.2)+1px)] last:pb-[calc(theme(spacing.2)+1px)]">
                {/* Decorative borders */}
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
                >
                  <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/5" />
                  <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/5" />
                  <div className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 dark:border-white/5 group-last/row:block" />
                  <div className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 dark:border-white/5 group-last/row:block" />
                </div>

                <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                  {/* Logo */}
                  <div className="col-span-2 flex">
                    <div className="pt-6 lg:pb-6 group/item relative">
                      <GridCorner />
                      <svg
                        viewBox="0 0 15 15"
                        aria-hidden="true"
                        className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -left-2"
                      >
                        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                      </svg>
                      <svg
                        viewBox="0 0 15 15"
                        aria-hidden="true"
                        className="hidden group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -right-2"
                      >
                        <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                      </svg>
                      <Link href="/">
                        <Logo />
                      </Link>
                    </div>
                  </div>

                  {/* Link Columns */}
                  <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid lg:pt-6">
                    {linkColumns.map((column, index) => (
                      <div key={index}>
                        <h3 className="text-sm/6 font-medium text-gray-950/50 dark:text-white/50">
                          {column.columnHeading}
                        </h3>
                        <ul className="mt-6 space-y-4 text-sm/6">
                          {column.links?.map((linkItem, linkIndex) => (
                            <li key={linkIndex}>
                              <CMSLink
                                {...linkItem.link}
                                className="font-medium text-gray-950 dark:text-white hover:text-gray-950/75 dark:hover:text-white/75 transition-colors"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 group/row relative isolate pt-[calc(theme(spacing.2)+1px)] last:pb-[calc(theme(spacing.2)+1px)]">
                {/* Decorative borders */}
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
                >
                  <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/5" />
                  <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/5" />
                  <div className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 dark:border-white/5 group-last/row:block" />
                  <div className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 dark:border-white/5 group-last/row:block" />
                </div>

                {/* Copyright */}
                <div>
                  <div className="py-3 group/item relative">
                    <svg
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="hidden group-first/item:block absolute size-[15px] fill-black/10 dark:fill-white/10 -top-2 -left-2"
                    >
                      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                    </svg>
                    <GridCorner />
                    <svg
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -left-2"
                    >
                      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                    </svg>
                    <svg
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="hidden group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -right-2"
                    >
                      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                    </svg>
                    <div className="text-sm/6 text-gray-950 dark:text-white">{copyrightText}</div>
                  </div>
                </div>

                {/* Theme Selector and Social Links */}
                <div className="flex items-center gap-6">
                  <ThemeSelector />
                  {socialLinks.length > 0 && (
                    <div className="flex">
                      <div className="flex items-center gap-8 py-3 group/item relative">
                        <svg
                          viewBox="0 0 15 15"
                          aria-hidden="true"
                          className="hidden group-first/item:block absolute size-[15px] fill-black/10 dark:fill-white/10 -top-2 -left-2"
                        >
                          <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                        </svg>
                        <GridCorner />
                        <svg
                          viewBox="0 0 15 15"
                          aria-hidden="true"
                          className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -left-2"
                        >
                          <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                        </svg>
                        <svg
                          viewBox="0 0 15 15"
                          aria-hidden="true"
                          className="hidden group-last/row:block absolute size-[15px] fill-black/10 dark:fill-white/10 -bottom-2 -right-2"
                        >
                          <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                        </svg>
                        {socialLinks.map((social, index) => (
                          <a
                            key={index}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit us on ${social.platform}`}
                            className="text-gray-950 dark:text-white hover:text-gray-950/75 dark:hover:text-white/75 transition-colors"
                            href={social.url}
                          >
                            <SocialIcon platform={social.platform} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
