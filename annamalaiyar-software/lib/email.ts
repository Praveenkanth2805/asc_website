import * as brevo from '@sendinblue/client'

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

interface EmailProps {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailProps) {
  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.sender = { name: 'Annamalaiyar Software Centre', email: process.env.BREVO_SMTP_USER! }
  sendSmtpEmail.to = [{ email: to }]
  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = html
  await apiInstance.sendTransacEmail(sendSmtpEmail)
}