import type { ComponentProps, ElementType, ReactNode } from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  children: ReactNode
  className?: string
  as?: ElementType
} & Omit<ComponentProps<'div'>, 'className' | 'children'>

/**
 * Square panel with a 45° chamfer at the bottom-left and a cursor-following
 * bloom. All visuals come from the `.chamfered-card` utility in globals.css;
 * `--bloom-x/--bloom-y` are set by <ChamferBloom /> mounted in the layout.
 */
export function ChamferedCard({ children, className, as: Tag = 'div', ...rest }: Props) {
  return (
    <Tag className={cn('chamfered-card group relative isolate overflow-hidden', className)} {...rest}>
      {children}
    </Tag>
  )
}
