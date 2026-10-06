import React, { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'

import type { ProposeProgramBlock as ProposeProgramBlockProps } from '@/payload-types'
import Button from '@/components/Button'
import { ChamferedCard } from '@/components/ChamferedCard'
import { resolveLinkHref } from '@/components/Link'
import { Reveal } from '@/components/Reveal'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'

type Props = ProposeProgramBlockProps & { disableInnerContainer?: boolean }

/** Render body text, turning every occurrence of `email` into a gold mailto link. */
function linkifyEmail(text: string, email: string) {
  const parts = text.split(email)
  if (parts.length === 1) return text
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <a
          href={`mailto:${email}`}
          className="font-medium break-words text-gold underline decoration-gold/40 underline-offset-4 transition hover:decoration-gold"
        >
          {email}
        </a>
      ) : null}
    </Fragment>
  ))
}

const PRIMARY_CLS =
  'group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-sans text-sm font-semibold tracking-wide text-navy-900 transition hover:bg-gold/90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-700 focus-visible:outline-none'

const OUTLINE_CLS =
  'inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ice/20 bg-ice/5 px-6 py-4 font-sans text-sm font-semibold tracking-wide text-ice backdrop-blur-sm transition hover:border-ice/40 hover:bg-ice/10 focus-visible:ring-2 focus-visible:ring-ice/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-700 focus-visible:outline-none'

export const ProposeProgramBlock: React.FC<Props> = async ({
  anchor,
  eyebrow,
  heading,
  body,
  email: emailFromBlock,
  links,
}) => {
  const settings = await getSiteSettings(0).catch(() => null)
  const email = emailFromBlock?.trim() || settings?.stemEmail?.trim() || DEFAULTS.stemEmail
  const items = (links ?? []).filter((l) => l?.link?.label)
  const fallbackMailto = `mailto:${email}?subject=STEM%20Grant%20Application`

  return (
    <section id={anchor || 'apply'} className="relative scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal>
          <ChamferedCard className="border border-navy-900/10 bg-navy-700 px-8 py-16 sm:px-12 sm:py-20 lg:px-16 dark:border-ice/10 [--chamfer-fill:var(--color-navy-700)]">
            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                {eyebrow ? (
                  <p className="font-sans text-xs font-semibold tracking-[0.22em] text-gold uppercase sm:text-sm">
                    {eyebrow}
                  </p>
                ) : null}
                <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-ice sm:text-5xl">
                  {heading}
                </h2>
                {body ? (
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-ice/80 sm:text-lg">
                    {linkifyEmail(body, email)}
                  </p>
                ) : null}
              </div>

              {items.length > 0 ? (
                <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:flex-col lg:items-stretch">
                  {items.map(({ link, id }, i) => {
                    const resolved = resolveLinkHref(link)
                    const href = resolved && !/^mailto:$/i.test(resolved) ? resolved : fallbackMailto
                    const primary = i === 0
                    return (
                      <Button
                        key={id ?? i}
                        href={href}
                        newTab={Boolean(link.newTab)}
                        className={primary ? PRIMARY_CLS : OUTLINE_CLS}
                      >
                        {link.label}
                        {primary ? (
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        ) : null}
                      </Button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </ChamferedCard>
        </Reveal>
      </div>
    </section>
  )
}
