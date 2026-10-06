import React, { Fragment } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { BoardMember, LeadershipBoardBlock as Props } from '@/payload-types'
import { BoardGroup, GroupDivider } from '@/components/leadership/BoardGroup'
import { GetInvolvedCta } from '@/components/leadership/GetInvolvedCta'

const FALLBACK_PRESIDENT_EMAIL = 'philparkerjr@gmail.com'

export const LeadershipBoardBlock: React.FC<Props & { disableInnerContainer?: boolean }> = async ({
  groups,
  cta,
}) => {
  const payload = await getPayload({ config: configPromise })
  const { docs: members } = await payload.find({
    collection: 'board-members',
    sort: 'order',
    limit: 100,
    depth: 1,
    pagination: false,
    overrideAccess: false,
  })

  const byGroup = (group: BoardMember['group']) => members.filter((m) => m.group === group)
  const president = members.find((m) => m.role.trim().toLowerCase() === 'president')
  const ctaEmail = cta?.email || president?.email || FALLBACK_PRESIDENT_EMAIL

  const sections = (groups ?? []).filter((g) => byGroup(g.group).length > 0)

  return (
    <Fragment>
      {sections.map((g, i) => (
        <Fragment key={g.id ?? `${g.group}-${i}`}>
          {i > 0 ? <GroupDivider /> : null}
          <BoardGroup
            title={g.title}
            eyebrow={g.eyebrow}
            members={byGroup(g.group)}
            layout={g.layout === 'feature' ? 'feature' : 'grid'}
          />
        </Fragment>
      ))}

      {cta?.enabled !== false ? (
        <GetInvolvedCta
          eyebrow={cta?.eyebrow ?? 'Get involved'}
          heading={cta?.heading ?? 'Interested in serving the chapter?'}
          body={cta?.body}
          buttonLabel={cta?.buttonLabel}
          email={ctaEmail}
        />
      ) : null}
    </Fragment>
  )
}
