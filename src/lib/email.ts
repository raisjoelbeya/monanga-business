import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP avec Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

// Interface pour les options d'email
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

// Fonction pour envoyer un email
export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.OUTLOOK_EMAIL || !process.env.OUTLOOK_PASSWORD) {
      console.error('Les identifiants SMTP ne sont pas configurés');
      throw new Error('Erreur de configuration du serveur email');
    }

    const mailOptions = {
      from: `"Monanga Business" <${process.env.OUTLOOK_EMAIL}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
}
