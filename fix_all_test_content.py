#!/usr/bin/env python3
import re
import os

# Files to fix
test_files = [
    'tests/int/contacts.int.spec.ts',
    'tests/int/legal.int.spec.ts',
    'tests/int/services.int.spec.ts',
    'tests/int/pages.int.spec.ts'
]

# Helper function to add at the top of each file
helper_function = """
// Helper for creating valid Lexical content
const createLexicalContent = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text }],
        direction: null,
        format: '' as const,
        indent: 0,
      },
    ],
    direction: null,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
"""

for file_path in test_files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} - file not found")
        continue
    
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add helper function after imports if not already present
    if 'createLexicalContent' not in content:
        # Find the position after imports (before first let/const/describe)
        import_end = re.search(r"(import .+\n)+", content)
        if import_end:
            insert_pos = import_end.end()
            content = content[:insert_pos] + helper_function + content[insert_pos:]
    
    # Fix user creation - add firstName and lastName
    content = re.sub(
        r"email: `test-\w+-\$\{Date\.now\(\)\}@example\.com`,\s+password: 'test123',\s+roles: \['user'\],",
        lambda m: m.group(0).replace(
            "roles: ['user'],",
            "firstName: 'Test',\n        lastName: 'User',\n        password: 'test123',\n        roles: ['user'],"
        ).replace("password: 'test123',\n        firstName:", "firstName:"),
        content
    )
    
    # Fix another user creation pattern
    content = re.sub(
        r"email: `another-\w+-\$\{Date\.now\(\)\}@example\.com`,\s+password: 'test123',\s+roles: \['user'\],",
        lambda m: m.group(0).replace(
            "roles: ['user'],",
            "firstName: 'Another',\n          lastName: 'User',\n          password: 'test123',\n          roles: ['user'],"
        ).replace("password: 'test123',\n          firstName:", "firstName:"),
        content
    )
    
    # Pattern to match the malformed Lexical content structures
    pattern = r"content: \{\s+root: \{\s+type: 'root',\s+children: \[\s+\{\s+type: 'paragraph',\s+version: 1,\s+children: \[\{ type: 'text', text: '([^']+)' \}\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\},"
    
    def replace_content(match):
        text = match.group(1)
        return f"content: createLexicalContent('{text}'),"
    
    content = re.sub(pattern, replace_content, content)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed {file_path}")

print("All test files fixed!")
