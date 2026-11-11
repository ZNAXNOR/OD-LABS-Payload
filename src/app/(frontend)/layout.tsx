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

  let pagesData
  let legalPagesData
  let postsData
  let contactSocials

  try {
    pagesData = await getPagesData()
  } catch (error) {
    console.error('Failed to fetch pages data:', error)
  }

  try {
    legalPagesData = await getLegalPagesData()
  } catch (error) {
    console.error('Failed to fetch published legal pages:', error)
  }

  try {
    postsData = await getPostsData()
  } catch (error) {
    console.error('Failed to fetch published posts:', error)
  }

  try {
    contactSocials = await getContactSocials()
  } catch (error) {
    console.error('Failed to fetch contact socials:', error)
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
