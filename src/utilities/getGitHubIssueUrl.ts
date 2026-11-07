export const GITHUB_REPO_ISSUES_URL =
  'https://github.com/ZNAXNOR/OD-LABS-Payload/issues/new'

export interface GitHubIssueParams {
  title?: string
  errorMessage?: string
  errorName?: string
  digest?: string
  url?: string
  userAgent?: string
  labels?: string[]
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

  const isError = Boolean(errorMessage || digest || errorName)

  const issueTitle =
    title ||
    (isError
      ? `[Bug]: ${errorName || 'Runtime Error'}${digest ? ` (${digest})` : ''}`
      : '[Bug / Feedback]: Issue Report')

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
  if (errorMessage) sections.push(`- **Error Message:** \`${errorMessage}\``)
  if (url) sections.push(`- **Page URL:** ${url}`)
  sections.push(`- **Timestamp:** \`${now}\``)
  if (userAgent) sections.push(`- **User Agent:** \`${userAgent}\``)

  sections.push('\n### Steps to Reproduce')
  sections.push("1. Go to '...'\n2. Click on '...'\n3. Observe behavior")

  sections.push('\n### Expected Behavior')
  sections.push('<!-- What did you expect to happen? -->')

  sections.push('\n### Additional Context')
  sections.push('<!-- Add any other context or screenshots about the problem here -->')

  const body = sections.join('\n')

  const queryParams = new URLSearchParams()
  queryParams.set('title', issueTitle)
  queryParams.set('body', body)
  if (labels && labels.length > 0) {
    queryParams.set('labels', labels.join(','))
  }

  return `${GITHUB_REPO_ISSUES_URL}?${queryParams.toString()}`
}
