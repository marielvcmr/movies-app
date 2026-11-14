import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { updateMeSchema } from '../schemas/user.schema.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.patch('/me', authenticate, validate(updateMeSchema), userController.updateMe);

export default router;
