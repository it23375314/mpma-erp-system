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
exports.updateAuditoriumBookingStatus = exports.deleteAuditoriumBooking = exports.updateAuditoriumBooking = exports.createAuditoriumBooking = exports.getAuditoriumBookings = void 0;
const AuditoriumBooking_1 = require("../models/AuditoriumBooking");
const getAuditoriumBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield AuditoriumBooking_1.AuditoriumBooking.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAuditoriumBookings = getAuditoriumBookings;
const createAuditoriumBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield AuditoriumBooking_1.AuditoriumBooking.create(req.body);
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createAuditoriumBooking = createAuditoriumBooking;
const updateAuditoriumBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield AuditoriumBooking_1.AuditoriumBooking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        // Update all editable fields if provided, preserving existing values otherwise
        const { name, contact, date, start, end, participants, description, status } = req.body;
        if (name !== undefined)
            booking.name = name;
        if (contact !== undefined)
            booking.contact = contact;
        if (date !== undefined)
            booking.date = date;
        if (start !== undefined)
            booking.start = start;
        if (end !== undefined)
            booking.end = end;
        if (participants !== undefined)
            booking.participants = participants;
        if (description !== undefined)
            booking.description = description;
        if (status !== undefined)
            booking.status = status;
        yield booking.save();
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateAuditoriumBooking = updateAuditoriumBooking;
const deleteAuditoriumBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield AuditoriumBooking_1.AuditoriumBooking.findByPk(req.params.id);
        if (!booking)
            return res.status(404).json({ message: 'Booking not found' });
        yield booking.destroy();
        res.status(200).json({ message: 'Booking deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteAuditoriumBooking = deleteAuditoriumBooking;
const updateAuditoriumBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const booking = yield AuditoriumBooking_1.AuditoriumBooking.findByPk(req.params.id);
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
exports.updateAuditoriumBookingStatus = updateAuditoriumBookingStatus;
