import type { CollectionBeforeChangeHook } from 'payload'

export const populateCompanyInfo: CollectionBeforeChangeHook = async ({ data, req }) => {
  try {
    const contact = await req.payload.findGlobal({
      slug: 'contact',
    })

    // Get the first office
    const mainOffice = contact.offices?.[0] || ({} as any)

    // Format address
    const addressParts = [
      mainOffice.street,
      mainOffice.city,
      mainOffice.state,
      mainOffice.postalCode,
      mainOffice.country,
    ].filter(Boolean)

    const companyAddress = addressParts.join(', ')

    // Format contact
    const contactParts = [contact.phone, contact.email].filter(Boolean)
    const companyContact = contactParts.join(' | ')

    return {
      ...data,
      websiteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com',
      websiteName: process.env.NEXT_PUBLIC_SITE_NAME || 'OD LABS',
      companyAddress: companyAddress || '123 Innovation Drive, Tech City, CA 94000, USA',
      companyContact: companyContact || '+1 (555) 0123-4567 | info@example.com',
    }
  } catch (error) {
    console.warn('Error populating company info:', error)
    return data
  }
}
