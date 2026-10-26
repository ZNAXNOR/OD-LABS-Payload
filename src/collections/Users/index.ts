import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { escapeHtml, wrapEmailHtml } from '@/email/template'
import { getServerSideURL } from '@/utilities/getURL'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Reset your OD LABS password',
      generateEmailHTML: ({ token, user }) => {
        const resetURL = `${getServerSideURL()}/admin/reset/${encodeURIComponent(token)}`

        return wrapEmailHtml({
          title: 'Reset your password',
          bodyHtml: `
            <p style="margin:0 0 16px;">Hello ${escapeHtml(user.email)},</p>
            <p style="margin:0 0 16px;">We received a request to reset the password for your OD LABS account.</p>
            <p style="margin:24px 0;">
              <a href="${escapeHtml(resetURL)}" style="display:inline-block;padding:11px 18px;background-color:#171717;color:#ffffff;text-decoration:none;font-weight:700;">Reset password</a>
            </p>
            <p style="margin:0 0 12px;">If you didn't request this, you can ignore this email. Your password will not change.</p>
            <p style="margin:0;">For your security, do not share this link with anyone.</p>
          `,
        })
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
