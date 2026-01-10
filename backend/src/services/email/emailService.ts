import nodemailer from 'nodemailer';
import { ApiError } from '../../utils/apiError';
import { EmailTemplates } from './emailTemplates';

export class EmailService {
  private static transporter: nodemailer.Transporter;

  // Initialize email transporter
  static async initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      throw new ApiError(500, 'Email service configuration error');
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
      from: {
        name: 'VMC Civic Issues',
        address: process.env.SMTP_FROM || process.env.SMTP_USER!
      },
      to: email,
      subject: 'Password Reset OTP - VMC Civic Issues',
      html: EmailTemplates.passwordResetOTP.html(fullName, otp),
      text: EmailTemplates.passwordResetOTP.text(fullName, otp)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset OTP sent:', info.messageId);
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
      from: {
        name: 'VMC Civic Issues',
        address: process.env.SMTP_FROM || process.env.SMTP_USER!
      },
      to: email,
      subject: EmailTemplates.welcome.subject,
      html: EmailTemplates.welcome.html(fullName, role, email, tempPassword, loginLink),
      text: EmailTemplates.welcome.text(fullName, role, email, tempPassword, loginLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
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
      from: {
        name: 'VMC Civic Issues',
        address: process.env.SMTP_FROM || process.env.SMTP_USER!
      },
      to: email,
      subject: EmailTemplates.issueAssigned.subject(ticketNumber),
      html: EmailTemplates.issueAssigned.html(engineerName, ticketNumber, category, location, priority, dashboardLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Issue assignment email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send issue assignment email:', error);
      // Don't throw error for notification emails - log and continue
      return { success: false, error: (error as Error).message };
    }
  }
}