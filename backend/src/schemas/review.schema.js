import { z } from 'zod';
import { ReviewLimits } from '../constants/reviewLimits.js';

export const createReviewSchema = z.object({
  points: z.number().int().min(ReviewLimits.POINTS_MIN).max(ReviewLimits.POINTS_MAX),
  // Empty or missing comment → null, so the database never stores "".
  comment: z
    .string()
    .trim()
    .max(ReviewLimits.COMMENT_MAX)
    .optional()
    .transform((comment) => comment || null),
});
