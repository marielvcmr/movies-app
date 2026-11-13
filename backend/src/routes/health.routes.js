import { Router } from 'express';

// Throwaway route for Step 1 verification — delete once auth routes exist (Step 6).
const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ ok: true });
});

export default router;
