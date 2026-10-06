import React from 'react'
import { Github, Globe, Linkedin, Mail, Phone } from 'lucide-react'

import type { BoardMember } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import { LeadershipCardMotion } from './LeadershipCard.client'

/** Strip nicknames in quotes, then take the first letter of first + last token. */
export function getInitials(name: string): string {
  const cleaned = name.replace(/"[^"]*"/g, '').replace(/\s+/g, ' ').trim()
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase()
  const first = parts[0]!.charAt(0)
  const last = parts[parts.length - 1]!.charAt(0)
  return (first + last).toUpperCase()
}

type CardProps = {
  member: BoardMember
  index: number
  size?: 'standard' | 'feature'
  columnsPerRow?: number
}

export function LeadershipCard({ member, index, size = 'standard', columnsPerRow = 4 }: CardProps) {
  const isFeature = size === 'feature'
  const initials = getInitials(member.name)
  // Stagger by column position so each row starts fresh.
  const colIndex = index % columnsPerRow
  const photo = member.photo && typeof member.photo === 'object' ? member.photo : null

  return (
    <LeadershipCardMotion colIndex={colIndex}>
      {/* Photo / monogram */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {photo ? (
          <Media
            resource={photo}
            alt={`Portrait of ${member.name}`}
            htmlElement={null}
            pictureClassName="block h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            aria-hidden="true"
            className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-chathams-600 via-chathams-700 to-navy-900 transition-transform duration-500 ease-out group-hover:scale-105"
          >
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(232,238,247,0.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(201,168,92,0.16),transparent_50%)]" />
            <span
              className={cn(
                'relative font-display font-semibold tracking-tight text-ice/95',
                isFeature ? 'text-7xl sm:text-8xl' : 'text-5xl sm:text-6xl',
              )}
            >
              {initials}
            </span>
          </div>
        )}

        {/* Bottom gradient veil for legibility on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-navy-900/60"
        />
      </div>

      {/* Text block */}
      <div className={cn('flex flex-1 flex-col', isFeature ? 'p-5 sm:p-7' : 'p-5')}>
        <h3
          className={cn(
            'font-display font-semibold tracking-tight break-words hyphens-auto text-navy-900 dark:text-ice',
            isFeature ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg md:text-xl',
          )}
        >
          {member.name}
        </h3>
        {member.postNominals ? (
          <p
            className={cn(
              'mt-1 font-sans italic text-navy-800/65 dark:text-ice/60',
              isFeature ? 'text-sm sm:text-base' : 'text-xs sm:text-sm',
            )}
          >
            {member.postNominals}
          </p>
        ) : null}
        <p
          className={cn(
            'font-sans font-medium tracking-wide text-chathams-700 dark:text-gold',
            member.postNominals ? 'mt-3' : 'mt-1',
            isFeature ? 'text-sm sm:text-base' : 'text-xs sm:text-sm',
          )}
        >
          {member.role}
        </p>

        <div className="flex-1" aria-hidden="true" />

        {member.email || member.linkedin || member.phone || member.website || member.github ? (
          <ContactRow member={member} isFeature={isFeature} />
        ) : null}
      </div>
    </LeadershipCardMotion>
  )
}

/** Accept bare domains as well as full URLs. */
function normalizeUrl(url: string): string {
  const u = url.trim()
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}

/** Accept a GitHub username or a full profile URL. */
function githubUrl(value: string): string {
  const v = value.trim().replace(/^@/, '')
  if (/^https?:\/\//i.test(v)) return v
  if (/github\.com\//i.test(v)) return `https://${v}`
  return `https://github.com/${v}`
}

function ContactRow({ member, isFeature }: { member: BoardMember; isFeature: boolean }) {
  const iconSize = isFeature ? 'h-4 w-4' : 'h-3.5 w-3.5'
  const linkClasses = cn(
    'inline-flex h-11 w-11 items-center justify-center sm:h-10 sm:w-10',
    'text-navy-800/70 dark:text-ice/70',
    'bg-navy-900/[0.04] dark:bg-ice/5',
    'transition-colors duration-200',
    'hover:bg-gold/20 hover:text-navy-900 dark:hover:bg-gold/20 dark:hover:text-ice',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900',
  )

  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      {member.email ? (
        <a
          href={`mailto:${member.email}?subject=AFCEA%20Rocky%20Mountain%20—%20${encodeURIComponent(member.role)}`}
          aria-label={`Email ${member.name}`}
          title={member.email}
          className={linkClasses}
        >
          <Mail className={iconSize} aria-hidden="true" />
        </a>
      ) : null}
      {member.linkedin ? (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${member.name} on LinkedIn`}
          className={linkClasses}
        >
          <Linkedin className={iconSize} aria-hidden="true" />
        </a>
      ) : null}
      {member.website ? (
        <a
          href={normalizeUrl(member.website)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${member.name}'s website`}
          title={member.website}
          className={linkClasses}
        >
          <Globe className={iconSize} aria-hidden="true" />
        </a>
      ) : null}
      {member.github ? (
        <a
          href={githubUrl(member.github)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${member.name} on GitHub`}
          title={member.github}
          className={linkClasses}
        >
          <Github className={iconSize} aria-hidden="true" />
        </a>
      ) : null}
      {member.phone ? (
        <a
          href={`tel:${member.phone.replace(/[^\d+]/g, '')}`}
          aria-label={`Call ${member.name}`}
          title={member.phone}
          className={linkClasses}
        >
          <Phone className={iconSize} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}
