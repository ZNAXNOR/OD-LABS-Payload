#!/usr/bin/env python3
import re
import os

files_to_fix = [
    'tests/int/access-control.int.spec.ts',
    'tests/int/blogs.int.spec.ts',
    'tests/int/legal.int.spec.ts',
    'tests/int/pages.int.spec.ts',
    'tests/int/services.int.spec.ts',
    'tests/int/contacts.int.spec.ts',
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        continue
    
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove draft: false, from user creation
    # Pattern: collection: 'users', data: { ... }, draft: false, })
    content = re.sub(
        r"(collection: 'users',\s*data: \{[^}]+\},)\s*draft: false,\s*\}",
        r"\1\n      }",
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Fixed {filepath}")

print("\nAll files processed!")
