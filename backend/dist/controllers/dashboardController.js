"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const AuditoriumBooking_1 = require("../models/AuditoriumBooking");
const ClassroomBooking_1 = require("../models/ClassroomBooking");
const TransportBooking_1 = require("../models/TransportBooking");
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
const Classroom_1 = require("../models/Classroom");
const Vehicle_1 = require("../models/Vehicle");
const sequelize_1 = require("sequelize");
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Get Totals
        const auditoriumTotal = yield AuditoriumBooking_1.AuditoriumBooking.count();
        const classroomTotal = yield ClassroomBooking_1.ClassroomBooking.count();
        const transportTotal = yield TransportBooking_1.TransportBooking.count();
        // Get Today's Activities
        const todayAuditorium = yield AuditoriumBooking_1.AuditoriumBooking.findAll({
            where: { date: today }
        });
        const todayClassroom = yield ClassroomBooking_1.ClassroomBooking.findAll({
            where: {
                dateFrom: { [sequelize_1.Op.lte]: today },
                dateTo: { [sequelize_1.Op.gte]: today }
            }
        });
        const todayTransport = yield TransportBooking_1.TransportBooking.findAll({
            where: {
                departureDate: { [sequelize_1.Op.lte]: today },
                returnDate: { [sequelize_1.Op.gte]: today }
            }
        });
        const todayMaintenance = yield Maintenance_1.default.findAll({
            where: {
                dateFrom: { [sequelize_1.Op.lte]: today },
                dateTo: { [sequelize_1.Op.gte]: today }
            },
            include: [
                { model: Classroom_1.Classroom, as: 'classroom' },
                { model: Vehicle_1.Vehicle, as: 'vehicle' }
            ]
        });
        // Format activities
        const activities = [
            ...todayAuditorium.map(b => ({ type: 'Auditorium', title: b.description, time: `${b.start} - ${b.end}`, status: b.status })),
            ...todayClassroom.map(b => ({ type: 'Classroom', title: b.courseName, time: `${b.timeFrom} - ${b.timeTo}`, status: b.status })),
            ...todayTransport.map(b => ({ type: 'Transport', title: b.destination, time: b.departureTime, status: b.status })),
            ...todayMaintenance.map((m) => {
                var _a, _b;
                const facilityName = ((_a = m.classroom) === null || _a === void 0 ? void 0 : _a.name) || ((_b = m.vehicle) === null || _b === void 0 ? void 0 : _b.name) || m.facilityType;
                return {
                    type: 'Maintenance',
                    title: `${m.title} (${facilityName})`,
                    time: `${m.timeFrom} - ${m.timeTo}`,
                    status: 'Maintenance'
                };
            })
        ];
        res.json({
            totals: {
                auditorium: auditoriumTotal,
                classroom: classroomTotal,
                transport: transportTotal,
                overall: auditoriumTotal + classroomTotal + transportTotal
            },
            todayActivities: activities
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDashboardStats = getDashboardStats;
