import express from 'express';
import { 
  getTransportBookings, 
  createTransportBooking, 
  updateTransportBooking, 
  deleteTransportBooking,
  updateTransportBookingStatus
} from '../controllers/transportBookingController';

const router = express.Router();

router.route('/').get(getTransportBookings).post(createTransportBooking);
router.route('/:id').put(updateTransportBooking).delete(deleteTransportBooking);
router.route('/:id/status').patch(updateTransportBookingStatus);

export default router;
