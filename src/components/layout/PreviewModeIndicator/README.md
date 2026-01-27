# PreviewModeIndicator Component

A comprehensive visual indicator for PayloadCMS Live Preview mode that displays preview status, performance metrics, error information, and debugging tools.

## Features

- **Visual Preview Status**: Shows when preview mode is active with real-time connection status
- **Performance Metrics**: Displays update timing, success rates, and performance trends
- **Error Display**: Shows current errors, error history, and debugging information
- **Developer Panel**: Advanced controls for debugging and configuration
- **Responsive Design**: Adapts to different screen sizes and devices
- **Customizable Position**: Can be positioned in any corner of the screen
- **Compact Mode**: Collapsible interface for minimal screen real estate usage

## Basic Usage

```tsx
import { PreviewModeIndicator } from '@/components/layout/PreviewModeIndicator'

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <PreviewModeIndicator />
    </div>
  )
}
```

## Advanced Usage

```tsx
import { PreviewModeIndicator } from '@/components/layout/PreviewModeIndicator'

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <PreviewModeIndicator
        position="top-right"
        showMetrics={true}
        showErrors={true}
        showDebugInfo={true}
        compact={false}
        enablePerformanceCharts={true}
        enableDeveloperMode={process.env.NODE_ENV === 'development'}
        className="custom-preview-indicator"
      />
    </div>
  )
}
```

## Props

| Prop                      | Type                                                           | Default          | Description                     |
| ------------------------- | -------------------------------------------------------------- | ---------------- | ------------------------------- |
| `className`               | `string`                                                       | `undefined`      | Additional CSS classes          |
| `position`                | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Screen position                 |
| `showMetrics`             | `boolean`                                                      | `true`           | Show performance metrics        |
| `showErrors`              | `boolean`                                                      | `true`           | Show error information          |
| `showDebugInfo`           | `boolean`                                                      | `false`          | Show detailed debug information |
| `compact`                 | `boolean`                                                      | `false`          | Use compact collapsible mode    |
| `enablePerformanceCharts` | `boolean`                                                      | `false`          | Show performance trend charts   |
| `enableDeveloperMode`     | `boolean`                                                      | `false`          | Enable developer panel          |

## Components

### PerformanceMetrics

Displays detailed performance information including:

- Update count and timing
- Success rate calculation
- Performance status indicators
- Trend analysis
- Real-time event tracking

### ErrorDisplay

Shows error information including:

- Current errors from preview state
- Error history with timestamps
- Concurrent editing warnings
- Debug information export
- Stack traces (when enabled)

### DeveloperPanel

Advanced debugging tools including:

- Manual refresh controls
- Real-time update toggles
- Configuration adjustments
- Session information
- Performance summaries

## Styling

The component uses Tailwind CSS classes and follows the existing design system. It includes:

- Responsive breakpoints for mobile, tablet, and desktop
- Backdrop blur effects for better readability
- Color-coded status indicators
- Smooth transitions and animations

## Integration with LivePreview Provider

The component automatically integrates with the `LivePreviewProvider` context to:

- Display current preview state
- Show performance metrics
- Handle error states
- Provide session management controls

## Development Mode

When `enableDeveloperMode` is true, additional features are available:

- Configuration adjustments (debounce timing, retry settings)
- Session information display
- Manual refresh controls
- Debug information export
- Console logging controls

## Accessibility

The component includes:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly text
- High contrast color schemes
- Responsive text sizing

## Browser Support

- Modern browsers with ES2020+ support
- CSS Grid and Flexbox support required
- Clipboard API for debug information export
- Performance API for timing measurements
