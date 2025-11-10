import "server-only"
import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private static transporter: Transporter;

  private static async createTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465', // True for SSL, false for TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  static async sendEmail(options: EmailOptions) {
    try {
      const transporter = await this.createTransporter();

      const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        ...options,
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  static async sendThankYouEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      subject: 'Thank You for contacting us',
      html: `
        <h1>Hello, ${name}!</h1>
        <p>Thank you for contacting us. We will get back to you shortly.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      `,
    });
  }

  static async sendPasswordResetEmail(to: string, resetLink: string) {
    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
