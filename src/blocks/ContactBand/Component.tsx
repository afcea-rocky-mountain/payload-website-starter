import React from 'react'
import { Mail, MapPin } from 'lucide-react'

import type { ContactBandBlock as ContactBandBlockProps } from '@/payload-types'
import { DEFAULTS, getSiteSettings } from '@/utilities/getSiteSettings'

type Props = ContactBandBlockProps & { disableInnerContainer?: boolean }

const LABEL_CLS =
  'font-sans text-[0.68rem] font-semibold tracking-[0.18em] text-chathams-700 uppercase dark:text-gold'
const ICON_CLS =
  'flex h-10 w-10 flex-none items-center justify-center bg-chathams-600/10 text-chathams-600 ring-1 ring-chathams-600/20 dark:bg-gold/10 dark:text-gold dark:ring-gold/30'

export const ContactBandBlock: React.FC<Props> = async ({
  addressLabel,
  emailLabel,
  email: emailFromBlock,
}) => {
  const settings = await getSiteSettings(0).catch(() => null)
  const email = emailFromBlock?.trim() || settings?.stemEmail?.trim() || DEFAULTS.stemEmail
  const line1 = settings?.address?.line1
  const line2 = settings?.address?.line2

  return (
    <section className="border-t border-navy-900/10 bg-ice dark:border-ice/10 dark:bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {line1 || line2 ? (
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className={ICON_CLS}>
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className={LABEL_CLS}>{addressLabel || 'Mailing Address'}</p>
                <p className="mt-2 font-display text-lg leading-snug text-navy-900 dark:text-ice">
                  {line1}
                  {line1 && line2 ? <br /> : null}
                  {line2}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-4">
            <span aria-hidden="true" className={ICON_CLS}>
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className={LABEL_CLS}>{emailLabel || 'Email'}</p>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block font-display text-lg leading-snug break-all text-navy-900 underline decoration-gold/40 underline-offset-4 transition hover:decoration-gold dark:text-ice"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
