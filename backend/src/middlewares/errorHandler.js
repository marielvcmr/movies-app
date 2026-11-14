import { getDuplicateKeyFields } from '../utils/dbErrors.js';
import { AppError } from '../utils/AppError.js';
import { ErrorCode } from '../constants/errorCodes.js';
import { HttpStatus } from '../constants/httpStatus.js';

// Error type set by express.json() when the request body isn't valid JSON.
const MALFORMED_JSON_ERROR_TYPE = 'entity.parse.failed';

// Converts errors we know how to describe into AppErrors; returns null for anything unexpected.
function toAppError(err) {
  if (err instanceof AppError) return err;

  if (err.type === MALFORMED_JSON_ERROR_TYPE) {
    return new AppError(HttpStatus.BAD_REQUEST, 'Malformed JSON body');
  }

  // Unique index violation (e.g. email already registered) → 409 with the colliding field names.
  const duplicateFields = getDuplicateKeyFields(err);
  if (duplicateFields) {
    return new AppError(HttpStatus.CONFLICT, `Already in use: ${duplicateFields.join(', ')}`, {
      details: { fields: duplicateFields },
    });
  }

  // Other client errors (4xx) from Express/body-parser that are marked safe to show (e.g. 413 body too large).
  const isClientError =
    err.status >= HttpStatus.BAD_REQUEST && err.status < HttpStatus.INTERNAL_SERVER_ERROR;
  if (err.expose && isClientError) {
    return new AppError(err.status, err.message);
  }

  return null;
}

// Must keep all 4 parameters: that's how Express recognizes an error handler.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const appError = toAppError(err);

  if (!appError) {
    console.error(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: { code: ErrorCode.INTERNAL_ERROR, message: 'Internal server error' },
    });
  }

  const body = { code: appError.code, message: appError.message };
  if (appError.details !== undefined) body.details = appError.details;

  return res.status(appError.status).json({ error: body });
}
