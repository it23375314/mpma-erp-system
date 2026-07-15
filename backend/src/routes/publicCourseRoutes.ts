import express from 'express';
import {
  getPublicCourses,
  getPublicCourseById,
  getAvailableBatches,
} from '../controllers/publicCourseController';

const router = express.Router();

// GET /api/public/courses
router.get('/', getPublicCourses);
router.get('/:id/batches', getAvailableBatches);

// GET /api/public/courses/:id
router.get('/:id', getPublicCourseById);

export default router;
