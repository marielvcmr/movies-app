import { Router } from 'express';
import authRoutes from './auth.routes.js';

// Every API route group is mounted here. Later steps add /users, /programs and /reviews.
const router = Router();

router.use('/auth', authRoutes);

export default router;
