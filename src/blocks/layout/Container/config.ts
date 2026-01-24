import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import {
  structuralFeatures,
  basicTextFeatures,
  alignmentFeatures,
  headingFeatures,
  listFeatures,
  enhancedLinkFeature,
} from '@/fields/richTextFeatures'

// Import rich text features

/**
 * ContainerBlock - A styling wrapper block for layout control
 *
 * This block provides a container with configurable styling options including:
 * - Maximum width constraints
 * - Background colors and images
 * - Padding and margin controls
 *
 * Note: This block previously had a nested blocks field which caused circular
 * reference issues and "Cannot read properties of undefined (reading 'map')" errors.
 * The empty blocks array (blocks: []) caused Payload's block processing system to fail
 * when attempting to validate and map over the nested blocks.
 *
 * It now uses a simple richText content field instead. For complex layouts with multiple
 * blocks, use multiple blocks in sequence at the collection level rather than nesting
 * them inside this container.
 *
 * Example usage:
 * - Add a ContainerBlock for styling (background, padding, etc.)
 * - Add content blocks after it (ContentBlock, MediaBlock, etc.)
 * - Add another ContainerBlock to change styling for the next section
 */
export const ContainerBlock: Block = {
  slug: 'container',
  dbName: 'container', // Root level optimization
  interfaceName: 'ContainerBlock',
  labels: {
    singular: 'Container Block',
    plural: 'Container Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Content to display inside the container with enhanced formatting',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }: { rootFeatures: any[] }) => [
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          ...rootFeatures,
          ...structuralFeatures,
          ...basicTextFeatures,
          ...alignmentFeatures,
          ...headingFeatures,
          ...listFeatures,
          ...enhancedLinkFeature,
        ],
      }),
    },
    {
      name: 'maxWidth',
      type: 'select',
      dbName: 'max_width', // Snake case conversion
      options: [
        { label: 'Small (640px)', value: 'sm' },
        { label: 'Medium (768px)', value: 'md' },
        { label: 'Large (1024px)', value: 'lg' },
        { label: 'Extra Large (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: 'Full Width', value: 'full' },
      ],
      defaultValue: 'xl',
      required: true,
      admin: {
        description: 'Maximum width of the container',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      dbName: 'bg_color', // Abbreviation + snake case
      options: [
        { label: 'None', value: 'none' },
        { label: 'White', value: 'white' },
        { label: 'Zinc 50', value: 'zinc-50' },
        { label: 'Zinc 100', value: 'zinc-100' },
        { label: 'Zinc 900', value: 'zinc-900' },
        { label: 'Brand Primary', value: 'brand-primary' },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Background color for the container',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image',
      },
    },
    {
      name: 'paddingTop',
      type: 'select',
      dbName: 'padding_top', // Snake case conversion
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Top padding',
      },
    },
    {
      name: 'paddingBottom',
      type: 'select',
      dbName: 'padding_bottom', // Snake case conversion
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Bottom padding',
      },
    },
    {
      name: 'marginTop',
      type: 'select',
      dbName: 'margin_top', // Snake case conversion
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'none',
      required: true,
      admin: {
        description: 'Top margin',
      },
    },
    {
      name: 'marginBottom',
      type: 'select',
      dbName: 'margin_bottom', // Snake case conversion
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'none',
      required: true,
      admin: {
        description: 'Bottom margin',
      },
    },
  ],
}
