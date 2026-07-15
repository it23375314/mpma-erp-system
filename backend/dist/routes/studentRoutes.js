"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationUpload_1 = require("../middleware/applicationUpload");
const studentController_1 = require("../controllers/studentController");
const router = express_1.default.Router();
// ============================================================
// NEW WORKFLOW ROUTES
// ============================================================
// Workflow 1: Student self-submits application → PENDING_REVIEW
router.post('/register', applicationUpload_1.applicationUpload, studentController_1.submitApplication);
// Admin: Get all pending applications
router.get('/pending', studentController_1.getPendingApplications);
// Admin: Get full application details (with documents & payments)
router.get('/application/:id', studentController_1.getApplicationById);
router.get('/application/:id/documents/:documentId', studentController_1.getApplicationDocument);
// Admin: Update student details during review
router.patch('/:id/update-details', studentController_1.updateApplicationStudent);
// Admin: Approve application → create payment & send email
router.patch('/:id/approve-payment', studentController_1.approveAndSendPaymentRequest);
router.post('/:id/resend-payment-email', studentController_1.resendQualificationPaymentNotification);
// Admin: Request correction from student
router.patch('/:id/request-correction', studentController_1.requestCorrection);
// Admin: Reject application
router.patch('/:id/reject', studentController_1.rejectApplication);
// ============================================================
// LEGACY / EXISTING ROUTES (backward compatible)
// ============================================================
router.post('/enroll', studentController_1.enrollStudent);
router.get('/', studentController_1.getStudents);
router.get('/report/pdf', studentController_1.getStudentsPdfReport);
router.get('/:id', studentController_1.getStudentById);
router.patch('/:id', studentController_1.updateStudent);
router.delete('/:id', studentController_1.deleteStudent);
exports.default = router;
