import express from 'express';
import { 
  getLecturers, 
  getLecturerById, 
  createLecturer, 
  updateLecturer, 
  toggleLecturerStatus,
  assignLecturerToBatch,
  removeLecturerFromBatch,
  getLecturersByBatch,
  getBatchesByLecturer
} from '../controllers/lecturerController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLecturers)
  .post(createLecturer);

router.route('/assignments')
  .post(assignLecturerToBatch);

router.route('/assignments/batch/:batchId')
  .get(getLecturersByBatch);

router.route('/assignments/lecturer/:lecturerId')
  .get(getBatchesByLecturer);

router.route('/assignments/batch/:batchId/lecturer/:lecturerId')
  .delete(removeLecturerFromBatch);

router.route('/:id')
  .get(getLecturerById)
  .put(updateLecturer);

router.route('/:id/status')
  .patch(toggleLecturerStatus);

export default router;
