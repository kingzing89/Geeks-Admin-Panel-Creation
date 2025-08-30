import mongoose, { Document, Schema } from 'mongoose';


export interface IDocumentation extends Document {
    title: string;
    slug: string;
    description?: string;
    content: string;
    category: string;
    readTime?: string;
    keyFeatures: string[];
    codeExamples: Array<{
      title: string;
      code: string;
      description: string;
    }>;
    quickLinks: string[];
    proTip?: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const DocumentationSchema = new Schema<IDocumentation>({
    title: {
      type: String,
      required: true,
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
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    readTime: {
      type: String,
    },
    keyFeatures: [{
      type: String,
    }],
    codeExamples: [{
      title: { type: String, required: true },
      code: { type: String, required: true },
      description: { type: String, required: true },
    }],
    quickLinks: [{
      type: String,
    }],
    proTip: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  }, {
    timestamps: true,
  });
  
  export const Documentation = mongoose.models.Documentation || mongoose.model<IDocumentation>('Documentation', DocumentationSchema);
  