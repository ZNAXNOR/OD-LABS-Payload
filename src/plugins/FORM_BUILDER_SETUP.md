# Form Builder Plugin Setup Guide

This guide explains how to use and configure the enhanced form builder plugin in this PayloadCMS project.

## Features

The form builder plugin has been enhanced with the following features:

### 1. Email Notifications

- Configure email recipients for form submissions
- Customize email subject and reply-to address
- Include/exclude submission data in emails
- Support for multiple recipients

### 2. Validation Settings

- **Honeypot Protection**: Hidden field to prevent spam bot submissions
- **Rate Limiting**: Limit submissions per IP address within a time window
- **Authentication Requirement**: Optionally require users to be logged in

### 3. Response Settings

- Custom success and error messages
- Optional redirect URL after successful submission
- Configurable confirmation messages with rich text

## Configuration

### Email Notifications Setup

To enable email notifications, you need to configure an email adapter in `src/payload.config.ts`.

#### Option 1: Nodemailer (SMTP)

1. Install the nodemailer adapter:

```bash
pnpm add @payloadcms/email-nodemailer
```

2. Add environment variables to `.env`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM_ADDRESS=noreply@example.com
SMTP_FROM_NAME=Your Site Name
```

3. Update `src/payload.config.ts`:

```typescript
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  // ... other config
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@example.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Your Site',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
```

#### Option 2: Resend

1. Install the resend adapter:

```bash
pnpm add @payloadcms/email-resend
```

2. Add environment variable to `.env`:

```env
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_ADDRESS=noreply@example.com
RESEND_FROM_NAME=Your Site Name
```

3. Update `src/payload.config.ts`:

```typescript
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  // ... other config
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@example.com',
    defaultFromName: process.env.RESEND_FROM_NAME || 'Your Site',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
```

### Implementing Email Sending

Once an email adapter is configured, update the form submission hook in `src/plugins/index.ts`:

```typescript
// Replace the logging code with actual email sending:
if (form?.emailNotifications?.enabled && form?.emailNotifications?.recipients?.length) {
  const { generateFormSubmissionEmail, generateFormSubmissionText } =
    await import('@/utilities/formEmailTemplate')

  const htmlContent = generateFormSubmissionEmail(doc, form)
  const textContent = generateFormSubmissionText(doc, form)

  await req.payload.sendEmail({
    to: form.emailNotifications.recipients.map((r: any) => r.email),
    subject: form.emailNotifications.subject || 'New Form Submission',
    html: htmlContent,
    text: textContent,
    replyTo: form.emailNotifications.replyTo || undefined,
  })
}
```

## Using Forms in the Admin Panel

### Creating a Form

1. Navigate to **Forms** in the admin panel
2. Click **Create New**
3. Configure the form:
   - **Title**: Name of your form
   - **Fields**: Add form fields (text, email, textarea, select, etc.)
   - **Confirmation Message**: Message shown after submission
   - **Email Notifications**: Configure email settings
   - **Validation Settings**: Set up spam protection and rate limiting
   - **Response Settings**: Customize success/error messages

### Email Notification Settings

- **Enable Email Notifications**: Toggle to enable/disable
- **Notification Recipients**: Add email addresses to receive notifications
- **Email Subject**: Customize the subject line
- **Reply-To Address**: Set a reply-to address (or leave empty to use submitter's email)
- **Include Submission Data**: Toggle to include/exclude form data in emails

### Validation Settings

- **Enable Honeypot Protection**: Adds a hidden field to catch bots
- **Enable Rate Limiting**: Prevents spam by limiting submissions
  - **Rate Limit Window**: Time window in minutes (1-1440)
  - **Max Submissions Per Window**: Maximum submissions allowed per IP
- **Require Authentication**: Only allow logged-in users to submit

### Response Settings

- **Success Message**: Shown after successful submission
- **Error Message**: Shown when submission fails
- **Redirect URL**: Optional URL to redirect to after success

## Frontend Implementation

### Rendering a Form

```tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ContactPage() {
  const payload = await getPayload({ config })

  const form = await payload.find({
    collection: 'forms',
    where: {
      title: { equals: 'Contact Form' },
    },
    limit: 1,
  })

  if (!form.docs[0]) {
    return <div>Form not found</div>
  }

  return <FormComponent form={form.docs[0]} />
}
```

### Submitting a Form

```tsx
'use client'
import React, { useState } from 'react'

export function FormComponent({ form }: { form: any }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const submissionData = form.fields.map((field: any) => ({
      field: field.name,
      value: formData.get(field.name),
    }))

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: form.id,
          submissionData,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage(form.responseSettings?.successMessage || 'Thank you for your submission!')

        // Redirect if configured
        if (form.responseSettings?.redirectUrl) {
          setTimeout(() => {
            window.location.href = form.responseSettings.redirectUrl
          }, 2000)
        }
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(form.responseSettings?.errorMessage || 'There was an error submitting your form.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {form.fields.map((field: any) => (
        <div key={field.id}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.blockType}
            name={field.name}
            id={field.name}
            required={field.required}
          />
        </div>
      ))}

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>

      {status === 'success' && <div className="success">{message}</div>}
      {status === 'error' && <div className="error">{message}</div>}
    </form>
  )
}
```

## Security Best Practices

1. **Always enable honeypot protection** for public forms
2. **Enable rate limiting** to prevent spam and abuse
3. **Validate all input** on the server side
4. **Use HTTPS** for form submissions
5. **Sanitize email content** to prevent XSS attacks
6. **Monitor submission logs** for suspicious activity
7. **Keep email credentials secure** using environment variables

## Troubleshooting

### Emails Not Sending

1. Check that an email adapter is configured in `payload.config.ts`
2. Verify environment variables are set correctly
3. Check the Payload logs for error messages
4. Test SMTP credentials with a simple test email
5. Ensure firewall allows outbound SMTP connections

### Rate Limiting Not Working

1. Verify rate limiting is enabled in form settings
2. Check that the time window and max submissions are configured
3. Note: IP tracking requires additional implementation in the form-submissions collection

### Form Not Displaying

1. Verify the form exists and is published
2. Check that the form ID is correct
3. Ensure the frontend has access to read forms
4. Check browser console for errors

## Additional Resources

- [Payload Form Builder Plugin Docs](https://payloadcms.com/docs/plugins/form-builder)
- [Payload Email Configuration](https://payloadcms.com/docs/email/overview)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Resend Documentation](https://resend.com/docs)
