#!/usr/bin/env python3
import re
import os

test_files = [
    "tests/int/blogs.int.spec.ts",
    "tests/int/legal.int.spec.ts",
    "tests/int/services.int.spec.ts",
    "tests/int/pages.int.spec.ts",
    "tests/int/access-control.int.spec.ts",
    "tests/int/contacts.int.spec.ts",
    "tests/performance/hooks.perf.spec.ts",
    "tests/performance/queries.perf.spec.ts",
    "tests/pbt/circularReference.pbt.spec.ts"
]

for filepath in test_files:
    if not os.path.exists(filepath):
        print(f"SKIP: {filepath} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # Fix 1: Add draft property to user creation
    pattern1 = r"(await payload\.create\(\{\s+collection: 'users',\s+data: \{[^}]+\},)\s+(\}\))"
    def add_draft(match):
        return f"{match.group(1)}\n      draft: false,\n    {match.group(2)}"
    
    new_content = re.sub(pattern1, add_draft, content)
    if new_content != content:
        changes.append("Added draft property to user creation")
        content = new_content
    
    # Fix 2: Fix root structures missing properties
    # Pattern: children array with paragraph, followed by closing braces without properties
    pattern2 = r"(children: \[\s*\{\s*type: 'paragraph',\s*version: 1,\s*children: \[[^\]]+\],\s*\},\s*\],)\s*(\}\s*\})"
    def add_root_properties(match):
        return f"{match.group(1)}\n              direction: null,\n              format: '',\n              indent: 0,\n              version: 1,\n            {match.group(2)}"
    
    new_content = re.sub(pattern2, add_root_properties, content)
    if new_content != content:
        changes.append("Added root properties")
        content = new_content
    
    # Fix 3: Fix root structures with multiple paragraphs
    pattern3 = r"(children: \[\s*(?:\{\s*type: 'paragraph',\s*version: 1,\s*children: \[[^\]]+\],\s*\},\s*)+\],)\s*(\}\s*\})"
    new_content = re.sub(pattern3, add_root_properties, content)
    if new_content != content and new_content != content:
        changes.append("Added root properties (multi-paragraph)")
        content = new_content
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"FIXED: {filepath} - {', '.join(changes)}")
    else:
        print(f"NO CHANGES: {filepath}")

print("\nAll test files processed")
