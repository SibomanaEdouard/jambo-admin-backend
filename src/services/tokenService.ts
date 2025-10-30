import jwt from 'jsonwebtoken';

export class TokenService {
  static generateAdminToken(adminData: any): string {
    return jwt.sign(
      { 
        ...adminData,
        isAdmin: true 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  static getAdminToken(): string {
    return this.generateAdminToken({
      id: 'admin-system',
      role: 'super-admin'
    });
  }
}