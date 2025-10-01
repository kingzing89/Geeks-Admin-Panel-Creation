import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  documentId: {
    type: Schema.Types.ObjectId,
    ref: 'Documentation',
    required: true,
    index: true,
  },
  stripeSessionId: {
    type: String,
    sparse: true,
    index: true,
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});


PurchaseSchema.index({ userId: 1, documentId: 1 }, { unique: true });
PurchaseSchema.index({ userId: 1, status: 1 });
PurchaseSchema.index({ documentId: 1, status: 1 });

export const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);