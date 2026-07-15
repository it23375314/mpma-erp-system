import express from 'express';
import {
  // Legacy
  enrollStudent,
  getStudents,
  getStudentsPdfReport,
  getStudentById,
  updateStudent,
  deleteStudent,
  // New Workflow
  submitApplication,
  getPendingApplications,
  getApplicationById,
  approveAndSendPaymentRequest,
  requestCorrection,
  rejectApplication,
  updateApplicationStudent,
} from '../controllers/studentController';

const router = express.Router();

// ============================================================
// NEW WORKFLOW ROUTES
// ============================================================

// Workflow 1: Student self-submits application → PENDING_REVIEW
router.post('/register', submitApplication);

// Admin: Get all pending applications
router.get('/pending', getPendingApplications);

// Admin: Get full application details (with documents & payments)
router.get('/application/:id', getApplicationById);

// Admin: Update student details during review
router.patch('/:id/update-details', updateApplicationStudent);

// Admin: Approve application → create payment & send email
router.patch('/:id/approve-payment', approveAndSendPaymentRequest);

// Admin: Request correction from student
router.patch('/:id/request-correction', requestCorrection);

// Admin: Reject application
router.patch('/:id/reject', rejectApplication);

// ============================================================
// LEGACY / EXISTING ROUTES (backward compatible)
// ============================================================

router.post('/enroll', enrollStudent);
router.get('/', getStudents);
router.get('/report/pdf', getStudentsPdfReport);
router.get('/:id', getStudentById);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
