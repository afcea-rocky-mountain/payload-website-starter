import { getCachedGlobal } from './getGlobals'
import type { SiteSetting } from '@/payload-types'

export { DEFAULTS } from './siteDefaults'

/** Site settings global, cached per request via unstable_cache (tag: global_site-settings). */
export const getSiteSettings = async (depth = 1): Promise<SiteSetting> =>
  getCachedGlobal('site-settings', depth)()
