export const GITHUB_REPO_ISSUES_URL =
  'https://github.com/ZNAXNOR/OD-LABS-Payload/issues/new'

// Maximum safe total URL length to prevent HTTP 414 Request-URI Too Large
const MAX_SAFE_URL_LENGTH = 1600
const MAX_ERROR_MESSAGE_LENGTH = 180
const MAX_BODY_LENGTH = 700

export interface GitHubIssueParams {
  title?: string
  errorMessage?: string
  errorName?: string
  digest?: string
  url?: string
  userAgent?: string
  labels?: string[]
}

/**
 * Sanitizes an error message by extracting only the primary summary line
 * and stripping verbose runtime traces, component diffs, and control characters.
 */
function sanitizeErrorMessage(rawMessage?: string): string | undefined {
  if (!rawMessage) return undefined

  // Extract the first non-empty line
  const lines = rawMessage
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return undefined

  let primary = lines[0]

  // Strip common noisy stack prefixes if concatenated
  primary = primary.replace(/^(Error|TypeError|ReferenceError|RangeError):\s*/i, '')

  if (primary.length > MAX_ERROR_MESSAGE_LENGTH) {
    primary = `${primary.slice(0, MAX_ERROR_MESSAGE_LENGTH)}... [truncated]`
  }

  return primary
}

export function getGitHubIssueUrl(params: GitHubIssueParams = {}): string {
  const {
    title,
    errorMessage,
    errorName,
    digest,
    url,
    userAgent,
    labels = ['bug'],
  } = params

  const sanitizedMessage = sanitizeErrorMessage(errorMessage)
  const isError = Boolean(sanitizedMessage || digest || errorName)

  let issueTitle =
    title ||
    (isError
      ? `[Bug]: ${errorName || 'Runtime Error'}${digest ? ` (${digest})` : ''}`
      : '[Bug / Feedback]: Issue Report')

  if (issueTitle.length > 90) {
    issueTitle = `${issueTitle.slice(0, 87)}...`
  }

  const now = new Date().toISOString()
  const sections: string[] = []

  sections.push('### Description')
  if (isError) {
    sections.push(
      'An unexpected error occurred while browsing the site. Diagnostic details are captured below.',
    )
  } else {
    sections.push(
      '<!-- Please provide a clear and concise description of the issue or feedback -->',
    )
  }

  sections.push('\n### Context')
  if (digest) sections.push(`- **Incident Digest:** \`${digest}\``)
  if (errorName) sections.push(`- **Error Type:** \`${errorName}\``)
  if (sanitizedMessage) sections.push(`- **Error Message:** \`${sanitizedMessage}\``)
  if (url) sections.push(`- **Page URL:** ${url}`)
  sections.push(`- **Timestamp:** \`${now}\``)

  if (userAgent) {
    const compactUA =
      userAgent.length > 80 ? `${userAgent.slice(0, 77)}...` : userAgent
    sections.push(`- **User Agent:** \`${compactUA}\``)
  }

  sections.push('\n### Steps to Reproduce')
  sections.push("1. Go to '...'\n2. Click on '...'\n3. Observe behavior")

  sections.push('\n### Expected Behavior')
  sections.push('<!-- What did you expect to happen? -->')

  let body = sections.join('\n')

  if (body.length > MAX_BODY_LENGTH) {
    body = `${body.slice(0, MAX_BODY_LENGTH)}\n\n*(Context trimmed for URL safety)*`
  }

  const queryParams = new URLSearchParams()
  queryParams.set('title', issueTitle)
  queryParams.set('body', body)
  if (labels && labels.length > 0) {
    queryParams.set('labels', labels.join(','))
  }

  let finalUrl = `${GITHUB_REPO_ISSUES_URL}?${queryParams.toString()}`

  // Fail-safe guard: If encoded URL still exceeds limit, aggressively clamp body
  if (finalUrl.length > MAX_SAFE_URL_LENGTH) {
    const overflow = finalUrl.length - MAX_SAFE_URL_LENGTH
    const clampedBody = body.slice(0, Math.max(200, body.length - overflow - 50))
    queryParams.set(
      'body',
      `${clampedBody}\n\n*(Truncated: query exceeded GitHub URL limit)*`,
    )
    finalUrl = `${GITHUB_REPO_ISSUES_URL}?${queryParams.toString()}`
  }

  return finalUrl
}
