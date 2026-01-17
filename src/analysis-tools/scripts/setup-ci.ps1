# Setup script for CI/CD integration (PowerShell version)
# This script configures the analysis tools for continuous integration

param(
    [switch]$SkipTests = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up Blocks & Components Analysis CI/CD Integration" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: This script must be run from the analysis-tools directory" -ForegroundColor Red
    exit 1
}

# Check Node.js version
try {
    $nodeVersion = node --version
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 16) {
        Write-Host "❌ Error: Node.js 16 or higher is required (found $nodeVersion)" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js version check passed ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js not found. Please install Node.js 16 or higher" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🔨 Building analysis tools..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Run tests to ensure everything works (unless skipped)
if (-not $SkipTests) {
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    npm run test:unit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Tests failed, but continuing setup..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Tests passed" -ForegroundColor Green
    }
}

# Create necessary directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
$directories = @(".cache/analysis", "analysis-output", "logs", "config")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Gray
    }
}

# Set up git hooks (if in a git repository)
if (Test-Path ".git") {
    Write-Host "🔗 Setting up git hooks..." -ForegroundColor Yellow
    
    $hookDir = ".git/hooks"
    if (-not (Test-Path $hookDir)) {
        New-Item -ItemType Directory -Path $hookDir -Force | Out-Null
    }
    
    # Create pre-commit hook (PowerShell version for Windows)
    $preCommitHook = @'
#!/bin/bash
# Pre-commit hook for blocks and components analysis

echo "🔍 Running pre-commit analysis..."

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' | grep -E '^src/(blocks|components)/' || true)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No relevant files to analyze"
    exit 0
fi

# Run quick analysis on staged files
cd src/analysis-tools

# Create temp directory for staged files
mkdir -p temp/staged

# Copy staged files
for file in $STAGED_FILES; do
    mkdir -p "temp/staged/$(dirname "$file")"
    git show ":$file" > "temp/staged/$file"
done

# Run analysis
npm run analyze -- \
    --blocks-dir temp/staged/src/blocks \
    --components-dir temp/staged/src/components \
    --scope full \
    --severity critical \
    --format console \
    --no-patterns

ANALYSIS_EXIT_CODE=$?

# Clean up
rm -rf temp/staged

if [ $ANALYSIS_EXIT_CODE -ne 0 ]; then
    echo "❌ Pre-commit analysis failed. Please fix critical issues before committing."
    exit 1
fi

echo "✅ Pre-commit analysis passed"
'@
    
    Set-Content -Path ".git/hooks/pre-commit" -Value $preCommitHook -Encoding UTF8
    Write-Host "✅ Pre-commit hook installed" -ForegroundColor Green
}

# Create environment-specific configurations
Write-Host "🌍 Creating environment configurations..." -ForegroundColor Yellow

# Development configuration
$devConfig = @{
    analysis = @{
        defaultScope = "full"
        defaultSeverity = "all"
        failOnCritical = $false
        timeoutMinutes = 10
    }
    performance = @{
        enableProfiling = $false
        enableCaching = $true
    }
    reporting = @{
        formats = @("console")
        includePerformanceMetrics = $false
    }
} | ConvertTo-Json -Depth 10

Set-Content -Path "config/development.json" -Value $devConfig -Encoding UTF8

# Production configuration
$prodConfig = @{
    analysis = @{
        defaultScope = "full"
        defaultSeverity = "critical"
        failOnCritical = $true
        timeoutMinutes = 30
    }
    performance = @{
        enableProfiling = $true
        enableCaching = $true
    }
    reporting = @{
        formats = @("json", "html")
        includePerformanceMetrics = $true
    }
} | ConvertTo-Json -Depth 10

Set-Content -Path "config/production.json" -Value $prodConfig -Encoding UTF8

# Create a sample environment configuration
Write-Host "🔐 Creating sample secrets configuration..." -ForegroundColor Yellow
$secretsExample = @'
# Example environment variables for CI/CD
# Copy this file to .env and fill in your values

# GitHub token for API access (optional, for pattern comparison)
GITHUB_TOKEN=your_github_token_here

# Slack webhook for notifications (optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Email configuration (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Analysis configuration
ANALYSIS_CACHE_TTL=3600000
ANALYSIS_MAX_WORKERS=4
ANALYSIS_TIMEOUT=30000
'@

Set-Content -Path "config/secrets.example.env" -Value $secretsExample -Encoding UTF8

# Create a README for CI/CD setup
Write-Host "📚 Creating CI/CD documentation..." -ForegroundColor Yellow
$cicdReadme = @'
# CI/CD Integration Setup

This document explains how to set up and configure the Blocks & Components Analysis tools for continuous integration.

## Quick Start

### Windows
```powershell
.\scripts\setup-ci.ps1
```

### Linux/macOS
```bash
./scripts/setup-ci.sh
```

## GitHub Actions Workflows

### Main Analysis Workflow (`.github/workflows/blocks-analysis.yml`)
- Runs on pull requests and pushes to main
- Performs comprehensive analysis
- Generates reports and artifacts
- Comments on PRs with results
- Fails on critical issues

### Pre-commit Workflow (`.github/workflows/pre-commit.yml`)
- Runs quick analysis on changed files only
- Faster feedback for developers
- Focuses on critical issues

## Configuration

### Environment Variables
- `GITHUB_TOKEN`: For GitHub API access (pattern comparison)
- `SLACK_WEBHOOK_URL`: For Slack notifications
- `ANALYSIS_CACHE_TTL`: Cache time-to-live in milliseconds
- `ANALYSIS_MAX_WORKERS`: Maximum parallel workers

### Configuration Files
- `config/ci.json`: Main CI configuration
- `config/development.json`: Development environment settings
- `config/production.json`: Production environment settings

## Usage

### Local Analysis
```bash
npm run analyze -- --blocks-dir ../blocks --components-dir ../components
```

### Performance Profiling
```bash
npm run profile ../blocks ../components
```

### CI Integration
The workflows automatically run on:
- Pull requests (quick analysis)
- Pushes to main (full analysis)
- Manual triggers (configurable scope)

## Troubleshooting

### Common Issues
1. **Timeout errors**: Increase `timeoutMinutes` in configuration
2. **Memory issues**: Reduce `maxWorkers` or enable streaming
3. **Rate limiting**: Add `GITHUB_TOKEN` for API access

### Debug Mode
```bash
npm run analyze -- --verbose
```

## Next Steps

1. Review and customize `config/ci.json`
2. Set up environment variables (see `config/secrets.example.env`)
3. Commit the workflow files to your repository
4. Test the integration with a pull request
'@

Set-Content -Path "CI_CD_SETUP.md" -Value $cicdReadme -Encoding UTF8

Write-Host ""
Write-Host "✅ CI/CD integration setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and customize config/ci.json" -ForegroundColor White
Write-Host "2. Set up environment variables (see config/secrets.example.env)" -ForegroundColor White
Write-Host "3. Commit the workflow files to your repository" -ForegroundColor White
Write-Host "4. Test the integration with a pull request" -ForegroundColor White
Write-Host ""
Write-Host "📚 See CI_CD_SETUP.md for detailed documentation" -ForegroundColor Cyan

if ($Verbose) {
    Write-Host ""
    Write-Host "📊 Setup Summary:" -ForegroundColor Yellow
    Write-Host "- Dependencies installed: ✅" -ForegroundColor Green
    Write-Host "- Project built: ✅" -ForegroundColor Green
    Write-Host "- Directories created: ✅" -ForegroundColor Green
    Write-Host "- Git hooks configured: $(if (Test-Path '.git') { '✅' } else { '⏭️ (not a git repo)' })" -ForegroundColor $(if (Test-Path '.git') { 'Green' } else { 'Yellow' })
    Write-Host "- Configuration files created: ✅" -ForegroundColor Green
    Write-Host "- Documentation generated: ✅" -ForegroundColor Green
}