import express from 'express';
import { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  toggleCourseStatus 
} from '../controllers/courseController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected by JWT auth
router.use(protect);

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(updateCourse);

router.route('/:id/status')
  .patch(toggleCourseStatus);

export default router;
