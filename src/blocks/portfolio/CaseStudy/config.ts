import type { Block } from 'payload'

export const CaseStudyBlock: Block = {
  slug: 'caseStudy',
  dbName: 'case_study', // Root level optimization
  interfaceName: 'CaseStudyBlock',
  labels: {
    singular: 'Case Study Block',
    plural: 'Case Study Blocks',
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'client',
      type: 'text',
      required: true,
      admin: {
        description: 'Client or company name',
        placeholder: 'Acme Corporation',
      },
    },
    {
      name: 'project',
      type: 'text',
      required: true,
      admin: {
        description: 'Project name',
        placeholder: 'E-commerce Platform Redesign',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Project duration',
        placeholder: '6 months',
      },
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'Your role in the project',
        placeholder: 'Lead Developer',
      },
    },
    {
      name: 'challenge',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'The Challenge',
          required: true,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Describe the problem or challenge',
            placeholder: 'The client needed to modernize their outdated platform...',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this section',
          },
        },
      ],
      admin: {
        description: 'Describe the challenge or problem',
      },
    },
    {
      name: 'approach',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Our Approach',
          required: true,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Describe your approach to solving the problem',
            placeholder: 'We conducted thorough research and developed a strategy...',
          },
        },
        {
          name: 'steps',
          type: 'array',
          dbName: 'steps', // Keep short names as-is
          maxRows: 10,
          labels: {
            singular: 'Step',
            plural: 'Steps',
          },
          fields: [
            {
              name: 'step',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'User research and analysis',
              },
            },
          ],
          admin: {
            description: 'Key steps in your approach',
          },
        },
      ],
      admin: {
        description: 'Describe your approach and methodology',
      },
    },
    {
      name: 'solution',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'The Solution',
          required: true,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Describe the solution you delivered',
            placeholder: 'We built a modern, scalable platform using...',
          },
        },
        {
          name: 'technologies',
          type: 'array',
          dbName: 'techs', // Abbreviation
          maxRows: 15,
          labels: {
            singular: 'Technology',
            plural: 'Technologies',
          },
          fields: [
            {
              name: 'technology',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Next.js',
              },
            },
          ],
          admin: {
            description: 'Technologies used in the solution',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this section',
          },
        },
      ],
      admin: {
        description: 'Describe the solution you delivered',
      },
    },
    {
      name: 'results',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'The Results',
          required: true,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'metrics',
          type: 'array',
          dbName: 'metrics', // Keep short names as-is
          minRows: 1,
          maxRows: 8,
          labels: {
            singular: 'Metric',
            plural: 'Metrics',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Metric label',
                placeholder: 'Page Load Time',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                description: 'Metric value',
                placeholder: '2.3s',
              },
            },
            {
              name: 'change',
              type: 'text',
              admin: {
                description: 'Change indicator (e.g., +50%, -30%)',
                placeholder: '-40%',
              },
            },
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Lucide icon name',
                placeholder: 'TrendingUp',
              },
            },
          ],
          admin: {
            description: 'Key metrics and results',
          },
        },
        {
          name: 'testimonial',
          type: 'group',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              admin: {
                description: 'Client testimonial',
                placeholder: 'Working with this team was exceptional...',
              },
            },
            {
              name: 'author',
              type: 'text',
              admin: {
                description: 'Testimonial author name',
                placeholder: 'John Doe',
              },
            },
            {
              name: 'role',
              type: 'text',
              admin: {
                description: 'Author role or title',
                placeholder: 'CEO, Acme Corporation',
              },
            },
          ],
          admin: {
            description: 'Optional client testimonial',
          },
        },
      ],
      admin: {
        description: 'Showcase the results and impact',
      },
    },
  ],
}
