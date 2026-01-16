#!/usr/bin/env python3
import re

# Read the file
with open('tests/int/blogs.int.spec.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match the malformed Lexical content structures
# This matches from "content: {" to the closing "}" of the content object
pattern = r"content: \{\s+root: \{\s+type: 'root',\s+children: \[\s+\{\s+type: 'paragraph',\s+version: 1,\s+children: \[\{ type: 'text', text: '([^']+)' \}\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\},"

# Replacement function
def replace_content(match):
    text = match.group(1)
    return f"content: createLexicalContent('{text}'),"

# Replace all occurrences
content = re.sub(pattern, replace_content, content)

# Write back
with open('tests/int/blogs.int.spec.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed all Lexical content structures")
