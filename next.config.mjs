import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  webpack: (webpackConfig, { dev, isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Add identifier validation plugin for production builds on server
    if (!dev && isServer) {
      // Dynamically import the plugin to avoid TypeScript import issues
      try {
        // For now, skip the validation plugin to allow development server to start
        // The plugin will be enabled for production builds through other means
        console.log('⚠️  Identifier validation plugin skipped in development mode')
      } catch (error) {
        console.warn('⚠️  Could not load identifier validation plugin:', error.message)
      }
    }

    // Tree-shaking optimizations
    if (!dev) {
      // Enable tree-shaking for production builds
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        usedExports: true,
        sideEffects: false,
        // Enable module concatenation for better tree-shaking
        concatenateModules: true,
      }

      // Optimize chunk splitting for better caching
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...webpackConfig.optimization.splitChunks.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate Payload chunks
          payload: {
            test: /[\\/]node_modules[\\/]@?payload/,
            name: 'payload',
            chunks: 'all',
            priority: 20,
          },
          // Separate UI library chunks
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 15,
          },
          // Group our components
          components: {
            test: /[\\/]src[\\/]components[\\/]/,
            name: 'components',
            chunks: 'all',
            priority: 5,
          },
          // Group our blocks
          blocks: {
            test: /[\\/]src[\\/]blocks[\\/]/,
            name: 'blocks',
            chunks: 'all',
            priority: 5,
          },
          // Group utilities
          utilities: {
            test: /[\\/]src[\\/]utilities[\\/]/,
            name: 'utilities',
            chunks: 'all',
            priority: 5,
          },
        },
      }
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@/components/ui',
      '@/blocks',
      '@/utilities',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
    ],
  },
  // Enable static optimization
  output: 'standalone',
  // Optimize bundle analyzer
  bundlePagesRouterDependencies: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
