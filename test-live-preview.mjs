// Test the live preview URL generation
import { generateServicesPagesPreviewUrl } from './src/utilities/livePreview.ts'

// Test with the actual document data
const testDoc = {
  id: 1,
  title: 'Web Devlpoment',
  slug: 'web-dev',
  serviceType: 'web-dev',
  _status: 'published',
}

console.log('Testing generateServicesPagesPreviewUrl:')
console.log('Input doc:', testDoc)
console.log('Generated URL:', generateServicesPagesPreviewUrl(testDoc))
console.log('Expected URL: http://localhost:3000/services/web-dev')

// Test with empty doc
console.log('\nTesting with empty doc:')
console.log('Generated URL:', generateServicesPagesPreviewUrl({}))
console.log('Expected URL: http://localhost:3000/services')

// Test with null doc
console.log('\nTesting with null doc:')
console.log('Generated URL:', generateServicesPagesPreviewUrl(null))
console.log('Expected URL: http://localhost:3000/services')
