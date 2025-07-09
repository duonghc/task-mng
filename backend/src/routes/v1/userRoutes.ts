import { Router } from 'express';
import { register, login, getProfile, updateProfile, listUsers } from '../../controllers/userController';
import { requireAuth } from '../../middleware/requireAuth';
import { validatePasswordStrength } from '../../middleware/passwordValidation';
import { authRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, validatePasswordStrength, register);
router.post('/login', authRateLimiter, login);
router.get('/me', requireAuth, getProfile);
router.patch('/me', requireAuth, updateProfile);
router.get('/', listUsers);

export default router;
