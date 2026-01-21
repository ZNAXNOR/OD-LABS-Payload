// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Mock CSS/SCSS imports
import { vi } from 'vitest'

// Add testing library matchers
import '@testing-library/jest-dom'

// Add jest-axe matchers
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock all CSS/SCSS imports
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
vi.mock('**/*.scss', () => ({}))
vi.mock('**/*.css', () => ({}))

// Mock PayloadCMS UI components that might cause issues
vi.mock('@payloadcms/ui', () => ({
  useField: vi.fn(() => ({ value: '', setValue: vi.fn() })),
  useConfig: vi.fn(() => ({ config: {} })),
  useDocumentInfo: vi.fn(() => ({ id: '1', collection: 'test' })),
  useLocale: vi.fn(() => 'en'),
  useTranslation: vi.fn(() => ({ t: (key: string) => key, i18n: {} })),
  usePayload: vi.fn(() => ({ getLocal: vi.fn(), getByID: vi.fn() })),
}))

// Mock complex components that might have SCSS dependencies
vi.mock('@/blocks/MediaBlock/Component', () => ({
  MediaBlock: vi.fn(({ children, ...props }) =>
    // Return a simple div for testing
    ({ type: 'div', props: { ...props, 'data-testid': 'media-block' }, children }),
  ),
}))

vi.mock('@/components/Media', () => ({
  Media: vi.fn(({ resource, ...props }) => ({
    type: 'img',
    props: { ...props, src: resource?.url, alt: resource?.alt, 'data-testid': 'media' },
  })),
}))

vi.mock('@/utilities/ui', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))
