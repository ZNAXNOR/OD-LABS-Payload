'use client'
import React, { useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

import type { Footer, SocialMedia } from '@/payload-types'

import { GridContainer } from '@/components/GridContainer'
import { Gutter } from '@/components/Gutter'
import { CMSLink } from '@/components/Link'
import LetsTalk from '@/components/LetsTalk'
import Arrow from '@/graphics/Arrow'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export type FooterClientProps = {
  footer: Footer
  socialMedia: SocialMedia
}

export const FooterClient: React.FC<FooterClientProps> = ({ footer, socialMedia }) => {
  const backToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Background */}
      <Gutter right className="absolute top-0 right-0 bottom-0 left-0 z-10">
        <div className="bg-od-gray h-full" />
      </Gutter>

      {/* Content */}
      <GridContainer className="pt-20 pb-80 relative z-20">
        <div className="grid grid-cols-10 gap-8">
          {/* Left Column - Navigation Links */}
          {Array.isArray(footer?.navItems) && footer.navItems.length > 0 && (
            <ul className="col-span-10 m:col-span-3 list-none m-0 p-0 space-y-2">
              {footer.navItems.map(({ link }, index) => (
                <li key={index}>
                  <CMSLink
                    {...link}
                    className="text-od-antique no-underline transition-colors duration-300 hover:text-od-blue text-base"
                  >
                    {link.label}
                  </CMSLink>
                </li>
              ))}
            </ul>
          )}

          {/* Right Column - Contact Info & Social */}
          <div className="col-span-10 m:col-span-4 m:col-start-7 space-y-12">
            {/* Email */}
            <div>
              <a
                href="mailto:info@customwebsiteseries.com"
                className="text-od-antique no-underline transition-colors duration-300 hover:text-od-blue text-base"
              >
                info@customwebsiteseries.com
              </a>
            </div>

            {/* Address */}
            <div>
              <a
                className="text-od-antique no-underline transition-colors duration-300 hover:text-od-blue text-base block"
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                3213 Main St. SE
                <br />
                New York, NY 66218
              </a>
            </div>

            {/* Phone */}
            <div>
              <a
                className="text-od-antique no-underline transition-colors duration-300 hover:text-od-blue text-base"
                href="tel:123-456-7890"
                target="_blank"
                rel="noopener noreferrer"
              >
                123-456-7890
              </a>
            </div>

            {/* Social Media */}
            {socialMedia?.links && socialMedia.links.length > 0 && (
              <ul className="list-none p-0 m-0 space-y-2">
                {socialMedia.links.map(({ url, label }, index) => (
                  <li key={index}>
                    <a
                      className="text-od-antique no-underline transition-colors duration-300 hover:text-od-blue text-base"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* Copyright & Theme Selector */}
            <div className="flex flex-col gap-4">
              <p className="text-od-antique text-base m-0">
                &copy; {new Date().getFullYear()} Company Name
              </p>
              <div className="[&_button]:text-white [&_button]:border [&_button]:border-white/20 [&_button]:px-3 [&_button]:py-1.5 [&_button]:rounded">
                <ThemeSelector />
              </div>
            </div>
          </div>
        </div>
      </GridContainer>

      {/* Let's Talk CTA - Positioned higher so footer links are above it */}
      <div className="absolute bottom-8 left-0 z-15">
        <LetsTalk className="!w-60 !h-72 m:!w-[28rem] m:!h-80 l:!w-[34rem] l:!h-[27rem]" />
      </div>

      {/* Back to Top Button */}
      <button
        type="button"
        onClick={backToTop}
        className={cn(
          'absolute z-30 right-8 bottom-8 l:right-[2px] xl:right-[10px] xxl:right-[18px]',
          'border-0 bg-transparent shadow-none',
          'transition-opacity duration-300 cursor-pointer p-0',
          'hover:opacity-50',
          'focus:outline-none active:outline-none',
        )}
        aria-label="Back to top"
      >
        <Arrow className="l:top-1 -rotate-90 text-white l:text-black l:dark:text-white" />
      </button>
    </footer>
  )
}
