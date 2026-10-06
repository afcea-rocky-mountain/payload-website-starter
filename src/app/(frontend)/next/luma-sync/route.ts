import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

import { syncLumaEvents } from '@/luma/sync'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

/**
 * Trigger a Luma → Events sync.
 *
 * Allowed callers:
 *  - a logged-in admin user (the "Sync Luma now" button on the dashboard), or
 *  - the Vercel cron (sends `Authorization: Bearer <CRON_SECRET>`).
 */
async function run(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  let authorized = false
  const auth = requestHeaders.get('authorization')
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) authorized = true
  if (!authorized) {
    const { user } = await payload.auth({ headers: requestHeaders })
    authorized = Boolean(user)
  }
  if (!authorized) return new Response('Action forbidden.', { status: 403 })

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (settings?.luma?.syncEnabled === false && auth) {
    return Response.json({ skipped: true, reason: 'Luma sync disabled in Site settings' })
  }

  try {
    const result = await syncLumaEvents(payload)
    return Response.json({ success: result.errors.length === 0, ...result })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error syncing Luma events' })
    return new Response('Error syncing Luma events.', { status: 500 })
  }
}

export async function POST(): Promise<Response> {
  return run()
}

// Vercel cron uses GET.
export async function GET(): Promise<Response> {
  return run()
}
