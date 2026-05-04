"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportBooking = void 0;
const db_1 = require("../config/db");
class TransportBooking extends db_1.Model {
}
exports.TransportBooking = TransportBooking;
TransportBooking.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    requesterName: { type: db_1.DataTypes.STRING, allowNull: false },
    designation: { type: db_1.DataTypes.STRING, allowNull: false },
    department: { type: db_1.DataTypes.STRING, allowNull: false },
    contactNumber: { type: db_1.DataTypes.STRING, allowNull: false },
    departureDate: { type: db_1.DataTypes.STRING, allowNull: false },
    returnDate: { type: db_1.DataTypes.STRING, allowNull: false },
    departureTime: { type: db_1.DataTypes.STRING, allowNull: false },
    pickupLocation: { type: db_1.DataTypes.STRING, allowNull: false },
    destination: { type: db_1.DataTypes.STRING, allowNull: false },
    purpose: { type: db_1.DataTypes.STRING, allowNull: false },
    vehicleId: { type: db_1.DataTypes.UUID, allowNull: false },
    estimatedKm: { type: db_1.DataTypes.STRING, allowNull: true },
    status: { type: db_1.DataTypes.STRING, defaultValue: 'Pending' }
}, {
    sequelize: db_1.sequelize,
    tableName: 'transport_bookings',
});
