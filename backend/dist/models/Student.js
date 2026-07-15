"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const db_1 = require("../config/db");
class Student extends db_1.Model {
}
exports.Student = Student;
Student.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: db_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    gender: {
        type: db_1.DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    },
    address: {
        type: db_1.DataTypes.TEXT,
        allowNull: false,
    },
    course: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    batch: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    studentCategory: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
    },
    nic: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
    },
    passport: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
    },
    enrollmentDate: {
        type: db_1.DataTypes.DATEONLY,
        defaultValue: db_1.DataTypes.NOW,
    },
    status: {
        type: db_1.DataTypes.ENUM('Pending', 'Enrolled', 'Registered', 'Graduated', 'Dropout', 'Applied', 'Qualified'),
        defaultValue: 'Pending',
    },
    application_status: {
        type: db_1.DataTypes.ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CORRECTION_REQUESTED'),
        allowNull: true,
        defaultValue: null,
    },
    payment_status_type: {
        type: db_1.DataTypes.ENUM('NOT_REQUESTED', 'PENDING', 'PAID', 'FAILED'),
        allowNull: true,
        defaultValue: null,
    },
    documents_path: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
        comment: 'Path to stored documents or JSON array of document paths',
    },
    approved_at: {
        type: db_1.DataTypes.DATE,
        allowNull: true,
    },
    admin_notes: {
        type: db_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'students',
});
exports.default = Student;
