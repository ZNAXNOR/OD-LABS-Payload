# PowerShell script to fix only unused ctx parameters in screenReaderUtils.ts

$filePath = "src/components/RichText/utils/screenReaderUtils.ts"
$content = Get-Content $filePath -Raw

# Fix function parameter declarations where ctx is unused
$content = $content -replace '(\w+):\s*\(([^,]+),\s*ctx\)\s*=>', '$1: ($2, _ctx) =>'

# Write back to file
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Fixed unused ctx parameters in $filePath"