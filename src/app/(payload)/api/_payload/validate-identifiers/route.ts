/**
 * API Route for Real-Time Identifier Validation
 */

import {
  DevelopmentWarningChecker,
  formatWarningsForConsole,
} from '@/utilities/validation/developmentWarnings'
import config from '@payload-config'

export async function GET() {
  try {
    // const payload = await getPayload({ config })
    const checker = new DevelopmentWarningChecker()

    const warnings = checker.checkPayloadConfig((await config) as any)
    const formatted = formatWarningsForConsole(warnings)

    return Response.json({
      success: true,
      warnings,
      formatted,
      timestamp: new Date().toISOString(),
      count: {
        total: warnings.length,
        errors: warnings.filter((w) => w.severity === 'error').length,
        warnings: warnings.filter((w) => w.severity === 'warning').length,
        info: warnings.filter((w) => w.severity === 'info').length,
      },
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
