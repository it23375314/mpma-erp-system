"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const router = express_1.default.Router();
// ============================================================
// NEW APPLICATION WORKFLOW
// ============================================================
// Student submits new application
router.post('/register', studentController_1.submitApplication);
// Admin views pending applications
router.get('/pending', studentController_1.getPendingApplications);
// Admin views specific application
router.get('/application/:id', studentController_1.getApplicationById);
// Admin approves application and sends payment request
router.patch('/:id/approve-payment', studentController_1.approveAndSendPaymentRequest);
// Admin requests correction from student
router.patch('/:id/request-correction', studentController_1.requestCorrection);
// Admin rejects application
router.patch('/:id/reject', studentController_1.rejectApplication);
// Admin updates student details during review
router.patch('/:id/update-details', studentController_1.updateApplicationStudent);
// ============================================================
// LEGACY ENDPOINTS
// ============================================================
// Legacy enrollment (direct enrollment without application)
router.post('/enroll', studentController_1.enrollStudent);
// Get all students
router.get('/', studentController_1.getStudents);
// Get students PDF report
router.get('/report/pdf', studentController_1.getStudentsPdfReport);
// Get single student by ID
router.get('/:id', studentController_1.getStudentById);
// Update student (legacy)
router.patch('/:id', studentController_1.updateStudent);
// Delete student
router.delete('/:id', studentController_1.deleteStudent);
exports.default = router;
