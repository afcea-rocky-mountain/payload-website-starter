/**
 * CLI entry: `pnpm seed`
 * Loads the original site content into the connected database.
 */
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'

import { seed } from './index'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)
await seed({ payload, req })
process.exit(0)
