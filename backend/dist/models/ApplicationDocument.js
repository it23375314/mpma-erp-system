"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationDocument = void 0;
const db_1 = require("../config/db");
class ApplicationDocument extends db_1.Model {
}
exports.ApplicationDocument = ApplicationDocument;
ApplicationDocument.init({
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
    document_type: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., "NIC", "Passport", "Birth Certificate", "O/Ls", "A/Ls"',
    },
    file_name: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    file_path: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        comment: 'Relative or absolute path to uploaded file',
    },
    file_size: {
        type: db_1.DataTypes.INTEGER,
        allowNull: false,
        comment: 'File size in bytes',
    },
    mime_type: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., "application/pdf", "image/jpeg"',
    },
    uploaded_at: {
        type: db_1.DataTypes.DATE,
        defaultValue: db_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'application_documents',
});
exports.default = ApplicationDocument;
