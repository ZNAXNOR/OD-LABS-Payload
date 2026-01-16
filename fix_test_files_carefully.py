#!/usr/bin/env python3
import re
import os

files_to_fix = [
    'tests/int/access-control.int.spec.ts',
    'tests/int/blogs.int.spec.ts',
    'tests/int/legal.int.spec.ts',
    'tests/int/pages.int.spec.ts',
    'tests/int/services.int.spec.ts',
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        continue
    
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix root structures that are missing properties
    # Look for: root: { type: 'root', children: [...], }
    # Where the closing } is NOT followed by direction, format, indent, version
    
    # More precise pattern - match content: { root: { ... } }
    # and only fix if root doesn't have all required properties
    
    def fix_content_block(match):
        block = match.group(0)
        
        # Check if this root already has all properties
        if 'direction:' in block and 'format:' in block and 'indent:' in block:
            # Check if version appears AFTER children (not inside paragraph)
            root_part = block.split('children:')[0] + 'children:' + block.split('children:')[1].split('],')[0] + '],'
            rest = block[len(root_part):]
            
            if 'version:' in rest.split('}')[0]:
                return block  # Already complete
        
        # Find the closing } of root (not of children or paragraph)
        # Pattern: children: [...], } where } closes root
        pattern = r'(children: \[[^\]]+\],)\s*\}'
        
        def add_props(m):
            return m.group(1) + '\n              direction: null,\n              format: \'\',\n              indent: 0,\n              version: 1,\n            }'
        
        fixed = re.sub(pattern, add_props, block, count=1)
        return fixed
    
    # Match content: { root: { ... } } blocks
    content = re.sub(
        r'content: \{\s*root: \{[^}]+type: \'root\',[^}]+children: \[[^\]]+\],[^}]*\}',
        fix_content_block,
        content,
        flags=re.DOTALL
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Fixed {filepath}")

print("\nAll files processed!")
