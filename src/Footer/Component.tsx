import Link from 'next/link'

import { Logo } from '@/components/Logo/Logo'
import { LegalPageLinks } from '@/components/LegalPageLinks'
import { ServiceStatus } from '@/components/ServiceStatus'
import type { LegalPagesData } from '@/getLegalPagesData'
import { ScrollToTop } from './ScrollToTop'
import { FooterNav } from './Nav'
import type { PagesData } from '@/getPagesData'

interface FooterProps {
  pagesData?: PagesData[]
  legalPagesData?: LegalPagesData[]
}

export async function Footer({ pagesData, legalPagesData = [] }: FooterProps) {
  const homePage = pagesData?.find((page) => page.href === '/')

  return (
    <footer className="relative z-20 mt-auto w-full border-t border-zinc-600 bg-black text-white">
      <div className="px-6 py-20 sm:px-8 lg:p-12">
        <div className="grid grid-cols-1 gap-16 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link aria-label="OD LABS" href="/" className="inline-flex">
              <Logo className="h-auto w-64 max-w-none sm:w-80 lg:w-md" />
            </Link>

            {homePage?.description && (
              <p className="mt-8 max-w-lg font-sans text-base text-zinc-400 sm:text-lg">
                {homePage.description}
              </p>
            )}

            <p className="py-6 font-mono text-xs tracking-wider text-zinc-500 uppercase">
              Web · Data · Automation · Engineering
            </p>

            <ServiceStatus
              variant="compact"
              className="hover:border-odl border border-transparent px-3 py-2 transition-all duration-300 ease-in-out hover:bg-zinc-950 hover:text-white"
            />
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-5 lg:border-l lg:border-zinc-600 lg:pl-10">
            <div className="font-mono text-[11px] tracking-widest text-zinc-600 uppercase">
              Pages
            </div>
            <div className="mt-4">
              <FooterNav pagesData={pagesData} />
            </div>
          </div>
        </div>

        {/* Signature Divider */}
        <div className="my-15 flex w-full items-center gap-6">
          <div className="h-px flex-1 bg-zinc-600" />
          <span className="px-2 font-serif text-lg font-normal tracking-wide text-white/90 italic sm:text-xl">
            Omkar Dalvi
          </span>
          <div className="h-px flex-1 bg-zinc-600" />
        </div>

        {/* Copyright, live service status, and utility action */}
        <div className="flex flex-col items-center justify-between gap-4 border-zinc-900 pt-5 font-mono text-xs text-zinc-400 sm:flex-row">
          <div className="flex flex-row gap-6">
            © {new Date().getFullYear()} OD LABS. All rights reserved.{' '}
            {legalPagesData.length > 0 && (
              <LegalPageLinks
                pages={legalPagesData}
                className="max-w-full [&_a:hover]:text-zinc-200"
              />
            )}
          </div>

          <ScrollToTop />
        </div>
      </div>
    </footer>
  )
}
