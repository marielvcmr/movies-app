import { z } from 'zod';
import { UserLimits } from '../constants/userLimits.js';

// Field rules shared by register (all required) and PATCH /users/me (all optional).
export const usernameSchema = z
  .string()
  .trim()
  .min(UserLimits.USERNAME_MIN)
  .max(UserLimits.USERNAME_MAX)
  .regex(UserLimits.USERNAME_PATTERN, 'may only contain letters, numbers, dots, hyphens and underscores');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(UserLimits.EMAIL_MAX)
  .pipe(z.email('must be a valid email'));

// Spaces are rejected (not trimmed), so the stored password is always exactly what the user typed.
export const passwordSchema = z
  .string()
  .min(UserLimits.PASSWORD_MIN)
  .max(UserLimits.PASSWORD_MAX)
  .regex(UserLimits.PASSWORD_PATTERN, 'must not contain spaces');

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'is required'),
  password: z.string().min(1, 'is required'),
});
