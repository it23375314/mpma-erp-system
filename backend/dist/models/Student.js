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
    enrollmentDate: {
        type: db_1.DataTypes.DATEONLY,
        defaultValue: db_1.DataTypes.NOW,
    },
    status: {
        type: db_1.DataTypes.ENUM('Pending', 'Enrolled', 'Graduated', 'Dropout'),
        defaultValue: 'Pending',
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'students',
});
exports.default = Student;
