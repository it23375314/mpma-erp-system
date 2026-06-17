import express from 'express';
import { enrollStudent, getStudents, deleteStudent } from '../controllers/studentController';

const router = express.Router();

router.post('/enroll', enrollStudent);
router.get('/', getStudents);
router.delete('/:id', deleteStudent);

export default router;
