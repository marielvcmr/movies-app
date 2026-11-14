import * as reviewService from '../services/review.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function createReview(req, res) {
  const review = await reviewService.createReview(req.user, req.validated.params.id, req.validated.body);
  res.status(HttpStatus.CREATED).json({ review });
}

export async function getMyReview(req, res) {
  const review = await reviewService.getMyReview(req.user, req.validated.params.id);
  res.status(HttpStatus.OK).json({ review });
}
