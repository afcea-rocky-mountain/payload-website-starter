import { cn } from '@/utilities/ui'

export function TagBadge({ tag, className }: { tag: string; className?: string }) {
  // Flagship tag gets gold treatment; everything else uses chathams blue.
  const isFlagship = tag.toLowerCase() === 'flagship'
  if (isFlagship) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 border border-gold/40 bg-gold/15 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-[0.14em] text-gold uppercase',
          className,
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
        {tag}
      </span>
    )
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border border-chathams-600/30 bg-chathams-600/10 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-[0.14em] text-chathams-700 uppercase dark:border-ice/20 dark:bg-ice/10 dark:text-ice/80',
        className,
      )}
    >
      {tag}
    </span>
  )
}
