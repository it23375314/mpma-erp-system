import express from 'express';
import { getVehicles, createVehicle, deleteVehicle, updateVehicle } from '../controllers/vehicleController';

const router = express.Router();

router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').delete(deleteVehicle).put(updateVehicle);

export default router;
