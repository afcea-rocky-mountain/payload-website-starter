import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { StemProgram } from '../../../payload-types'

const paths = ['/', '/stem-grant']

export const revalidateStem: CollectionAfterChangeHook<StemProgram> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) paths.forEach((p) => revalidatePath(p))
  return doc
}

export const revalidateStemDelete: CollectionAfterDeleteHook<StemProgram> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) paths.forEach((p) => revalidatePath(p))
  return doc
}
