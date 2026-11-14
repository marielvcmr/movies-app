import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { Program } from '../models/Program.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { UserType } from '../constants/enums.js';
import { hashPassword } from '../utils/password.js';
import { escapeRegex } from '../utils/text.js';
import { recalculateProgramAverages } from './score.service.js';

const DESCENDING = -1;
const NEWEST_FIRST = Object.freeze({ createdAt: DESCENDING, _id: DESCENDING });
// Regex option: ignore upper/lower case in the admin search.
const CASE_INSENSITIVE = 'i';

// Fields of each review in a user's review list, with a short summary of its program.
const USER_REVIEW_FIELDS = Object.freeze({
  points: 1,
  comment: 1,
  createdAt: 1,
  updatedAt: 1,
  'program._id': 1,
  'program.title': 1,
  'program.type': 1,
  'program.year': 1,
  'program.posterUrl': 1,
});

// ── Helpers ─────────────────────────────────────────────────────────────────

async function findUserOrFail(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
  }
  return user;
}

// The programs this user reviewed: their averages change when the user's type changes or the user is deleted.
function getReviewedProgramIds(userId) {
  return Review.distinct('program', { author: userId });
}

async function recalculatePrograms(programIds) {
  await Promise.all(programIds.map((programId) => recalculateProgramAverages(programId)));
}

function toPage(result, page, limit) {
  return { data: result.data, page, limit, total: result.total[0]?.count ?? 0 };
}

// ── Session user ────────────────────────────────────────────────────────────

// Returns the user document, or null if it doesn't exist.
export function getUserById(userId) {
  return User.findById(userId);
}

// Returns the user document with this exact username, or null.
export function findUserByUsername(username) {
  return User.findOne({ username });
}

// Applies the session user's own changes. Duplicates (username/email) → 409 via the error handler.
export async function updateMe(user, { username, email, password }) {
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.passwordHash = await hashPassword(password);

  await user.save();
  return user;
}

// DESIGN.md → "Borrado": delete the reviews, then the user, then recalculate the affected programs.
export async function deleteMe(user) {
  const programIds = await getReviewedProgramIds(user._id);
  await Review.deleteMany({ author: user._id });
  await user.deleteOne();
  await recalculatePrograms(programIds);
}

// ── Public profile ──────────────────────────────────────────────────────────

// README: { username, type, createdAt, reviewsCount, pointsMean }. Never the email.
export async function getPublicProfile(userId) {
  const user = await findUserOrFail(userId);

  const [stats] = await Review.aggregate([
    { $match: { author: user._id } },
    { $group: { _id: null, reviewsCount: { $sum: 1 }, pointsMean: { $avg: '$points' } } },
  ]);

  return {
    _id: user._id,
    username: user.username,
    type: user.type,
    createdAt: user.createdAt,
    reviewsCount: stats?.reviewsCount ?? 0,
    pointsMean: stats?.pointsMean ?? null,
  };
}

export async function listUserReviews(userId, { page, limit }) {
  const user = await findUserOrFail(userId);

  const [result] = await Review.aggregate([
    { $match: { author: user._id } },
    {
      $facet: {
        data: [
          { $sort: NEWEST_FIRST },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $lookup: { from: Program.collection.name, localField: 'program', foreignField: '_id', as: 'program' } },
          { $unwind: '$program' },
          { $project: USER_REVIEW_FIELDS },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ]);
  return toPage(result, page, limit);
}

// ── Admin ───────────────────────────────────────────────────────────────────

// README: the Users module list — username, email, type, createdAt and reviewsCount.
export async function listUsers({ q, type, page, limit }) {
  const filter = {};
  if (q) {
    const pattern = { $regex: escapeRegex(q), $options: CASE_INSENSITIVE };
    filter.$or = [{ username: pattern }, { email: pattern }];
  }
  if (type) filter.type = type;

  const [result] = await User.aggregate([
    { $match: filter },
    {
      $facet: {
        data: [
          { $sort: NEWEST_FIRST },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          // Count each user's reviews without loading them.
          {
            $lookup: {
              from: Review.collection.name,
              localField: '_id',
              foreignField: 'author',
              pipeline: [{ $count: 'count' }],
              as: 'reviewStats',
            },
          },
          {
            $project: {
              username: 1,
              email: 1,
              type: 1,
              createdAt: 1,
              reviewsCount: { $ifNull: [{ $first: '$reviewStats.count' }, 0] },
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ]);
  return toPage(result, page, limit);
}

// README: only normal ↔ critic; admins cannot be changed. Recalculates every program the user reviewed.
export async function changeUserType(userId, type) {
  const user = await findUserOrFail(userId);
  if (user.type === UserType.ADMIN) {
    throw new AppError(HttpStatus.FORBIDDEN, 'Admin accounts cannot be changed');
  }

  user.type = type;
  await user.save();

  await recalculatePrograms(await getReviewedProgramIds(user._id));
  return user;
}
