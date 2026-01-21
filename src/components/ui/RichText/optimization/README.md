# Image Optimization for RichText Components

This module provides comprehensive image optimization capabilities for the RichText editor and components, including advanced loading strategies, performance monitoring, and responsive image handling.

## Features

### 🚀 Advanced Loading Strategies

- **Lazy Loading**: Load images when they enter the viewport
- **Intersection Observer**: Efficient viewport detection
- **Progressive Loading**: Low-quality placeholder → high-quality image
- **Critical Resource Preloading**: Preload above-the-fold images
- **Bandwidth-Aware Loading**: Adjust quality based on connection speed

### 🖼️ Format Optimization

- **WebP Support**: Modern format with better compression
- **AVIF Support**: Next-generation format for even better compression
- **Automatic Fallbacks**: Graceful degradation to JPEG/PNG
- **Smart Format Selection**: Choose optimal format per device/connection

### 📱 Responsive Image Handling

- **Device-Specific Optimization**: Different settings for mobile/tablet/desktop
- **Breakpoint-Based Loading**: Responsive image sizes
- **Device Pixel Ratio Support**: High-DPI display optimization
- **Container Query Support**: Adapt to container size

### 📊 Performance Monitoring

- **Load Time Tracking**: Monitor image loading performance
- **File Size Analysis**: Track bandwidth usage
- **Format Distribution**: Analyze format usage patterns
- **Optimization Recommendations**: Automated suggestions for improvements

### 🛡️ Error Handling & Reliability

- **Retry Mechanism**: Automatic retry on load failures
- **Error Boundaries**: Graceful error handling
- **Fallback UI**: User-friendly error states
- **Loading States**: Skeleton loaders and progress indicators

## Quick Start

### Basic Usage

```tsx
import { OptimizedImage } from '@/components/RichText/optimization/imageOptimization'

// Basic optimized image
;<OptimizedImage
  resource={mediaResource}
  alt="Optimized image"
  loadingStrategy="intersection"
  enableWebP={true}
  quality={85}
/>
```

### RichText Integration

```tsx
import { RichText } from '@/components/RichText'

// RichText with image optimization
;<RichText
  data={richTextData}
  imageOptimization={{
    strategy: 'performance',
    enableWebP: true,
    enableAVIF: true,
    quality: 85,
    enableBlurPlaceholder: true,
    enablePerformanceMonitoring: true,
  }}
/>
```

## Configuration

### Image Optimization Strategies

#### Performance Strategy

Optimized for maximum performance and fast loading:

```tsx
imageOptimization={{
  strategy: 'performance',
  enableWebP: true,
  enableAVIF: true,
  quality: 75,
  enableBlurPlaceholder: true,
  enableIntersectionObserver: true,
}}
```

#### Quality Strategy

Optimized for maximum image quality:

```tsx
imageOptimization={{
  strategy: 'quality',
  enableWebP: true,
  quality: 95,
  enableBlurPlaceholder: false,
  loadingStrategy: 'lazy',
}}
```

#### Bandwidth-Aware Strategy

Adapts to user's connection speed:

```tsx
imageOptimization={{
  strategy: 'bandwidth-aware',
  enableWebP: true,
  enableAVIF: true,
  enablePerformanceMonitoring: true,
}}
```

### Global Configuration

```tsx
import { initializeImageOptimization } from '@/components/RichText/optimization/imageOptimizationConfig'

// Initialize with custom settings
initializeImageOptimization({
  defaultQuality: 85,
  enableWebP: true,
  enableAVIF: false,
  defaultLoadingStrategy: 'intersection',
  enablePerformanceMonitoring: true,
})
```

### Configuration Presets

```tsx
import { applyConfigPreset } from '@/components/RichText/optimization/imageOptimizationConfig'

// Apply predefined presets
applyConfigPreset('performance') // Maximum performance
applyConfigPreset('quality') // Maximum quality
applyConfigPreset('balanced') // Balanced approach
applyConfigPreset('mobile-first') // Mobile-optimized
applyConfigPreset('development') // Development-friendly
```

## Advanced Usage

### Custom Loading Strategies

```tsx
import { createOptimizedImageConverter } from '@/components/RichText/converters/mediaConverters'

// Create custom image converter
const customImageConverter = createOptimizedImageConverter({
  loadingStrategy: 'progressive',
  enableWebP: true,
  enableAVIF: true,
  quality: 90,
  enablePreload: true,
})

// Use in RichText
<RichText
  data={richTextData}
  customConverters={{
    upload: customImageConverter,
  }}
/>
```

### Performance Monitoring

```tsx
import { useImagePerformanceMonitor } from '@/components/RichText/optimization/imagePerformanceMonitor'

function MyComponent() {
  const { startMonitoring, getInsights } = useImagePerformanceMonitor()

  const handleImageLoad = (src: string) => {
    const monitor = startMonitoring(src, {
      dimensions: { width: 800, height: 600 },
      quality: 85,
      format: 'webp',
    })

    return {
      onComplete: () => monitor.complete(),
      onError: (error: Error) => monitor.error(error),
    }
  }

  const logPerformanceInsights = () => {
    const insights = getInsights()
    console.log('Performance Summary:', insights.summary)
    console.log('Recommendations:', insights.recommendations)
  }

  return (
    <div>
      <OptimizedImage
        src="/example.jpg"
        alt="Example"
        onLoadStart={() => handleImageLoad('/example.jpg')}
      />
      <button onClick={logPerformanceInsights}>Show Performance Insights</button>
    </div>
  )
}
```

### Responsive Configuration

```tsx
import { createResponsiveOptimizedImageConverter } from '@/components/RichText/converters/mediaConverters'

const responsiveConverter = createResponsiveOptimizedImageConverter({
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  qualities: {
    mobile: 70,
    tablet: 80,
    desktop: 85,
    wide: 90,
  },
  formats: ['avif', 'webp', 'jpeg'],
})
```

### Error Handling

```tsx
<OptimizedImage
  src="/example.jpg"
  alt="Example"
  enableRetry={true}
  maxRetries={3}
  onError={(error) => {
    console.error('Image failed to load:', error)
    // Custom error handling
  }}
  errorFallback={
    <div className="custom-error-fallback">
      <p>Failed to load image</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  }
/>
```

## Performance Best Practices

### 1. Choose the Right Strategy

- **Critical images** (above-the-fold): Use `eager` or `critical` strategy
- **Below-the-fold images**: Use `intersection` or `lazy` strategy
- **Gallery images**: Use `performance` strategy with lower quality
- **Hero images**: Use `quality` strategy with preloading

### 2. Optimize for Mobile

```tsx
// Mobile-first configuration
{
  defaultQuality: 70,
  enableAVIF: true,
  enableBlurPlaceholder: true,
  intersectionRootMargin: '100px', // Load earlier on mobile
  enableBandwidthDetection: true,
}
```

### 3. Use Appropriate Formats

- **AVIF**: Best compression, use for modern browsers
- **WebP**: Good compression, wide browser support
- **JPEG**: Fallback for older browsers
- **PNG**: Only for images requiring transparency

### 4. Monitor Performance

```tsx
// Enable performance monitoring in development
{
  enablePerformanceMonitoring: true,
  enableDebugMode: process.env.NODE_ENV === 'development',
  logPerformanceMetrics: true,
}
```

## API Reference

### OptimizedImage Props

| Prop                         | Type                                                   | Default          | Description                |
| ---------------------------- | ------------------------------------------------------ | ---------------- | -------------------------- |
| `resource`                   | `MediaType`                                            | -                | Payload media resource     |
| `src`                        | `string`                                               | -                | Image source URL           |
| `alt`                        | `string`                                               | -                | Alt text for accessibility |
| `loadingStrategy`            | `'lazy' \| 'eager' \| 'progressive' \| 'intersection'` | `'intersection'` | Loading strategy           |
| `enableWebP`                 | `boolean`                                              | `true`           | Enable WebP format         |
| `enableAVIF`                 | `boolean`                                              | `false`          | Enable AVIF format         |
| `quality`                    | `number`                                               | `85`             | Image quality (1-100)      |
| `enableBlurPlaceholder`      | `boolean`                                              | `true`           | Show blur placeholder      |
| `enableIntersectionObserver` | `boolean`                                              | `true`           | Use intersection observer  |
| `enablePreload`              | `boolean`                                              | `false`          | Preload critical images    |
| `criticalResource`           | `boolean`                                              | `false`          | Mark as critical resource  |
| `enableRetry`                | `boolean`                                              | `true`           | Enable retry on error      |
| `maxRetries`                 | `number`                                               | `3`              | Maximum retry attempts     |

### Configuration Options

| Option                        | Type      | Default          | Description                   |
| ----------------------------- | --------- | ---------------- | ----------------------------- |
| `defaultLoadingStrategy`      | `string`  | `'intersection'` | Default loading strategy      |
| `defaultQuality`              | `number`  | `85`             | Default image quality         |
| `enableWebP`                  | `boolean` | `true`           | Enable WebP format globally   |
| `enableAVIF`                  | `boolean` | `false`          | Enable AVIF format globally   |
| `enableBlurPlaceholder`       | `boolean` | `true`           | Enable blur placeholders      |
| `enablePerformanceMonitoring` | `boolean` | `true`           | Enable performance monitoring |
| `maxFileSize`                 | `number`  | `5MB`            | Maximum file size             |
| `maxRetries`                  | `number`  | `3`              | Maximum retry attempts        |

## Browser Support

### Image Formats

- **WebP**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **JPEG/PNG**: Universal support

### Features

- **Intersection Observer**: Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+
- **Performance Observer**: Chrome 52+, Firefox 57+, Safari 11+, Edge 79+

## Troubleshooting

### Common Issues

#### Images not loading

1. Check network connectivity
2. Verify image URLs are accessible
3. Check browser console for errors
4. Ensure proper CORS headers for external images

#### Poor performance

1. Enable performance monitoring to identify bottlenecks
2. Use appropriate loading strategies
3. Optimize image quality settings
4. Consider using AVIF/WebP formats

#### Layout shifts

1. Always provide width/height dimensions
2. Use blur placeholders
3. Reserve space for images with CSS

### Debug Mode

Enable debug mode for detailed logging:

```tsx
{
  enableDebugMode: true,
  logPerformanceMetrics: true,
}
```

## Migration Guide

### From Basic Image Component

```tsx
// Before
<Image src="/example.jpg" alt="Example" width={800} height={600} />

// After
<OptimizedImage
  src="/example.jpg"
  alt="Example"
  width={800}
  height={600}
  loadingStrategy="intersection"
  enableWebP={true}
  quality={85}
/>
```

### From RichText without Optimization

```tsx
// Before
<RichText data={richTextData} />

// After
<RichText
  data={richTextData}
  imageOptimization={{
    strategy: 'balanced',
    enableWebP: true,
    quality: 85,
  }}
/>
```

## Contributing

When contributing to the image optimization module:

1. **Add tests** for new features
2. **Update documentation** for API changes
3. **Consider performance impact** of new features
4. **Test across different devices** and connection speeds
5. **Maintain backward compatibility** when possible

## License

This module is part of the larger project and follows the same license terms.
