/**
 * Email Service Configuration
 * 
 * This service sends form data to Vercel API Routes which handle
 * SMTP email sending on the server side.
 * 
 * See EMAIL_SETUP.md for detailed instructions.
 */

// Vercel API Routes Configuration
// Uses Vercel serverless functions (API routes in /api directory)
// No separate backend server needed - functions run on Vercel
const USE_API = true
const API_ENDPOINT_CONTACT = '/api/contact'
const API_ENDPOINT_SEND_EMAIL = '/api/send-email'

/**
 * Send email via Vercel API Route (contact form - full details)
 */
async function sendViaContactAPI(
  subject: string,
  formData: Record<string, unknown>,
  type: 'contact' | 'devis' = 'contact'
): Promise<void> {
  try {
    const response = await fetch(API_ENDPOINT_CONTACT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
        subject: subject,
        ...formData,
      }),
    })

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `API returned status ${response.status}: ${text || 'API route not found. Make sure you are running "vercel dev" for local development.'}`
      )
    }

    // Parse JSON only if response is ok
    let result
    try {
      result = await response.json()
    } catch {
      throw new Error('Invalid JSON response from server')
    }

    if (!result.success) {
      throw new Error(result.error || 'Email sending failed')
    }

    console.log('Email sent successfully via Vercel API:', result.messageId)
  } catch (error) {
    console.error('Error sending email via API:', error)
    throw error
  }
}

/**
 * Send email via Vercel API Route (simple form - send-email)
 */
async function sendViaEmailAPI(
  subject: string,
  formData: Record<string, unknown>
): Promise<void> {
  try {
    const response = await fetch(API_ENDPOINT_SEND_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject,
        ...formData,
      }),
    })

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `API returned status ${response.status}: ${text || 'API route not found. Make sure you are running "vercel dev" for local development.'}`
      )
    }

    // Parse JSON only if response is ok
    let result
    try {
      result = await response.json()
    } catch {
      throw new Error('Invalid JSON response from server')
    }

    if (!result.success) {
      throw new Error(result.error || 'Email sending failed')
    }

    console.log('Email sent successfully via Vercel API:', result.messageId)
  } catch (error) {
    console.error('Error sending email via API:', error)
    throw error
  }
}

/**
 * Main function to send email
 * Uses Vercel API Routes to send emails via SMTP
 * @param subject - Email subject (e.g., "Commandez Votre Pièce" or "Demande d'ouverture de compte professionnel")
 * @param formData - Form data object
 * @param useSimpleForm - If true, uses simple send-email endpoint, otherwise uses full contact endpoint
 */
export async function sendEmail(
  subject: string,
  formData: Record<string, unknown>,
  useSimpleForm: boolean = false
): Promise<void> {
  try {
    if (USE_API) {
      if (useSimpleForm) {
        await sendViaEmailAPI(subject, formData)
      } else {
        // Determine type based on form data
        const type = formData.companyName || formData.siret ? 'devis' : 'contact'
        await sendViaContactAPI(subject, formData, type)
      }
    } else {
      throw new Error(
        'Email API is not configured. Please set up SMTP environment variables.\n' +
        'See EMAIL_SETUP.md for instructions.'
      )
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
