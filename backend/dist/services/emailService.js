"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationRejectionEmail = exports.sendCorrectionRequestEmail = exports.sendQualificationPaymentEmail = exports.sendEnrollmentPaymentEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("../config/env");
let transporter = null;
const getTransporter = () => {
    if (!transporter) {
        const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
        const user = process.env.SMTP_USER || process.env.EMAIL_USER;
        const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s/g, '');
        if (!user || !pass) {
            throw new Error('SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS in .env');
        }
        transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }
    return transporter;
};
const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};
const buildEnrollmentPaymentHtml = (data) => {
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
const sendEnrollmentPaymentEmail = (toEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
        from: `"MPMA ERP System" <${fromAddress}>`,
        to: toEmail,
        subject: 'MPMA Student Enrollment Payment Details',
        html: buildEnrollmentPaymentHtml(data),
    };
    const info = yield getTransporter().sendMail(mailOptions);
    console.log(`Enrollment payment email sent to ${toEmail} (messageId: ${info.messageId})`);
});
exports.sendEnrollmentPaymentEmail = sendEnrollmentPaymentEmail;
const buildQualificationPaymentHtml = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <h2 style="color: #10b981; margin-top: 0;">🎓 Application Approved - MPMA Course Qualification</h2>
      <p>Dear ${data.studentName},</p>
      
      <div style="background: #ecfdf5; padding: 16px; border-left: 4px solid #10b981; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #047857; font-weight: bold;">Congratulations! You are qualified to join this course.</p>
      </div>

      <p>Your application has been reviewed and approved by our admin team. Below are your qualification and payment details:</p>

      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 8px 0;"><strong>Student Name:</strong> ${data.studentName}</p>
        <p style="margin: 8px 0;"><strong>Course Name:</strong> ${data.courseName}</p>
        <p style="margin: 8px 0;"><strong>Batch Name:</strong> ${data.batchName}</p>
        <p style="margin: 8px 0; border-top: 1px solid #cbd5e1; padding-top: 8px;"><strong>Payment Reference:</strong> ${data.paymentReference}</p>
        <p style="margin: 8px 0;"><strong>Registration Fee:</strong> ${formatCurrency(data.registrationFee)}</p>
        <p style="margin: 8px 0;"><strong>Course Fee:</strong> ${formatCurrency(data.courseFee)}</p>
        <p style="margin: 8px 0; padding-top: 8px; border-top: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">
          <strong>Total Payable Amount:</strong> ${formatCurrency(data.totalAmount)}
        </p>
        <p style="margin: 8px 0;"><strong>Payment Method:</strong> GovPay</p>
      </div>

      <p style="color: #475569; margin-bottom: 24px;">
        To complete your registration, please proceed with payment using the GovPay payment gateway. Click the button below to proceed to the payment page.
      </p>

      <p style="margin: 24px 0; text-align: center;">
        <a href="${data.paymentPageUrl}" style="display: inline-block; background: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Proceed to Payment
        </a>
      </p>

      <p style="color: #64748b; font-size: 13px; background: #f1f5f9; padding: 12px; border-radius: 6px;">
        <strong>Secure Payment Link:</strong><br>
        ${data.paymentPageUrl}
      </p>

      <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 16px; color: #64748b; font-size: 13px;">
        <p style="margin: 4px 0;">If you have any questions or encounter any issues with payment, please contact our support team.</p>
        <p style="margin: 4px 0;">Best regards,<br><strong>MPMA Administration Team</strong></p>
      </div>
    </div>
  `;
};
const sendQualificationPaymentEmail = (toEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
        from: `"MPMA ERP System" <${fromAddress}>`,
        to: toEmail,
        subject: '✅ Application Approved - Course Qualification & Payment Request',
        html: buildQualificationPaymentHtml(data),
    };
    const info = yield getTransporter().sendMail(mailOptions);
    console.log(`Qualification payment email sent to ${toEmail} (messageId: ${info.messageId})`);
});
exports.sendQualificationPaymentEmail = sendQualificationPaymentEmail;
const buildCorrectionRequestHtml = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <h2 style="color: #f59e0b; margin-top: 0;">⚠️ Action Required - Application Correction Needed</h2>
      <p>Dear ${data.studentName},</p>
      
      <div style="background: #fffbeb; padding: 16px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>Your application requires corrections before it can be approved.</strong></p>
      </div>

      <p>Your application for the following course has been reviewed:</p>
      <p style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 12px 0;">
        <strong>Course:</strong> ${data.courseName}
      </p>

      <p><strong>Corrections Required:</strong></p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 12px 0; white-space: pre-wrap; border-left: 4px solid #ef4444;">
${data.correctionDetails}
      </div>

      <p>Please review the corrections needed and resubmit your application with the corrected details and/or documents.</p>

      <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
        If you have questions about these corrections, please contact our support team.
      </p>

      <p>Best regards,<br><strong>MPMA Administration Team</strong></p>
    </div>
  `;
};
const sendCorrectionRequestEmail = (toEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
        from: `"MPMA ERP System" <${fromAddress}>`,
        to: toEmail,
        subject: '⚠️ Application Correction Required - MPMA Student Registration',
        html: buildCorrectionRequestHtml(data),
    };
    const info = yield getTransporter().sendMail(mailOptions);
    console.log(`Correction request email sent to ${toEmail} (messageId: ${info.messageId})`);
});
exports.sendCorrectionRequestEmail = sendCorrectionRequestEmail;
const buildApplicationRejectionHtml = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px; color: #0f172a;">
      <h2 style="color: #ef4444; margin-top: 0;">Application Status Update - MPMA Course Registration</h2>
      <p>Dear ${data.studentName},</p>
      
      <div style="background: #fee2e2; padding: 16px; border-left: 4px solid #ef4444; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #7f1d1d;"><strong>Unfortunately, your application has not been approved.</strong></p>
      </div>

      <p>Your application for the following course has been carefully reviewed:</p>
      <p style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 12px 0;">
        <strong>Course:</strong> ${data.courseName}
      </p>

      <p><strong>Reason for Rejection:</strong></p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 12px 0; white-space: pre-wrap; border-left: 4px solid #ef4444;">
${data.rejectionReason}
      </div>

      <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
        You may contact our support team to discuss your application or inquire about future opportunities.
      </p>

      <p>Best regards,<br><strong>MPMA Administration Team</strong></p>
    </div>
  `;
};
const sendApplicationRejectionEmail = (toEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
    const mailOptions = {
        from: `"MPMA ERP System" <${fromAddress}>`,
        to: toEmail,
        subject: 'Application Status Update - MPMA Course Registration',
        html: buildApplicationRejectionHtml(data),
    };
    const info = yield getTransporter().sendMail(mailOptions);
    console.log(`Application rejection email sent to ${toEmail} (messageId: ${info.messageId})`);
});
exports.sendApplicationRejectionEmail = sendApplicationRejectionEmail;
