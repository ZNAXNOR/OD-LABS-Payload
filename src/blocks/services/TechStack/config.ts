import type { Block } from 'payload'

export const TechStackBlock: Block = {
  slug: 'techStack',
  dbName: 'tech_stack', // Root level optimization
  interfaceName: 'TechStackBlock',
  labels: {
    singular: 'Tech Stack Block',
    plural: 'Tech Stack Blocks',
  },
  admin: {
    group: 'Services',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Optional heading for the tech stack section',
        placeholder: 'Technologies We Use',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Optional description text',
        placeholder: 'Our technology stack and expertise',
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
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'List',
          value: 'list',
        },
      ],
      required: true,
      admin: {
        description: 'How to display the technologies',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      dbName: 'techs', // Abbreviation
      minRows: 1,
      maxRows: 50,
      labels: {
        singular: 'Technology',
        plural: 'Technologies',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 80,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Technology name is required'
            }
            return true
          },
          admin: {
            description: 'Technology name',
            placeholder: 'React',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Technology logo/icon (upload or use icon name)',
          },
        },
        {
          name: 'iconName',
          type: 'text',
          maxLength: 50,
          admin: {
            description: 'Lucide icon name if not using uploaded icon',
            placeholder: 'Code',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            {
              label: 'Frontend',
              value: 'frontend',
            },
            {
              label: 'Backend',
              value: 'backend',
            },
            {
              label: 'Database',
              value: 'database',
            },
            {
              label: 'DevOps',
              value: 'devops',
            },
            {
              label: 'Tools',
              value: 'tools',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          required: true,
          admin: {
            description: 'Technology category for filtering',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Optional description of the technology',
            placeholder: 'A JavaScript library for building user interfaces',
          },
        },
        {
          name: 'proficiency',
          type: 'select',
          options: [
            {
              label: 'Beginner',
              value: 'beginner',
            },
            {
              label: 'Intermediate',
              value: 'intermediate',
            },
            {
              label: 'Advanced',
              value: 'advanced',
            },
            {
              label: 'Expert',
              value: 'expert',
            },
          ],
          admin: {
            description: 'Your proficiency level with this technology',
          },
        },
        {
          name: 'yearsExperience',
          type: 'number',
          min: 0,
          max: 50,
          admin: {
            description: 'Years of experience with this technology',
            placeholder: '3',
          },
        },
      ],
      admin: {
        description: 'Add technologies to display',
        components: {
          RowLabel: '@/blocks/services/TechStack/RowLabel#TechnologyRowLabel',
        },
      },
    },
    {
      name: 'showDescriptions',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show technology descriptions',
      },
    },
    {
      name: 'enableFiltering',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable category filtering',
      },
    },
  ],
}
