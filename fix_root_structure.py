#!/usr/bin/env python3
import re
import os

test_files = [
    "tests/int/blogs.int.spec.ts",
    "tests/int/legal.int.spec.ts",
    "tests/int/services.int.spec.ts",
    "tests/int/pages.int.spec.ts",
]

for filepath in test_files:
    if not os.path.exists(filepath):
        print(f"SKIP: {filepath} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern to match root structures missing the required properties
    # Look for closing of children array followed by closing braces without the properties
    pattern = r"(\s+children: \[\s*\{\s*type: 'paragraph',\s*version: 1,\s*children: \[\{ type: 'text', text: '[^']*' \}\],\s*\},\s*\],)\s*(\}\s*\})"
    
    def add_properties(match):
        children_part = match.group(1)
        closing_braces = match.group(2)
        return f"{children_part}\n              direction: null,\n              format: '',\n              indent: 0,\n              version: 1,\n            {closing_braces}"
    
    content = re.sub(pattern, add_properties, content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"FIXED: {filepath}")
    else:
        print(f"NO CHANGES: {filepath}")

print("\nAll test files processed")
