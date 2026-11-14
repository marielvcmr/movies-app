// Every list endpoint answers with one page of results (GET /programs, GET /users...).
export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// Copy of ErrorCode in backend/src/constants/errorCodes.js.
// Decide what to do with an error by its `code`, never by its `message`.
export const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// Body of every error response: { error: { code, message, details? } }.
export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}
