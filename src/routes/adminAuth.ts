import { Router } from 'express';
import { login } from '../controllers/adminAuthController';
import { authLimiter } from '../middlewares/security';
;

const router = Router();

router.post('/login', authLimiter, login);

export default router;