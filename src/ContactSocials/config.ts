import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { link } from '@/fields/link'
import { revalidateContactSocials } from './hooks/revalidateContactSocials'

export const ContactSocials: GlobalConfig = {
  slug: 'contact-socials',
  label: 'Contact',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateContactSocials],
  },
  fields: [
    {
      name: 'contactActions',
      type: 'array',
      defaultValue: [
        {
          link: {
            type: 'custom',
            url: 'mailto:omkar@notifications.odtechlab.com',
            label: 'Email us',
          },
          enabled: true,
        },
        {
          link: {
            type: 'custom',
            url: 'https://cal.com/od-omkar-dalvi/30min',
            newTab: true,
            label: 'Schedule a meeting',
          },
          enabled: true,
        },
      ],
      label: 'Contact actions',
      admin: {
        description:
          'Actions displayed in the contact form sidebar, megamenu, or footer. Select an internal page or provide an external custom URL (such as mailto: or a Cal.com link).',
        initCollapsed: true,
      },
      fields: [
        link({
          appearances: false,
        }),
        { name: 'description', type: 'textarea', label: 'Description' },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enabled',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social profiles',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'profile',
              type: 'select',
              label: 'Profile',
              required: true,
              defaultValue: 'omkar-dalvi',
              options: [
                { label: 'Omkar Dalvi', value: 'omkar-dalvi' },
                { label: 'OD LABS', value: 'od-labs' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              required: true,
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'X / Twitter', value: 'x' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Threads', value: 'threads' },
                { label: 'Website', value: 'website' },
              ],
              admin: {
                width: '50%',
              },
            },
          ],
        },
        { name: 'url', type: 'text', required: true, label: 'Profile URL' },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enabled',
        },
      ],
    },
  ],
}
