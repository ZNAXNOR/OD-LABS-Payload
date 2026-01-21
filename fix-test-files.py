#!/usr/bin/env python3
"""
Consolidated test file fixer script.
Combines functionality from multiple fix scripts into a single parameterized tool.
"""
import re
import os
import argparse
from typing import List, Dict, Callable

class TestFileFixer:
    def __init__(self):
        self.fixes_applied = []
    
    def add_lexical_helper(self, content: str) -> str:
        """Add the Lexical content helper function if not present."""
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
        
        if 'createLexicalContent' not in content:
            # Find the position after imports
            import_end = re.search(r"(import .+\n)+", content)
            if import_end:
                insert_pos = import_end.end()
                content = content[:insert_pos] + helper_function + content[insert_pos:]
                self.fixes_applied.append("Added Lexical helper function")
        
        return content
    
    def fix_user_creation(self, content: str) -> str:
        """Add draft property and required fields to user creation."""
        original_content = content
        
        # Fix 1: Add draft property to user creation
        pattern1 = r"(await payload\.create\(\{\s+collection: 'users',\s+data: \{[^}]+\},)\s+(\}\))"
        def add_draft(match):
            return f"{match.group(1)}\n      draft: false,\n    {match.group(2)}"
        
        content = re.sub(pattern1, add_draft, content)
        
        # Fix 2: Add firstName and lastName to user creation
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
        
        if content != original_content:
            self.fixes_applied.append("Fixed user creation")
        
        return content
    
    def fix_root_structures(self, content: str) -> str:
        """Fix incomplete root structures in Lexical content."""
        original_content = content
        
        # Fix root structures missing properties
        pattern = r"(children: \[\s*\{\s*type: 'paragraph',\s*version: 1,\s*children: \[[^\]]+\],\s*\},\s*\],)\s*(\}\s*\})"
        def add_root_properties(match):
            return f"{match.group(1)}\n              direction: null,\n              format: '',\n              indent: 0,\n              version: 1,\n            {match.group(2)}"
        
        content = re.sub(pattern, add_root_properties, content)
        
        # Fix root structures with multiple paragraphs
        pattern2 = r"(children: \[\s*(?:\{\s*type: 'paragraph',\s*version: 1,\s*children: \[[^\]]+\],\s*\},\s*)+\],)\s*(\}\s*\})"
        content = re.sub(pattern2, add_root_properties, content)
        
        if content != original_content:
            self.fixes_applied.append("Fixed root structures")
        
        return content
    
    def fix_lexical_content(self, content: str) -> str:
        """Replace malformed Lexical content with helper function calls."""
        original_content = content
        
        # Pattern to match malformed Lexical content structures
        pattern = r"content: \{\s+root: \{\s+type: 'root',\s+children: \[\s+\{\s+type: 'paragraph',\s+version: 1,\s+children: \[\{ type: 'text', text: '([^']+)' \}\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\],\s+(?:direction: null,\s+format: '',\s+indent: 0,\s+version: 1,\s+)?\},\s+\},"
        
        def replace_content(match):
            text = match.group(1)
            return f"content: createLexicalContent('{text}'),"
        
        content = re.sub(pattern, replace_content, content)
        
        if content != original_content:
            self.fixes_applied.append("Fixed Lexical content structures")
        
        return content
    
    def process_file(self, filepath: str, fix_types: List[str] = None) -> bool:
        """Process a single file with specified fix types."""
        if not os.path.exists(filepath):
            print(f"SKIP: {filepath} not found")
            return False
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        self.fixes_applied = []
        
        # Apply fixes based on fix_types
        if not fix_types or 'lexical-helper' in fix_types:
            content = self.add_lexical_helper(content)
        
        if not fix_types or 'user-creation' in fix_types:
            content = self.fix_user_creation(content)
        
        if not fix_types or 'root-structures' in fix_types:
            content = self.fix_root_structures(content)
        
        if not fix_types or 'lexical-content' in fix_types:
            content = self.fix_lexical_content(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"FIXED: {filepath} - {', '.join(self.fixes_applied)}")
            return True
        else:
            print(f"NO CHANGES: {filepath}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Fix test files with various patterns')
    parser.add_argument('files', nargs='*', help='Files to process (default: predefined list)')
    parser.add_argument('--fix-types', nargs='*', 
                       choices=['lexical-helper', 'user-creation', 'root-structures', 'lexical-content'],
                       help='Types of fixes to apply (default: all)')
    parser.add_argument('--pattern', help='File pattern to match (e.g., "tests/**/*.spec.ts")')
    
    args = parser.parse_args()
    
    # Default files if none specified
    default_files = [
        "tests/int/blogs.int.spec.ts",
        "tests/int/legal.int.spec.ts",
        "tests/int/services.int.spec.ts",
        "tests/int/pages.int.spec.ts",
        "tests/int/access-control.int.spec.ts",
        "tests/int/contacts.int.spec.ts",
        "tests/performance/hooks.perf.spec.ts",
        "tests/performance/queries.perf.spec.ts",
        "tests/pbt/utilities/circularReference.pbt.spec.ts"
    ]
    
    files_to_process = args.files if args.files else default_files
    
    if args.pattern:
        import glob
        files_to_process = glob.glob(args.pattern, recursive=True)
    
    fixer = TestFileFixer()
    fixed_count = 0
    
    for filepath in files_to_process:
        if fixer.process_file(filepath, args.fix_types):
            fixed_count += 1
    
    print(f"\nProcessed {len(files_to_process)} files, fixed {fixed_count} files")

if __name__ == "__main__":
    main()