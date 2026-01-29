import type { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  dbName: 'testimonial', // Root level optimization
  interfaceName: 'TestimonialBlock',
  labels: {
    singular: 'Testimonial Block',
    plural: 'Testimonial Blocks',
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
        description: 'Optional heading for the testimonials section',
        placeholder: 'What Our Clients Say',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'single',
      options: [
        {
          label: 'Single',
          value: 'single',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
      required: true,
      admin: {
        description: 'Layout style for displaying testimonials',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      dbName: 'testimonials', // Keep short names as-is
      minRows: 1,
      maxRows: 20,
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          maxLength: 500,
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Testimonial quote is required'
            }
            if (value.trim().length < 10) {
              return 'Testimonial quote should be at least 10 characters long'
            }
            return true
          },
          admin: {
            description: 'Testimonial quote',
            placeholder: 'Working with this team was an exceptional experience...',
          },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          maxLength: 80,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Author name is required'
            }
            return true
          },
          admin: {
            description: 'Author name',
            placeholder: 'John Doe',
          },
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          maxLength: 80,
          validate: (value: any) => {
            if (!value || value.trim().length === 0) {
              return 'Author role is required'
            }
            return true
          },
          admin: {
            description: 'Author role or title',
            placeholder: 'CEO',
          },
        },
        {
          name: 'company',
          type: 'text',
          maxLength: 80,
          admin: {
            description: 'Company name',
            placeholder: 'Acme Corporation',
          },
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Author avatar image',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Rating (1-5 stars)',
            step: 1,
          },
        },
        {
          name: 'date',
          type: 'text',
          maxLength: 50,
          admin: {
            description: 'Testimonial date',
            placeholder: 'January 2024',
          },
        },
        {
          name: 'projectType',
          type: 'text',
          maxLength: 50,
          admin: {
            description: 'Type of project',
            placeholder: 'Web Development',
          },
        },
      ],
      admin: {
        description: 'Add testimonials to display',
        components: {
          RowLabel: '@/blocks/portfolio/Testimonial/RowLabel#TestimonialRowLabel',
        },
      },
    },
    {
      name: 'showRatings',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display star ratings',
      },
    },
  ],
}
