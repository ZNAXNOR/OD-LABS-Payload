# Database Identifier Guidelines

This document provides comprehensive guidelines for maintaining PostgreSQL identifier length compliance in Payload CMS configurations.

## Overview

PostgreSQL has a 63-character limit for database identifiers (table names, column names, enum names, etc.). Payload CMS automatically generates these identifiers from your configuration, and deeply nested field structures can easily exceed this limit.

## Quick Reference

### ✅ Do's

- **Use `dbName` properties** for nested fields deeper than 2-3 levels
- **Use snake_case naming** for all `dbName` properties
- **Keep identifiers meaningful** but concise
- **Run validation regularly** during development
- **Test with real data** to ensure migrations work

### ❌ Don'ts

- **Don't ignore validation warnings** - they prevent production issues
- **Don't use camelCase** in `dbName` properties
- **Don't make identifiers too cryptic** - maintain readability
- **Don't skip testing migrations** with existing data

## Naming Conventions

### Snake Case Format

All `dbName` properties should use snake_case:

```typescript
// ✅ Good
{
  name: 'featuredImage',
  type: 'upload',
  dbName: 'featured_img', // snake_case
}

// ❌ Bad
{
  name: 'featuredImage',
  type: 'upload',
  dbName: 'featuredImage', // camelCase
}
```

### Abbreviation Guidelines

Use these standard abbreviations to keep identifiers short:

| Original        | Abbreviation | Example Usage  |
| --------------- | ------------ | -------------- |
| `description`   | `desc`       | `meta_desc`    |
| `navigation`    | `nav`        | `header_nav`   |
| `featured`      | `feat`       | `feat_post`    |
| `reference`     | `ref`        | `author_ref`   |
| `configuration` | `config`     | `site_config`  |
| `information`   | `info`       | `contact_info` |
| `background`    | `bg`         | `hero_bg`      |
| `thumbnail`     | `thumb`      | `img_thumb`    |
| `category`      | `cat`        | `post_cat`     |
| `metadata`      | `meta`       | `seo_meta`     |
| `attributes`    | `attrs`      | `prod_attrs`   |
| `settings`      | `opts`       | `user_opts`    |
| `statistics`    | `stats`      | `page_stats`   |
| `performance`   | `perf`       | `site_perf`    |

## When to Use `dbName`

### Required Scenarios

1. **Deep Nesting (3+ levels)**

   ```typescript
   // Without dbName: header_tabs_dropdown_nav_items_featured_link_links_link_type (67 chars)
   // With dbName: header_tabs_dropdown_nav_feat_links_type (43 chars)
   ```

2. **Long Field Names**

   ```typescript
   {
     name: 'personalInformation',
     dbName: 'personal_info', // Prevents long identifiers
   }
   ```

3. **Array Fields with Complex Items**
   ```typescript
   {
     name: 'navigationItems',
     type: 'array',
     dbName: 'nav_items',
     fields: [
       {
         name: 'featuredContent',
         dbName: 'feat_content',
       }
     ]
   }
   ```

### Optional but Recommended

1. **Enum Fields with Long Paths**
2. **Group Fields in Arrays**
3. **Relationship Fields in Deep Structures**

## Configuration Examples

### Global Configuration

```typescript
export const Header: GlobalConfig = {
  slug: 'header',
  dbName: 'header', // Root level naming
  fields: [
    {
      name: 'navigationTabs',
      type: 'array',
      dbName: 'nav_tabs', // Shorten array name
      fields: [
        {
          name: 'dropdownContent',
          type: 'group',
          dbName: 'dropdown', // Strategic interruption
          fields: [
            {
              name: 'navigationItems',
              type: 'array',
              dbName: 'nav_items', // Further shortening
              fields: [
                {
                  name: 'featuredLink',
                  type: 'group',
                  dbName: 'feat_link', // Abbreviation
                  fields: [
                    // Nested fields inherit shorter path
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### Block Configuration

```typescript
export const ServicesBlock: Block = {
  slug: 'servicesGrid',
  dbName: 'svc_grid', // Abbreviated root
  fields: [
    {
      name: 'services',
      type: 'array',
      dbName: 'services', // Keep semantic meaning
      fields: [
        {
          name: 'serviceFeatures',
          type: 'array',
          dbName: 'features', // Simplify nested arrays
          fields: [
            {
              name: 'featureDescription',
              type: 'textarea',
              dbName: 'desc', // Abbreviate leaf fields
            },
          ],
        },
      ],
    },
  ],
}
```

### Collection Configuration

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  dbName: 'posts', // Explicit naming
  fields: [
    {
      name: 'contentBlocks',
      type: 'blocks',
      dbName: 'content', // Shorten blocks field
      blocks: [
        // Block configurations with their own dbName properties
      ],
    },
    {
      name: 'seoMetadata',
      type: 'group',
      dbName: 'seo_meta', // Group abbreviation
      fields: [
        {
          name: 'socialMediaSettings',
          type: 'group',
          dbName: 'social', // Nested group shortening
        },
      ],
    },
  ],
}
```

## Development Workflow

### 1. Real-Time Validation

Enable development warnings in your `payload.config.ts`:

```typescript
import { createDevelopmentMiddleware } from './src/utilities/validation/developmentWarnings'

const developmentMiddleware = createDevelopmentMiddleware({
  maxLength: 50, // Warn before PostgreSQL limit
  enforceSnakeCase: true,
  warnMissingDbName: true,
})

export default buildConfig({
  // ... other config
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'development') {
      const warnings = developmentMiddleware.validateConfig(payload.config)
      if (warnings.length > 0) {
        console.log('⚠️ Identifier warnings found:')
        warnings.forEach((w) => console.log(`  ${w.path}: ${w.message}`))
      }
    }
  },
})
```

### 2. Pre-Commit Validation

The pre-commit hook automatically runs identifier validation:

```bash
# Runs automatically on git commit
git commit -m "Add new field configuration"

# Manual validation
pnpm run validate:identifiers
```

### 3. Build-Time Integration

Validation runs automatically during builds:

```bash
# Development build (warnings only)
pnpm run build

# Strict validation (fails on warnings)
pnpm run validate:identifiers:strict
```

### 4. IDE Integration

For VSCode users, install the Payload CMS extension for real-time warnings in your editor.

## Validation Commands

### Available Scripts

```bash
# Basic validation
pnpm run validate:identifiers

# Verbose output with suggestions
pnpm run validate:identifiers:verbose

# Strict mode (fails on warnings)
pnpm run validate:identifiers:strict

# Custom configuration
node scripts/validate-identifiers.js --config ./custom.config.ts --verbose
```

### Environment-Specific Validation

```bash
# Development (verbose, no failure on warnings)
NODE_ENV=development pnpm run validate:identifiers

# Production (strict, fails on warnings)
NODE_ENV=production pnpm run validate:identifiers

# CI/CD (optimized for pipelines)
NODE_ENV=ci pnpm run validate:identifiers
```

## Migration Considerations

### Safe Migration Practices

1. **Test Locally First**

   ```bash
   # Run validation before migration
   pnpm run validate:identifiers:strict

   # Generate and test migration
   pnpm run payload migrate:create
   ```

2. **Backup Production Data**

   ```bash
   # Always backup before applying identifier changes
   pg_dump your_database > backup_before_identifiers.sql
   ```

3. **Gradual Rollout**
   - Apply changes to staging environment first
   - Test all functionality with real data
   - Monitor for any issues before production deployment

### Migration Script Example

```typescript
// migrations/20240101_identifier_optimization.ts
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Rename tables/columns to use optimized identifiers
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "header_tabs_dropdown_nav_items_featured_link_links" 
    RENAME TO "header_nav_feat_links";
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Rollback changes
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "header_nav_feat_links" 
    RENAME TO "header_tabs_dropdown_nav_items_featured_link_links";
  `)
}
```

## Troubleshooting

### Common Issues

1. **"Identifier too long" errors**
   - Add `dbName` properties to nested fields
   - Use abbreviations from the guidelines above
   - Break up deeply nested structures

2. **Migration failures**
   - Check for existing data conflicts
   - Ensure all references are updated
   - Test rollback procedures

3. **Type generation issues**
   - Run `pnpm run generate:types` after identifier changes
   - Clear TypeScript cache if needed
   - Restart your development server

### Getting Help

1. **Run verbose validation**

   ```bash
   pnpm run validate:identifiers:verbose
   ```

2. **Check validation reports**

   ```bash
   # Reports are generated in ./validation-reports/
   ls -la validation-reports/
   ```

3. **Enable development warnings**
   - Add development middleware to your config
   - Check browser console for real-time warnings
   - Use IDE extensions for inline warnings

## Best Practices Summary

1. **Plan Ahead**: Consider identifier length when designing field structures
2. **Use Validation**: Run validation regularly during development
3. **Test Migrations**: Always test identifier changes with real data
4. **Document Changes**: Keep track of `dbName` rationale in comments
5. **Monitor Production**: Watch for any issues after deploying identifier changes
6. **Stay Consistent**: Use the same abbreviation patterns across your project
7. **Review Regularly**: Audit identifier usage as your schema evolves

## Resources

- [PostgreSQL Identifier Documentation](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
- [Payload CMS Field Documentation](https://payloadcms.com/docs/fields/overview)
- [Database Migration Guide](./MIGRATION.md)
- [Validation Configuration Reference](../validation.config.js)
