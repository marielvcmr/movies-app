import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// The token only carries the user id ("subject"). Step 7 loads the user from the DB on each request,
// so a type change by an admin takes effect immediately instead of waiting for the token to expire.
export function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: env.JWT_EXPIRES_IN,
  });
}
