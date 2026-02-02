import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

const RECIPIENT_EMAIL = 'espaceauto92.info@gmail.com'

const fieldLabels: Record<string, string> = {
  name: 'Nom',
  fullName: 'Nom Complet',
  email: 'Email',
  phone: 'Téléphone',
  subject: 'Sujet',
  message: 'Message',
  year: 'Année',
  make: 'Marque',
  model: 'Modèle',
  matricule: 'Matricule',
  partGroup: 'Groupe de Pièce',
  partSubGroup: 'Sous-groupe de Pièce',
  additionalInfo: 'Informations Supplémentaires',
}

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

function createEmailHTML(data: Record<string, unknown>, subject: string): string {
  let fieldsHTML = ''
  for (const [key, value] of Object.entries(data)) {
    if (value && key !== 'subject') {
      const label = fieldLabels[key] || key
      fieldsHTML += `
        <div style="margin-bottom: 15px; padding: 12px; background-color: #f9fafb; border-left: 4px solid #dc2626; border-radius: 6px;">
          <div style="font-weight: 600; color: #dc2626; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${escapeHtml(label)}</div>
          <div style="color: #1f2937; font-size: 14px;">${escapeHtml(String(value))}</div>
        </div>
      `
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚗 ${escapeHtml(subject)}</h1>
        </div>
        <div style="padding: 30px 20px;">
          ${fieldsHTML}
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">Email envoyé depuis le site web Espace Auto 92</p>
          <p style="margin: 5px 0 0 0;">426 Avenue de la République, 92000 Nanterre, France</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { subject = 'Nouveau Message', ...formData } = req.body

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || RECIPIENT_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"Espace Auto 92 Website" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      subject: subject,
      html: createEmailHTML(formData, subject),
    })

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId 
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    })
  }
}
