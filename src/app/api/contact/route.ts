import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Configuration du transporteur email avec votre compte Outlook
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true pour le port 465, false pour les autres ports
      auth: {
        user: 'joelbeya.bj@outlook.com', // Votre adresse Outlook
        pass: process.env.OUTLOOK_PASSWORD, // Mot de passe de l'application généré dans les paramètres de sécurité Outlook
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Options de l'email
    const mailOptions = {
      from: 'joelbeya.bj@outlook.com',
      to: 'joelbeya.bj@outlook.com', // Même adresse pour les tests
      subject: `Nouveau message de contact: ${subject}`,
      text: `
        Vous avez reçu un nouveau message du formulaire de contact :
        
        Nom: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
