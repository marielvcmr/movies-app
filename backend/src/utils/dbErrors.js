// MongoDB's error code for a unique-index violation.
const DUPLICATE_KEY_ERROR_CODE = 11000;

// Returns the field names that collided (e.g. ['email']), or null if err isn't a duplicate-key error.
export function getDuplicateKeyFields(err) {
  if (err?.code !== DUPLICATE_KEY_ERROR_CODE) return null;
  return Object.keys(err.keyValue ?? err.keyPattern ?? {});
}
