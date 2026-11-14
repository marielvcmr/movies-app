import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import programRoutes from './program.routes.js';

// Every API route group is mounted here. Later steps add /users, /programs and /reviews.
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/programs', programRoutes);

export default router;
