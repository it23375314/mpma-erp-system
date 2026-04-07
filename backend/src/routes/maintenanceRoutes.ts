import { Router } from 'express';
import { 
  getMaintenances,
  createMaintenance,
  deleteMaintenance,
  updateMaintenance,
  checkMaintenanceConflict
} from '../controllers/maintenanceController';

const router = Router();

router.route('/')
  .get(getMaintenances)
  .post(createMaintenance);

router.post('/check-conflict', checkMaintenanceConflict);

router.route('/:id')
  .delete(deleteMaintenance)
  .put(updateMaintenance);

export default router;
