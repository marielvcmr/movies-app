import mongoose from 'mongoose';
import { ReviewLimits } from '../constants/reviewLimits.js';

const reviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    comment: { type: String, trim: true, maxlength: ReviewLimits.COMMENT_MAX, default: null },
    points: {
      type: Number,
      required: true,
      min: ReviewLimits.POINTS_MIN,
      max: ReviewLimits.POINTS_MAX,
      validate: { validator: Number.isInteger, message: 'points must be an integer' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Indexes from DESIGN.md → "Índices".
reviewSchema.index({ author: 1, program: 1 }, { unique: true });
reviewSchema.index({ program: 1, createdAt: -1 });
reviewSchema.index({ author: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
