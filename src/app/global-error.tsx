'use client'

import * as Sentry from '@sentry/nextjs'
import React, { useEffect } from 'react'
import { getGitHubIssueUrl } from '@/utilities/getGitHubIssueUrl'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDev = process.env.NODE_ENV !== 'production'

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error)
    } else {
      console.error('[OD LABS Dev] Global Root Error caught:', error)
    }
  }, [error])

  return (
    <html lang="en" style={{ backgroundColor: '#09090b', color: '#fafafa', colorScheme: 'dark' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>500: Critical System Failure | OD LABS</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: '24px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          color: '#fafafa',
          fontFamily:
            'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            border: '1px solid #27272a',
            backgroundColor: 'rgba(9, 9, 11, 0.95)',
            padding: '36px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* Corner tick brackets */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              width: '12px',
              height: '12px',
              borderTop: '1px solid #71717a',
              borderLeft: '1px solid #71717a',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '12px',
              height: '12px',
              borderTop: '1px solid #71717a',
              borderRight: '1px solid #71717a',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              width: '12px',
              height: '12px',
              borderBottom: '1px solid #71717a',
              borderLeft: '1px solid #71717a',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '12px',
              height: '12px',
              borderBottom: '1px solid #71717a',
              borderRight: '1px solid #71717a',
            }}
          />

          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#e94235',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#e94235',
                display: 'inline-block',
              }}
            />
            <span>00 — CRITICAL ROOT LAYOUT EXCEPTION // HARD FAULT</span>
          </div>

          {/* Display Code */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '56px',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
              userSelect: 'none',
            }}
          >
            <span style={{ color: '#e94235', fontWeight: 300, marginRight: '4px' }}>[</span>
            500
            <span style={{ color: '#e94235', fontWeight: 300, marginLeft: '4px' }}>]</span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: '#f4f4f5',
              margin: '0 0 10px 0',
            }}
          >
            Application Core Failure
          </h1>

          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#a1a1aa',
              margin: '0 0 28px 0',
            }}
          >
            A catastrophic exception occurred at the root layout boundary. The standard shell could
            not be rendered.
          </p>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                backgroundColor: '#e94235',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Reset Application
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#d4d4d8',
                border: '1px solid #3f3f46',
                padding: '12px 24px',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Return Home
            </button>

            <a
              href={getGitHubIssueUrl({
                errorMessage: error?.message,
                errorName: error?.name,
                digest: error?.digest,
                title: `[Bug]: Critical Root Layout Failure${error?.digest ? ` (${error.digest})` : ''}`,
                labels: ['bug', 'critical'],
              })}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: 'transparent',
                color: '#d4d4d8',
                border: '1px solid #3f3f46',
                padding: '12px 24px',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span>Report Issue</span>
              <span style={{ color: '#71717a' }}>↗</span>
            </a>

            <a
              href="https://status.odtechlab.com"
              target="_blank"
              rel="noreferrer"
              style={{
                marginLeft: 'auto',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#71717a',
                textDecoration: 'none',
              }}
            >
              System Status ↗
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
