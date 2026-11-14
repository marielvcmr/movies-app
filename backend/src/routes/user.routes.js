import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { validate, RequestPart } from '../middlewares/validate.js';
import {
  updateMeSchema,
  userIdParamsSchema,
  userReviewsQuerySchema,
  listUsersQuerySchema,
  changeUserTypeSchema,
} from '../schemas/user.schema.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Admin: the Users module list.
router.get('/', authenticate, requireAdmin, validate(listUsersQuerySchema, RequestPart.QUERY), userController.listUsers);

// The session user. These come before '/:id' so that "me" is never read as an id.
router.patch('/me', authenticate, validate(updateMeSchema), userController.updateMe);
router.delete('/me', authenticate, userController.deleteMe);

// Any user: public profile and reviews of a user.
router.get('/:id', authenticate, validate(userIdParamsSchema, RequestPart.PARAMS), userController.getProfile);
router.get('/:id/reviews', authenticate, validate(userIdParamsSchema, RequestPart.PARAMS), validate(userReviewsQuerySchema, RequestPart.QUERY), userController.listUserReviews);

// Admin: change a user's type.
router.patch('/:id/type', authenticate, requireAdmin, validate(userIdParamsSchema, RequestPart.PARAMS), validate(changeUserTypeSchema), userController.changeType);

export default router;
