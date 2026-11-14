import { Router } from 'express';
import { HttpStatus } from '../constants/httpStatus.js';

// Throwaway route for Step 1 verification — delete once auth routes exist (Step 6).
const router = Router();

router.get('/', (req, res) => {
  res.status(HttpStatus.OK).json({ ok: true });
});

export default router;
