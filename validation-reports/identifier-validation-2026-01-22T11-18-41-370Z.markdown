# Database Identifier Analysis Report

## Summary

- **Total Configurations**: 5
- **Total Violations**: 6
- **Critical Violations**: 4
- **Warning Violations**: 2
- **Configurations with Issues**: 1

## Most Problematic Configurations

- **header** (global): 4 critical violations

## Violations by Type

- **Collections**: 0 violations
- **Globals**: 6 violations
- **Blocks**: 0 violations

## Recommendations

- 4 critical identifier length violations must be fixed
- 2 identifiers are approaching the length limit
- 1 configurations have deep nesting that may cause issues


## Fix Suggestions

### 1. header

**Field:** `navigationTabs.dropdownContent.navigationItems.featuredLink.links`

**Issue:** The field path "navigationTabs.dropdownContent.navigationItems.featuredLink.links" generates a 76-character identifier "header_navigation_tabs_dropdown_content_navigation_items_featured_link_links" which exceeds PostgreSQL's 63-character limit. Adding dbName: 'links' reduces the identifier length by 71 characters while preserving semantic meaning.

**Recommended Fix:**

```typescript
{
  name: 'links',
  type: 'array',
  dbName: 'links', // Fixes identifier length violation
  // ... other field properties
}
```

### 2. header

**Field:** `navigationTabs.dropdownContent.navigationItems.featuredLink.links.link`

**Issue:** The field path "navigationTabs.dropdownContent.navigationItems.featuredLink.links.link" generates a 74-character identifier "navigation_tabs_dropdown_content_navigation_items_featured_link_links_link" which exceeds PostgreSQL's 63-character limit. Adding dbName: 'link' reduces the identifier length by 70 characters while preserving semantic meaning.

**Recommended Fix:**

```typescript
{
  name: 'link',
  type: 'group',
  dbName: 'link', // Fixes identifier length violation
  // ... other field properties
}
```

### 3. header

**Field:** `navigationTabs.dropdownContent.navigationItems.featuredLink.links.link.type`

**Issue:** The field path "navigationTabs.dropdownContent.navigationItems.featuredLink.links.link.type" generates a 79-character identifier "navigation_tabs_dropdown_content_navigation_items_featured_link_links_link_type" which exceeds PostgreSQL's 63-character limit. Adding dbName: 'type' reduces the identifier length by 75 characters while preserving semantic meaning.

**Recommended Fix:**

```typescript
{
  name: 'type',
  type: 'radio',
  dbName: 'type', // Fixes identifier length violation
  // ... other field properties
}
```

### 4. header

**Field:** `navigationTabs.dropdownContent.navigationItems.featuredLink.links.link.url`

**Issue:** The field path "navigationTabs.dropdownContent.navigationItems.featuredLink.links.link.url" generates a 78-character identifier "navigation_tabs_dropdown_content_navigation_items_featured_link_links_link_url" which exceeds PostgreSQL's 63-character limit. Adding dbName: 'url' reduces the identifier length by 75 characters while preserving semantic meaning.

**Recommended Fix:**

```typescript
{
  name: 'url',
  type: 'text',
  dbName: 'url', // Fixes identifier length violation
  // ... other field properties
}
```


## Performance Metrics

- **Total Time:** 0ms
- **Analysis Time:** 0ms
- **Suggestion Time:** 0ms
- **Configurations Analyzed:** 5
- **Fields Analyzed:** 17
