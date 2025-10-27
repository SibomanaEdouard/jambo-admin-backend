import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { UserManagementService } from '../services/userManagementService';
import { AuditLogService } from '../services/auditLogService';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const result = await UserManagementService.getAllUsers(page, limit, search);
    
    // Log the action
    await AuditLogService.logAction(
      'VIEW_USERS_LIST',
      req.admin._id,
      req,
      { page, limit, search, resultsCount: result.users.length }
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const userDetails = await UserManagementService.getUserDetails(userId);
    
    // Log the action
    await AuditLogService.logAction(
      'VIEW_USER_DETAILS',
      req.admin._id,
      req,
      { userId },
      userId
    );

    res.json(userDetails);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyDevice = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, deviceId } = req.body;
    const result = await UserManagementService.verifyUserDevice(userId, deviceId);
    
    // Log the action
    await AuditLogService.logAction(
      'VERIFY_DEVICE',
      req.admin._id,
      req,
      { userId, deviceId },
      userId
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await UserManagementService.getDashboardStats();
    
    // Log the action
    await AuditLogService.logAction(
      'VIEW_DASHBOARD',
      req.admin._id,
      req,
      { stats }
    );

    res.json(stats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};