import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { UserManagementService } from '../services/userManagementService';
import { AuditLogService } from '../services/auditLogService';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    // Get the token from the current admin request
    const adminToken = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('🔐 Controller - Making users request with token:', {
      hasToken: !!adminToken,
      tokenLength: adminToken?.length,
      adminId: req.admin?._id
    });

    const result = await UserManagementService.getAllUsers(
      page, 
      limit, 
      search,
      adminToken  
    );
    
    // Log the action
    await AuditLogService.logAction(
      'VIEW_USERS_LIST',
      req.admin._id,
      req,
      { page, limit, search, resultsCount: result.users.length }
    );

    res.json(result);
  } catch (error: any) {
    console.error('❌ Controller error fetching users:', error);
    res.status(400).json({ message: error.message });
  }
};

export const verifyDevice = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { deviceId } = req.body;
    
    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    // Get the token from the current admin request
    const adminToken = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('🔐 Controller - Verifying device with token:', {
      hasToken: !!adminToken,
      userId,
      deviceId
    });

    const result = await UserManagementService.verifyUserDevice(
      userId, 
      deviceId,
      adminToken
    );
    
    // Log the action
    await AuditLogService.logAction(
      'VERIFY_DEVICE',
      req.admin._id,
      req,
      { userId, deviceId },
      userId
    );

    return res.json(result); 
  } catch (error: any) {
    console.error('❌ Controller error verifying device:', error);
    return res.status(400).json({ message: error.message }); 
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get the token from the current admin request
    const adminToken = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('🔐 Controller - Getting dashboard stats with token:', {
      hasToken: !!adminToken
    });

    const stats = await UserManagementService.getDashboardStats(
      adminToken 
    );
    
    // Log the action
    await AuditLogService.logAction(
      'VIEW_DASHBOARD',
      req.admin._id,
      req,
      { stats }
    );

    res.json(stats);
  } catch (error: any) {
    console.error('❌ Controller error fetching dashboard stats:', error);
    res.status(400).json({ message: error.message });
  }
};