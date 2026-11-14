import { z } from 'zod';
import { UserLimits } from '../constants/userLimits.js';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(UserLimits.USERNAME_MIN)
    .max(UserLimits.USERNAME_MAX)
    .regex(UserLimits.USERNAME_PATTERN, 'may only contain letters, numbers, dots, hyphens and underscores'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(UserLimits.EMAIL_MAX)
    .pipe(z.email('must be a valid email')),
  // Not trimmed: spaces are valid password characters.
  password: z.string().min(UserLimits.PASSWORD_MIN).max(UserLimits.PASSWORD_MAX),
});

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'is required'),
  password: z.string().min(1, 'is required'),
});
