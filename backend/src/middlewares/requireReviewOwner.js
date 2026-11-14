import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { getReviewById } from '../services/review.service.js';

// README access "Dueño": only the author of the review can continue. Sets req.review.
export async function requireReviewOwner(req, res, next) {
  const review = await getReviewById(req.validated.params.id);
  if (!review) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Review not found');
  }

  if (!review.author.equals(req.user._id)) {
    throw new AppError(HttpStatus.FORBIDDEN, 'You can only change your own reviews');
  }

  req.review = review;
  next();
}
