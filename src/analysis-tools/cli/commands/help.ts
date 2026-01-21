import { Command } from 'commander'
import chalk from 'chalk'

export const helpCommand = new Command('help')
  .description('Show detailed help information')
  .action(() => {
    console.log(chalk.bold.blue('🔍 Payload CMS Blocks & Components Analyzer'))
    console.log('')
    console.log(chalk.bold('USAGE:'))
    console.log('  blocks-analyzer analyze [options]')
    console.log('')
    console.log(chalk.bold('ANALYSIS SCOPES:'))
    console.log('  blocks      - Analyze only block configurations')
    console.log('  components  - Analyze only React components')
    console.log('  full        - Complete analysis (blocks + components + integration)')
    console.log('')
    console.log(chalk.bold('OUTPUT FORMATS:'))
    console.log('  console     - Colored terminal output (default)')
    console.log('  json        - JSON format for programmatic use')
    console.log('  html        - Interactive HTML report')
    console.log('')
    console.log(chalk.bold('EXAMPLES:'))
    console.log('  # Basic analysis with console output')
    console.log('  blocks-analyzer analyze')
    console.log('')
    console.log('  # Analyze only blocks')
    console.log('  blocks-analyzer analyze --scope blocks')
    console.log('')
    console.log('  # Generate HTML report')
    console.log('  blocks-analyzer analyze --format html --output report.html')
    console.log('')
    console.log('  # Custom directories with verbose output')
    console.log(
      '  blocks-analyzer analyze --blocks-dir ./src/blocks --components-dir ./src/components --verbose',
    )
    console.log('')
    console.log('  # Skip optional features for faster analysis')
    console.log('  blocks-analyzer analyze --no-tests --no-patterns')
    console.log('')
    console.log('  # Focus on critical issues only')
    console.log('  blocks-analyzer analyze --severity critical')
    console.log('')
    console.log(chalk.bold('OPTIONS:'))
    console.log(
      '  -b, --blocks-dir <path>     Directory containing block configurations (auto-detected)',
    )
    console.log(
      '  -c, --components-dir <path> Directory containing React components (auto-detected)',
    )
    console.log(
      '  -s, --scope <scope>         Analysis scope: blocks, components, or full (default: full)',
    )
    console.log(
      '  -f, --format <format>       Output format: console, json, or html (default: console)',
    )
    console.log('  -o, --output <path>         Output file path (required for json/html formats)')
    console.log('  --no-tests                  Skip test generation')
    console.log('  --no-patterns               Skip official pattern comparison')
    console.log(
      '  --severity <level>          Minimum severity level: all, critical, high (default: all)',
    )
    console.log('  --verbose                   Enable verbose logging')
    console.log('  -h, --help                  Display help for command')
    console.log('  -V, --version               Display version number')
    console.log('')
    console.log(chalk.bold('SEVERITY LEVELS:'))
    console.log('  critical    - Security vulnerabilities, missing access control')
    console.log('  high        - Accessibility violations, performance issues')
    console.log('  medium      - Best practice violations, missing validations')
    console.log('  low         - Style issues, minor improvements')
    console.log('')
    console.log(chalk.bold('REPORT SECTIONS:'))
    console.log('  📊 Summary              - Overview of analysis results')
    console.log('  📦 Block Analysis       - Block configuration issues and metrics')
    console.log('  ⚛️  Component Analysis   - React component issues and metrics')
    console.log('  🔗 Integration Analysis - Block-component mapping validation')
    console.log('  📋 Pattern Comparison   - Comparison against official patterns')
    console.log('  🚀 Implementation Guide - Prioritized improvement recommendations')
    console.log('')
    console.log(
      chalk.gray('For more information, visit: https://github.com/your-org/blocks-analyzer'),
    )
  })
