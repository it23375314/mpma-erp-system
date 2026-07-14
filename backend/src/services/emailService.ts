import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import '../config/env';

let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (!transporter) {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s/g, '');

    if (!user || !pass) {
      throw new Error('SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS in .env');
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
};

const fromAddress = () =>
  process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

// ============================================================
// EMAIL DATA INTERFACES
// ============================================================

export interface EnrollmentPaymentEmailData {
  studentName: string;
  studentCategory: string;
  courseName: string;
  batchName: string;
  paymentReference: string;
  registrationFee: number;
  courseFee: number;
  totalAmount: number;
  paymentPageUrl: string;
}

export interface QualificationPaymentEmailData {
  studentName: string;
  courseName: string;
  batchName: string;
  paymentReference: string;
  registrationFee: number;
  courseFee: number;
  totalAmount: number;
  paymentPageUrl: string;
}

export interface CorrectionRequestEmailData {
  studentName: string;
  courseName: string;
  correctionDetails: string;
}

export interface ApplicationRejectionEmailData {
  studentName: string;
  courseName: string;
  rejectionReason: string;
}

// ============================================================
// EMAIL HTML BUILDERS
// ============================================================

const buildEnrollmentPaymentHtml = (data: EnrollmentPaymentEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <h2 style="color: #0f172a; margin-top: 0;">MPMA Student Enrollment Payment Details</h2>
      <p>Dear ${data.studentName},</p>
      <p>Your enrollment has been received successfully.</p>

      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 8px 0;"><strong>Student Name:</strong> ${data.studentName}</p>
        <p style="margin: 8px 0;"><strong>Student Category:</strong> ${data.studentCategory}</p>
        <p style="margin: 8px 0;"><strong>Course Name:</strong> ${data.courseName}</p>
        <p style="margin: 8px 0;"><strong>Batch Name:</strong> ${data.batchName}</p>
        <p style="margin: 8px 0;"><strong>Payment Reference:</strong> ${data.paymentReference}</p>
        <p style="margin: 8px 0;"><strong>Registration Fee:</strong> ${formatCurrency(data.registrationFee)}</p>
        <p style="margin: 8px 0;"><strong>Course Fee:</strong> ${formatCurrency(data.courseFee)}</p>
        <p style="margin: 8px 0;"><strong>Total Payable:</strong> ${formatCurrency(data.totalAmount)}</p>
        <p style="margin: 8px 0;"><strong>Payment Method:</strong> GovPay</p>
        <p style="margin: 8px 0;"><strong>Payment Status:</strong> Pending</p>
      </div>

      <p>Please complete your payment using GovPay.</p>
      <p style="margin: 24px 0;">
        <a href="${data.paymentPageUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none;">
          Go to Payment Page
        </a>
      </p>
      <p style="color: #64748b; font-size: 14px;">If the button does not work, copy and paste this link into your browser:<br>${data.paymentPageUrl}</p>
      <p>Best regards,<br>MPMA Team</p>
    </div>
  `;
};

const buildQualificationPaymentHtml = (data: QualificationPaymentEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <div style="background: #0f172a; color: white; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0;">🎉 Application Approved – Payment Required</h2>
      </div>
      <p>Dear ${data.studentName},</p>
      <p>Congratulations! Your application to <strong>${data.courseName}</strong> (Batch: ${data.batchName}) has been <strong>approved</strong> by the MPMA admissions team.</p>
      <p>To complete your enrollment, please proceed with the payment outlined below:</p>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 8px 0;"><strong>Payment Reference:</strong> ${data.paymentReference}</p>
        <p style="margin: 8px 0;"><strong>Registration Fee:</strong> ${formatCurrency(data.registrationFee)}</p>
        <p style="margin: 8px 0;"><strong>Course Fee:</strong> ${formatCurrency(data.courseFee)}</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Total Payable:</strong> ${formatCurrency(data.totalAmount)}</p>
      </div>

      <p style="margin: 24px 0;">
        <a href="${data.paymentPageUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Proceed to Payment
        </a>
      </p>
      <p style="color: #64748b; font-size: 14px;">If the button does not work:<br>${data.paymentPageUrl}</p>
      <p>Best regards,<br>MPMA Admissions Team</p>
    </div>
  `;
};

const buildCorrectionRequestHtml = (data: CorrectionRequestEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <div style="background: #f59e0b; color: white; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0;">⚠️ Application – Correction Required</h2>
      </div>
      <p>Dear ${data.studentName},</p>
      <p>Thank you for applying to <strong>${data.courseName}</strong> at MPMA. After reviewing your application, our admissions team has identified items that require correction or additional information.</p>

      <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-weight: bold;">Correction Required:</p>
        <p style="margin: 0; white-space: pre-wrap;">${data.correctionDetails}</p>
      </div>

      <p>Please update your application accordingly. If you have questions, contact the MPMA admissions office.</p>
      <p>Best regards,<br>MPMA Admissions Team</p>
    </div>
  `;
};

const buildRejectionHtml = (data: ApplicationRejectionEmailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <div style="background: #dc2626; color: white; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0;">Application Status Update</h2>
      </div>
      <p>Dear ${data.studentName},</p>
      <p>We regret to inform you that your application to <strong>${data.courseName}</strong> at MPMA has not been approved at this time.</p>

      <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-weight: bold;">Reason:</p>
        <p style="margin: 0; white-space: pre-wrap;">${data.rejectionReason}</p>
      </div>

      <p>If you believe this decision was made in error, or if you have questions about your application, please contact our admissions office.</p>
      <p>Best regards,<br>MPMA Admissions Team</p>
    </div>
  `;
};

// ============================================================
// EXPORTED EMAIL SEND FUNCTIONS
// ============================================================

export const sendEnrollmentPaymentEmail = async (
  toEmail: string,
  data: EnrollmentPaymentEmailData
): Promise<void> => {
  const mailOptions = {
    from: `"MPMA ERP System" <${fromAddress()}>`,
    to: toEmail,
    subject: 'MPMA Student Enrollment Payment Details',
    html: buildEnrollmentPaymentHtml(data),
  };
  const info = await getTransporter().sendMail(mailOptions);
  console.log(`Enrollment payment email sent to ${toEmail} (messageId: ${info.messageId})`);
};

export const sendQualificationPaymentEmail = async (
  toEmail: string,
  data: QualificationPaymentEmailData
): Promise<void> => {
  const mailOptions = {
    from: `"MPMA ERP System" <${fromAddress()}>`,
    to: toEmail,
    subject: '🎉 MPMA Application Approved – Please Complete Your Payment',
    html: buildQualificationPaymentHtml(data),
  };
  const info = await getTransporter().sendMail(mailOptions);
  console.log(`Qualification payment email sent to ${toEmail} (messageId: ${info.messageId})`);
};

export const sendCorrectionRequestEmail = async (
  toEmail: string,
  data: CorrectionRequestEmailData
): Promise<void> => {
  const mailOptions = {
    from: `"MPMA ERP System" <${fromAddress()}>`,
    to: toEmail,
    subject: 'MPMA Application – Correction Required',
    html: buildCorrectionRequestHtml(data),
  };
  const info = await getTransporter().sendMail(mailOptions);
  console.log(`Correction request email sent to ${toEmail} (messageId: ${info.messageId})`);
};

export const sendApplicationRejectionEmail = async (
  toEmail: string,
  data: ApplicationRejectionEmailData
): Promise<void> => {
  const mailOptions = {
    from: `"MPMA ERP System" <${fromAddress()}>`,
    to: toEmail,
    subject: 'MPMA Application Status Update',
    html: buildRejectionHtml(data),
  };
  const info = await getTransporter().sendMail(mailOptions);
  console.log(`Application rejection email sent to ${toEmail} (messageId: ${info.messageId})`);
};
