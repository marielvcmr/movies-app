import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate, RequestPart } from '../middlewares/validate.js';
import { listProgramsQuerySchema, programIdParamsSchema } from '../schemas/program.schema.js';
import { createReviewSchema, listReviewsQuerySchema } from '../schemas/review.schema.js';
import * as programController from '../controllers/program.controller.js';
import * as reviewController from '../controllers/review.controller.js';

const router = Router();

router.get('/', authenticate, validate(listProgramsQuerySchema, RequestPart.QUERY), programController.listPrograms);

router.get('/:id', authenticate, validate(programIdParamsSchema, RequestPart.PARAMS), programController.getProgram);

// Reviews of a program.
router.post('/:id/reviews', authenticate, validate(programIdParamsSchema, RequestPart.PARAMS), validate(createReviewSchema), reviewController.createReview,);

router.get('/:id/reviews', authenticate, validate(programIdParamsSchema, RequestPart.PARAMS), validate(listReviewsQuerySchema, RequestPart.QUERY), reviewController.listProgramReviews);

router.get('/:id/reviews/mine', authenticate, validate(programIdParamsSchema, RequestPart.PARAMS), reviewController.getMyReview,);

export default router;
