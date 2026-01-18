import nodemailer from 'nodemailer'
import env from '#start/env'
import type User from '#models/user'

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      const smtpHost = env.get('SMTP_HOST')
      const smtpPort = env.get('SMTP_PORT')
      const smtpUser = env.get('SMTP_USER')
      const smtpPassword = env.get('SMTP_PASSWORD')

      if (!smtpHost || !smtpPort) {
        // Return a mock transporter for development without SMTP config
        this.transporter = {
          sendMail: async (options: nodemailer.SendMailOptions) => {
            console.log('📧 [Mock Email] Would send email:')
            console.log(`   To: ${options.to}`)
            console.log(`   Subject: ${options.subject}`)
            console.log(`   Preview URL: Check console for verification link`)
            return { messageId: 'mock-' + Date.now() }
          },
        } as nodemailer.Transporter
      } else {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth:
            smtpUser && smtpPassword
              ? {
                  user: smtpUser,
                  pass: smtpPassword,
                }
              : undefined,
        })
      }
    }
    return this.transporter
  }

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    const frontendUrl = env.get('FRONTEND_URL')
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`

    console.log(`🔗 Verification URL for ${user.email}: ${verificationUrl}`)

    const html = this.getVerificationEmailTemplate(user.name, verificationUrl)

    await this.getTransporter().sendMail({
      from: '"Focus Guide" <noreply@focusguide.app>',
      to: user.email,
      subject: 'Vérifiez votre adresse email',
      html,
    })
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    const frontendUrl = env.get('FRONTEND_URL')
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`

    console.log(`🔗 Password reset URL for ${user.email}: ${resetUrl}`)

    const html = this.getPasswordResetEmailTemplate(user.name, resetUrl)

    await this.getTransporter().sendMail({
      from: '"Focus Guide" <noreply@focusguide.app>',
      to: user.email,
      subject: 'Réinitialisez votre mot de passe',
      html,
    })
  }

  private getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Inter, -apple-system, sans-serif; line-height: 1.6; color: #262626; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #262626; margin: 0; }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D9FC00;
      color: #262626;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
    }
    .footer { margin-top: 30px; font-size: 14px; color: #666; }
    .link { word-break: break-all; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Focus Guide</h1>
    </div>
    <p>Bonjour ${name},</p>
    <p>Merci de vous être inscrit à Focus Guide ! Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" class="button">Vérifier mon email</a>
    </p>
    <p>Ou copiez-collez ce lien dans votre navigateur :</p>
    <p class="link">${verificationUrl}</p>
    <p class="footer">
      Ce lien expire dans 24 heures.<br>
      Si vous n'avez pas créé de compte Focus Guide, ignorez cet email.
    </p>
  </div>
</body>
</html>
`
  }

  private getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Inter, -apple-system, sans-serif; line-height: 1.6; color: #262626; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #262626; margin: 0; }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D9FC00;
      color: #262626;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
    }
    .footer { margin-top: 30px; font-size: 14px; color: #666; }
    .link { word-break: break-all; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Focus Guide</h1>
    </div>
    <p>Bonjour ${name},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
    </p>
    <p>Ou copiez-collez ce lien dans votre navigateur :</p>
    <p class="link">${resetUrl}</p>
    <p class="footer">
      Ce lien expire dans 1 heure.<br>
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
    </p>
  </div>
</body>
</html>
`
  }
}

export const emailService = new EmailService()
