"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationChecklist = void 0;
const db_1 = require("../config/db");
class VerificationChecklist extends db_1.Model {
}
exports.VerificationChecklist = VerificationChecklist;
VerificationChecklist.init({
    id: {
        type: db_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'One checklist per student application',
    },
    identity_verified: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    documents_complete: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    eligibility_verified: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    course_available: {
        type: db_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    checked_by: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    checked_at: {
        type: db_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'verification_checklists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = VerificationChecklist;
