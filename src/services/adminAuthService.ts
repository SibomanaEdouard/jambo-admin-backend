import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';

export class AdminAuthService {
  static async createDefaultAdmin() {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const existingAdmin = await db.collection('admins').findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);
      const admin = {
        email: process.env.ADMIN_EMAIL!,
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('admins').insertOne(admin);
      console.log('Default admin user created');
    }
  }

  static async loginAdmin(email: string, password: string) {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const admin = await db.collection('admins').findOne({ email, isActive: true });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.collection('admins').updateOne(
      { _id: admin._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = jwt.sign(
      { 
        adminId: admin._id.toString(), 
        email: admin.email,
        role: admin.role
      },
      Buffer.from(process.env.JWT_SECRET as string),
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "1h" } as SignOptions
    );

    return {
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token
    };
  }
}