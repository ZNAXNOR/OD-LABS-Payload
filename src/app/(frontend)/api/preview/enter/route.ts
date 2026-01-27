import { generateAuthenticatedPreviewUrl, getPreviewUrlGenerator } from '@/utilities/livePreview'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { CollectionSlug } from 'payload'
import { getPayload } from 'payload'

/**
 * Preview Entry API Route
 *
 * Handles authentication and token validation, sets Next.js draft mode with secure cookies,
 * and generates and validates preview URLs.
 *
 * Requirements: 5.1, 7.1, 7.2
 */

interface EnterPreviewRequest {
  collection: string
  id: string
  locale?: string
  token: string
}

interface EnterPreviewResponse {
  success: boolean
  previewUrl?: string
  error?: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse request body
    let body: EnterPreviewRequest
    try {
      body = await request.json()
    } catch (error) {
      return Response.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 },
      )
    }

    const { collection, id, locale, token } = body

    // Validate required fields
    if (!collection || !id || !token) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: collection, id, and token are required',
        },
        { status: 400 },
      )
    }

    // Validate collection exists
    const collectionConfig = payload.config.collections?.find((c) => c.slug === collection)
    if (!collectionConfig) {
      return Response.json(
        { success: false, error: `Collection '${collection}' not found` },
        { status: 404 },
      )
    }

    // Verify authentication token
    let user
    try {
      user = await payload.verifyToken(token)
      if (!user) {
        return Response.json(
          { success: false, error: 'Invalid or expired authentication token' },
          { status: 401 },
        )
      }
    } catch (error) {
      payload.logger.error('Token verification failed:', error)
      return Response.json({ success: false, error: 'Authentication failed' }, { status: 401 })
    }

    // Verify user has access to the document
    try {
      const doc = await payload.findByID({
        collection: collection as CollectionSlug,
        id,
        user,
        overrideAccess: false, // Enforce access control
        locale,
        draft: true, // Allow access to draft content
      })

      if (!doc) {
        return Response.json(
          { success: false, error: 'Document not found or access denied' },
          { status: 404 },
        )
      }

      // Generate preview URL
      const urlGenerator = getPreviewUrlGenerator(collection as CollectionSlug)
      if (!urlGenerator) {
        return Response.json(
          { success: false, error: `Preview not supported for collection '${collection}'` },
          { status: 400 },
        )
      }

      const basePreviewUrl = urlGenerator(doc, locale)
      const authenticatedPreviewUrl = generateAuthenticatedPreviewUrl(basePreviewUrl, token, locale)

      // Enable draft mode
      const draft = await draftMode()
      draft.enable()

      // Set secure preview cookie with authentication token
      const response = Response.json({
        success: true,
        previewUrl: authenticatedPreviewUrl,
      })

      // Set secure cookie with authentication token
      response.headers.set(
        'Set-Cookie',
        `__payload_preview_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
      )

      payload.logger.info(`Preview mode enabled for ${collection}:${id} by user ${user.id}`)

      return response
    } catch (error) {
      payload.logger.error('Document access verification failed:', error)
      return Response.json(
        { success: false, error: 'Failed to verify document access' },
        { status: 403 },
      )
    }
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Preview entry failed:', error)

    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET handler for direct preview URL access
 * Supports query parameters: collection, id, locale, token
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const collection = url.searchParams.get('collection')
    const id = url.searchParams.get('id')
    const locale = url.searchParams.get('locale') || undefined
    const token = url.searchParams.get('token')

    if (!collection || !id || !token) {
      return Response.json(
        { success: false, error: 'Missing required query parameters: collection, id, and token' },
        { status: 400 },
      )
    }

    // Convert GET to POST format and process
    const postBody = { collection, id, locale, token }
    const postRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody),
    })

    const response = await POST(postRequest)
    const data = (await response.json()) as EnterPreviewResponse

    if (data.success && data.previewUrl) {
      // Redirect to preview URL
      redirect(data.previewUrl)
    } else {
      return Response.json(data, { status: response.status })
    }
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Preview GET request failed:', error)

    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
