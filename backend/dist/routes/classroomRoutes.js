"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classroomController_1 = require("../controllers/classroomController");
const router = express_1.default.Router();
router.route('/').get(classroomController_1.getClassrooms).post(classroomController_1.createClassroom);
router.route('/:id').delete(classroomController_1.deleteClassroom).put(classroomController_1.updateClassroom);
exports.default = router;
