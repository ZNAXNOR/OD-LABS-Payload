import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LeftRail } from '@/Rail/Left'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { LayoutClient } from './LayoutClient'
import { getPagesData } from '@/getPagesData'
import { getLegalPagesData } from '@/getLegalPagesData'
import { getPostsData } from '@/getPostsData'
import { getContactSocials } from '@/utilities/getContactSocials'
import { resolveTwitterHandle } from '@/utilities/resolveTwitterHandle'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()

  // These datasets are independent; fetch them concurrently instead of
  // serially extending the critical path for every page request.
  const [pagesResult, legalPagesResult, postsResult, socialsResult] =
    await Promise.allSettled([
      getPagesData(),
      getLegalPagesData(),
      getPostsData(),
      getContactSocials(),
    ])

  const pagesData =
    pagesResult.status === 'fulfilled' ? pagesResult.value : undefined
  const legalPagesData =
    legalPagesResult.status === 'fulfilled' ? legalPagesResult.value : undefined
  const postsData =
    postsResult.status === 'fulfilled' ? postsResult.value : undefined
  const contactSocials =
    socialsResult.status === 'fulfilled' ? socialsResult.value : undefined

  if (pagesResult.status === 'rejected') {
    console.error('Failed to fetch pages data:', pagesResult.reason)
  }
  if (legalPagesResult.status === 'rejected') {
    console.error('Failed to fetch published legal pages:', legalPagesResult.reason)
  }
  if (postsResult.status === 'rejected') {
    console.error('Failed to fetch published posts:', postsResult.reason)
  }
  if (socialsResult.status === 'rejected') {
    console.error('Failed to fetch contact socials:', socialsResult.reason)
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <LayoutClient
            header={<Header />}
            footer={
              <Footer
                pagesData={pagesData}
                legalPagesData={legalPagesData}
                contactSocials={contactSocials}
              />
            }
            leftRail={<LeftRail />}
            pagesData={pagesData}
            legalPagesData={legalPagesData}
            postsData={postsData}
            contactSocials={contactSocials}
          >
            {children}
          </LayoutClient>
        </Providers>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let contactSocials = null
  try {
    contactSocials = await getContactSocials()
  } catch {
    // Contact socials unavailable during build or error fallback
  }

  const twitterCreator = resolveTwitterHandle(contactSocials)

  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: twitterCreator,
    },
  }
}
