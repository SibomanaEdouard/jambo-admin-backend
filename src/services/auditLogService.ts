import AuditLog from '../models/AuditLog';

export class AuditLogService {
  static async logAction(
    action: string,
    adminId: string,
    req: any,
    details?: any,
    targetUserId?: string
  ) {
    try {
      const auditLog = new AuditLog({
        action,
        adminId,
        targetUserId,
        details,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      await auditLog.save();
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  }

  static async getAdminLogs(adminId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const logs = await AuditLog.find({ adminId })
      .populate('targetUserId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments({ adminId });

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}