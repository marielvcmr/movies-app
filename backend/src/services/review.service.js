import { Review } from '../models/Review.js';
import { Program } from '../models/Program.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { UserType, ReviewGroup } from '../constants/enums.js';
import { getDuplicateKeyFields } from '../utils/dbErrors.js';
import { toObjectId } from '../utils/objectId.js';
import { recalculateProgramAverages } from './score.service.js';

const DESCENDING = -1;
const NEWEST_FIRST = Object.freeze({ createdAt: DESCENDING, _id: DESCENDING });

// README: critics = authors of type critic; audience = authors of type normal and admin.
const AUTHOR_TYPES_BY_GROUP = Object.freeze({
  [ReviewGroup.CRITICS]: [UserType.CRITIC],
  [ReviewGroup.AUDIENCE]: [UserType.NORMAL, UserType.ADMIN],
});

// Fields sent to clients for each review in a list. The author shows only username and type (never email).
const REVIEW_LIST_FIELDS = Object.freeze({
  program: 1,
  points: 1,
  comment: 1,
  createdAt: 1,
  updatedAt: 1,
  'author._id': 1,
  'author.username': 1,
  'author.type': 1,
});

async function ensureProgramExists(programId) {
  const programExists = await Program.exists({ _id: programId });
  if (!programExists) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Program not found');
  }
}

export async function createReview(user, programId, { points, comment }) {
  await ensureProgramExists(programId);

  let review;
  try {
    review = await Review.create({ author: user._id, program: programId, points, comment });
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

  await recalculateProgramAverages(programId);
  return review;
}

export async function getMyReview(user, programId) {
  const review = await Review.findOne({ author: user._id, program: programId });
  if (!review) {
    throw new AppError(HttpStatus.NOT_FOUND, 'You have not reviewed this program');
  }
  return review;
}

export async function listProgramReviews(programId, { group, page, limit }) {
  await ensureProgramExists(programId);

  const pipeline = [
    { $match: { program: toObjectId(programId) } },
    { $lookup: { from: User.collection.name, localField: 'author', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
  ];
  if (group) {
    pipeline.push({ $match: { 'author.type': { $in: AUTHOR_TYPES_BY_GROUP[group] } } });
  }
  pipeline.push({
    $facet: {
      data: [
        { $sort: NEWEST_FIRST },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: REVIEW_LIST_FIELDS },
      ],
      total: [{ $count: 'count' }],
    },
  });

  const [result] = await Review.aggregate(pipeline);
  return { data: result.data, page, limit, total: result.total[0]?.count ?? 0 };
}

export function getReviewById(reviewId) {
  return Review.findById(reviewId);
}

export async function updateReview(review, { points, comment }) {
  if (points !== undefined) review.points = points;
  if (comment !== undefined) review.comment = comment;

  await review.save();
  await recalculateProgramAverages(review.program);
  return review;
}

export async function deleteReview(review) {
  await review.deleteOne();
  await recalculateProgramAverages(review.program);
}
