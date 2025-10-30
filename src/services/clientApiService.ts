import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';

const CLIENT_BACKEND_URL = process.env.CLIENT_BACKEND_URL || 'http://localhost:5000';

class TokenManager {
  private static instance: TokenManager;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string): void {
    process.env.ADMIN_ACCESS_TOKEN = token;
  }

  getToken(): string | null {
    const token = process.env.ADMIN_ACCESS_TOKEN;
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.log('Token has expired, clearing it');
        this.clearToken();
        return null;
      }
    } catch (error) {
      console.warn('Could not decode token for expiry check');
    }
    
    return token;
  }

  clearToken(): void {
    delete process.env.ADMIN_ACCESS_TOKEN;
  }

  isTokenValid(): boolean {
    return !!this.getToken();
  }
}



export const clientApi = axios.create({
  baseURL: `${CLIENT_BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Extend AxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor with dynamic token management
clientApi.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const tokenManager = TokenManager.getInstance();
    const adminToken = tokenManager.getToken();
    
    if (adminToken) {
      // Ensure headers exist
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else {
      console.warn('No valid admin token available for client backend request');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
clientApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    // If token is invalid/expired (401) and we haven't already tried to refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Admin token rejected by client backend, clearing token...');
      TokenManager.getInstance().clearToken();
    }
    
    // Log detailed error information
    if (error.response) {
      console.error('Client Backend API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('Client Backend Network Error:', {
        message: error.message,
        url: error.config?.url
      });
    } else {
      console.error('Client Backend Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const tokenManager = TokenManager.getInstance();

export const clientApiService = {
  // Get all users from client backend
  async getUsers(page: number = 1, limit: number = 10, search: string = '') {
    try {
      if (!tokenManager.isTokenValid()) {
        throw new Error('No valid admin token available. Please log in again.');
      }

      const response = await clientApi.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users from client backend:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  },

  // Verify a user's device
  async verifyDevice(userId: string, deviceId: string) {
    try {
      if (!tokenManager.isTokenValid()) {
        throw new Error('No valid admin token available. Please log in again.');
      }

      const response = await clientApi.post(`/admin/users/${userId}/verify-device`, { deviceId });
      return response.data;
    } catch (error: any) {
      console.error('Error verifying device in client backend:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to verify device');
    }
  },

  // Get user by ID
  async getUserById(userId: string) {
    try {
      if (!tokenManager.isTokenValid()) {
        throw new Error('No valid admin token available. Please log in again.');
      }

      const response = await clientApi.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user from client backend:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  },

  // Get dashboard stats
  async getDashboardStats() {
    try {
      if (!tokenManager.isTokenValid()) {
        throw new Error('No valid admin token available. Please log in again.');
      }

      const response = await clientApi.get('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats from client backend:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard stats');
    }
  },

  // This is  test   connection with client backend
  async testConnection(): Promise<{ connected: boolean; message?: string }> {
    try {
      if (!tokenManager.isTokenValid()) {
        return { connected: false, message: 'No valid admin token' };
      }

      await clientApi.get('/admin/dashboard/stats');
      return { connected: true };
    } catch (error: any) {
      return { 
        connected: false, 
        message: error.response?.data?.message || error.message 
      };
    }
  }
};


export const tokenUtils = {
  // Set token when admin logs in
  setAdminToken(token: string): void {
    tokenManager.setToken(token);
    console.log('Admin token set for client backend communication');
  },

  // Clear token when admin logs out
  clearAdminToken(): void {
    tokenManager.clearToken();
    console.log('Admin token cleared');
  },

  // Check if we have a valid token
  hasValidToken(): boolean {
    return tokenManager.isTokenValid();
  },

  getTokenInfo(): { hasToken: boolean; isExpired: boolean } {
    const token = tokenManager.getToken();
    return {
      hasToken: !!token,
      isExpired: !tokenManager.isTokenValid()
    };
  }
};