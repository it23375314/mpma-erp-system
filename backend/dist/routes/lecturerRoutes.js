"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerController_1 = require("../controllers/lecturerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .get(lecturerController_1.getLecturers)
    .post(lecturerController_1.createLecturer);
router.route('/assignments')
    .post(lecturerController_1.assignLecturerToBatch);
router.route('/assignments/batch/:batchId')
    .get(lecturerController_1.getLecturersByBatch);
router.route('/assignments/lecturer/:lecturerId')
    .get(lecturerController_1.getBatchesByLecturer);
router.route('/assignments/batch/:batchId/lecturer/:lecturerId')
    .delete(lecturerController_1.removeLecturerFromBatch);
router.route('/:id')
    .get(lecturerController_1.getLecturerById)
    .put(lecturerController_1.updateLecturer);
router.route('/:id/status')
    .patch(lecturerController_1.toggleLecturerStatus);
exports.default = router;
