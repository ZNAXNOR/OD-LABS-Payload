import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

/**
 * Preview Exit API Route
 *
 * Clears draft mode and authentication tokens, handles session cleanup and redirection.
 *
 * Requirements: 5.4, 7.5
 */

interface ExitPreviewResponse {
  success: boolean
  redirectUrl?: string
  error?: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse request body for redirect URL
    let redirectUrl = '/'
    try {
      const body = await request.json()
      if (body.redirectUrl && typeof body.redirectUrl === 'string') {
        redirectUrl = body.redirectUrl
      }
    } catch {
      // Use default redirect URL if JSON parsing fails
    }

    // Disable draft mode
    const draft = await draftMode()
    draft.disable()

    // Create response with redirect URL
    const response = Response.json({
      success: true,
      redirectUrl,
    })

    // Clear preview authentication cookie
    response.headers.set(
      'Set-Cookie',
      '__payload_preview_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    )

    payload.logger.info('Preview mode disabled and authentication tokens cleared')

    return response
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Preview exit failed:', error)

    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET handler for direct preview exit
 * Supports query parameter: redirect (optional)
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const redirectUrl = url.searchParams.get('redirect') || '/'

    // Disable draft mode
    const draft = await draftMode()
    draft.disable()

    // Create redirect response
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    })

    // Clear preview authentication cookie
    response.headers.set(
      'Set-Cookie',
      '__payload_preview_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    )

    const payload = await getPayload({ config: configPromise })
    payload.logger.info(`Preview mode exited, redirecting to: ${redirectUrl}`)

    return response
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Preview exit GET request failed:', error)

    // Fallback redirect to home
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    })
  }
}
