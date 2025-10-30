import { Router } from 'express';
import { 
  getAllUsers,  
  verifyDevice, 
  getDashboardStats 
} from '../controllers/userManagementController';
import { authenticateAdmin } from '../middlewares/auth';

const router = Router();

router.use(authenticateAdmin);


router.get('', getAllUsers);
router.get('/dashboard/stats', getDashboardStats);
router.post('/:userId/verify-device', verifyDevice);

export default router;