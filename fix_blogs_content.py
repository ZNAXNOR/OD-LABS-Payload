#!/usr/bin/env python3
import re

# Read the file
with open('tests/int/blogs.int.spec.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match incomplete root structures
# Matches: root: { type: 'root', children: [...], }
# But NOT if it already has direction, format, indent, version

pattern = r"(root: \{\s*type: 'root',\s*children: \[[^\]]+\],\s*)\}"

def replacement(match):
    return match.group(1) + "direction: null,\n              format: '',\n              indent: 0,\n              version: 1,\n            }"

# Replace all occurrences
content = re.sub(pattern, replacement, content)

# Write back
with open('tests/int/blogs.int.spec.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed all root structures in blogs.int.spec.ts")
