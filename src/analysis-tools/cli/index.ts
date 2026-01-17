#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { analyzeCommand } from './commands/analyze.js'
import { helpCommand } from './commands/help.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))

const program = new Command()

program
  .name('blocks-analyzer')
  .description('Payload CMS blocks and components analysis tool')
  .version(packageJson.version)

// Add commands
program.addCommand(analyzeCommand)
program.addCommand(helpCommand)

// Global error handler
program.exitOverride((err) => {
  if (err.code === 'commander.version') {
    console.log(packageJson.version)
    process.exit(0)
  }
  if (err.code === 'commander.help') {
    process.exit(0)
  }
  console.error(chalk.red('Error:'), err.message)
  process.exit(1)
})

// Parse command line arguments
program.parse()
