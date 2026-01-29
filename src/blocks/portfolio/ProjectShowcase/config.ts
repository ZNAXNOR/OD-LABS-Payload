import { link } from '@/fields/link'
import type { Block } from 'payload'

export const ProjectShowcaseBlock: Block = {
  slug: 'projectShowcase',
  interfaceName: 'ProjectShowcaseBlock',
  labels: {
    singular: 'Project Showcase Block',
    plural: 'Project Showcase Blocks',
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Optional heading for the project showcase section',
        placeholder: 'Our Projects',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text',
        placeholder: 'Explore our latest work',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Masonry',
          value: 'masonry',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
      required: true,
      admin: {
        description: 'Layout style for displaying projects',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
      ],
      required: true,
      admin: {
        description: 'Number of columns in the grid',
        condition: (data) => data.layout === 'grid' || data.layout === 'masonry',
      },
    },
    {
      name: 'projects',
      type: 'array',
      minRows: 1,
      maxRows: 24,
      labels: {
        singular: 'Project',
        plural: 'Projects',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 100,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Project title is required'
            }
            return true
          },
          admin: {
            description: 'Project title',
            placeholder: 'E-commerce Platform',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 200,
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Project description is required'
            }
            return true
          },
          admin: {
            description: 'Brief project description',
            placeholder: 'A modern e-commerce solution built with Next.js',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Project thumbnail or hero image',
          },
        },
        {
          name: 'technologies',
          type: 'array',
          minRows: 1,
          maxRows: 10,
          labels: {
            singular: 'Technology',
            plural: 'Technologies',
          },
          fields: [
            {
              name: 'technology',
              type: 'text',
              required: true,
              maxLength: 50,
              validate: (value: any) => {
                if (!value || value.trim().length === 0) {
                  return 'Technology name is required'
                }
                return true
              },
              admin: {
                placeholder: 'React',
              },
            },
          ],
          admin: {
            description: 'Technologies used in this project',
            components: {
              RowLabel: '@/blocks/portfolio/ProjectShowcase/RowLabel#TechnologyRowLabel',
            },
          },
        },
        {
          name: 'category',
          type: 'text',
          required: true,
          maxLength: 50,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Project category is required'
            }
            return true
          },
          admin: {
            description: 'Project category for filtering',
            placeholder: 'Web Development',
          },
        },
        {
          name: 'projectLink',
          type: 'group',
          fields: [link({ disableLabel: false })].flat(),
          admin: {
            description: 'Optional link to project details page',
          },
        },
        {
          name: 'githubUrl',
          type: 'text',
          maxLength: 200,
          validate: (value: any) => {
            if (!value) return true // Optional field
            try {
              const url = new URL(value)
              if (!url.hostname.includes('github.com')) {
                return 'Please enter a valid GitHub URL'
              }
              return true
            } catch {
              return 'Please enter a valid URL'
            }
          },
          admin: {
            description: 'GitHub repository URL',
            placeholder: 'https://github.com/username/repo',
          },
        },
        {
          name: 'liveUrl',
          type: 'text',
          maxLength: 200,
          validate: (value: any) => {
            if (!value) return true // Optional field
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL'
            }
          },
          admin: {
            description: 'Live project URL',
            placeholder: 'https://example.com',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as featured project',
          },
        },
      ],
      admin: {
        description: 'Add projects to showcase',
        components: {
          RowLabel: '@/blocks/portfolio/ProjectShowcase/RowLabel#ProjectRowLabel',
        },
      },
    },
    {
      name: 'enableFiltering',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable category filtering for projects',
      },
    },
    {
      name: 'filterCategories',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: 'Category',
        plural: 'Categories',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          maxLength: 50,
          admin: {
            placeholder: 'Web Development',
          },
        },
      ],
      admin: {
        description: 'Categories to show in filter (leave empty to auto-generate from projects)',
        condition: (data) => data.enableFiltering === true,
        components: {
          RowLabel: '@/blocks/portfolio/ProjectShowcase/RowLabel#CategoryRowLabel',
        },
      },
    },
    {
      name: 'showLoadMore',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show "Load More" button for pagination',
      },
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      defaultValue: 6,
      min: 3,
      max: 24,
      admin: {
        description: 'Number of projects to show per page',
        condition: (data) => data.showLoadMore === true,
      },
    },
  ],
}
