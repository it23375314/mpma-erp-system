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
exports.updateTransportBookingStatus = exports.deleteTransportBooking = exports.updateTransportBooking = exports.createTransportBooking = exports.getTransportBookings = void 0;
const TransportBooking_1 = require("../models/TransportBooking");
const Vehicle_1 = require("../models/Vehicle");
const getTransportBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield TransportBooking_1.TransportBooking.findAll({
            include: [{ model: Vehicle_1.Vehicle, as: 'vehicle' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTransportBookings = getTransportBookings;
const createTransportBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield TransportBooking_1.TransportBooking.create(req.body);
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createTransportBooking = createTransportBooking;
const updateTransportBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield TransportBooking_1.TransportBooking.findByPk(req.params.id, {
            include: [{ model: Vehicle_1.Vehicle, as: 'vehicle' }]
        });
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        const { requesterName, designation, department, contactNumber, departureDate, returnDate, departureTime, pickupLocation, destination, purpose, vehicleId, status } = req.body;
        if (requesterName !== undefined)
            booking.requesterName = requesterName;
        if (designation !== undefined)
            booking.designation = designation;
        if (department !== undefined)
            booking.department = department;
        if (contactNumber !== undefined)
            booking.contactNumber = contactNumber;
        if (departureDate !== undefined)
            booking.departureDate = departureDate;
        if (returnDate !== undefined)
            booking.returnDate = returnDate;
        if (departureTime !== undefined)
            booking.departureTime = departureTime;
        if (pickupLocation !== undefined)
            booking.pickupLocation = pickupLocation;
        if (destination !== undefined)
            booking.destination = destination;
        if (purpose !== undefined)
            booking.purpose = purpose;
        if (vehicleId !== undefined)
            booking.vehicleId = vehicleId;
        if (status !== undefined)
            booking.status = status;
        yield booking.save();
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateTransportBooking = updateTransportBooking;
const deleteTransportBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield TransportBooking_1.TransportBooking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        yield booking.destroy();
        res.status(200).json({ message: 'Booking deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTransportBooking = deleteTransportBooking;
const updateTransportBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const booking = yield TransportBooking_1.TransportBooking.findByPk(req.params.id);
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
exports.updateTransportBookingStatus = updateTransportBookingStatus;
