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

  generateContactEmailHtml(name: string, email: string, subject: string, message: string, sheetsUrl?: string | null): string {
    // Escape all user input to prevent HTML injection
    const safeName = this.escapeHtml(name);
    const safeEmail = this.escapeHtml(email);
    const safeSubject = this.escapeHtml(subject || 'No subject provided');
    const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');

    const sheetsLinkHtml = sheetsUrl ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border-radius: 8px; border-left: 4px solid #10b981;">
        <p style="margin: 0; color: #047857;">
          <strong>📊 View in Google Sheets:</strong> 
          <a href="${sheetsUrl}" target="_blank" style="color: #047857; text-decoration: underline;">
            Open consultation tracking spreadsheet
          </a>
        </p>
      </div>
    ` : '';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
          🎓 New Consultation Request - SKILL+
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
        
        ${sheetsLinkHtml}
        
        <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>💬 Reply directly to this email</strong> to respond to ${safeName} at ${safeEmail}
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p>This email was sent from the SKILL+ website contact form</p>
          <p>Dr. Ganesh D. Patil - Educational Leadership & Career Counseling</p>
        </div>
      </div>
    `;
  }

  generateClientConfirmationHtml(name: string): string {
    const safeName = this.escapeHtml(name);

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
          Thank you for contacting SKILL+ 🎓
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 18px; color: #1e293b; margin-bottom: 15px;">
            Dear ${safeName},
          </p>
          
          <p style="line-height: 1.6; color: #475569;">
            Thank you for reaching out to SKILL+ for career counseling and educational guidance. 
            We have received your consultation request and greatly appreciate your interest in our services.
          </p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">What happens next?</h3>
          <ul style="line-height: 1.8; color: #475569; padding-left: 20px;">
            <li><strong>Review:</strong> Dr. Ganesh D. Patil will personally review your request</li>
            <li><strong>Response:</strong> You can expect a response within 24-48 hours</li>
            <li><strong>Consultation:</strong> We'll schedule a convenient time for your consultation</li>
            <li><strong>Guidance:</strong> Receive personalized career and educational advice</li>
          </ul>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #fbbf24;">
          <p style="margin: 0; color: #92400e;">
            <strong>💡 In the meantime:</strong> Feel free to explore our services and prepare any specific questions 
            you'd like to discuss during your consultation.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Need immediate assistance?</strong> 
            You can reach us directly at <a href="mailto:skillpluska@rediffmail.com" style="color: #1e40af;">skillpluska@rediffmail.com</a>
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p><strong>SKILL+ - Empowering Your Educational Journey</strong></p>
          <p>Dr. Ganesh D. Patil - Career Counselor & Educational Leader</p>
          <p>Website: <a href="https://skillplus.replit.app" style="color: #2563eb;">skillplus.replit.app</a></p>
        </div>
      </div>
    `;
  }
}

export const emailService = new EmailService();