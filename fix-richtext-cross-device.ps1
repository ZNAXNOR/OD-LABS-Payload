# PowerShell script to fix remaining TypeScript issues in richtext-cross-device.int.spec.tsx

$filePath = "tests/int/richtext-cross-device.int.spec.tsx"
$content = Get-Content $filePath -Raw

# Fix all remaining unused device parameters
$content = $content -replace '\(\[deviceKey, device\]\) =>', '([deviceKey]) =>'
$content = $content -replace 'for \(const \[deviceKey, device\] of', 'for (const [deviceKey] of'

# Write back to file
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "Fixed unused device parameters in $filePath"