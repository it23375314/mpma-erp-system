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
exports.sendEnrollmentPaymentEmail = void 0;
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
