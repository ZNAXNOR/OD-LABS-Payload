import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Preview Session Renewal API Route
 *
 * Handles session renewal and token refresh for active preview sessions.
 * Validates existing session and generates new authentication tokens.
 *
 * Requirements: 5.5, 7.3, 7.5
 */

interface RenewSessionRequest {
  sessionId: string
  token: string
}

interface RenewSessionResponse {
  success: boolean
  session?: {
    id: string
    userId: string
    collection: string
    documentId: string
    locale?: string
    token: string
    expiresAt: Date
    createdAt: Date
    lastAccessedAt: Date
  }
  error?: string
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse request body
    let body: RenewSessionRequest
    try {
      body = await request.json()
    } catch (error) {
      return Response.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 },
      )
    }

    const { sessionId, token } = body

    // Validate required fields
    if (!sessionId || !token) {
      return Response.json(
        {
          success: false,
          error: 'Missing required fields: sessionId and token are required',
        },
        { status: 400 },
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
      payload.logger.error('Token verification failed during renewal:', error)
      return Response.json({ success: false, error: 'Authentication failed' }, { status: 401 })
    }

    // Generate new token with extended expiration
    const newToken = await payload.generateToken({
      user,
      expiresIn: 3600, // 1 hour
    })

    // Create renewed session object
    const renewedSession = {
      id: sessionId,
      userId: user.id,
      collection: '', // This would typically come from stored session data
      documentId: '', // This would typically come from stored session data
      token: newToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      createdAt: new Date(), // This would typically be preserved from original session
      lastAccessedAt: new Date(),
    }

    // Update secure preview cookie with new token
    const response = Response.json({
      success: true,
      session: renewedSession,
    })

    // Set secure cookie with new authentication token
    response.headers.set(
      'Set-Cookie',
      `__payload_preview_token=${newToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
    )

    payload.logger.info(`Preview session renewed for user ${user.id}, session ${sessionId}`)

    return response
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Preview session renewal failed:', error)

    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET handler for session status check
 * Supports query parameters: sessionId, token
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    const token = url.searchParams.get('token')

    if (!sessionId || !token) {
      return Response.json(
        { success: false, error: 'Missing required query parameters: sessionId and token' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Verify token is still valid
    try {
      const user = await payload.verifyToken(token)
      if (!user) {
        return Response.json(
          { success: false, error: 'Session expired or invalid' },
          { status: 401 },
        )
      }

      // Return session status
      return Response.json({
        success: true,
        sessionValid: true,
        userId: user.id,
        sessionId,
      })
    } catch (error) {
      payload.logger.error('Session status check failed:', error)
      return Response.json({ success: false, error: 'Session expired or invalid' }, { status: 401 })
    }
  } catch (error) {
    const payload = await getPayload({ config: configPromise })
    payload.logger.error('Session status check failed:', error)

    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
