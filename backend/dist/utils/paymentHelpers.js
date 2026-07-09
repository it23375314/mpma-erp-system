"use strict";
/**
 * Payment Helper Utilities for GovPay Integration
 * ================================================
 * These helpers generate unique identifiers for payment records.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmount = exports.generateReceiptNumber = exports.generatePaymentReference = void 0;
/**
 * Generate a unique payment reference.
 * Format: STU-PAY-YYYYMMDD-STUDENTID-RANDOM
 * Example: STU-PAY-20260622-12-4589
 *
 * @param studentId - The student ID (UUID or numeric string)
 * @returns A unique payment reference string
 */
const generatePaymentReference = (studentId) => {
    var _a;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    // Use last segment of UUID or full numeric id
    const shortStudentId = studentId.includes('-')
        ? ((_a = studentId.split('-').pop()) === null || _a === void 0 ? void 0 : _a.substring(0, 6)) || studentId.substring(0, 6)
        : studentId;
    // 4-digit random number
    const random = Math.floor(1000 + Math.random() * 9000);
    return `STU-PAY-${dateStr}-${shortStudentId}-${random}`;
};
exports.generatePaymentReference = generatePaymentReference;
/**
 * Generate a receipt number for a completed payment.
 * Format: RCPT-YYYYMMDD-HHMMSS-RANDOM
 * Example: RCPT-20260622-104500-7823
 *
 * @returns A unique receipt number string
 */
const generateReceiptNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `RCPT-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};
exports.generateReceiptNumber = generateReceiptNumber;
/**
 * Format amount to 2 decimal places for comparison.
 * Prevents floating-point mismatch during amount verification.
 */
const formatAmount = (amount) => {
    return parseFloat(amount.toFixed(2));
};
exports.formatAmount = formatAmount;
