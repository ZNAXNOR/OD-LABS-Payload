import type { GlobalAfterChangeHook } from 'payload'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    import('next/cache')
      .then(({ revalidateTag }) => {
        revalidateTag('global_footer')
      })
      .catch((err) => {
        payload.logger.error(`Error revalidating footer: ${err}`)
      })
  }

  return doc
}
