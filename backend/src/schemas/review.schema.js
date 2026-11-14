import { z } from 'zod';
import { ReviewLimits } from '../constants/reviewLimits.js';
import { ReviewGroup } from '../constants/enums.js';
import { paginationShape, objectIdSchema } from './common.schema.js';

const pointsSchema = z.number().int().min(ReviewLimits.POINTS_MIN).max(ReviewLimits.POINTS_MAX);
const commentTextSchema = z.string().trim().max(ReviewLimits.COMMENT_MAX);

export const createReviewSchema = z.object({
  points: pointsSchema,
  // Empty or missing comment → null, so the database never stores "".
  comment: commentTextSchema.optional().transform((comment) => comment || null),
});

export const updateReviewSchema = z
  .object({
    points: pointsSchema.optional(),
    // Not sent → no change. "" or null → remove the comment.
    comment: commentTextSchema
      .nullable()
      .optional()
      .transform((comment) => (comment === undefined ? undefined : comment || null)),
  })
  .refine((changes) => changes.points !== undefined || changes.comment !== undefined, {
    message: 'send at least one of: points, comment',
  });

export const reviewIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const listReviewsQuerySchema = z.object({
  group: z.enum(Object.values(ReviewGroup)).optional(),
  ...paginationShape,
});
