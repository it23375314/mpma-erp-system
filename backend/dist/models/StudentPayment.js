"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPayment = void 0;
const db_1 = require("../config/db");
class StudentPayment extends db_1.Model {
}
exports.StudentPayment = StudentPayment;
StudentPayment.init({
    id: {
        type: db_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        comment: 'References students.id (UUID)',
    },
    user_id: {
        type: db_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'References users.id if available',
    },
    course_batch_id: {
        type: db_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'References course batch if available',
    },
    registration_fee: {
        type: db_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    course_fee: {
        type: db_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    full_amount_payable: {
        type: db_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'registration_fee + course_fee',
    },
    amount_paid: {
        type: db_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    payment_method: {
        type: db_1.DataTypes.ENUM('GOVPAY', 'CASH', 'BANK_TRANSFER'),
        allowNull: false,
        defaultValue: 'GOVPAY',
    },
    payment_status: {
        type: db_1.DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING',
    },
    payment_completed: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    payment_reference: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique reference: STU-PAY-YYYYMMDD-STUDENTID-RANDOM',
    },
    transaction_id: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
        comment: 'GovPay transaction ID received on callback',
    },
    receipt_number: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
        comment: 'Auto-generated receipt number after payment',
    },
    paid_at: {
        type: db_1.DataTypes.DATE,
        allowNull: true,
    },
    callback_response: {
        type: db_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Full GovPay callback JSON for audit purposes',
    },
    remarks: {
        type: db_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'student_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = StudentPayment;
