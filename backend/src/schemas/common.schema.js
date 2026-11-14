import { z } from 'zod';
import { Pagination } from '../constants/queryLimits.js';

// Reusable ?page=&limit= rules. Query values arrive as text, so they're coerced to numbers.
export const paginationShape = {
  page: z.coerce.number().int().min(Pagination.FIRST_PAGE).default(Pagination.FIRST_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(Pagination.MAX_LIMIT)
    .default(Pagination.DEFAULT_LIMIT),
};

// MongoDB ObjectId: 24 hexadecimal characters.
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export const objectIdSchema = z.string().regex(OBJECT_ID_PATTERN, 'must be a valid id');
