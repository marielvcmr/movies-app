import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

// Returns the user document, or null if it doesn't exist. Step 8 adds self-editing here.
export function getUserById(userId) {
  return User.findById(userId);
}

// Applies the session user's own changes. Duplicates (username/email) → 409 via the error handler.
export async function updateMe(user, { username, email, password }) {
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.passwordHash = await hashPassword(password);

  await user.save();
  return user;
}