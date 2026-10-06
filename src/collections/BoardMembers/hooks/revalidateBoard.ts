import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { BoardMember } from '../../../payload-types'

const paths = ['/leadership', '/']

export const revalidateBoard: CollectionAfterChangeHook<BoardMember> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) paths.forEach((p) => revalidatePath(p))
  return doc
}

export const revalidateBoardDelete: CollectionAfterDeleteHook<BoardMember> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) paths.forEach((p) => revalidatePath(p))
  return doc
}
