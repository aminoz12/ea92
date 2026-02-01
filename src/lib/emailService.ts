/**
 * Email Service Configuration
 * 
 * This service uses EmailJS to send emails via SMTP directly from the frontend.
 * No backend server needed! EmailJS handles SMTP on their side.
 * 
 * Setup Instructions:
 * 1. Sign up at https://www.emailjs.com/ (Free tier available)
 * 2. Create an email service (Gmail) and connect your Gmail account
 * 3. Create an email template
 * 4. Get your Service ID, Template ID, and Public Key
 * 5. Add them to your .env file or replace the values below
 * 
 * See EMAIL_SETUP.md for detailed instructions.
 */

const RECIPIENT_EMAIL = 'Espaceauto92.contact@gmail.com'

// Vercel API Routes Configuration
// Uses Vercel serverless functions (API routes in /api directory)
// No separate backend server needed - functions run on Vercel
const USE_API = true
const API_ENDPOINT_CONTACT = '/api/contact'
const API_ENDPOINT_SEND_EMAIL = '/api/send-email'

/**
 * Format form data as a readable email body (HTML version for rich formatting)
 */
function formatFormDataAsEmailHTML(data: Record<string, any>): string {
  const fieldLabels: Record<string, string> = {
    name: 'Nom',
    fullName: 'Nom Complet',
    companyName: 'Raison Sociale',
    email: 'Email',
    phone: 'Téléphone',
    subject: 'Sujet',
    message: 'Message',
    siret: 'SIRET',
    address: 'Adresse',
    city: 'Ville',
    postalCode: 'Code Postal',
    year: 'Année',
    make: 'Marque',
    model: 'Modèle',
    matricule: 'Matricule',
    partGroup: 'Groupe de Pièce',
    partSubGroup: 'Sous-groupe de Pièce',
    additionalInfo: 'Informations Supplémentaires',
  }

  let htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .email-body {
          padding: 30px 20px;
        }
        .field-group {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f9fafb;
          border-left: 4px solid #dc2626;
          border-radius: 6px;
        }
        .field-label {
          font-weight: 600;
          color: #dc2626;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .field-value {
          color: #1f2937;
          font-size: 16px;
          word-wrap: break-word;
        }
        .field-value.message {
          white-space: pre-wrap;
          line-height: 1.8;
        }
        .email-footer {
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 25px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>🚗 Nouvelle Soumission de Formulaire</h1>
        </div>
        <div class="email-body">
  `

  // Group fields logically
  const personalFields = ['name', 'fullName', 'email', 'phone']
  const companyFields = ['companyName', 'siret', 'address', 'city', 'postalCode']
  const vehicleFields = ['year', 'make', 'model', 'matricule']
  const partsFields = ['partGroup', 'partSubGroup']
  const messageFields = ['subject', 'message', 'additionalInfo']
  const processedFields = new Set<string>()

  // Add personal information
  const personalData = Object.entries(data).filter(([key]) => personalFields.includes(key) && data[key])
  if (personalData.length > 0) {
    personalData.forEach(([key, value]) => {
      processedFields.add(key)
      const label = fieldLabels[key] || key
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  // Add company information
  const companyData = Object.entries(data).filter(([key]) => companyFields.includes(key) && data[key])
  if (companyData.length > 0) {
    if (personalData.length > 0) htmlBody += '<div class="divider"></div>'
    companyData.forEach(([key, value]) => {
      processedFields.add(key)
      const label = fieldLabels[key] || key
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  // Add vehicle information
  const vehicleData = Object.entries(data).filter(([key]) => vehicleFields.includes(key) && data[key])
  if (vehicleData.length > 0) {
    if (personalData.length > 0 || companyData.length > 0) htmlBody += '<div class="divider"></div>'
    vehicleData.forEach(([key, value]) => {
      processedFields.add(key)
      const label = fieldLabels[key] || key
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  // Add parts information
  const partsData = Object.entries(data).filter(([key]) => partsFields.includes(key) && data[key])
  if (partsData.length > 0) {
    if (personalData.length > 0 || companyData.length > 0 || vehicleData.length > 0) htmlBody += '<div class="divider"></div>'
    partsData.forEach(([key, value]) => {
      processedFields.add(key)
      const label = fieldLabels[key] || key
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  // Add message/subject fields
  const messageData = Object.entries(data).filter(([key]) => messageFields.includes(key) && data[key])
  if (messageData.length > 0) {
    if (personalData.length > 0 || companyData.length > 0 || vehicleData.length > 0 || partsData.length > 0) htmlBody += '<div class="divider"></div>'
    messageData.forEach(([key, value]) => {
      processedFields.add(key)
      const label = fieldLabels[key] || key
      const isMessage = key === 'message' || key === 'additionalInfo'
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value ${isMessage ? 'message' : ''}">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  // Add any remaining fields
  const remainingFields = Object.entries(data).filter(([key]) => !processedFields.has(key) && data[key])
  if (remainingFields.length > 0) {
    if (processedFields.size > 0) htmlBody += '<div class="divider"></div>'
    remainingFields.forEach(([key, value]) => {
      const label = fieldLabels[key] || key
      htmlBody += `
          <div class="field-group">
            <div class="field-label">${label}</div>
            <div class="field-value">${escapeHtml(String(value))}</div>
          </div>
      `
    })
  }

  htmlBody += `
        </div>
        <div class="email-footer">
          <p>Email envoyé depuis le site web Espace Auto 92</p>
          <p>426 Avenue de la République, 92000 Nanterre, France</p>
        </div>
      </div>
    </body>
    </html>
  `

  return htmlBody
}

/**
 * Format form data as a readable email body (plain text version for fallback)
 */
function formatFormDataAsEmail(data: Record<string, any>): string {
  let emailBody = 'Nouvelle soumission de formulaire:\n\n'
  
  const fieldLabels: Record<string, string> = {
    name: 'Nom',
    fullName: 'Nom Complet',
    companyName: 'Raison Sociale',
    email: 'Email',
    phone: 'Téléphone',
    subject: 'Sujet',
    message: 'Message',
    siret: 'SIRET',
    address: 'Adresse',
    city: 'Ville',
    postalCode: 'Code Postal',
    year: 'Année',
    make: 'Marque',
    model: 'Modèle',
    matricule: 'Matricule',
    partGroup: 'Groupe de Pièce',
    partSubGroup: 'Sous-groupe de Pièce',
    additionalInfo: 'Informations Supplémentaires',
  }

  for (const [key, value] of Object.entries(data)) {
    if (value) {
      const label = fieldLabels[key] || key
      emailBody += `${label}: ${value}\n`
    }
  }
  
  return emailBody
}

/**
 * Escape HTML to prevent XSS
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
 * Send email via Vercel API Route (contact form - full details)
 */
async function sendViaContactAPI(
  subject: string,
  formData: Record<string, any>,
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
    } catch (parseError) {
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
  formData: Record<string, any>
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
    } catch (parseError) {
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
  formData: Record<string, any>,
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
