"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomBooking = void 0;
const db_1 = require("../config/db");
class ClassroomBooking extends db_1.Model {
}
exports.ClassroomBooking = ClassroomBooking;
ClassroomBooking.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    requestingOfficerName: { type: db_1.DataTypes.STRING, allowNull: false },
    designation: { type: db_1.DataTypes.STRING, allowNull: false },
    requestingOfficerEmail: { type: db_1.DataTypes.STRING, allowNull: false },
    courseName: { type: db_1.DataTypes.STRING, allowNull: false },
    audienceType: { type: db_1.DataTypes.STRING, allowNull: false },
    batchCode: { type: db_1.DataTypes.STRING, allowNull: false },
    numberOfParticipants: { type: db_1.DataTypes.INTEGER, allowNull: false },
    dateFrom: { type: db_1.DataTypes.STRING, allowNull: false },
    dateTo: { type: db_1.DataTypes.STRING, allowNull: false },
    courseCoordinator: { type: db_1.DataTypes.STRING, allowNull: false },
    timeFrom: { type: db_1.DataTypes.STRING, allowNull: false },
    timeTo: { type: db_1.DataTypes.STRING, allowNull: false },
    preferredDaysOfWeek: { type: db_1.DataTypes.JSON, defaultValue: [] },
    paidCourse: { type: db_1.DataTypes.STRING, allowNull: false },
    classroomId: { type: db_1.DataTypes.UUID, allowNull: false },
    exam: { type: db_1.DataTypes.STRING, allowNull: false },
    additionalRequirements: { type: db_1.DataTypes.STRING },
    status: { type: db_1.DataTypes.STRING, defaultValue: 'Pending' }
}, {
    sequelize: db_1.sequelize,
    tableName: 'classroom_bookings'
});
