import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate, RequestPart } from '../middlewares/validate.js';
import { requireReviewOwner } from '../middlewares/requireReviewOwner.js';
import { reviewIdParamsSchema, updateReviewSchema } from '../schemas/review.schema.js';
import * as reviewController from '../controllers/review.controller.js';

const router = Router();

router.patch('/:id', authenticate, validate(reviewIdParamsSchema, RequestPart.PARAMS), requireReviewOwner, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, validate(reviewIdParamsSchema, RequestPart.PARAMS), requireReviewOwner, reviewController.deleteReview);

export default router;
