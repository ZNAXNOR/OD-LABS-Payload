import type { GlobalAfterChangeHook } from 'payload'

export const revalidateContactGlobal: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating contact`)

    import('next/cache')
      .then(({ revalidateTag }) => {
        revalidateTag('global_contact')
      })
      .catch((err) => {
        payload.logger.error(`Error revalidating contact: ${err}`)
      })
  }

  return doc
}
