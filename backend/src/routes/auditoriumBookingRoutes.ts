import { Router } from 'express';
import { 
  getAuditoriumBookings, 
  createAuditoriumBooking, 
  updateAuditoriumBooking, 
  deleteAuditoriumBooking,
  updateAuditoriumBookingStatus
} from '../controllers/auditoriumBookingController';

const router = Router();

router.route('/')
  .get(getAuditoriumBookings)
  .post(createAuditoriumBooking);

router.route('/:id')
  .put(updateAuditoriumBooking)
  .delete(deleteAuditoriumBooking);

router.route('/:id/status')
  .patch(updateAuditoriumBookingStatus);

export default router;
