# Analysis Tools Migration Guide

This guide helps you update the analysis tools to work with the restructured PayloadCMS project layout.

## What Changed

The analysis tools have been updated to support both legacy and restructured project layouts with automatic path detection.

### Key Improvements

1. **Automatic Path Detection**: The tools now automatically detect your project structure
2. **Flexible Directory Discovery**: Works with both legacy and restructured layouts
3. **Centralized Path Configuration**: All paths are now configurable and auto-detected
4. **Backward Compatibility**: Existing projects continue to work without changes

## Project Structure Support

### Restructured Projects (New)

```
src/
├── blocks/
│   ├── index.ts                    # Combined exports
│   ├── hero/
│   │   └── Hero/
│   │       ├── index.ts           # Block config
│   │       └── Component.tsx      # React component
│   └── content/
├── components/
│   ├── index.ts                   # Combined exports
│   ├── ui/
│   ├── blocks/
│   └── forms/
└── types/
    └── index.ts                   # Centralized types

tests/
├── unit/
├── integration/
├── e2e/
├── performance/
└── property-based/
```

### Legacy Projects (Original)

```
src/
├── blocks/
│   ├── Hero/
│   │   ├── config.ts              # Block config
│   │   └── Component.tsx          # React component
│   └── Content/
├── components/
│   └── [mixed organization]
└── payload-types.ts               # Generated types

tests/
├── unit/
├── int/
├── e2e/
├── performance/
└── pbt/
```

## Migration Steps

### 1. Automatic Detection (Recommended)

The analysis tools automatically detect your project structure. No manual configuration needed!

```bash
# Run analysis - automatically detects structure
npm run analyze

# Or use the simple analysis script
node simple-analysis.mjs
```

### 2. Manual Path Configuration (Advanced)

If you need custom paths, you can configure them:

```typescript
import { PathResolver } from './src/analysis-tools/config/paths'

const pathResolver = new PathResolver({
  blocksDir: 'custom/blocks/path',
  componentsDir: 'custom/components/path',
  testsDir: 'custom/tests/path',
})
```

### 3. Update Custom Scripts

If you have custom scripts that reference hardcoded paths, update them:

```bash
# Run the path update script
npm run update-paths
```

## CLI Usage

The CLI now automatically detects your project structure:

```bash
# Basic analysis (auto-detects paths)
blocks-analyzer analyze

# Override specific paths if needed
blocks-analyzer analyze --blocks-dir custom/blocks --components-dir custom/components

# Verbose output shows detected paths
blocks-analyzer analyze --verbose
```

## Configuration Files

### Path Configuration

Create `src/analysis-tools/config/custom-paths.ts` for custom configurations:

```typescript
import { PathConfig } from './paths'

export const customPaths: PathConfig = {
  projectRoot: process.cwd(),
  blocksDir: 'src/custom-blocks',
  componentsDir: 'src/custom-components',
  // ... other paths
}
```

### Analysis Options

The analysis options remain the same:

```typescript
const options = {
  blockDir: 'auto-detected', // Now auto-detected
  componentDir: 'auto-detected', // Now auto-detected
  includeTests: true,
  compareOfficial: false,
  severity: 'all',
}
```

## Breaking Changes

### None for End Users

The changes are backward compatible. Existing usage continues to work.

### For Tool Developers

If you've extended the analysis tools:

1. **Import Changes**: Path utilities are now in `config/paths`
2. **Discovery Methods**: Updated to support both structures
3. **Configuration**: Use `PathResolver` for path management

## Troubleshooting

### Path Detection Issues

If paths aren't detected correctly:

```bash
# Check detected structure
blocks-analyzer analyze --verbose

# Override paths manually
blocks-analyzer analyze --blocks-dir src/blocks --components-dir src/components
```

### Custom Project Structures

For non-standard structures, create a custom path configuration:

```typescript
import { PathResolver } from './config/paths'

const resolver = new PathResolver({
  blocksDir: 'app/blocks',
  componentsDir: 'app/ui',
  testsDir: 'spec',
})
```

### Legacy Script Updates

Update any scripts that use hardcoded paths:

```bash
# Before (hardcoded)
node analysis.js --blocks src/blocks

# After (auto-detected)
node analysis.js
```

## Validation

Verify the migration worked:

```bash
# 1. Run analysis
npm run analyze

# 2. Check paths are detected correctly
blocks-analyzer analyze --verbose

# 3. Verify all features work
npm test
```

## Support

If you encounter issues:

1. Check the verbose output: `--verbose`
2. Verify your project structure matches expected patterns
3. Use manual path overrides if needed
4. Run the update script: `npm run update-paths`

## Benefits

After migration, you get:

- ✅ Automatic path detection
- ✅ Support for both project structures
- ✅ Improved discovery algorithms
- ✅ Better error handling
- ✅ Flexible configuration options
- ✅ Backward compatibility

The analysis tools now adapt to your project structure automatically, making them more robust and easier to use across different PayloadCMS project layouts.
