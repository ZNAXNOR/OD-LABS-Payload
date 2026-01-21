# Tree-Shaking Optimization Guide

This guide explains how the project is optimized for tree-shaking and how to maintain these optimizations.

## What is Tree-Shaking?

Tree-shaking is a dead code elimination technique that removes unused code from the final bundle. This reduces bundle size and improves performance.

## Project Optimizations

### 1. Export Structure

All major modules use tree-shaking friendly export patterns:

```typescript
// ✅ Good: Named exports allow tree-shaking
export { Button } from './Button'
export { Card } from './Card'

// ❌ Bad: Barrel exports can prevent tree-shaking
export * from './Button'
export * from './Card'
```

### 2. Lazy Loading

Components and utilities are lazy-loaded when possible:

```typescript
// Lazy-loaded categories for code splitting
export const componentCategories = {
  ui: () => import('./ui'),
  blocks: () => import('./blocks'),
} as const
```

### 3. Side Effects Configuration

The `package.json` includes `sideEffects` configuration:

```json
{
  "sideEffects": ["*.css", "*.scss", "./src/utilities/accessibility.css"]
}
```

### 4. Webpack Optimizations

The Next.js config includes tree-shaking optimizations:

- `usedExports: true` - Mark used exports
- `sideEffects: false` - Enable aggressive tree-shaking
- `concatenateModules: true` - Module concatenation

## Best Practices

### 1. Import Patterns

```typescript
// ✅ Good: Import only what you need
import { Button } from '@/components/ui/Button'
import { loadHeroBlocks } from '@/blocks'

// ❌ Bad: Imports entire module
import * as UI from '@/components/ui'
import { allBlocks } from '@/blocks'
```

### 2. Dynamic Imports

Use dynamic imports for large components:

```typescript
// ✅ Good: Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// ✅ Good: Conditional loading
if (condition) {
  const { heavyFunction } = await import('./heavy-utils')
  heavyFunction()
}
```

### 3. Avoid Side Effects

Keep modules pure to enable tree-shaking:

```typescript
// ✅ Good: Pure module
export function pureFunction(input: string): string {
  return input.toUpperCase()
}

// ❌ Bad: Side effects prevent tree-shaking
console.log('Module loaded') // Side effect
export function impureFunction() {
  /* ... */
}
```

## Monitoring Bundle Size

### 1. Bundle Analyzer

Run the bundle analyzer to check tree-shaking effectiveness:

```bash
pnpm run analyze
```

This opens a visual report showing:

- Bundle sizes by chunk
- Unused code detection
- Import optimization opportunities

### 2. Build Analysis

Check build output for chunk sizes:

```bash
pnpm build
```

Look for:

- Small chunk sizes
- Efficient code splitting
- No duplicate dependencies

## Common Issues

### 1. Barrel Exports

Avoid deep barrel exports that can prevent tree-shaking:

```typescript
// ❌ Problematic: Deep barrel export
export * from './deeply/nested/module'

// ✅ Better: Direct exports
export { specificFunction } from './deeply/nested/module'
```

### 2. Default Exports

Prefer named exports over default exports:

```typescript
// ✅ Good: Named export (tree-shakable)
export const MyComponent = () => <div />

// ❌ Less optimal: Default export
export default () => <div />
```

### 3. Circular Dependencies

Avoid circular dependencies that can break tree-shaking:

```typescript
// ❌ Bad: Circular dependency
// fileA.ts
import { funcB } from './fileB'
export const funcA = () => funcB()

// fileB.ts
import { funcA } from './fileA' // Circular!
export const funcB = () => funcA()
```

## Verification

### 1. Check Bundle Analysis

After making changes, verify tree-shaking effectiveness:

1. Run `pnpm run analyze`
2. Check that unused exports are eliminated
3. Verify chunk sizes are reasonable
4. Look for duplicate dependencies

### 2. Test Imports

Test that imports work correctly:

```typescript
// Test individual imports
import { Button } from '@/components/ui'
import { loadHeroBlocks } from '@/blocks'

// Verify lazy loading works
const blocks = await loadHeroBlocks()
```

### 3. Performance Testing

Monitor performance metrics:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Bundle size impact
- Load time improvements

## Maintenance

### 1. Regular Audits

- Run bundle analysis monthly
- Check for new unused dependencies
- Monitor bundle size growth
- Review import patterns in PRs

### 2. Dependency Updates

When updating dependencies:

- Check if they support tree-shaking
- Verify bundle size impact
- Update import patterns if needed

### 3. Code Reviews

In code reviews, check for:

- Proper import patterns
- Avoiding side effects
- Using lazy loading appropriately
- Following export conventions

## Resources

- [Webpack Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Next.js Bundle Analysis](https://nextjs.org/docs/advanced-features/analyzing-bundles)
- [ES6 Modules and Tree Shaking](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
