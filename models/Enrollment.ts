import mongoose, { Document, Schema } from 'mongoose';


export interface IEnrollment extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
    enrolledAt: Date;
    completedAt?: Date;
  }
  
  const EnrollmentSchema = new Schema<IEnrollment>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED'],
      default: 'ACTIVE',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  });
  
  // Compound index to ensure unique enrollment per user per course
  EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
  
  export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);