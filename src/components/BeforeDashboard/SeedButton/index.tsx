'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
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
      setError(null)
      setLoading(true)

      toast.promise(
        (async () => {
          const res = await fetch('/next/seed', { method: 'POST', credentials: 'include' })
          if (res.ok) {
            setSeeded(true)
            setLoading(false)
            return true
          }
          let detail = `HTTP ${res.status}`
          try {
            const body = (await res.json()) as { error?: string }
            if (body?.error) detail = body.error
          } catch {
            // non-JSON error body (e.g. a gateway timeout page)
          }
          throw new Error(detail)
        })().catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err)
          setError(message)
          setLoading(false)
          throw err
        }),
        {
          loading: 'Seeding with data....',
          success: <SuccessMessage />,
          error: (err: unknown) =>
            `Seeding failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      )
    },
    [loading, seeded],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
