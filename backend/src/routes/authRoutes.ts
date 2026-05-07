import { Router } from 'express';
import { register, login, changePassword, getUsers, deleteUser, updateUser } from '../controllers/authController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/users', protect, adminOnly, getUsers);
router.patch('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/register', protect, adminOnly, register);
router.post('/login', login);
router.post('/change-password', protect, changePassword);

export default router;
