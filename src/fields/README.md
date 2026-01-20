# Rich Text Features

This directory contains enhanced Lexical editor configurations for PayloadCMS with comprehensive rich text features.

## Files

- `richTextFeatures.ts` - Comprehensive rich text feature configurations
- `defaultLexical.ts` - Default lexical editor configurations (updated to use new features)
- `link.ts` - Link field configurations
- `linkGroup.ts` - Link group field configurations

## Available Configurations

### Preset Configurations

1. **basicRichText** - Basic text formatting with links
   - Paragraph
   - Bold, Italic, Underline, Strikethrough, Superscript, Subscript
   - Enhanced links

2. **standardRichText** - Standard rich text features
   - All basic features
   - Text alignment (left, center, right, justify)
   - Headings (H1-H6)
   - Lists (ordered, unordered, checklist)
   - Blockquotes and horizontal rules

3. **advancedRichText** - Advanced features (same as standard in current version)
   - All standard features
   - Code and table features (placeholders for future implementation)

4. **comprehensiveRichText** - All available features
   - All advanced features
   - Complete feature set

### Feature Groups

You can also use individual feature groups to create custom configurations:

- `basicTextFeatures` - Bold, italic, underline, strikethrough, superscript, subscript
- `alignmentFeatures` - Text alignment and indentation
- `headingFeatures` - H1-H6 headings
- `listFeatures` - Ordered, unordered, and checklist features
- `structuralFeatures` - Paragraph, blockquote, horizontal rule
- `enhancedLinkFeature` - Enhanced link handling with validation and options
- `colorFeatures` - Text and background colors (placeholder - not available in current version)
- `codeFeatures` - Code blocks and syntax highlighting (placeholder - not available in current version)
- `tableFeatures` - Table editing (placeholder - not available in current version)
- `spacingFeatures` - Custom spacing controls (basic indentation only)

## Usage Examples

### Using Preset Configurations

```typescript
import { standardRichText, comprehensiveRichText } from '@/fields/richTextFeatures'

// In a collection field
{
  name: 'content',
  type: 'richText',
  editor: standardRichText,
}

// For advanced content
{
  name: 'advancedContent',
  type: 'richText',
  editor: comprehensiveRichText,
}
```

### Creating Custom Configurations

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  basicTextFeatures,
  headingFeatures,
  listFeatures,
  enhancedLinkFeature,
} from '@/fields/richTextFeatures'

const customRichText = lexicalEditor({
  features: [...basicTextFeatures, ...headingFeatures, ...listFeatures, ...enhancedLinkFeature],
})
```

## Keyboard Shortcuts

The rich text editor includes built-in keyboard shortcuts for efficient content creation:

### Text Formatting

- **Ctrl/Cmd + B** - Bold
- **Ctrl/Cmd + I** - Italic
- **Ctrl/Cmd + U** - Underline
- **Ctrl/Cmd + Shift + S** - Strikethrough
- **Ctrl/Cmd + .** - Superscript
- **Ctrl/Cmd + ,** - Subscript

### Structure

- **Ctrl/Cmd + Alt + 1-6** - Headings H1-H6
- **Ctrl/Cmd + Alt + 0** - Paragraph
- **Ctrl/Cmd + Shift + .** - Blockquote
- **Ctrl/Cmd + Shift + -** - Horizontal rule

### Lists

- **Ctrl/Cmd + Shift + 8** - Unordered list
- **Ctrl/Cmd + Shift + 7** - Ordered list
- **Ctrl/Cmd + Shift + 9** - Checklist
- **Tab** - Indent
- **Shift + Tab** - Outdent

### Alignment

- **Ctrl/Cmd + Shift + L** - Left align
- **Ctrl/Cmd + Shift + E** - Center align
- **Ctrl/Cmd + Shift + R** - Right align
- **Ctrl/Cmd + Shift + J** - Justify align

### Links

- **Ctrl/Cmd + K** - Insert/edit link
- **Ctrl/Cmd + Shift + K** - Remove link

### General

- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Y / Ctrl/Cmd + Shift + Z** - Redo

## Enhanced Link Features

The enhanced link feature includes:

- **Internal Links** - Link to pages, blogs, services, legal documents, and contacts
- **External Links** - Full URL validation and options
- **Link Options**:
  - Open in new tab
  - Download link
  - Relationship attributes (nofollow, noopener, noreferrer)
  - Language code (hreflang)
  - Title/tooltip text

## Future Enhancements

The following features are prepared for future implementation when they become available in PayloadCMS:

- **Text Colors** - Font color and background color selection
- **Code Features** - Inline code and code blocks with syntax highlighting
- **Table Features** - Full table editing with row/column headers
- **Advanced Spacing** - Granular margin, padding, and line height controls

## Migration from Default Lexical

To migrate from the default lexical configuration:

1. Replace `defaultLexical` imports with specific configurations:

   ```typescript
   // Old
   import { defaultLexical } from '@/fields/defaultLexical'

   // New
   import { standardRichText } from '@/fields/richTextFeatures'
   ```

2. Update field configurations:

   ```typescript
   // Old
   {
     name: 'content',
     type: 'richText',
     editor: defaultLexical,
   }

   // New
   {
     name: 'content',
     type: 'richText',
     editor: standardRichText,
   }
   ```

The `enhancedLexical` export in `defaultLexical.ts` now uses the comprehensive configuration automatically.
