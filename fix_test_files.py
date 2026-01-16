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
    
    # Fix root structure - add missing properties
    # Pattern: find root with children array but missing direction/format/indent/version
    pattern = r"(root: \{\s+type: 'root',\s+children: \[[\s\S]*?\],)\s+(\}\s+\})"
    replacement = r"\1\n                direction: null,\n                format: '',\n                indent: 0,\n                version: 1,\n              \2"
    
    content = re.sub(pattern, replacement, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"FIXED: {filepath}")

print("\nAll test files processed")
