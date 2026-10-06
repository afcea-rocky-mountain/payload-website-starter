import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'

// Seeding uploads ~18 images through sharp (7 sizes each) and Vercel Blob; give it room.
export const maxDuration = 300

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq })

    // The seed writes with revalidation disabled; flush every cache it touched.
    for (const tag of ['global_header', 'global_footer', 'global_site-settings', 'events', 'pages-sitemap', 'redirects']) {
      revalidateTag(tag, 'max')
    }
    revalidatePath('/', 'layout')

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    const message = e instanceof Error ? e.message : String(e)
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
