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
      maxLength: 80,
      validate: (value: any) => {
        if (!value || value.trim().length === 0) {
          return 'Client name is required'
        }
        return true
      },
      admin: {
        description: 'Client or company name',
        placeholder: 'Acme Corporation',
      },
    },
    {
      name: 'project',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: any) => {
        if (!value || value.trim().length === 0) {
          return 'Project name is required'
        }
        return true
      },
      admin: {
        description: 'Project name',
        placeholder: 'E-commerce Platform Redesign',
      },
    },
    {
      name: 'duration',
      type: 'text',
      maxLength: 50,
      admin: {
        description: 'Project duration',
        placeholder: '6 months',
      },
    },
    {
      name: 'role',
      type: 'text',
      maxLength: 80,
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
          maxLength: 80,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          maxLength: 500,
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
          maxLength: 80,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          maxLength: 500,
          admin: {
            description: 'Describe your approach to solving the problem',
            placeholder: 'We conducted thorough research and developed a strategy...',
          },
        },
        {
          name: 'steps',
          type: 'array',
          dbName: 'steps', // Keep short names as-is
          minRows: 1,
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
              maxLength: 150,
              admin: {
                placeholder: 'User research and analysis',
              },
            },
          ],
          admin: {
            description: 'Key steps in your approach',
            components: {
              RowLabel: '@/blocks/portfolio/CaseStudy/RowLabel#StepRowLabel',
            },
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
          maxLength: 80,
          admin: {
            description: 'Section heading',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          maxLength: 500,
          admin: {
            description: 'Describe the solution you delivered',
            placeholder: 'We built a modern, scalable platform using...',
          },
        },
        {
          name: 'technologies',
          type: 'array',
          dbName: 'techs', // Abbreviation
          minRows: 1,
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
              maxLength: 50,
              admin: {
                placeholder: 'Next.js',
              },
            },
          ],
          admin: {
            description: 'Technologies used in the solution',
            components: {
              RowLabel: '@/blocks/portfolio/CaseStudy/RowLabel#TechnologyRowLabel',
            },
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
          maxLength: 80,
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
              maxLength: 80,
              admin: {
                description: 'Metric label',
                placeholder: 'Page Load Time',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              maxLength: 50,
              admin: {
                description: 'Metric value',
                placeholder: '2.3s',
              },
            },
            {
              name: 'change',
              type: 'text',
              maxLength: 20,
              admin: {
                description: 'Change indicator (e.g., +50%, -30%)',
                placeholder: '-40%',
              },
            },
            {
              name: 'icon',
              type: 'text',
              maxLength: 50,
              admin: {
                description: 'Lucide icon name',
                placeholder: 'TrendingUp',
              },
            },
          ],
          admin: {
            description: 'Key metrics and results',
            components: {
              RowLabel: '@/blocks/portfolio/CaseStudy/RowLabel#MetricRowLabel',
            },
          },
        },
        {
          name: 'testimonial',
          type: 'group',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              maxLength: 500,
              admin: {
                description: 'Client testimonial',
                placeholder: 'Working with this team was exceptional...',
              },
            },
            {
              name: 'author',
              type: 'text',
              maxLength: 80,
              admin: {
                description: 'Testimonial author name',
                placeholder: 'John Doe',
              },
            },
            {
              name: 'role',
              type: 'text',
              maxLength: 100,
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
