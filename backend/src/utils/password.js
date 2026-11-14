import bcrypt from 'bcrypt';

// Cost factor: each +1 doubles hashing time. 12 takes ~250ms — slow for attackers, fine for one login.
const SALT_ROUNDS = 12;

export function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}
