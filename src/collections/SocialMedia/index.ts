import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const SocialMedia: CollectionConfig = {
  slug: 'social-media',
  dbName: 'social_media_links', // Use a unique table name to avoid conflicts
  labels: {
    singular: 'Social Media',
    plural: 'Social Media',
  },
  admin: {
    useAsTitle: 'platform',
    defaultColumns: ['platform', 'url', 'label'],
    group: 'Settings',
    description: 'Manage social media links as global assets',
  },
  access: {
    create: authenticated,
    read: () => true, // Public read access for frontend
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'platform',
      type: 'select',
      dbName: 'socal_media_platform',
      required: true,
      unique: true,
      options: [
        { label: 'Facebook', value: 'Facebook' },
        { label: 'Twitter/X', value: 'Twitter/X' },
        { label: 'LinkedIn', value: 'LinkedIn' },
        { label: 'Instagram', value: 'Instagram' },
        { label: 'YouTube', value: 'YouTube' },
        { label: 'GitHub', value: 'GitHub' },
        { label: 'Discord', value: 'Discord' },
        { label: 'TikTok', value: 'TikTok' },
        { label: 'Pinterest', value: 'Pinterest' },
        { label: 'Snapchat', value: 'Snapchat' },
        { label: 'WhatsApp', value: 'WhatsApp' },
        { label: 'Telegram', value: 'Telegram' },
        { label: 'Other', value: 'Other' },
      ],
      admin: {
        description: 'Social media platform',
        width: '50%',
        components: {
          Cell: '@/components/admin/SafeSelectCell',
        },
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Profile URL',
        width: '50%',
      },
      validate: (value: any) => {
        if (!value) return 'URL is required'
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Custom label (optional, defaults to platform name)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for this social media account',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this social media link is active and should be displayed',
      },
    },
  ],
  timestamps: true,
}
