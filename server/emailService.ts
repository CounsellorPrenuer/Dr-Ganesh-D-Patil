import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!this.isDevelopment) {
      // In production, this would be configured with real SMTP credentials
      // For example: Gmail, SendGrid, AWS SES, etc.
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (this.isDevelopment) {
      // In development, just log the email instead of sending it
      console.log('\n🔔 EMAIL NOTIFICATION (Development Mode) 🔔');
      console.log('=========================================');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Reply-To: ${options.replyTo || 'Not set'}`);
      console.log('Content:');
      console.log(options.html.replace(/<[^>]*>/g, '').trim()); // Strip HTML tags for console
      console.log('=========================================\n');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    if (!this.transporter) {
      throw new Error('Email transporter not configured for production');
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"SKILL+ Website" <noreply@skillplus.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo
      });

      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  private escapeHtml(text: string): string {
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };
    return String(text).replace(/[&<>"'\/]/g, (s) => entityMap[s]);
  }

  generateContactEmailHtml(name: string, email: string, subject: string, message: string): string {
    // Escape all user input to prevent HTML injection
    const safeName = this.escapeHtml(name);
    const safeEmail = this.escapeHtml(email);
    const safeSubject = this.escapeHtml(subject || 'No subject provided');
    const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
          New Contact Inquiry - SKILL+
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #475569;">${safeMessage}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Reply directly to this email</strong> to respond to ${safeName} at ${safeEmail}
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p>This email was sent from the SKILL+ website contact form</p>
          <p>Dr. Ganesh D. Patil - Educational Leadership & Career Counseling</p>
        </div>
      </div>
    `;
  }
}

export const emailService = new EmailService();