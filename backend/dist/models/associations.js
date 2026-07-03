"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const Maintenance_1 = __importDefault(require("./Maintenance"));
const Classroom_1 = require("./Classroom");
const Vehicle_1 = require("./Vehicle");
const ClassroomBooking_1 = require("./ClassroomBooking");
const TransportBooking_1 = require("./TransportBooking");
const StudentPayment_1 = __importDefault(require("./StudentPayment"));
const Student_1 = __importDefault(require("./Student"));
const setupAssociations = () => {
    // Classroom & Bookings
    Classroom_1.Classroom.hasMany(ClassroomBooking_1.ClassroomBooking, { foreignKey: 'classroomId', as: 'bookings' });
    ClassroomBooking_1.ClassroomBooking.belongsTo(Classroom_1.Classroom, { foreignKey: 'classroomId', as: 'classroom' });
    // Vehicle & Bookings
    Vehicle_1.Vehicle.hasMany(TransportBooking_1.TransportBooking, { foreignKey: 'vehicleId', as: 'bookings' });
    TransportBooking_1.TransportBooking.belongsTo(Vehicle_1.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    // Maintenance associations
    Maintenance_1.default.belongsTo(Classroom_1.Classroom, { foreignKey: 'facilityId', as: 'classroom', constraints: false });
    Maintenance_1.default.belongsTo(Vehicle_1.Vehicle, { foreignKey: 'facilityId', as: 'vehicle', constraints: false });
    // StudentPayment & Student associations
    // A student can have many payments; each payment belongs to one student.
    Student_1.default.hasMany(StudentPayment_1.default, { foreignKey: 'student_id', as: 'payments', constraints: false });
    StudentPayment_1.default.belongsTo(Student_1.default, { foreignKey: 'student_id', as: 'student', constraints: false });
};
exports.setupAssociations = setupAssociations;
