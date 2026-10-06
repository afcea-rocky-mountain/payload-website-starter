import { getPayload } from 'payload'
import config from '@payload-config'

import { syncLumaEvents } from '@/luma/sync'

// CLI entry: `pnpm luma:sync`
const payload = await getPayload({ config })
const result = await syncLumaEvents(payload, { revalidate: false })
console.log(JSON.stringify(result, null, 2))
process.exit(result.errors.length ? 1 : 0)
