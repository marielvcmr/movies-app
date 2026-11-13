import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load backend/.env regardless of which folder the process was started from.
dotenv.config({
  path: path.resolve(import.meta.dirname, '../../.env'),
  quiet: true,
});

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().min(1).default('127.0.0.1'),
  /*MONGODB_URI: z
    .string({ error: 'is required' })
    .regex(/^mongodb(\+srv)?:\/\//, 'must start with mongodb:// or mongodb+srv://'),*/
  JWT_SECRET: z
    .string({ error: 'is required' })
    .min(32, 'must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  //OMDB_API_KEY: z.string({ error: 'is required' }).min(1, 'is required'),
  CORS_ORIGIN: z
    .string({ error: 'is required' })
    .min(1, 'is required')
    .transform((value) =>
      value.split(',').map((origin) => origin.trim()).filter(Boolean),
    ),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const problems = result.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(`Invalid environment configuration (check backend/.env):\n${problems}`);
  process.exit(1);
}

export const env = Object.freeze(result.data);
