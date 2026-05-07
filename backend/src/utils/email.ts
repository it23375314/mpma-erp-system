import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, password: string, name: string) => {
  const mailOptions = {
    from: `"MPMA ERP System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to MPMA ERP System - Your Account Details',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0f172a;">Welcome to MPMA ERP, ${name}!</h2>
        <p>An administrator has created an account for you in the MPMA ERP System.</p>
        <p>Here are your login credentials:</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</span></p>
        </div>
        <p>For security reasons, we recommend changing your password after your first login.</p>
        <p>Best regards,<br>MPMA Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // We don't want to fail the registration if email fails, but we should log it
  }
};
