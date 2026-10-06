import React from 'react'

import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getSiteSettings(0),
  ])

  return <HeaderClient data={headerData} siteSettings={siteSettings} />
}
