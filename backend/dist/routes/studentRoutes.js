"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const router = express_1.default.Router();
router.post('/enroll', studentController_1.enrollStudent);
router.get('/', studentController_1.getStudents);
router.get('/report/pdf', studentController_1.getStudentsPdfReport);
router.get('/:id', studentController_1.getStudentById);
router.patch('/:id', studentController_1.updateStudent);
router.delete('/:id', studentController_1.deleteStudent);
exports.default = router;
