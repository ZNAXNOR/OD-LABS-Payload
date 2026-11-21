/**
 * Adds the OD LABS brand suffix once, even when an editor has already included
 * it or a previously generated value contains the suffix more than once.
 */
export const withBrandSuffix = (value?: string | null): string => {
  const title = value?.trim()

  if (!title) return 'OD LABS'

  const baseTitle = title.replace(/(?:\s*\|\s*OD LABS)+$/gi, '').trim()

  if (!baseTitle || /^OD LABS$/i.test(baseTitle)) return 'OD LABS'

  return `${baseTitle} | OD LABS`
}
