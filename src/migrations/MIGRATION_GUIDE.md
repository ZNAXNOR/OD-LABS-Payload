# Database Identifier Optimization Migration Guide

## Overview

This guide covers the database identifier optimization migration that addresses PostgreSQL's 63-character identifier length limitations in Payload CMS. The migration systematically renames long database identifiers to shorter, semantically meaningful names while preserving data integrity.

## Migration Details

### Migration File

- **File**: `20260122_140000_identifier_optimization.ts`
- **Purpose**: Rename database identifiers to comply with PostgreSQL limits
- **Safety**: Includes complete rollback capability

### What Gets Renamed

#### Enum Types

The migration renames enum types that exceed or approach PostgreSQL's 63-character limit:

**Hero Block Enums:**

- `enum_pages_blocks_hero_code_snippet_language` → `enum_pages_hero_code_lang`
- `enum_pages_blocks_hero_code_snippet_theme` → `enum_pages_hero_code_theme`
- `enum_pages_blocks_hero_split_layout_content_side` → `enum_pages_hero_split_side`
- `enum_pages_blocks_hero_split_layout_media_type` → `enum_pages_hero_split_media`
- `enum_pages_blocks_hero_gradient_config_animation` → `enum_pages_hero_grad_anim`
- `enum_pages_blocks_hero_settings_overlay_color` → `enum_pages_hero_overlay_color`

**Content Block Enums:**

- `enum_pages_blocks_content_columns_background_color` → `enum_pages_content_col_bg`
- `enum_pages_blocks_content_columns_padding` → `enum_pages_content_col_pad`

**Tech Stack Enums:**

- `enum_pages_blocks_tech_stack_technologies_category` → `enum_pages_tech_cat`
- `enum_pages_blocks_tech_stack_technologies_proficiency` → `enum_pages_tech_prof`

**Container Enums:**

- `enum_pages_blocks_container_max_width` → `enum_pages_container_width`
- `enum_pages_blocks_container_background_color` → `enum_pages_container_bg`
- `enum_pages_blocks_container_padding_top` → `enum_pages_container_pad_top`
- `enum_pages_blocks_container_padding_bottom` → `enum_pages_container_pad_bot`
- `enum_pages_blocks_container_margin_top` → `enum_pages_container_mar_top`
- `enum_pages_blocks_container_margin_bottom` → `enum_pages_container_mar_bot`

_And many more across all collections (pages, blogs, services) and their version tables..._

#### Table Names

The migration also renames table identifiers:

- `pages_blocks_hero_gradient_config_colors` → `pages_hero_grad_colors`
- `pages_blocks_services_grid_services_features` → `pages_svc_grid_svc_feat`
- `pages_blocks_services_grid_services` → `pages_svc_grid_services`
- `pages_blocks_tech_stack_technologies` → `pages_tech_stack_tech`
- `pages_blocks_pricing_table_tiers_features` → `pages_price_tier_feat`
- `pages_blocks_project_showcase_projects_technologies` → `pages_proj_show_proj_tech`

_And more..._

## Pre-Migration Checklist

### 1. Backup Your Database

**CRITICAL**: Always backup your database before running migrations.

```bash
# PostgreSQL backup
pg_dump -h localhost -U username -d database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using Payload CLI if available
payload backup
```

### 2. Test in Development Environment

Run the migration in a development environment first:

```bash
# Test the migration
npx tsx src/migrations/testMigration.ts

# Run migration in development
payload migrate
```

### 3. Verify Application Compatibility

Ensure your application code doesn't directly reference the old identifier names in:

- Raw SQL queries
- Database constraints
- Custom database operations
- External tools or scripts

## Running the Migration

### Using Payload CLI

```bash
# Run all pending migrations
payload migrate

# Run specific migration (if needed)
payload migrate --name 20260122_140000_identifier_optimization
```

### Manual Execution

If you need to run the migration manually:

```typescript
import { up } from './src/migrations/20260122_140000_identifier_optimization'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
await up({ db: payload.db })
```

## Rollback Procedure

If you need to rollback the migration:

### Using Payload CLI

```bash
# Rollback the last migration
payload migrate:down

# Rollback specific migration
payload migrate:down --name 20260122_140000_identifier_optimization
```

### Manual Rollback

```typescript
import { down } from './src/migrations/20260122_140000_identifier_optimization'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
await down({ db: payload.db })
```

## Verification Steps

### 1. Check Migration Status

```bash
# Verify migration was applied
payload migrate:status
```

### 2. Verify Database Schema

Connect to your database and verify the renamed identifiers:

```sql
-- Check enum types
SELECT typname FROM pg_type WHERE typname LIKE 'enum_pages_hero_%';

-- Check table names
SELECT tablename FROM pg_tables WHERE tablename LIKE 'pages_hero_%';
```

### 3. Test Application Functionality

- Start your application
- Test all major features
- Verify admin panel functionality
- Check that all blocks render correctly
- Test content creation and editing

## Troubleshooting

### Migration Fails

1. **Check PostgreSQL version compatibility**
   - Ensure you're using PostgreSQL 12+
   - Verify user permissions for ALTER operations

2. **Identifier conflicts**
   - Check for existing identifiers with the new names
   - Verify no custom constraints use the old names

3. **Transaction issues**
   - Ensure no long-running transactions are blocking
   - Check for active connections to the database

### Application Issues After Migration

1. **Clear application caches**
   - Restart your application
   - Clear any ORM/database caches

2. **Regenerate types**

   ```bash
   payload generate:types
   ```

3. **Check for hardcoded references**
   - Search codebase for old identifier names
   - Update any raw SQL queries

### Rollback Issues

1. **Verify rollback SQL**
   - Check that all operations are reversible
   - Ensure no data was lost during forward migration

2. **Manual cleanup**
   - If automatic rollback fails, manually rename identifiers
   - Use the migration file as a reference for original names

## Performance Considerations

### Migration Execution Time

- **Enum renames**: Very fast (milliseconds per operation)
- **Table renames**: Fast (seconds per table, depending on size)
- **Total estimated time**: 1-5 minutes for typical installations

### Database Locks

- **ALTER TYPE**: Brief exclusive locks on enum types
- **ALTER TABLE**: Brief exclusive locks on tables
- **Impact**: Minimal downtime (seconds)

### Recommendations

- Run during low-traffic periods
- Monitor database performance during migration
- Have rollback plan ready

## Post-Migration Tasks

### 1. Update Documentation

- Update any documentation referencing old identifier names
- Update database schema documentation
- Update development setup guides

### 2. Update Monitoring

- Update any monitoring queries using old names
- Update database performance dashboards
- Update backup/restore procedures

### 3. Team Communication

- Notify team members of the changes
- Update development environment setup
- Share this migration guide

## Testing the Migration

### Automated Tests

Run the migration test suite:

```bash
# Test migration logic
npx tsx src/migrations/testMigration.ts

# Run application tests
npm test
```

### Manual Testing

1. **Content Management**
   - Create new pages/blogs/services
   - Edit existing content
   - Test all block types

2. **Admin Panel**
   - Verify all collections load
   - Test field editing
   - Check relationship fields

3. **Frontend**
   - Verify content renders correctly
   - Test all page types
   - Check block functionality

## Support and Recovery

### If Something Goes Wrong

1. **Stop the application immediately**
2. **Restore from backup**
3. **Investigate the issue**
4. **Contact support if needed**

### Emergency Contacts

- Database Administrator: [Contact Info]
- DevOps Team: [Contact Info]
- Development Team Lead: [Contact Info]

### Recovery Procedures

1. **Database restore from backup**
2. **Application rollback to previous version**
3. **Gradual re-deployment with fixes**

## Appendix

### Complete List of Renamed Identifiers

See the migration file `20260122_140000_identifier_optimization.ts` for the complete list of all renamed identifiers.

### Migration Testing Results

Run `npx tsx src/migrations/testMigration.ts` to see detailed test results including:

- Identifier length compliance
- Circular rename detection
- Duplicate name detection
- Rollback capability verification

### Related Documentation

- [PostgreSQL Identifier Limits](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
- [Payload CMS Migrations](https://payloadcms.com/docs/database/migrations)
- [Database Backup Best Practices](docs/database-backup.md)
