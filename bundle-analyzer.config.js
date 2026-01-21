// Bundle analyzer configuration for monitoring tree-shaking effectiveness
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

module.exports = withBundleAnalyzer

// Usage: ANALYZE=true pnpm build
// This will generate a bundle analysis report showing:
// - Bundle sizes by chunk
// - Tree-shaking effectiveness
// - Unused code detection
// - Import optimization opportunities
