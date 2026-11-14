import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

// Same message for "no such user" and "wrong password", so attackers can't discover which accounts exist.
const INVALID_CREDENTIALS_MESSAGE = 'Invalid login or password';

function buildSession(user) {
  return { token: signToken(user._id), user: user.toJSON() };
}

export async function register({ username, email, password }) {
  const passwordHash = await hashPassword(password);
  // No `type` passed: the model's default (UserType.NORMAL) applies. Duplicates → 409 via the error handler.
  const user = await User.create({ username, email, passwordHash });
  return buildSession(user);
}

export async function login({ login, password }) {
  const looksLikeEmail = login.includes('@');
  const filter = looksLikeEmail ? { email: login.toLowerCase() } : { username: login };

  const user = await User.findOne(filter).select('+passwordHash');
  const passwordMatches = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!passwordMatches) {
    throw new AppError(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
  }
  return buildSession(user);
}
