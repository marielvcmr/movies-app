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

export async function listProgramReviews(req, res) {
  const result = await reviewService.listProgramReviews(req.validated.params.id, req.validated.query);
  res.status(HttpStatus.OK).json(result);
}

export async function updateReview(req, res) {
  const review = await reviewService.updateReview(req.review, req.validated.body);
  res.status(HttpStatus.OK).json({ review });
}

export async function deleteReview(req, res) {
  await reviewService.deleteReview(req.review);
  res.status(HttpStatus.NO_CONTENT).end();
}