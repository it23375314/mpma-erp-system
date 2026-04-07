"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditoriumBookingController_1 = require("../controllers/auditoriumBookingController");
const router = (0, express_1.Router)();
router.route('/')
    .get(auditoriumBookingController_1.getAuditoriumBookings)
    .post(auditoriumBookingController_1.createAuditoriumBooking);
router.route('/:id')
    .put(auditoriumBookingController_1.updateAuditoriumBooking)
    .delete(auditoriumBookingController_1.deleteAuditoriumBooking);
router.route('/:id/status')
    .patch(auditoriumBookingController_1.updateAuditoriumBookingStatus);
exports.default = router;
