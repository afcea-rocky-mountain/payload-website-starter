import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MissionPillarsBlock } from '@/blocks/MissionPillars/Component'
import { FeaturedEventBlock } from '@/blocks/FeaturedEvent/Component'
import { EventsGridBlock } from '@/blocks/EventsGrid/Component'
import { StemImpactBlock } from '@/blocks/StemImpact/Component'
import { StemProgramsBlock } from '@/blocks/StemPrograms/Component'
import { EligibilityBlock } from '@/blocks/Eligibility/Component'
import { PromoBandBlock } from '@/blocks/PromoBand/Component'
import { CtaBandBlock } from '@/blocks/CtaBand/Component'
import { ProposeProgramBlock } from '@/blocks/ProposeProgram/Component'
import { ContactBandBlock } from '@/blocks/ContactBand/Component'
import { LeadershipBoardBlock } from '@/blocks/LeadershipBoard/Component'
import { ZeffyEmbedBlock } from '@/blocks/ZeffyEmbed/Component'

const blockComponents = {
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  missionPillars: MissionPillarsBlock,
  featuredEvent: FeaturedEventBlock,
  eventsGrid: EventsGridBlock,
  stemImpact: StemImpactBlock,
  stemPrograms: StemProgramsBlock,
  eligibility: EligibilityBlock,
  promoBand: PromoBandBlock,
  ctaBand: CtaBandBlock,
  proposeProgram: ProposeProgramBlock,
  contactBand: ContactBandBlock,
  leadershipBoard: LeadershipBoardBlock,
  zeffyEmbed: ZeffyEmbedBlock,
}

// Blocks that paint their own full-bleed section background and spacing.
// Everything else gets the default vertical rhythm wrapper.
const SELF_SPACED = new Set<string>([
  'missionPillars',
  'featuredEvent',
  'eventsGrid',
  'stemImpact',
  'stemPrograms',
  'eligibility',
  'promoBand',
  'ctaBand',
  'proposeProgram',
  'contactBand',
  'leadershipBoard',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const el = (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} disableInnerContainer />
              )
              if (SELF_SPACED.has(blockType)) return <Fragment key={index}>{el}</Fragment>
              return (
                <div className="my-16" key={index}>
                  {el}
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
