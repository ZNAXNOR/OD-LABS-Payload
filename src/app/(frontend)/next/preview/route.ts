import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'

export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')
  const configuredSecret = process.env.PREVIEW_SECRET

  // Fail closed if the preview secret is missing or does not match.
  if (!configuredSecret || !previewSecret || previewSecret !== configuredSecret) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Insufficient search params', { status: 400 })
  }

  // Only allow same-origin relative paths. Reject protocol-relative URLs,
  // backslashes, control characters, and paths that normalize outside the site.
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    /[\u0000-\u001F\u007F]/.test(path)
  ) {
    return new Response('This endpoint only accepts safe relative preview paths', {
      status: 400,
    })
  }

  const target = new URL(path, req.nextUrl.origin)
  if (target.origin !== req.nextUrl.origin) {
    return new Response('Invalid preview path', { status: 400 })
  }

  let user

  try {
    const authResult = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
    user = authResult.user
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()
  redirect(target.pathname + target.search + target.hash)
}
