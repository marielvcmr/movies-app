import { HttpErrorResponse } from '@angular/common/http';

import type { ApiErrorBody } from '../models/api.model';
import { ErrorCode } from '../models/api.model';

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

// Friendly text for each field the API validates (rules from backend/src/constants/userLimits.js).
const FIELD_HINTS: Record<string, string> = {
  username: 'Username: 3–30 characters, only letters, numbers, dots, hyphens and underscores.',
  email: 'Please enter a valid email.',
  password: 'Password: 8–72 characters, no spaces.',
};

const DUPLICATE_HINTS: Record<string, string> = {
  username: 'That username is already taken.',
  email: 'That email is already registered.',
};

// Turns any error from an API call into one short English sentence for the user.
export function apiErrorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return GENERIC_MESSAGE;

  // Status 0 = the request never got an answer (API off, wrong URL, no network).
  if (err.status === 0) return "Can't reach the server. Check your connection and try again.";

  const body = err.error as Partial<ApiErrorBody> | null;
  const error = body?.error;
  if (!error) return GENERIC_MESSAGE;

  switch (error.code) {
    case ErrorCode.VALIDATION_ERROR:
      return validationMessage(error.details) ?? error.message;
    case ErrorCode.CONFLICT:
      return duplicateMessage(error.details) ?? error.message;
    case ErrorCode.INTERNAL_ERROR:
      return GENERIC_MESSAGE;
    default:
      return error.message; // e.g. 401 on login: "Invalid login or password"
  }
}

// details = [{ path: 'password', message: '...' }, ...] → hint for the first field.
function validationMessage(details: unknown): string | null {
  if (!Array.isArray(details) || details.length === 0) return null;
  const path = (details[0] as { path?: string }).path ?? '';
  return FIELD_HINTS[path] ?? null;
}

// details = { fields: ['email'] } → "That email is already registered."
function duplicateMessage(details: unknown): string | null {
  const fields = (details as { fields?: string[] } | undefined)?.fields;
  const field = fields?.[0];
  return field ? (DUPLICATE_HINTS[field] ?? null) : null;
}
