"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const db_1 = require("../config/db");
class Vehicle extends db_1.Model {
}
exports.Vehicle = Vehicle;
Vehicle.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: db_1.DataTypes.STRING, allowNull: false },
    number: { type: db_1.DataTypes.STRING, allowNull: false },
    capacity: { type: db_1.DataTypes.INTEGER, allowNull: false },
    type: { type: db_1.DataTypes.STRING, allowNull: false },
    acStatus: { type: db_1.DataTypes.STRING, allowNull: false },
    status: { type: db_1.DataTypes.STRING, defaultValue: 'Available' },
}, {
    sequelize: db_1.sequelize,
    tableName: 'vehicles',
});
