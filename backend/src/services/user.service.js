import { User } from '../models/User.js';

// Returns the user document, or null if it doesn't exist. Step 8 adds self-editing here.
export function getUserById(userId) {
  return User.findById(userId);
}
