import mongoose from 'mongoose';
import { UserType } from '../constants/enums.js';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    // Never returned by queries unless explicitly requested with .select('+passwordHash').
    passwordHash: { type: String, required: true, select: false },
    type: { type: String, enum: Object.values(UserType), default: UserType.NORMAL },
  },
  {
    timestamps: true,
    toJSON: {
      // Safety net: strip internal fields whenever a user document is turned into JSON.
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const User = mongoose.model('User', userSchema);
