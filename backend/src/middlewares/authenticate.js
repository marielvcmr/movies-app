import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { verifyToken } from '../utils/token.js';
import { getUserById } from '../services/user.service.js';

// "Bearer <token>". The scheme name is case-insensitive per the HTTP spec.
const BEARER_TOKEN_PATTERN = /^Bearer\s+(\S+)$/i;

// Requires a valid session. On success, req.user is the logged-in user's document.
export async function authenticate(req, res, next) {
  const match = BEARER_TOKEN_PATTERN.exec(req.get('Authorization') ?? '');
  if (!match) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Missing or malformed Authorization header');
  }

  const userId = verifyToken(match[1]);
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  // The token can outlive the account (e.g. the user deleted it), so always check the user still exists.
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  req.user = user;
  next();
}
