# Design Document: Services Collection Map Error Fix

## Overview

This design addresses the "Cannot read properties of undefined (reading 'map')" error in the Services collection by fixing the ContainerBlock's circular reference issue. The root cause is that ContainerBlock has a nested `blocks` field initialized with an empty array (`blocks: []`), which causes Payload's block processing system to fail when it attempts to map over undefined values during configuration validation.

The solution involves removing the nested blocks functionality from ContainerBlock, as it creates unnecessary complexity and circular reference risks. Instead, we'll rely on Payload's native block composition at the collection level, which is the recommended approach for building flexible layouts.

## Architecture

### Current Architecture (Problematic)

```
Services Collection
  └─ Layout Blocks Field
      ├─ ContainerBlock (has nested blocks: [])
      │   └─ Nested Blocks Field (empty array causes map error)
      ├─ DividerBlock
      ├─ SpacerBlock
      └─ Other Content Blocks
```

**Problem:** When Payload processes the ContainerBlock, it encounters the empty `blocks: []` array and attempts to map over it or validate its contents. Since the array is empty and not properly initialized with block references, Payload's internal processing fails with a map error.

### Proposed Architecture (Fixed)

```
Services Collection
  └─ Layout Blocks Field
      ├─ ContainerBlock (styling/layout wrapper only)
      │   └─ No nested blocks field
      ├─ DividerBlock
      ├─ SpacerBlock
      └─ Other Content Blocks
```

**Solution:** Remove the nested blocks field from ContainerBlock entirely. Users can achieve the same layout goals by:

1. Using multiple blocks in sequence at the collection level
2. Using the ContainerBlock purely for styling (background, padding, margins, max-width)
3. Grouping related blocks visually through the admin UI

## Components and Interfaces

### 1. ContainerBlock Configuration

**File:** `src/blocks/layout/Container/config.ts`

**Current Implementation (Problematic):**

```typescript
export const ContainerBlock: Block = {
  slug: 'container',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [], // ❌ Empty array causes map error
      required: true,
    },
    // ... styling fields
  ],
}
```

**Proposed Implementation (Fixed):**

```typescript
export const ContainerBlock: Block = {
  slug: 'container',
  interfaceName: 'ContainerBlock',
  labels: {
    singular: 'Container Block',
    plural: 'Container Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    // Remove the nested blocks field entirely
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Content to display inside the container',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      options: [
        { label: 'Small (640px)', value: 'sm' },
        { label: 'Medium (768px)', value: 'md' },
        { label: 'Large (1024px)', value: 'lg' },
        { label: 'Extra Large (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: 'Full Width', value: 'full' },
      ],
      defaultValue: 'xl',
      required: true,
    },
    // ... rest of styling fields (backgroundColor, padding, margin, etc.)
  ],
}
```

**Rationale:**

- Removes the circular reference risk entirely
- Simplifies the block configuration
- Aligns with Payload's recommended patterns
- Maintains all styling functionality
- Adds a richText field for simple content needs

### 2. Block Assignments Configuration

**File:** `src/blocks/config/blockAssignments.ts`

**No changes required** - The block assignments are already correct. The issue is in the ContainerBlock definition itself, not in how it's assigned to collections.

### 3. Services Collection Configuration

**File:** `src/pages/Services/index.ts`

**No changes required** - The Services collection configuration is correct. Once the ContainerBlock is fixed, the collection will work properly.

## Data Models

### ContainerBlock Data Structure

**Before (with nested blocks):**

```typescript
interface ContainerBlock {
  blockType: 'container'
  blocks: Block[] // Nested blocks array
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  backgroundColor: string
  backgroundImage?: Media
  paddingTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}
```

**After (styling wrapper only):**

```typescript
interface ContainerBlock {
  blockType: 'container'
  content?: RichText // Simple content field
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  backgroundColor: string
  backgroundImage?: Media
  paddingTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginTop: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  marginBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}
```

### Services Collection Data Structure

**No changes** - The Services collection structure remains the same:

```typescript
interface ServicePage {
  title: string
  slug: string
  content: RichText
  hero?: HeroBlock[]
  layout: Block[] // All blocks including ContainerBlock
  serviceType: string
  featured: boolean
  pricing: {
    startingPrice?: number
    currency: 'USD' | 'EUR' | 'GBP' | 'INR'
    pricingModel: 'fixed' | 'hourly' | 'monthly' | 'custom'
  }
  _status: 'draft' | 'published'
  createdBy?: User
  updatedBy?: User
}
```

## Error Analysis

### Root Cause

The error "Cannot read properties of undefined (reading 'map')" occurs because:

1. **ContainerBlock Definition:** The block has a nested `blocks` field with `blocks: []`
2. **Payload Processing:** When Payload loads the Services collection, it processes all blocks in the layout array
3. **Block Validation:** Payload attempts to validate the ContainerBlock's nested blocks field
4. **Map Operation:** Payload's internal code tries to call `.map()` on the blocks array to process each nested block
5. **Undefined Reference:** Since the array is empty and not properly initialized with valid block references, some internal property becomes undefined
6. **Error Thrown:** The map operation fails with "Cannot read properties of undefined"

### Why Empty Array Causes Issues

In Payload's block system:

- A `blocks` field expects an array of Block configurations (not instances)
- An empty array `[]` signals "no blocks are allowed" rather than "blocks will be added later"
- Payload tries to validate and process the empty array, expecting block metadata
- When it finds no valid block configurations, internal references become undefined
- Subsequent operations (like mapping over block properties) fail

### Alternative Approaches Considered

#### Option 1: Populate Nested Blocks Array (Rejected)

```typescript
// ❌ This would work but creates circular reference risks
import { ContentBlock } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const ContainerBlock: Block = {
  slug: 'container',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        ContentBlock,
        MediaBlock,
        // Cannot include ContainerBlock here (circular reference)
      ],
    },
  ],
}
```

**Rejected because:**

- Creates import dependency complexity
- Risk of circular references if ContainerBlock is included
- Limits flexibility (must predefine which blocks can be nested)
- Increases bundle size and complexity

#### Option 2: Dynamic Block Population (Rejected)

```typescript
// ❌ Complex and error-prone
export function createContainerBlock(availableBlocks: Block[]): Block {
  return {
    slug: 'container',
    fields: [
      {
        name: 'blocks',
        type: 'blocks',
        blocks: availableBlocks.filter((b) => b.slug !== 'container'),
      },
    ],
  }
}
```

**Rejected because:**

- Requires refactoring the entire block assignment system
- Adds runtime complexity
- Harder to maintain and debug
- Not the recommended Payload pattern

#### Option 3: Remove Nested Blocks (Selected)

```typescript
// ✅ Simple, safe, and follows Payload best practices
export const ContainerBlock: Block = {
  slug: 'container',
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
    // ... styling fields only
  ],
}
```

**Selected because:**

- Eliminates the error completely
- Simplifies the block configuration
- Follows Payload's recommended patterns
- Maintains all styling functionality
- Users can still build complex layouts using multiple blocks

## Implementation Details

### Step 1: Update ContainerBlock Configuration

**File:** `src/blocks/layout/Container/config.ts`

**Changes:**

1. Remove the `blocks` field entirely
2. Add a `content` richText field for simple content
3. Keep all styling fields (maxWidth, backgroundColor, padding, margin, etc.)
4. Add documentation comments explaining the change

**Code:**

```typescript
import type { Block } from 'payload'

/**
 * ContainerBlock - A styling wrapper block for layout control
 *
 * This block provides a container with configurable styling options including:
 * - Maximum width constraints
 * - Background colors and images
 * - Padding and margin controls
 *
 * Note: This block previously had a nested blocks field which caused circular
 * reference issues. It now uses a simple richText content field instead.
 * For complex layouts, use multiple blocks in sequence at the collection level.
 */
export const ContainerBlock: Block = {
  slug: 'container',
  interfaceName: 'ContainerBlock',
  labels: {
    singular: 'Container Block',
    plural: 'Container Blocks',
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Content to display inside the container',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      options: [
        { label: 'Small (640px)', value: 'sm' },
        { label: 'Medium (768px)', value: 'md' },
        { label: 'Large (1024px)', value: 'lg' },
        { label: 'Extra Large (1280px)', value: 'xl' },
        { label: '2XL (1536px)', value: '2xl' },
        { label: 'Full Width', value: 'full' },
      ],
      defaultValue: 'xl',
      required: true,
      admin: {
        description: 'Maximum width of the container',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'White', value: 'white' },
        { label: 'Zinc 50', value: 'zinc-50' },
        { label: 'Zinc 100', value: 'zinc-100' },
        { label: 'Zinc 900', value: 'zinc-900' },
        { label: 'Brand Primary', value: 'brand-primary' },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Background color for the container',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image',
      },
    },
    {
      name: 'paddingTop',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Top padding',
      },
    },
    {
      name: 'paddingBottom',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'md',
      required: true,
      admin: {
        description: 'Bottom padding',
      },
    },
    {
      name: 'marginTop',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'none',
      required: true,
      admin: {
        description: 'Top margin',
      },
    },
    {
      name: 'marginBottom',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
      defaultValue: 'none',
      required: true,
      admin: {
        description: 'Bottom margin',
      },
    },
  ],
}
```

### Step 2: Update Frontend Component (if exists)

**File:** `src/blocks/layout/Container/Component.tsx` (if it exists)

**Changes:**

1. Remove any logic for rendering nested blocks
2. Update to render the richText content field
3. Keep all styling logic

**Pseudocode:**

```typescript
export function Container({ content, maxWidth, backgroundColor, ... }: ContainerBlock) {
  return (
    <div
      className={cn(
        'container',
        maxWidthClasses[maxWidth],
        backgroundColorClasses[backgroundColor],
        paddingClasses[paddingTop, paddingBottom],
        marginClasses[marginTop, marginBottom]
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage.url})` } : undefined}
    >
      {content && <RichText content={content} />}
    </div>
  )
}
```

### Step 3: Verify Services Collection

**No code changes needed** - Just verify that the Services collection loads without errors after fixing ContainerBlock.

**Verification steps:**

1. Start the Payload dev server
2. Navigate to the Services collection in the admin panel
3. Verify the collection loads without map errors
4. Create a new service page
5. Add blocks to the layout field
6. Add a ContainerBlock and verify it renders correctly
7. Save the page and verify no validation errors

## Testing Strategy

### Manual Testing

1. **Collection Loading Test**
   - Start Payload dev server
   - Navigate to Services collection
   - Verify no console errors
   - Verify collection list view loads

2. **Block Addition Test**
   - Create new service page
   - Add ContainerBlock to layout
   - Verify block configuration UI renders
   - Verify no map errors in console

3. **Block Configuration Test**
   - Configure ContainerBlock styling options
   - Add content to the richText field
   - Verify all fields work correctly
   - Save the page

4. **Block Rendering Test**
   - View the saved service page in admin
   - Verify ContainerBlock displays correctly
   - Verify styling is applied
   - Verify content renders

5. **Other Blocks Test**
   - Add other blocks (DividerBlock, SpacerBlock, etc.)
   - Verify they work alongside ContainerBlock
   - Verify no interference between blocks

### Automated Testing (Future)

While not part of this immediate fix, future tests should include:

1. **Unit Tests**
   - Test ContainerBlock configuration is valid
   - Test block assignments return correct blocks
   - Test Services collection configuration is valid

2. **Integration Tests**
   - Test creating a service page with blocks
   - Test saving and retrieving service pages
   - Test block data persistence

3. **E2E Tests**
   - Test full workflow: create → edit → save → view
   - Test block interactions in admin UI
   - Test frontend rendering of blocks

## Migration Considerations

### Existing Data

If there are existing service pages with ContainerBlocks that have nested blocks data:

**Migration Strategy:**

1. **Identify affected documents:** Query for service pages with ContainerBlocks
2. **Extract nested content:** For each ContainerBlock with nested blocks, extract the nested blocks
3. **Flatten structure:** Move nested blocks to the parent layout array
4. **Update ContainerBlock:** Convert nested blocks content to richText if possible
5. **Preserve styling:** Keep all ContainerBlock styling settings

**Migration Script (Pseudocode):**

```typescript
async function migrateContainerBlocks() {
  const services = await payload.find({
    collection: 'services',
    where: {
      'layout.blockType': { equals: 'container' },
    },
  })

  for (const service of services.docs) {
    let modified = false
    const newLayout = []

    for (const block of service.layout) {
      if (block.blockType === 'container' && block.blocks?.length > 0) {
        // Add container with content converted from nested blocks
        newLayout.push({
          ...block,
          blocks: undefined, // Remove nested blocks
          content: convertBlocksToRichText(block.blocks), // Convert to richText
        })

        // Add nested blocks as siblings
        newLayout.push(...block.blocks)
        modified = true
      } else {
        newLayout.push(block)
      }
    }

    if (modified) {
      await payload.update({
        collection: 'services',
        id: service.id,
        data: { layout: newLayout },
      })
    }
  }
}
```

### Backward Compatibility

**Breaking Change:** Yes, this is a breaking change for the ContainerBlock structure.

**Impact:**

- Existing ContainerBlocks with nested blocks will need migration
- Frontend components rendering ContainerBlock will need updates
- TypeScript interfaces will need updates

**Mitigation:**

- Provide migration script
- Document the change clearly
- Update all frontend components
- Test thoroughly before deployment

## Documentation

### Code Comments

Add comprehensive comments to the ContainerBlock configuration explaining:

- Why the nested blocks field was removed
- What the previous issue was
- How to achieve similar layouts without nested blocks
- Best practices for using ContainerBlock

### User Documentation

Create or update documentation for content editors:

- How to use ContainerBlock for styling
- How to build complex layouts using multiple blocks
- Examples of common layout patterns
- Migration guide for existing content

### Developer Documentation

Update developer documentation:

- Block configuration best practices
- How to avoid circular reference issues
- When to use nested blocks vs. sequential blocks
- Testing strategies for block configurations

## Best Practices for Future Block Development

### 1. Avoid Nested Blocks Unless Necessary

**Guideline:** Only use nested blocks fields when absolutely required for the block's functionality.

**Rationale:**

- Increases complexity
- Risk of circular references
- Harder to maintain
- Can cause performance issues

### 2. Use Sequential Blocks Instead

**Guideline:** Prefer using multiple blocks in sequence at the collection level rather than nesting blocks.

**Example:**

```typescript
// ❌ Avoid: Nested blocks
{
  name: 'container',
  type: 'blocks',
  blocks: [ContainerBlock] // ContainerBlock has nested blocks
}

// ✅ Prefer: Sequential blocks
{
  name: 'layout',
  type: 'blocks',
  blocks: [ContainerBlock, ContentBlock, MediaBlock] // All at same level
}
```

### 3. Validate Block Configurations

**Guideline:** Always test block configurations thoroughly before deploying.

**Checklist:**

- [ ] Block loads without errors
- [ ] All fields render correctly
- [ ] No circular references
- [ ] No empty arrays in blocks fields
- [ ] TypeScript types are correct
- [ ] Frontend component handles all cases

### 4. Document Block Purpose

**Guideline:** Add clear documentation to each block explaining its purpose and usage.

**Template:**

```typescript
/**
 * BlockName - Brief description
 *
 * Purpose: What this block is for
 * Usage: How to use this block
 * Limitations: Any constraints or limitations
 * Related: Links to related blocks or documentation
 */
export const BlockName: Block = {
  // ...
}
```

### 5. Keep Blocks Simple

**Guideline:** Each block should have a single, clear purpose.

**Anti-pattern:**

- A block that tries to do too many things
- A block with complex nested structures
- A block with many conditional fields

**Good pattern:**

- Simple, focused blocks
- Clear field names and descriptions
- Minimal nesting
- Composable with other blocks

## Summary

This design fixes the Services collection map error by removing the problematic nested blocks field from ContainerBlock. The solution:

1. **Eliminates the error** by removing the empty `blocks: []` array
2. **Simplifies the block** by focusing on styling functionality
3. **Follows best practices** by using sequential blocks instead of nested blocks
4. **Maintains flexibility** by allowing users to build complex layouts with multiple blocks
5. **Improves maintainability** by reducing complexity and circular reference risks

The fix is straightforward, safe, and aligns with Payload's recommended patterns for block configuration.

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Block References Are Defined

_For any_ collection type and block assignment configuration, when retrieving blocks for that collection, all returned block references should be defined (not undefined or null).

**Validates: Requirements 1.3, 3.4**

**Rationale:** This property ensures that the block assignment system never returns undefined or null block references, which would cause map errors when Payload tries to process them. By testing this across all collection types, we verify that the block assignment configuration is complete and correct.

**Test Approach:**

- Generate test cases for all collection types ('blogs', 'services', 'contacts', 'legal', 'pages')
- For each collection type, call `getBlocksForCollection(collectionType)`
- Verify that all blocks in the returned `hero` and `layout` arrays are defined
- Verify that each block has required properties (slug, fields, etc.)

### Property 2: Invalid Block Configurations Are Detected

_For any_ block configuration with a nested blocks field, if the nested blocks array is empty or contains undefined references, the system should detect and report the invalid configuration.

**Validates: Requirements 6.4**

**Rationale:** This property ensures that we have validation in place to catch configuration errors similar to the one that caused the original bug. By testing various invalid configurations, we verify that the system provides helpful error messages rather than cryptic map errors.

**Test Approach:**

- Create test block configurations with various invalid states:
  - Empty blocks array: `blocks: []`
  - Undefined blocks: `blocks: [undefined]`
  - Null blocks: `blocks: [null]`
  - Mixed valid/invalid: `blocks: [ValidBlock, undefined]`
- Attempt to use each invalid configuration
- Verify that appropriate errors or warnings are generated
- Verify that error messages are helpful and actionable

### Example 1: ContainerBlock Configuration Is Valid

The ContainerBlock configuration should be valid according to Payload's block schema requirements and should not contain an empty nested blocks field.

**Validates: Requirements 2.1, 2.3, 2.4**

**Test Steps:**

1. Import the ContainerBlock configuration
2. Verify it has the required properties:
   - `slug` is 'container'
   - `interfaceName` is 'ContainerBlock'
   - `fields` array is defined and not empty
3. Verify it does NOT have a nested blocks field, OR if it does, the blocks array is properly populated
4. Verify all fields have valid types and configurations
5. Attempt to use ContainerBlock in a test collection configuration
6. Verify no errors are thrown during configuration processing

### Example 2: Services Collection Works End-to-End

The Services collection should load, allow creating service pages with blocks, and persist data correctly without any map errors.

**Validates: Requirements 4.1, 4.4, 5.1**

**Test Steps:**

1. Load the Services collection configuration
2. Verify the collection loads without errors
3. Create a new service page with test data:
   - Set required fields (title, content)
   - Add a HeroBlock to the hero field
   - Add multiple blocks to the layout field including ContainerBlock
4. Save the service page
5. Verify no validation errors occur
6. Retrieve the saved service page
7. Verify all block data is persisted correctly:
   - Hero block data is intact
   - Layout blocks are in correct order
   - ContainerBlock data (content, styling) is correct
8. Update the service page (add/remove blocks)
9. Verify updates persist correctly

### Example 3: ContainerBlock Renders Without Nested Blocks

The ContainerBlock should render correctly with its content field and styling options, without requiring nested blocks.

**Validates: Requirements 2.1, 5.1**

**Test Steps:**

1. Create a test service page
2. Add a ContainerBlock with:
   - Content in the richText field
   - Various styling options (maxWidth, backgroundColor, padding, margin)
   - Optional background image
3. Save the page
4. Retrieve the page data
5. Verify ContainerBlock data structure:
   - Has `content` field with richText data
   - Has all styling fields with correct values
   - Does NOT have a `blocks` field with nested blocks
6. Verify the block can be edited and resaved
7. Verify styling options work correctly

## Error Handling

### Map Error Prevention

**Strategy:** Prevent map errors by ensuring all block arrays are properly initialized and validated.

**Implementation:**

1. **Block Assignment Validation:** Add runtime validation to `getBlocksForCollection()` to verify all returned blocks are defined
2. **Configuration Validation:** Add startup validation to check all block configurations for common issues
3. **Type Safety:** Use TypeScript to catch configuration errors at compile time

**Example Validation:**

```typescript
export function getBlocksForCollection(collection: PageCollectionType): PageCollectionBlocks {
  const blocks = BLOCK_ASSIGNMENTS[collection]

  // Validate hero blocks
  if (blocks.hero) {
    blocks.hero.forEach((block, index) => {
      if (!block || !block.slug) {
        throw new Error(
          `Invalid hero block at index ${index} for collection "${collection}": Block is undefined or missing slug`,
        )
      }
    })
  }

  // Validate layout blocks
  blocks.layout.forEach((block, index) => {
    if (!block || !block.slug) {
      throw new Error(
        `Invalid layout block at index ${index} for collection "${collection}": Block is undefined or missing slug`,
      )
    }
  })

  return {
    hero: blocks.hero ? [...blocks.hero] : undefined,
    layout: [...blocks.layout],
  }
}
```

### Circular Reference Prevention

**Strategy:** Prevent circular references by never allowing a block to include itself in nested blocks.

**Implementation:**

1. **Design Rule:** Avoid nested blocks fields unless absolutely necessary
2. **Validation:** If nested blocks are used, validate that the block doesn't include itself
3. **Documentation:** Clearly document the risks and best practices

**Example Validation:**

```typescript
export function validateBlockConfiguration(block: Block): void {
  const nestedBlocksField = block.fields.find(
    (field) => field.type === 'blocks' && field.name === 'blocks',
  )

  if (nestedBlocksField && 'blocks' in nestedBlocksField) {
    const nestedBlocks = nestedBlocksField.blocks
    const hasCircularRef = nestedBlocks.some((nestedBlock) => nestedBlock.slug === block.slug)

    if (hasCircularRef) {
      throw new Error(
        `Circular reference detected: Block "${block.slug}" includes itself in nested blocks`,
      )
    }
  }
}
```

### Empty Array Handling

**Strategy:** Treat empty blocks arrays as configuration errors, not valid configurations.

**Implementation:**

1. **Validation:** Check for empty blocks arrays during configuration loading
2. **Error Messages:** Provide clear error messages explaining the issue
3. **Documentation:** Document that empty blocks arrays are not supported

**Example Validation:**

```typescript
export function validateNestedBlocks(block: Block): void {
  const nestedBlocksField = block.fields.find(
    (field) => field.type === 'blocks' && field.name === 'blocks',
  )

  if (nestedBlocksField && 'blocks' in nestedBlocksField) {
    const nestedBlocks = nestedBlocksField.blocks

    if (Array.isArray(nestedBlocks) && nestedBlocks.length === 0) {
      console.warn(
        `Warning: Block "${block.slug}" has an empty nested blocks array. ` +
          `This may cause errors. Either remove the blocks field or populate it with valid blocks.`,
      )
    }
  }
}
```

### Graceful Degradation

**Strategy:** If a block configuration error is detected, fail gracefully with helpful error messages.

**Implementation:**

1. **Try-Catch Blocks:** Wrap block processing in try-catch blocks
2. **Error Context:** Include context in error messages (collection name, block slug, etc.)
3. **Fallback Behavior:** Provide fallback behavior when possible

**Example:**

```typescript
export function safeGetBlocksForCollection(
  collection: PageCollectionType,
): PageCollectionBlocks | null {
  try {
    return getBlocksForCollection(collection)
  } catch (error) {
    console.error(`Error loading blocks for collection "${collection}":`, error)

    // Return minimal valid configuration as fallback
    return {
      hero: undefined,
      layout: [],
    }
  }
}
```

### Error Logging

**Strategy:** Log detailed error information to help with debugging.

**Implementation:**

1. **Stack Traces:** Include full stack traces in error logs
2. **Configuration Dump:** Log the problematic configuration
3. **Context Information:** Include collection name, block slug, field name, etc.

**Example:**

```typescript
export function logBlockError(
  error: Error,
  context: {
    collection?: string
    blockSlug?: string
    fieldName?: string
  },
): void {
  console.error('Block Configuration Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })
}
```
