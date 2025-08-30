import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseProgress extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    completedSections: string[];
    progressPercentage: number;
    lastAccessedAt: Date;
  }
  
  const CourseProgressSchema = new Schema<ICourseProgress>({
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
    completedSections: [{
      type: String,
    }],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Compound index to ensure unique progress per user per course
  CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
  
  export const CourseProgress = mongoose.models.CourseProgress || mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);