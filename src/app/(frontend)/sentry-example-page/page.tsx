'use client'

import * as Sentry from '@sentry/nextjs'
import Head from 'next/head'
import { useEffect, useState } from 'react'

class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'SentryExampleFrontendError'
  }
}

export default function Page() {
  const [hasSentError, setHasSentError] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    Sentry.logger.info('Sentry example page loaded')
    async function checkConnectivity() {
      const result = await Sentry.diagnoseSdkConnectivity()
      setIsConnected(result !== 'sentry-unreachable')
    }
    checkConnectivity()
  }, [])

  return (
    <div className="min-h-screen text-zinc-200">
      <Head>
        <title>sentry-example-page</title>
        <meta name="description" content="Test Sentry for your Next.js app!" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-6 font-sans text-zinc-200">
        <div className="flex-1" />

        <svg
          height="48"
          width="48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Sentry logo"
          className="text-zinc-200"
        >
          <path
            d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z"
            fill="currentColor"
          />
        </svg>

        <h1 className="rounded-md border border-zinc-800 px-[10px] py-1 font-mono text-xl leading-tight text-zinc-200">
          sentry-example-page
        </h1>

        <p className="m-0 max-w-[520px] text-center text-base leading-relaxed text-zinc-400">
          Click the button below, and view the sample error on the Sentry{' '}
          <a
            target="_blank"
            rel="noopener"
            href="https://od-labs.sentry.io/issues/?project=4512344291410000"
            className="cursor-pointer text-zinc-400 underline decoration-odl underline-offset-[3px] transition-[color,text-decoration-color] duration-150 ease-linear hover:text-zinc-200 hover:decoration-odl"
          >
            Issues Page
          </a>
          . For more details about setting up Sentry,{' '}
          <a
            target="_blank"
            rel="noopener"
            href="https://docs.sentry.io/platforms/javascript/guides/nextjs/"
            className="cursor-pointer text-[#e4e4e7] underline decoration-[#e94235] underline-offset-[3px] transition-[color,text-decoration-color] duration-150 ease-linear hover:text-[#f4f4f5] hover:decoration-[#ef4444]"
          >
            read our docs
          </a>
          .
        </p>

        <button
          type="button"
          onClick={async () => {
            Sentry.logger.info(
              'User clicked the button, throwing a sample error',
            )
            await Sentry.startSpan(
              {
                name: 'Example Frontend/Backend Span',
                op: 'test',
              },
              async () => {
                const res = await fetch('/api/sentry-example-api')
                if (!res.ok) {
                  setHasSentError(true)
                }
              },
            )
            throw new SentryExampleFrontendError(
              'This error is raised on the frontend of the example page.',
            )
          }}
          disabled={!isConnected}
          className="mt-2 cursor-pointer rounded-lg border-0 bg-orange-700 p-0 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="bg-odl inline-block -translate-y-1 rounded-[inherit] border border-orange-700 px-5 py-3 text-lg leading-none font-semibold text-white transition-[transform,background-color] duration-150 ease-linear [button:disabled_&]:translate-y-0 [button:disabled_&]:border-0 [button:not(:disabled):active_&]:translate-y-0 [button:not(:disabled):hover_&]:-translate-y-1.5 [button:not(:disabled):hover_&]:bg-[#ef4444]">
            Throw Sample Error
          </span>
        </button>

        {hasSentError ? (
          <p className="m-0 rounded-lg border border-green-500/30 bg-green-500/12 px-[18px] py-3 text-base leading-snug text-green-300">
            Error sent to Sentry.
          </p>
        ) : !isConnected ? (
          <div className="m-0 max-w-[520px] rounded-lg border border-red-500/30 bg-red-500/12 px-[18px] py-[14px] text-center text-[15px] leading-relaxed text-[#f87171]">
            <p className="m-0 text-[15px] text-[#f87171]">
              It looks like network requests to Sentry are being blocked, which
              will prevent errors from being captured. Try disabling your
              ad-blocker to complete the test.
            </p>
          </div>
        ) : (
          <div className="h-[46px]" />
        )}

        <div className="flex-1" />
      </main>
    </div>
  )
}
