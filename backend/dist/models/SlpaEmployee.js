"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlpaEmployee = void 0;
const db_1 = require("../config/db");
class SlpaEmployee extends db_1.Model {
}
exports.SlpaEmployee = SlpaEmployee;
SlpaEmployee.init({
    id: { type: db_1.DataTypes.UUID, defaultValue: db_1.DataTypes.UUIDV4, primaryKey: true },
    serviceNumber: { type: db_1.DataTypes.STRING, allowNull: false, unique: true, field: 'service_number' },
    epfNumber: { type: db_1.DataTypes.STRING, allowNull: false, unique: true, field: 'epf_number' },
    nic: { type: db_1.DataTypes.STRING, allowNull: false, unique: true }, fullName: { type: db_1.DataTypes.STRING, allowNull: false, field: 'full_name' },
    firstName: { type: db_1.DataTypes.STRING, allowNull: false, field: 'first_name' }, lastName: { type: db_1.DataTypes.STRING, allowNull: false, field: 'last_name' },
    department: { type: db_1.DataTypes.STRING, allowNull: false }, position: { type: db_1.DataTypes.STRING, allowNull: false },
    dob: { type: db_1.DataTypes.DATEONLY, allowNull: false }, gender: { type: db_1.DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: false },
    email: { type: db_1.DataTypes.STRING, allowNull: true }, phone: { type: db_1.DataTypes.STRING, allowNull: true },
    active: { type: db_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { sequelize: db_1.sequelize, tableName: 'slpa_employees', underscored: true });
exports.default = SlpaEmployee;
