# Fix content structure in test files
$files = @(
    "tests/int/blogs.int.spec.ts",
    "tests/int/legal.int.spec.ts",
    "tests/int/services.int.spec.ts",
    "tests/int/pages.int.spec.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Fix incomplete paragraph structures - add version property
        $content = $content -replace `
            "(\s+type: 'paragraph',\s+children: \[\{ type: 'text', text: '([^']+)' \}\],)", `
            "`$1`n                  version: 1,"
        
        # Fix root structure - add missing properties
        $content = $content -replace `
            "(root: \{\s+type: 'root',\s+children: \[)", `
            "`$1"
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed $file"
    }
}

Write-Host "Content structure fixes complete"
