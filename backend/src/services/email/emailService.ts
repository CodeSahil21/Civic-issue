import nodemailer from 'nodemailer';
import { ApiError } from '../../utils/apiError';
import { EmailTemplates } from './emailTemplates';

export class EmailService {
  private static transporter: nodemailer.Transporter;

  // Initialize email transporter
  static async initialize() {
    try {
      // For production, use actual SMTP credentials
      if (process.env.NODE_ENV === 'production') {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await this.transporter.verify();
      } else {
        // For dev/testing use ethereal
        const account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
      }
      
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      console.log('⚠️  Email service not configured. Emails will fail.');
      // Don't throw error in development - just log warning
      if (process.env.NODE_ENV === 'production') {
        throw new ApiError(500, 'Email service configuration error');
      }
    }
  }

  // Send password reset OTP email
  static async sendPasswordResetOTP(
    email: string,
    fullName: string,
    otp: string
  ) {
    if (!this.transporter) {
      await this.initialize();
    }
    
    const mailOptions = {
      from: process.env.NODE_ENV === 'production' 
        ? `VMC Civic Issues <${process.env.SMTP_FROM || process.env.SMTP_USER}>` 
        : 'VMC Civic Issues <noreply@ethereal.email>',
      to: email,
      subject: 'Password Reset OTP - VMC Civic Issues',
      html: EmailTemplates.passwordResetOTP.html(fullName, otp),
      text: EmailTemplates.passwordResetOTP.text(fullName, otp)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset OTP sent:', info.messageId);
      
      // Log email preview url in development
      if (process.env.NODE_ENV !== 'production' && info.messageId) {
        console.log('📧 Email preview url:', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset OTP:', error);
      throw new ApiError(500, 'Failed to send password reset OTP');
    }
  }

  // Send welcome email for new users
  static async sendWelcomeEmail(
    email: string,
    fullName: string,
    role: string,
    tempPassword: string
  ) {
    if (!this.transporter) {
      await this.initialize();
    }

    const loginLink = `${process.env.FRONTEND_URL}/login`;
    
    const mailOptions = {
      from: process.env.NODE_ENV === 'production' 
        ? `VMC Civic Issues <${process.env.SMTP_FROM || process.env.SMTP_USER}>` 
        : 'VMC Civic Issues <noreply@ethereal.email>',
      to: email,
      subject: EmailTemplates.welcome.subject,
      html: EmailTemplates.welcome.html(fullName, role, email, tempPassword, loginLink),
      text: EmailTemplates.welcome.text(fullName, role, email, tempPassword, loginLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      
      // Log email preview url in development
      if (process.env.NODE_ENV !== 'production' && info.messageId) {
        console.log('📧 Email preview url:', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new ApiError(500, 'Failed to send welcome email');
    }
  }

  // Send issue assignment notification
  static async sendIssueAssignmentEmail(
    email: string,
    engineerName: string,
    ticketNumber: string,
    category: string,
    location: string,
    priority: string
  ) {
    if (!this.transporter) {
      await this.initialize();
    }

    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/issues/${ticketNumber}`;
    
    const mailOptions = {
      from: process.env.NODE_ENV === 'production' 
        ? `VMC Civic Issues <${process.env.SMTP_FROM || process.env.SMTP_USER}>` 
        : 'VMC Civic Issues <noreply@ethereal.email>',
      to: email,
      subject: EmailTemplates.issueAssigned.subject(ticketNumber),
      html: EmailTemplates.issueAssigned.html(engineerName, ticketNumber, category, location, priority, dashboardLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Issue assignment email sent:', info.messageId);
      
      // Log email preview url in development
      if (process.env.NODE_ENV !== 'production' && info.messageId) {
        console.log('📧 Email preview url:', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send issue assignment email:', error);
      // Don't throw error for notification emails - log and continue
      return { success: false, error: (error as Error).message };
    }
  }
}