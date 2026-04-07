"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriumBooking = void 0;
const db_1 = require("../config/db");
class AuditoriumBooking extends db_1.Model {
}
exports.AuditoriumBooking = AuditoriumBooking;
AuditoriumBooking.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: db_1.DataTypes.STRING, allowNull: false },
    contact: { type: db_1.DataTypes.STRING, allowNull: false },
    date: { type: db_1.DataTypes.STRING, allowNull: false },
    start: { type: db_1.DataTypes.STRING, allowNull: false },
    end: { type: db_1.DataTypes.STRING, allowNull: false },
    participants: { type: db_1.DataTypes.INTEGER, allowNull: false },
    description: { type: db_1.DataTypes.STRING, allowNull: false },
    status: { type: db_1.DataTypes.STRING, defaultValue: 'Pending' }
}, {
    sequelize: db_1.sequelize,
    tableName: 'auditorium_bookings'
});
