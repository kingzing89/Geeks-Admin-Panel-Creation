import mongoose, { Document, Schema } from 'mongoose';
export interface INewsletterSubscriber extends Document {
    email: string;
    createdAt: Date;
  }


const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  }, {
    timestamps: { createdAt: true, updatedAt: false },
  });
  
  export const NewsletterSubscriber = mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema)
  