"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class Maintenance extends db_1.Model {
}
Maintenance.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: db_1.DataTypes.TEXT,
        allowNull: true,
    },
    facilityType: {
        type: db_1.DataTypes.ENUM('Auditorium', 'Classroom', 'Transport', 'General'),
        allowNull: false,
        defaultValue: 'General',
    },
    facilityId: {
        type: db_1.DataTypes.UUID,
        allowNull: true,
    },
    dateFrom: {
        type: db_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    dateTo: {
        type: db_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    timeFrom: {
        type: db_1.DataTypes.TIME,
        allowNull: false,
    },
    timeTo: {
        type: db_1.DataTypes.TIME,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'Maintenance',
    tableName: 'maintenances',
});
exports.default = Maintenance;
