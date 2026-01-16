# PowerShell script to fix test files by adding context parameter

$testFiles = @(
    "tests/unit/hooks/createRevalidateHook.unit.spec.ts",
    "tests/unit/utilities/slugGeneration.unit.spec.ts",
    "tests/unit/validation/circularReference.unit.spec.ts",
    "tests/int/access-control.int.spec.ts",
    "tests/int/blogs.int.spec.ts",
    "tests/int/contacts.int.spec.ts",
    "tests/int/legal.int.spec.ts",
    "tests/int/pages.int.spec.ts",
    "tests/int/services.int.spec.ts",
    "tests/pbt/circularReference.pbt.spec.ts",
    "tests/pbt/slugGeneration.pbt.spec.ts",
    "tests/pbt/slugUniqueness.pbt.spec.ts",
    "tests/performance/hooks.perf.spec.ts",
    "tests/performance/load.perf.spec.ts",
    "tests/performance/queries.perf.spec.ts"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw
        
        # Fix patterns for beforeChange hooks (missing context)
        $content = $content -replace '(\s+)(operation:\s*[''"](?:create|update)[''"]\s*,\s*\n\s+collection:\s*[^\n]+\n\s*)\)', '$1$2context: {},\n$1)'
        
        # Fix patterns for afterChange hooks (missing context, data, previousDoc)
        $content = $content -replace '(\s+)(doc:\s*[^\n]+,\s*\n\s+req:\s*[^\n]+,\s*\n\s+operation:\s*[''"](?:create|update)[''"]\s*,\s*\n\s+collection:\s*[^\n]+\n\s*)\)', '$1$2context: {},\n$1data: {},\n$1previousDoc: undefined,\n$1)'
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed $file"
    }
}

Write-Host "Done!"
