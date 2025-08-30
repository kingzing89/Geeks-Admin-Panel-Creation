import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseReview extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const CourseReviewSchema = new Schema<ICourseReview>({
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  }, {
    timestamps: true,
  });
  
  // Compound index to ensure unique review per user per course
  CourseReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
  
  export const CourseReview = mongoose.models.CourseReview || mongoose.model<ICourseReview>('CourseReview', CourseReviewSchema);
  