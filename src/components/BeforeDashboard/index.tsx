import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import { LumaSyncButton } from './LumaSyncButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>AFCEA Rocky Mountain — site dashboard</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <LumaSyncButton />
          {' — pulls the latest events from the chapter’s Luma calendar. Runs automatically every morning; use this after publishing a new Luma event to see it on the site right away.'}
        </li>
        <li>
          <strong>Events</strong>: open an event to add a card blurb, tag it, mark it featured, or attach a Zeffy ticket form. Those fields are never overwritten by the Luma sync.
        </li>
        <li>
          <strong>Pages</strong> are built from blocks. Use the eye icon on a page to live-preview changes before publishing.
        </li>
        <li>
          <SeedButton />
          {' — first-time setup only. Loads the original site content (pages, board, STEM programs). It will replace existing pages, board members and STEM programs.'}
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
