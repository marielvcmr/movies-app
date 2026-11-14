import { z } from 'zod';
import { usernameSchema, emailSchema, passwordSchema } from './auth.schema.js';
import { paginationShape, objectIdSchema } from './common.schema.js';
import { UserType } from '../constants/enums.js';

// An admin can only move users between these two types (README: the app never creates admins).
const ASSIGNABLE_TYPES = [UserType.NORMAL, UserType.CRITIC];

export const updateMeSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine((changes) => Object.values(changes).some((value) => value !== undefined), {
    message: 'send at least one of: username, email, password',
  });

export const userIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const userReviewsQuerySchema = z.object({
  ...paginationShape,
});

export const listUsersQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  type: z.enum(Object.values(UserType)).optional(),
  ...paginationShape,
});

export const changeUserTypeSchema = z.object({
  type: z.enum(ASSIGNABLE_TYPES),
});
