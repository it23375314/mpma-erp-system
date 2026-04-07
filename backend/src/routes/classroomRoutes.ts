import express from 'express';
import { getClassrooms, createClassroom, deleteClassroom, updateClassroom } from '../controllers/classroomController';

const router = express.Router();

router.route('/').get(getClassrooms).post(createClassroom);
router.route('/:id').delete(deleteClassroom).put(updateClassroom);

export default router;
