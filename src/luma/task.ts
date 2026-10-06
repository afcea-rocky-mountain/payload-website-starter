import type { TaskConfig } from 'payload'

import { syncLumaEvents } from './sync'

/**
 * Jobs-queue task so the sync can be queued from the admin, run by
 * `payload jobs:run`, or triggered by the Vercel cron that hits
 * /api/payload-jobs/run.
 */
export const syncLumaEventsTask: TaskConfig<'syncLumaEvents'> = {
  slug: 'syncLumaEvents',
  label: 'Sync events from Luma',
  retries: 2,
  inputSchema: [{ name: 'includePast', type: 'checkbox' }],
  outputSchema: [
    { name: 'created', type: 'number' },
    { name: 'updated', type: 'number' },
    { name: 'skipped', type: 'number' },
    { name: 'unpublishedMissing', type: 'number' },
    { name: 'errors', type: 'number' },
  ],
  handler: async ({ input, req }) => {
    const result = await syncLumaEvents(req.payload, {
      includePast: input?.includePast ?? undefined,
    })
    return {
      output: {
        created: result.created,
        updated: result.updated,
        skipped: result.skipped,
        unpublishedMissing: result.unpublishedMissing,
        errors: result.errors.length,
      },
    }
  },
}
