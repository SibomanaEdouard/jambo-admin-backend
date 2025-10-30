import { Router } from 'express';
import { 
  getAllUsers,  
  verifyDevice, 
  getDashboardStats 
} from '../controllers/userManagementController';
import { authenticateAdmin } from '../middlewares/auth';

const router = Router();

router.use(authenticateAdmin);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           example: 150
 *         activeUsers:
 *           type: integer
 *           example: 120
 *         newUsers:
 *           type: integer
 *           example: 15
 *         verifiedDevices:
 *           type: integer
 *           example: 100
 */

/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: User management endpoints
 *   - name: Dashboard
 *     description: Dashboard statistics endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get paginated list of all users
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by email or name
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('', getAllUsers);

/**
 * @swagger
 * /api/admin/users/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * @swagger
 * /api/admin/users/{userId}/verify-device:
 *   post:
 *     summary: Verify a user's device
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Device ID to verify
 *                 example: "device-12345"
 *     responses:
 *       200:
 *         description: Device verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Device verified successfully
 *                 device:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:userId/verify-device', verifyDevice);

export default router;