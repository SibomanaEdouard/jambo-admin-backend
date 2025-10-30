import { Router } from 'express';
import { login } from '../controllers/adminAuthController';
import { authLimiter } from '../middlewares/security';
import { authenticateAdmin } from '../middlewares/auth';
import { AdminAuthService } from '../services/adminAuthService';
;

const router = Router();

router.post('/login', authLimiter, login);
router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    await AdminAuthService.logoutAdmin();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

export default router;