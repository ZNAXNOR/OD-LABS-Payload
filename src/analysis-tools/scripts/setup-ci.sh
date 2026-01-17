#!/bin/bash

# Setup script for CI/CD integration
# This script configures the analysis tools for continuous integration

set -e

echo "🚀 Setting up Blocks & Components Analysis CI/CD Integration"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the analysis-tools directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Error: Node.js 16 or higher is required"
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building analysis tools..."
npm run build

# Run tests to ensure everything works
echo "🧪 Running tests..."
npm run test:unit

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p .cache/analysis
mkdir -p analysis-output
mkdir -p logs

# Set up git hooks (if in a git repository)
if [ -d ".git" ]; then
    echo "🔗 Setting up git hooks..."
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
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
EOF

    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook installed"
fi

# Create configuration files if they don't exist
if [ ! -f "config/ci.json" ]; then
    echo "⚙️ Creating CI configuration..."
    mkdir -p config
    # The ci.json file should already be created by the previous step
fi

# Create environment-specific configurations
echo "🌍 Creating environment configurations..."

# Development configuration
cat > config/development.json << 'EOF'
{
  "analysis": {
    "defaultScope": "full",
    "defaultSeverity": "all",
    "failOnCritical": false,
    "timeoutMinutes": 10
  },
  "performance": {
    "enableProfiling": false,
    "enableCaching": true
  },
  "reporting": {
    "formats": ["console"],
    "includePerformanceMetrics": false
  }
}
EOF

# Production configuration
cat > config/production.json << 'EOF'
{
  "analysis": {
    "defaultScope": "full",
    "defaultSeverity": "critical",
    "failOnCritical": true,
    "timeoutMinutes": 30
  },
  "performance": {
    "enableProfiling": true,
    "enableCaching": true
  },
  "reporting": {
    "formats": ["json", "html"],
    "includePerformanceMetrics": true
  }
}
EOF

# Create a sample GitHub Actions secret configuration
echo "🔐 Creating sample secrets configuration..."
cat > config/secrets.example.env << 'EOF'
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
EOF

# Create a README for CI/CD setup
echo "📚 Creating CI/CD documentation..."
cat > CI_CD_SETUP.md << 'EOF'
# CI/CD Integration Setup

This document explains how to set up and configure the Blocks & Components Analysis tools for continuous integration.

## Quick Start

1. Run the setup script:
   ```bash
   ./scripts/setup-ci.sh
   ```

2. Configure your CI environment variables (see `config/secrets.example.env`)

3. Commit the workflow files to your repository

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

## Customization

### Thresholds
Adjust quality thresholds in `config/ci.json`:
```json
{
  "thresholds": {
    "overallScore": {
      "excellent": 90,
      "good": 70,
      "needsImprovement": 50
    },
    "issues": {
      "critical": 0,
      "high": 5,
      "medium": 20
    }
  }
}
```

### Notifications
Configure notifications in the workflow files or `config/ci.json`.

### Analysis Scope
Control what gets analyzed:
- `blocks`: Only block configurations
- `components`: Only React components  
- `full`: Complete analysis (default)

## Troubleshooting

### Common Issues
1. **Timeout errors**: Increase `timeoutMinutes` in configuration
2. **Memory issues**: Reduce `maxWorkers` or enable streaming
3. **Rate limiting**: Add `GITHUB_TOKEN` for API access

### Debug Mode
Enable verbose logging:
```bash
npm run analyze -- --verbose
```

### Performance Issues
Run performance profiling:
```bash
npm run profile
```

## Integration with Other Tools

### Pre-commit Hooks
The setup script installs a pre-commit hook that runs quick analysis on staged files.

### IDE Integration
Configure your IDE to run analysis on save or as a background task.

### Deployment Gates
Use the analysis results as deployment gates in your CD pipeline.
EOF

echo ""
echo "✅ CI/CD integration setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and customize config/ci.json"
echo "2. Set up environment variables (see config/secrets.example.env)"
echo "3. Commit the workflow files to your repository"
echo "4. Test the integration with a pull request"
echo ""
echo "📚 See CI_CD_SETUP.md for detailed documentation"