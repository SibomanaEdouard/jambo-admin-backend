import { clientApiService, tokenUtils } from './clientApiService';

export class UserManagementService {
  static async getAllUsers(page: number = 1, limit: number = 10, search: string = '', requestToken?: string) {
    try {
      console.log('🔐 UserManagementService - Processing users request:', {
        page,
        limit,
        search,
        hasRequestToken: !!requestToken,
        requestTokenLength: requestToken?.length
      });

      // Use the token from the current admin request
      if (requestToken) {
        console.log('🔐 Setting admin token for client backend call');
        tokenUtils.setAdminToken(requestToken);
      } else {
        console.warn('⚠️ No request token provided to UserManagementService');
      }

      const result = await clientApiService.getUsers(page, limit, search);
      console.log('✅ Successfully fetched users from client backend:', {
        userCount: result.users.length,
        totalPages: result.pagination.pages
      });
      
      return result;
    } catch (error: any) {
      console.error('❌ UserManagementService - Error fetching users:', {
        error: error.message,
        stack: error.stack
      });
      throw new Error(error.message || 'Failed to fetch users from client backend');
    }
  }

  static async verifyUserDevice(userId: string, deviceId: string, requestToken?: string) {
    try {
      console.log('🔐 UserManagementService - Verifying device:', {
        userId,
        deviceId,
        hasRequestToken: !!requestToken
      });

      if (requestToken) {
        tokenUtils.setAdminToken(requestToken);
      }

      const result = await clientApiService.verifyDevice(userId, deviceId);
      console.log('✅ Successfully verified device');
      
      return result;
    } catch (error: any) {
      console.error('❌ UserManagementService - Error verifying device:', error);
      throw new Error(error.message || 'Failed to verify device');
    }
  }

  static async getDashboardStats(requestToken?: string) {
    try {
      console.log('🔐 UserManagementService - Getting dashboard stats:', {
        hasRequestToken: !!requestToken
      });

      if (requestToken) {
        tokenUtils.setAdminToken(requestToken);
      }

      const result = await clientApiService.getDashboardStats();
      console.log('✅ Successfully fetched dashboard stats');
      
      return result;
    } catch (error: any) {
      console.error('❌ UserManagementService - Error fetching dashboard stats:', error);
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
  }
}