"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const Classroom_1 = require("./Classroom");
const ClassroomBooking_1 = require("./ClassroomBooking");
const Vehicle_1 = require("./Vehicle");
const TransportBooking_1 = require("./TransportBooking");
const Maintenance_1 = __importDefault(require("./Maintenance"));
const setupAssociations = () => {
    // Classroom <-> ClassroomBooking
    Classroom_1.Classroom.hasMany(ClassroomBooking_1.ClassroomBooking, { foreignKey: 'classroomId', as: 'bookings' });
    ClassroomBooking_1.ClassroomBooking.belongsTo(Classroom_1.Classroom, { foreignKey: 'classroomId', as: 'classroom' });
    // Vehicle <-> TransportBooking
    Vehicle_1.Vehicle.hasMany(TransportBooking_1.TransportBooking, { foreignKey: 'vehicleId', as: 'bookings' });
    TransportBooking_1.TransportBooking.belongsTo(Vehicle_1.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    // Maintenance -> Classroom/Vehicle
    Maintenance_1.default.belongsTo(Classroom_1.Classroom, { foreignKey: 'facilityId', as: 'classroom', constraints: false });
    Maintenance_1.default.belongsTo(Vehicle_1.Vehicle, { foreignKey: 'facilityId', as: 'vehicle', constraints: false });
};
exports.setupAssociations = setupAssociations;
