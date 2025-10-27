import { Router } from 'express';
import { 
  getAllUsers, 
  getUserDetails, 
  verifyDevice, 
  getDashboardStats 
} from '../controllers/userManagementController';
import { authenticateAdmin } from '../middlewares/auth';

const router = Router();

router.use(authenticateAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/', getAllUsers);
router.get('/:userId', getUserDetails);
router.post('/verify-device', verifyDevice);

export default router;