'use client'

import React, { useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'
import { Sprout } from 'lucide-react'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div className="seed-success-msg">
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      const seedPromise = fetch('/next/seed', { method: 'POST', credentials: 'include' })
        .then((res) => {
          if (res.ok) {
            setSeeded(true)
            return true
          } else {
            throw new Error('An error occurred while seeding.')
          }
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : String(err)
          setError(message)
          throw err
        })
        .finally(() => {
          setLoading(false)
        })

      toast.promise(seedPromise, {
        loading: 'Seeding with data....',
        success: <SuccessMessage />,
        error: (err) => err?.message || 'An error occurred while seeding.',
      })
    },
    [loading, seeded, error],
  )

  let statusText = ''
  if (loading) statusText = ' (seeding...)'
  if (seeded) statusText = ' (done!)'
  if (error) statusText = ` (error: ${error})`

  return (
    <span className="seed-button-wrapper">
      <button className="seedButton" onClick={handleClick} disabled={loading || seeded}>
        <Sprout width={16} height={16} />
        Seed Database
      </button>
      {statusText && <span className="seed-status">{statusText}</span>}
    </span>
  )
}
