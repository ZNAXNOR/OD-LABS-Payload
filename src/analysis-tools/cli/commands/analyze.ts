import { Command } from 'commander'
import chalk from 'chalk'
import path from 'path'
import { AnalysisOrchestrator } from '../../analyzers/AnalysisOrchestrator.js'
import { ConsoleFormatter } from '../formatters/ConsoleFormatter.js'
import { JsonFormatter } from '../formatters/JsonFormatter.js'
import { HtmlFormatter } from '../formatters/HtmlFormatter.js'
import {
  ProgressManager,
  ANALYSIS_STEPS,
  BLOCKS_ONLY_STEPS,
  COMPONENTS_ONLY_STEPS,
} from '../utils/ProgressManager.js'
import {
  validateDirectories,
  validateOutputPath,
  printValidationResults,
} from '../utils/validation.js'
import type { AnalysisOptions, OutputFormat } from '../../types/index.js'

export const analyzeCommand = new Command('analyze')
  .description('Analyze Payload CMS blocks and components')
  .option('-b, --blocks-dir <path>', 'Directory containing block configurations', 'src/blocks')
  .option('-c, --components-dir <path>', 'Directory containing React components', 'src/components')
  .option('-s, --scope <scope>', 'Analysis scope: blocks, components, or full', 'full')
  .option('-f, --format <format>', 'Output format: console, json, or html', 'console')
  .option('-o, --output <path>', 'Output file path (for json/html formats)')
  .option('--no-tests', 'Skip test generation')
  .option('--no-patterns', 'Skip official pattern comparison')
  .option('--severity <level>', 'Minimum severity level: all, critical, high', 'all')
  .option('--verbose', 'Enable verbose logging')
  .action(async (options) => {
    // Determine progress steps based on scope
    let progressSteps = ANALYSIS_STEPS
    if (options.scope === 'blocks') {
      progressSteps = BLOCKS_ONLY_STEPS
    } else if (options.scope === 'components') {
      progressSteps = COMPONENTS_ONLY_STEPS
    }

    const progress = new ProgressManager(progressSteps, options.verbose)

    try {
      // Validate options
      validateOptions(options)

      progress.start()

      // Convert relative paths to absolute
      const blocksDir = path.resolve(process.cwd(), options.blocksDir)
      const componentsDir = path.resolve(process.cwd(), options.componentsDir)

      if (options.verbose) {
        progress.info(`Blocks directory: ${blocksDir}`)
        progress.info(`Components directory: ${componentsDir}`)
        progress.info(`Analysis scope: ${options.scope}`)
        progress.info(`Output format: ${options.format}`)
      }

      progress.nextStep()

      // Create analysis options
      const analysisOptions: AnalysisOptions = {
        blockDir: blocksDir,
        componentDir: componentsDir,
        includeTests: options.tests,
        compareOfficial: options.patterns,
        severity: options.severity as 'all' | 'critical' | 'high',
      }

      // Initialize orchestrator
      const orchestrator = new AnalysisOrchestrator()

      // Run analysis based on scope
      progress.nextStep()
      let result

      switch (options.scope) {
        case 'blocks':
          progress.updateCurrentStep('Analyzing block configurations...')
          result = await orchestrator.analyzeBlocks([blocksDir])
          break
        case 'components':
          progress.updateCurrentStep('Analyzing React components...')
          result = await orchestrator.analyzeComponents([componentsDir])
          break
        case 'full':
        default:
          progress.updateCurrentStep('Running comprehensive analysis...')
          result = await orchestrator.analyze(analysisOptions)

          // Update progress for full analysis steps
          if (options.scope === 'full') {
            progress.nextStep('Analyzing components...')
            progress.nextStep('Validating integration...')

            if (options.patterns) {
              progress.nextStep('Comparing against official patterns...')
            }

            if (options.tests) {
              progress.nextStep('Generating test suites...')
            }
          }
          break
      }

      progress.nextStep('Generating report...')

      // Format and output results
      await formatAndOutput(result, options, progress)

      progress.succeed('Analysis completed successfully! 🎉')
    } catch (error) {
      progress.fail('Analysis failed')
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error))

      if (options.verbose && error instanceof Error) {
        console.error(chalk.gray('Stack trace:'))
        console.error(chalk.gray(error.stack))
      }

      process.exit(1)
    }
  })

function validateOptions(options: any): void {
  const validScopes = ['blocks', 'components', 'full']
  const validFormats = ['console', 'json', 'html']
  const validSeverities = ['all', 'critical', 'high']

  if (!validScopes.includes(options.scope)) {
    throw new Error(`Invalid scope: ${options.scope}. Must be one of: ${validScopes.join(', ')}`)
  }

  if (!validFormats.includes(options.format)) {
    throw new Error(`Invalid format: ${options.format}. Must be one of: ${validFormats.join(', ')}`)
  }

  if (!validSeverities.includes(options.severity)) {
    throw new Error(
      `Invalid severity: ${options.severity}. Must be one of: ${validSeverities.join(', ')}`,
    )
  }

  // Validate directories
  const dirValidation = validateDirectories(options.blocksDir, options.componentsDir)
  if (!dirValidation.isValid) {
    printValidationResults(dirValidation)
    throw new Error('Directory validation failed')
  }

  // Print warnings if any
  if (dirValidation.warnings.length > 0) {
    printValidationResults(dirValidation)
  }

  // Validate output path for file formats
  if (options.format === 'json' || options.format === 'html') {
    const outputValidation = validateOutputPath(options.output, options.format)
    if (!outputValidation.isValid) {
      printValidationResults(outputValidation)
      throw new Error('Output path validation failed')
    }

    // Print warnings if any
    if (outputValidation.warnings.length > 0) {
      printValidationResults(outputValidation)
    }
  }
}

async function formatAndOutput(
  result: any,
  options: any,
  progress: ProgressManager,
): Promise<void> {
  const format = options.format as OutputFormat

  switch (format) {
    case 'console': {
      progress.updateCurrentStep('Formatting console output...')
      const formatter = new ConsoleFormatter()
      const output = await formatter.format(result)
      console.log(output)
      break
    }

    case 'json': {
      progress.updateCurrentStep('Generating JSON report...')
      const formatter = new JsonFormatter()
      const output = await formatter.format(result)
      await formatter.writeToFile(output, options.output)
      console.log(chalk.green(`JSON report written to: ${options.output}`))
      break
    }

    case 'html': {
      progress.updateCurrentStep('Generating HTML report...')
      const formatter = new HtmlFormatter()
      const output = await formatter.format(result)
      await formatter.writeToFile(output, options.output)
      console.log(chalk.green(`HTML report written to: ${options.output}`))
      break
    }

    default:
      throw new Error(`Unsupported output format: ${format}`)
  }
}
