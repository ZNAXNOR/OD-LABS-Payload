import ora, { Ora } from 'ora'
import chalk from 'chalk'

export interface ProgressStep {
  id: string
  title: string
  weight: number
}

export class ProgressManager {
  private spinner: Ora
  private steps: ProgressStep[]
  private currentStepIndex: number = 0
  private totalWeight: number = 0
  private completedWeight: number = 0
  private verbose: boolean

  constructor(steps: ProgressStep[], verbose: boolean = false) {
    this.steps = steps
    this.verbose = verbose
    this.totalWeight = steps.reduce((sum, step) => sum + step.weight, 0)
    this.spinner = ora()
  }

  start(): void {
    if (this.steps.length === 0) return

    const firstStep = this.steps[0]
    if (!firstStep) {
      throw new Error('No steps provided to ProgressManager')
    }
    this.spinner.start(this.formatStepMessage(firstStep, 0))
  }

  nextStep(message?: string): void {
    if (this.currentStepIndex < this.steps.length) {
      const currentStep = this.steps[this.currentStepIndex]
      if (!currentStep) {
        throw new Error('Invalid step index')
      }

      this.completedWeight += currentStep.weight

      if (this.verbose) {
        this.spinner.succeed(chalk.green(`✓ ${currentStep.title}`))
      }
    }

    this.currentStepIndex++

    if (this.currentStepIndex < this.steps.length) {
      const nextStep = this.steps[this.currentStepIndex]
      if (!nextStep) {
        throw new Error('Invalid next step index')
      }

      const progress = Math.round((this.completedWeight / this.totalWeight) * 100)

      const stepMessage = message || nextStep.title
      this.spinner.start(
        this.formatStepMessage(
          {
            id: nextStep.id,
            title: stepMessage,
            weight: nextStep.weight,
          },
          progress,
        ),
      )
    }
  }

  updateCurrentStep(message: string): void {
    if (this.currentStepIndex < this.steps.length) {
      const currentStep = this.steps[this.currentStepIndex]
      if (!currentStep) {
        throw new Error('Invalid current step index')
      }

      const progress = Math.round((this.completedWeight / this.totalWeight) * 100)
      this.spinner.text = this.formatStepMessage(
        {
          id: currentStep.id,
          title: message,
          weight: currentStep.weight,
        },
        progress,
      )
    }
  }

  succeed(message?: string): void {
    if (message) {
      this.spinner.succeed(chalk.green(message))
    } else {
      this.spinner.succeed(chalk.green('✓ Analysis completed successfully'))
    }
  }

  fail(message?: string): void {
    if (message) {
      this.spinner.fail(chalk.red(message))
    } else {
      this.spinner.fail(chalk.red('✗ Analysis failed'))
    }
  }

  info(message: string): void {
    if (this.verbose) {
      this.spinner.info(chalk.blue(message))
    }
  }

  warn(message: string): void {
    this.spinner.warn(chalk.yellow(message))
  }

  stop(): void {
    this.spinner.stop()
  }

  private formatStepMessage(step: ProgressStep, progress: number): string {
    const progressBar = this.createProgressBar(progress)
    const stepInfo = this.verbose ? ` [${this.currentStepIndex + 1}/${this.steps.length}]` : ''

    return `${progressBar} ${step.title}${stepInfo}`
  }

  private createProgressBar(progress: number, width: number = 20): string {
    const filled = Math.round((progress / 100) * width)
    const empty = width - filled

    const filledBar = '█'.repeat(filled)
    const emptyBar = '░'.repeat(empty)

    return chalk.cyan(`[${filledBar}${emptyBar}] ${progress}%`)
  }
}

// Predefined progress steps for common analysis workflows
export const ANALYSIS_STEPS: ProgressStep[] = [
  { id: 'init', title: 'Initializing analysis...', weight: 5 },
  { id: 'discovery', title: 'Discovering files...', weight: 10 },
  { id: 'blocks', title: 'Analyzing blocks...', weight: 25 },
  { id: 'components', title: 'Analyzing components...', weight: 25 },
  { id: 'integration', title: 'Validating integration...', weight: 15 },
  { id: 'patterns', title: 'Comparing patterns...', weight: 10 },
  { id: 'tests', title: 'Generating tests...', weight: 5 },
  { id: 'report', title: 'Generating report...', weight: 5 },
]

export const BLOCKS_ONLY_STEPS: ProgressStep[] = [
  { id: 'init', title: 'Initializing analysis...', weight: 10 },
  { id: 'discovery', title: 'Discovering block files...', weight: 20 },
  { id: 'blocks', title: 'Analyzing blocks...', weight: 60 },
  { id: 'report', title: 'Generating report...', weight: 10 },
]

export const COMPONENTS_ONLY_STEPS: ProgressStep[] = [
  { id: 'init', title: 'Initializing analysis...', weight: 10 },
  { id: 'discovery', title: 'Discovering component files...', weight: 20 },
  { id: 'components', title: 'Analyzing components...', weight: 60 },
  { id: 'report', title: 'Generating report...', weight: 10 },
]
