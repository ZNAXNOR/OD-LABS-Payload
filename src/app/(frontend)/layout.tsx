import React from 'react'
import './styles.css'

import { InitTheme } from '@/providers/Theme/InitTheme'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { AdminBar } from '@/components/admin/AdminBar'
import { LivePreviewListener } from '@/components/admin/LivePreviewListener'
import { PreviewModeIndicator } from '@/components/admin/PreviewModeIndicator'
import { Header } from '@/globals/Header/Component'
import { Providers } from '@/providers'

import { Footer } from '@/globals/Footer/Component'
import { draftMode } from 'next/headers'

import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { isEnabled } = await draftMode()
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </head>
      <body>
        <Providers>
          <LivePreviewListener>
            <PreviewModeIndicator />
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            {children}
            <Footer />
          </LivePreviewListener>
        </Providers>
      </body>
    </html>
  )
}
