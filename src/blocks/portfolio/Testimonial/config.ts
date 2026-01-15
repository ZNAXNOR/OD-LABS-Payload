import type { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  labels: {
    singular: 'Testimonial Block',
    plural: 'Testimonial Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading for the testimonials section',
        placeholder: 'What Our Clients Say',
      },
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
      defaultValue: 'grid',
      required: true,
      admin: {
        description: 'Layout style for displaying testimonials',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
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
          admin: {
            description: 'Testimonial quote',
            placeholder: 'Working with this team was an exceptional experience...',
          },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          admin: {
            description: 'Author name',
            placeholder: 'John Doe',
          },
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: {
            description: 'Author role or title',
            placeholder: 'CEO',
          },
        },
        {
          name: 'company',
          type: 'text',
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
          admin: {
            description: 'Testimonial date',
            placeholder: 'January 2024',
          },
        },
        {
          name: 'projectType',
          type: 'text',
          admin: {
            description: 'Type of project',
            placeholder: 'Web Development',
          },
        },
      ],
      admin: {
        description: 'Add testimonials to display',
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
