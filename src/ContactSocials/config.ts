import type { GlobalConfig } from 'payload'

export const ContactSocials: GlobalConfig = {
  slug: 'contact-socials',
  label: 'Contact & Socials',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactActions',
      type: 'array',
      label: 'Contact actions',
      admin: {
        description: 'Actions displayed in the contact form sidebar. Use mailto: for email and the Cal.com URL for scheduling.',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Button label' },
        { name: 'href', type: 'text', required: true, label: 'Destination URL' },
        { name: 'description', type: 'text', label: 'Description' },
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
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'X', value: 'x' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Threads', value: 'threads' },
            { label: 'Website', value: 'website' },
          ],
        },
        { name: 'url', type: 'text', required: true, label: 'Profile URL' },
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Enabled' },
      ],
    },
  ],
}
