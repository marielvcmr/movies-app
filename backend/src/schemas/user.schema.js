import { z } from 'zod';
import { usernameSchema, emailSchema, passwordSchema } from './auth.schema.js';

export const updateMeSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine((changes) => Object.values(changes).some((value) => value !== undefined), {
    message: 'send at least one of: username, email, password',
  });
