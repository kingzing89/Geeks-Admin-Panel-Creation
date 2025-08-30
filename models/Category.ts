import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    title: string;
    slug: string;
    description?: string;
    content?: string;
    bgColor?: string;
    icon?: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const CategorySchema = new Schema<ICategory>({
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    bgColor: {
      type: String,
    },
    icon: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  }, {
    timestamps: true,
  });
  
  export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
  