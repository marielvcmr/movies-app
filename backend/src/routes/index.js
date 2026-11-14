import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import programRoutes from './program.routes.js';
import reviewRoutes from './review.routes.js';

// Every API route group is mounted here. 

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/programs', programRoutes);
router.use('/reviews', reviewRoutes);

export default router;
