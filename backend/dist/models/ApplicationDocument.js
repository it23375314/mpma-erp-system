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
        comment: 'e.g. NIC, Passport, Certificate, Photo',
    },
    file_name: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    mime_type: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    file_data: {
        type: db_1.DataTypes.BLOB('long'),
        allowNull: false,
    },
    uploaded_by_admin: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'application_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = ApplicationDocument;
