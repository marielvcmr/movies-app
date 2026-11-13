// Machine-readable codes for the { error: { code, message, details? } } envelope.
// Shared with the frontend: it should branch on `code`, never on `message`.
export const ErrorCode = Object.freeze({
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

// Code used when an AppError is created without an explicit one.
export const DEFAULT_CODE_BY_STATUS = Object.freeze({
  400: ErrorCode.BAD_REQUEST,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  500: ErrorCode.INTERNAL_ERROR,
});
