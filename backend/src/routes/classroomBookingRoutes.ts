import express from 'express';
import { 
  getClassroomBookings, 
  createClassroomBooking, 
  updateClassroomBooking, 
  deleteClassroomBooking,
  updateClassroomBookingStatus
} from '../controllers/classroomBookingController';

const router = express.Router();

router.route('/').get(getClassroomBookings).post(createClassroomBooking);
router.route('/:id').put(updateClassroomBooking).delete(deleteClassroomBooking);
router.route('/:id/status').patch(updateClassroomBookingStatus);

export default router;
