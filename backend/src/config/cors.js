import cors from 'cors';
import { env } from './env.js';

// Only origins listed in CORS_ORIGIN receive an Access-Control-Allow-Origin header.
// Auth uses the Authorization header (not cookies), so credentials stay disabled.
export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN,
});
