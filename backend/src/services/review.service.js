import { Review } from '../models/Review.js';
import { Program } from '../models/Program.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { getDuplicateKeyFields } from '../utils/dbErrors.js';

export async function createReview(user, programId, { points, comment }) {
  const programExists = await Program.exists({ _id: programId });
  if (!programExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Program not found');
  }

  try {
    return await Review.create({ author: user._id, program: programId, points, comment });
  } catch (err) {
    // The unique { author, program } index: this user already reviewed this program.
    const duplicateFields = getDuplicateKeyFields(err);
    if (duplicateFields) {
      throw new AppError(HttpStatus.CONFLICT, 'You have already reviewed this program', {
        details: { fields: duplicateFields },
      });
    }
    throw err;
  }
}

export async function getMyReview(user, programId) {
  const review = await Review.findOne({ author: user._id, program: programId });
  if (!review) {
    throw new AppError(HttpStatus.NOT_FOUND, 'You have not reviewed this program');
  }
  return review;
}
