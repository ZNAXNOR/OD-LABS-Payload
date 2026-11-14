import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const { isEnabled } = await draftMode()

  return Response.json(
    { isEnabled },
    {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
      },
    },
  )
}
