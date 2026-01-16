#!/usr/bin/env python3
"""
Fix TypeScript test files by:
1. Adding proper Lexical root structure properties
2. Not modifying user creation (users collection doesn't support drafts)
"""

import re

# Template for complete root structure
COMPLETE_ROOT = """root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', text: 'CONTENT_TEXT' }],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              }"""

def fix_file(filepath, content_texts):
    """Fix a single test file with specific content texts"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace each incomplete root structure with complete one
    for text in content_texts:
        # Pattern for incomplete structure
        incomplete = f"""root: {{
                type: 'root',
                children: [
                  {{
                    type: 'paragraph',
                    version: 1,
                    children: [{{ type: 'text', text: '{text}' }}],
                  }},
                ],
              }}"""
        
        complete = COMPLETE_ROOT.replace('CONTENT_TEXT', text)
        content = content.replace(incomplete, complete)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed {filepath}")

# Fix blogs.int.spec.ts
fix_file('tests/int/blogs.int.spec.ts', [
    'Test content',
    'Content',
    'Original content',
    'Draft content',
    'Content 1',
    'Content 2',
])

# Fix access-control.int.spec.ts  
fix_file('tests/int/access-control.int.spec.ts', [
    'Content',
])

# Fix legal.int.spec.ts
fix_file('tests/int/legal.int.spec.ts', [
    'Privacy policy content',
    'Legal content',
    'Original content',
    'Terms content',
    'Content',
    'Content 1',
    'Content 2',
    'Privacy content',
])

# Fix services.int.spec.ts
fix_file('tests/int/services.int.spec.ts', [
    'Service description',
    'Original description',
    'Description',
    'Description 1',
    'Description 2',
    'Featured description',
    'Draft description',
])

print("\n✅ All test files fixed!")
