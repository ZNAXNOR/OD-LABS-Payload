import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateContactSocials: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    payload.logger.info(`Revalidating contact socials`)
    revalidateTag('global_contact-socials', 'max')
  }

  return doc
}
