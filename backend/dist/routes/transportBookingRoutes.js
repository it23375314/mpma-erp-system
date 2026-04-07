"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transportBookingController_1 = require("../controllers/transportBookingController");
const router = express_1.default.Router();
router.route('/').get(transportBookingController_1.getTransportBookings).post(transportBookingController_1.createTransportBooking);
router.route('/:id').put(transportBookingController_1.updateTransportBooking).delete(transportBookingController_1.deleteTransportBooking);
router.route('/:id/status').patch(transportBookingController_1.updateTransportBookingStatus);
exports.default = router;
