"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classroomBookingController_1 = require("../controllers/classroomBookingController");
const router = express_1.default.Router();
router.route('/').get(classroomBookingController_1.getClassroomBookings).post(classroomBookingController_1.createClassroomBooking);
router.route('/:id').put(classroomBookingController_1.updateClassroomBooking).delete(classroomBookingController_1.deleteClassroomBooking);
router.route('/:id/status').patch(classroomBookingController_1.updateClassroomBookingStatus);
exports.default = router;
