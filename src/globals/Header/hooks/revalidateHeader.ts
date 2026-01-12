import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    import('next/cache')
      .then(({ revalidateTag }) => {
        revalidateTag('global_header')
      })
      .catch((err) => {
        payload.logger.error(`Error revalidating header: ${err}`)
      })
  }

  return doc
}
