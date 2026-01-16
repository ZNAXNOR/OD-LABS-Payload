# PowerShell script to fix blogs integration test file

$filePath = "tests/int/blogs.int.spec.ts"
$content = Get-Content $filePath -Raw

# Fix user creation - add firstName and lastName
$content = $content -replace `
  "email: ``test-blogs-\`\${Date\.now\(\)}@example\.com``,\s+password: 'test123',\s+roles: \['user'\],", `
  "email: ``test-blogs-`${Date.now()}@example.com``,`n        firstName: 'Test',`n        lastName: 'User',`n        password: 'test123',`n        roles: ['user'],"

$content = $content -replace `
  "email: ``another-blog-\`\${Date\.now\(\)}@example\.com``,\s+password: 'test123',\s+roles: \['user'\],", `
  "email: ``another-blog-`${Date.now()}@example.com``,`n          firstName: 'Another',`n          lastName: 'User',`n          password: 'test123',`n          roles: ['user'],"

# Fix Lexical content structure - remove duplicate version and add missing properties at root
# Pattern 1: Fix paragraph children with duplicate version
$content = $content -replace `
  "(\s+)children: \[\{ type: 'text', text: '[^']+' \}\],\s+direction: null,\s+format: '',\s+indent: 0,\s+version: 1,", `
  "`$1children: [{ type: 'text', text: 'Content' }],"

# Pattern 2: Fix root structure missing properties
$content = $content -replace `
  "(\s+)root: \{\s+type: 'root',\s+children: \[\s+\{\s+type: 'paragraph',\s+version: 1,\s+children: \[\{ type: 'text', text: '[^']+' \}\],\s+\},\s+\],\s+\},", `
  "`$1root: {`n`$1  type: 'root',`n`$1  children: [`n`$1    {`n`$1      type: 'paragraph',`n`$1      version: 1,`n`$1      children: [{ type: 'text', text: 'Content' }],`n`$1      direction: null,`n`$1      format: '',`n`$1      indent: 0,`n`$1    },`n`$1  ],`n`$1  direction: null,`n`$1  format: '',`n`$1  indent: 0,`n`$1  version: 1,`n`$1},"

# Save the fixed content
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Fixed blogs integration test file"
