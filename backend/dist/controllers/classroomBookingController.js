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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassroomBookingStatus = exports.deleteClassroomBooking = exports.updateClassroomBooking = exports.createClassroomBooking = exports.getClassroomBookings = void 0;
const ClassroomBooking_1 = require("../models/ClassroomBooking");
const Classroom_1 = require("../models/Classroom");
const getClassroomBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield ClassroomBooking_1.ClassroomBooking.findAll({
            include: [{ model: Classroom_1.Classroom, as: 'classroom' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getClassroomBookings = getClassroomBookings;
const createClassroomBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield ClassroomBooking_1.ClassroomBooking.create(req.body);
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createClassroomBooking = createClassroomBooking;
const updateClassroomBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield ClassroomBooking_1.ClassroomBooking.findByPk(req.params.id, {
            include: [{ model: Classroom_1.Classroom, as: 'classroom' }]
        });
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        const { requestingOfficerName, designation, requestingOfficerEmail, courseName, audienceType, batchCode, numberOfParticipants, dateFrom, dateTo, courseCoordinator, timeFrom, timeTo, preferredDaysOfWeek, paidCourse, classroomId, exam, additionalRequirements, status } = req.body;
        if (requestingOfficerName !== undefined)
            booking.requestingOfficerName = requestingOfficerName;
        if (designation !== undefined)
            booking.designation = designation;
        if (requestingOfficerEmail !== undefined)
            booking.requestingOfficerEmail = requestingOfficerEmail;
        if (courseName !== undefined)
            booking.courseName = courseName;
        if (audienceType !== undefined)
            booking.audienceType = audienceType;
        if (batchCode !== undefined)
            booking.batchCode = batchCode;
        if (numberOfParticipants !== undefined)
            booking.numberOfParticipants = numberOfParticipants;
        if (dateFrom !== undefined)
            booking.dateFrom = dateFrom;
        if (dateTo !== undefined)
            booking.dateTo = dateTo;
        if (courseCoordinator !== undefined)
            booking.courseCoordinator = courseCoordinator;
        if (timeFrom !== undefined)
            booking.timeFrom = timeFrom;
        if (timeTo !== undefined)
            booking.timeTo = timeTo;
        if (preferredDaysOfWeek !== undefined)
            booking.preferredDaysOfWeek = preferredDaysOfWeek;
        if (paidCourse !== undefined)
            booking.paidCourse = paidCourse;
        if (classroomId !== undefined)
            booking.classroomId = classroomId;
        if (exam !== undefined)
            booking.exam = exam;
        if (additionalRequirements !== undefined)
            booking.additionalRequirements = additionalRequirements;
        if (status !== undefined)
            booking.status = status;
        yield booking.save();
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateClassroomBooking = updateClassroomBooking;
const deleteClassroomBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield ClassroomBooking_1.ClassroomBooking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        yield booking.destroy();
        res.status(200).json({ message: 'Booking deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteClassroomBooking = deleteClassroomBooking;
const updateClassroomBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const booking = yield ClassroomBooking_1.ClassroomBooking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        booking.status = status;
        yield booking.save();
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateClassroomBookingStatus = updateClassroomBookingStatus;
