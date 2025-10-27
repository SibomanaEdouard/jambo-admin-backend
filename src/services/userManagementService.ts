import mongoose from 'mongoose';
interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number;
  devices: Array<{
    deviceId: string;
    verified: boolean;
    verifiedAt?: Date;
    lastLogin?: Date;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ITransaction {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  createdAt: Date;
}

export class UserManagementService {
  static async getAllUsers(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    
    // We'll use the same database but different collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const searchFilter = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await db.collection('users')
      .find(searchFilter)
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('users').countDocuments(searchFilter);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getUserDetails(userId: string) {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const user = await db.collection('users')
      .findOne({ _id: new mongoose.Types.ObjectId(userId) }, { projection: { password: 0 } });

    if (!user) {
      throw new Error('User not found');
    }

    const transactions = await db.collection('transactions')
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return {
      user,
      recentTransactions: transactions
    };
  }

  static async verifyUserDevice(userId: string, deviceId: string) {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const result = await db.collection('users').updateOne(
      { 
        _id: new mongoose.Types.ObjectId(userId),
        'devices.deviceId': deviceId
      },
      {
        $set: {
          'devices.$.verified': true,
          'devices.$.verifiedAt': new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error('User or device not found');
    }

    return { message: 'Device verified successfully' };
  }

  static async getDashboardStats() {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const totalUsers = await db.collection('users').countDocuments();
    const activeUsers = await db.collection('users').countDocuments({ isActive: true });
    
    const pendingDevicesResult = await db.collection('users').aggregate([
      { $unwind: '$devices' },
      { $match: { 'devices.verified': false } },
      { $count: 'count' }
    ]).toArray();

    const totalBalanceResult = await db.collection('users').aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]).toArray();

    const recentTransactions = await db.collection('transactions')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 1,
            type: 1,
            amount: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.email': 1
          }
        }
      ])
      .toArray();

    return {
      totalUsers,
      activeUsers,
      pendingDevices: pendingDevicesResult[0]?.count || 0,
      totalBalance: totalBalanceResult[0]?.total || 0,
      recentTransactions
    };
  }
}