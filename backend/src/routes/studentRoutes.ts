import express from 'express';
import {
  enrollStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';

const router = express.Router();

router.post('/enroll', enrollStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
