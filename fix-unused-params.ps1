# PowerShell script to fix unused parameters in screenReaderUtils.ts

$filePath = "src/components/RichText/utils/screenReaderUtils.ts"
$content = Get-Content $filePath -Raw

# Fix unused ctx and data parameters
$content = $content -replace '\bctx\b(?=\s*\)|\s*,|\s*=>)', '_ctx'
$content = $content -replace '\bdata\b(?=\s*,\s*_ctx)', '_data'

# Write back to file
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Fixed unused parameters in $filePath"