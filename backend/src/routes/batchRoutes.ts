import express from 'express';
import { 
  getBatches, 
  getBatchById, 
  createBatch, 
  updateBatch, 
  enrollStudent 
} from '../controllers/batchController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBatches)
  .post(createBatch);

router.route('/:id')
  .get(getBatchById)
  .put(updateBatch);

router.route('/:id/enroll')
  .post(enrollStudent);

export default router;
