/**
 * Form Email Template Utilities
 *
 * These utilities generate HTML email templates for form submissions.
 * To use email notifications, configure an email adapter in payload.config.ts:
 *
 * Example with nodemailer:
 * import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
 *
 * export default buildConfig({
 *   email: nodemailerAdapter({
 *     defaultFromAddress: 'noreply@example.com',
 *     defaultFromName: 'Your Site Name',
 *     transportOptions: {
 *       host: process.env.SMTP_HOST,
 *       port: 587,
 *       auth: {
 *         user: process.env.SMTP_USER,
 *         pass: process.env.SMTP_PASS,
 *       },
 *     },
 *   }),
 * })
 */

interface FormSubmission {
  id: string
  form: string | any
  submissionData: Array<{
    field: string
    value: any
  }>
  createdAt: string
}

interface Form {
  id: string
  title?: string
  fields?: any[]
  emailNotifications?: {
    includeSubmissionData?: boolean
  }
}

/**
 * Generate HTML email content for form submission notification
 */
export function generateFormSubmissionEmail(submission: FormSubmission, form: Form): string {
  const formTitle = form.title || 'Form Submission'
  const submissionDate = new Date(submission.createdAt).toLocaleString()

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formTitle} - New Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    .meta {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .meta strong {
      color: #2c3e50;
    }
    .field {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9ecef;
    }
    .field:last-child {
      border-bottom: none;
    }
    .field-label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 5px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-value {
      color: #212529;
      font-size: 16px;
      word-wrap: break-word;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }
    .empty-value {
      color: #adb5bd;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>New ${formTitle}</h1>
    
    <div class="meta">
      <strong>Submission ID:</strong> ${submission.id}<br>
      <strong>Submitted:</strong> ${submissionDate}
    </div>
`

  // Include submission data if enabled
  if (form.emailNotifications?.includeSubmissionData !== false && submission.submissionData) {
    html += '<div class="submission-data">\n'

    for (const field of submission.submissionData) {
      const fieldLabel = field.field || 'Unknown Field'
      let fieldValue = field.value

      // Format different value types
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        fieldValue = '<span class="empty-value">(No response)</span>'
      } else if (typeof fieldValue === 'boolean') {
        fieldValue = fieldValue ? 'Yes' : 'No'
      } else if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(', ')
      } else if (typeof fieldValue === 'object') {
        fieldValue = JSON.stringify(fieldValue, null, 2)
      }

      html += `
      <div class="field">
        <div class="field-label">${escapeHtml(fieldLabel)}</div>
        <div class="field-value">${fieldValue}</div>
      </div>
`
    }

    html += '</div>\n'
  }

  html += `
    <div class="footer">
      This is an automated notification from your form builder system.
    </div>
  </div>
</body>
</html>
`

  return html
}

/**
 * Generate plain text email content for form submission notification
 */
export function generateFormSubmissionText(submission: FormSubmission, form: Form): string {
  const formTitle = form.title || 'Form Submission'
  const submissionDate = new Date(submission.createdAt).toLocaleString()

  let text = `New ${formTitle}\n\n`
  text += `Submission ID: ${submission.id}\n`
  text += `Submitted: ${submissionDate}\n\n`

  // Include submission data if enabled
  if (form.emailNotifications?.includeSubmissionData !== false && submission.submissionData) {
    text += 'Submission Data:\n'
    text += '='.repeat(50) + '\n\n'

    for (const field of submission.submissionData) {
      const fieldLabel = field.field || 'Unknown Field'
      let fieldValue = field.value

      // Format different value types
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        fieldValue = '(No response)'
      } else if (typeof fieldValue === 'boolean') {
        fieldValue = fieldValue ? 'Yes' : 'No'
      } else if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(', ')
      } else if (typeof fieldValue === 'object') {
        fieldValue = JSON.stringify(fieldValue, null, 2)
      }

      text += `${fieldLabel}:\n${fieldValue}\n\n`
    }
  }

  text += '\n---\n'
  text += 'This is an automated notification from your form builder system.\n'

  return text
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(form: Form): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!form.emailNotifications) {
    errors.push('Email notifications configuration is missing')
    return { valid: false, errors }
  }

  if (!form.emailNotifications.enabled) {
    errors.push('Email notifications are not enabled')
    return { valid: false, errors }
  }

  // Check for recipients
  const recipients = (form.emailNotifications as any).recipients
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    errors.push('No email recipients configured')
  }

  // Validate recipient emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (recipients) {
    recipients.forEach((recipient: any, index: number) => {
      if (!recipient.email || !emailRegex.test(recipient.email)) {
        errors.push(`Invalid email address for recipient ${index + 1}`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
