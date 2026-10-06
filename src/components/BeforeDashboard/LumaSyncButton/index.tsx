'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

import '../SeedButton/index.scss'

export const LumaSyncButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (loading) return
      setLoading(true)
      setSummary(null)
      try {
        const res = await fetch('/next/luma-sync', { method: 'POST', credentials: 'include' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as {
          created?: number
          updated?: number
          skipped?: number
          unpublishedMissing?: number
          errors?: string[]
          reason?: string
        }
        if (data.reason) {
          toast.info(data.reason)
          setSummary(data.reason)
        } else {
          const msg = `${data.created ?? 0} new · ${data.updated ?? 0} updated · ${data.skipped ?? 0} unchanged${
            data.unpublishedMissing ? ` · ${data.unpublishedMissing} unpublished` : ''
          }${data.errors?.length ? ` · ${data.errors.length} errors` : ''}`
          toast.success(`Luma sync complete: ${msg}`)
          setSummary(msg)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        toast.error(`Luma sync failed: ${msg}`)
        setSummary(`error: ${msg}`)
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  return (
    <Fragment>
      <Button
        buttonStyle="pill"
        className="dashboard-action"
        disabled={loading}
        onClick={handleClick}
        size="small"
      >
        {loading ? 'Syncing Luma…' : 'Sync Luma events now'}
      </Button>
      {summary ? ` (${summary})` : ''}
    </Fragment>
  )
}
