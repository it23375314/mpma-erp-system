"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicCourseController_1 = require("../controllers/publicCourseController");
const router = express_1.default.Router();
// GET /api/public/courses
router.get('/', publicCourseController_1.getPublicCourses);
router.get('/:id/batches', publicCourseController_1.getAvailableBatches);
// GET /api/public/courses/:id
router.get('/:id', publicCourseController_1.getPublicCourseById);
exports.default = router;
