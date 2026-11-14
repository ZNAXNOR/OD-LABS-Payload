import PageTemplate, { generateMetadata } from './[slug]/page'

// Keep the homepage on the same ISR cadence as published CMS pages.
export const revalidate = 3600

export default PageTemplate

export { generateMetadata }
