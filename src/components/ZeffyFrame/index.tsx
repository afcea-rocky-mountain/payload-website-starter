import { cn } from '@/utilities/ui'

/** Convert any Zeffy form URL to its embeddable form. */
export function toZeffyEmbedUrl(url: string): string {
  try {
    const u = new URL(url.trim())
    if (!/zeffy\.com$/i.test(u.hostname) && !/\.zeffy\.com$/i.test(u.hostname)) return url
    // https://www.zeffy.com/en-US/ticketing/<slug>  ->  https://www.zeffy.com/embed/ticketing/<slug>
    u.pathname = u.pathname.replace(/^\/(?:[a-z]{2}-[A-Z]{2}\/)?(ticketing|donation-form|fundraising|peer-to-peer|membership|shop|raffle|auction)\//, '/embed/$1/')
    return u.toString()
  } catch {
    return url
  }
}

type Props = {
  url: string
  title?: string
  height?: number | null
  className?: string
}

/** Zeffy payment / ticketing iframe (Zeffy's recommended embed markup). */
export function ZeffyFrame({ url, title = 'Zeffy form', height, className }: Props) {
  const src = toZeffyEmbedUrl(url)
  const h = height && height > 0 ? height : 1200
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-white dark:bg-navy-900', className)}
      style={{ height: h }}
    >
      <iframe
        title={title}
        src={src}
        allow="payment"
        allowTransparency
        loading="lazy"
        style={{ position: 'absolute', border: 0, top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}
