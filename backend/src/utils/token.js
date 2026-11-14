import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Pinned so a token signed with any other algorithm (including "none") is always rejected.
const TOKEN_ALGORITHM = 'HS256';

// The token only carries the user id ("subject"). Step 7 loads the user from the DB on each request,
// so a type change by an admin takes effect immediately instead of waiting for the token to expire.
export function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    algorithm: TOKEN_ALGORITHM,
    subject: String(userId),
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

// Returns the user id stored in a valid token, or null if the token is invalid, tampered with or expired.
export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: [TOKEN_ALGORITHM] });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}