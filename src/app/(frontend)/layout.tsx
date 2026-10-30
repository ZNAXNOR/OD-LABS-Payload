import type { Metadata } from 'next'
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()

  let pagesData
  let legalPagesData

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

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="a6dbdbc7-4e29-4581-8033-e195c7bb3d0b"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
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
            footer={<Footer pagesData={pagesData} legalPagesData={legalPagesData} />}
            leftRail={<LeftRail />}
            pagesData={pagesData}
            legalPagesData={legalPagesData}
          >
            {children}
          </LayoutClient>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
