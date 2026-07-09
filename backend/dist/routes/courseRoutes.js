"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes are protected by JWT auth
router.use(auth_1.protect);
router.route('/')
    .get(courseController_1.getCourses)
    .post(courseController_1.createCourse);
router.route('/:id')
    .get(courseController_1.getCourseById)
    .put(courseController_1.updateCourse);
router.route('/:id/status')
    .patch(courseController_1.toggleCourseStatus);
exports.default = router;
