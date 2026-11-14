import mongoose from 'mongoose';

// Aggregation pipelines do not convert text ids to ObjectIds (find() does). Use this before $match.
export function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id));
}
