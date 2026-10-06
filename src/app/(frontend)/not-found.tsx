import React from 'react'

import Button from '@/components/Button'

export default function NotFound() {
  return (
    <main id="main" className="bg-ice text-navy-900 dark:bg-navy-900 dark:text-ice">
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-display text-sm font-semibold tracking-widest text-gold uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-ice">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-base text-navy-700/80 dark:text-ice/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Button href="/" variant="solidDark" className="mt-8">
          Return home
        </Button>
      </section>
    </main>
  )
}
