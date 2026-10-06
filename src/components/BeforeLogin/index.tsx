import React from 'react'

import './index.scss'

const baseClass = 'before-login'

/** Short, chapter-specific intro above the admin login form. */
const BeforeLogin: React.FC = () => (
  <div className={baseClass}>
    <p className={`${baseClass}__title`}>Chapter website admin</p>
    <p className={`${baseClass}__hint`}>
      Sign in to manage pages, events, board members and STEM programs for the AFCEA Rocky
      Mountain Chapter. Need access? Ask the chapter webmaster.
    </p>
  </div>
)

export default BeforeLogin
