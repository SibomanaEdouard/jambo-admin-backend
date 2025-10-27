import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  adminId: mongoose.Types.ObjectId;
  targetUserId?: mongoose.Types.ObjectId;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true }
}, {
  timestamps: true
});

// Index for faster queries
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);