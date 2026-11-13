import { AppError } from '../utils/AppError.js';
import { ErrorCode } from '../constants/errorCodes.js';

// Converts errors we know how to describe into AppErrors; returns null for anything unexpected.
function toAppError(err) {
  if (err instanceof AppError) return err;

  // Thrown by express.json() when the request body isn't valid JSON.
  if (err.type === 'entity.parse.failed') {
    return new AppError(400, 'Malformed JSON body');
  }

  // Other client errors from Express/body-parser that are marked safe to show (e.g. 413 body too large).
  if (err.expose && err.status >= 400 && err.status < 500) {
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
    return res.status(500).json({
      error: { code: ErrorCode.INTERNAL_ERROR, message: 'Internal server error' },
    });
  }

  const body = { code: appError.code, message: appError.message };
  if (appError.details !== undefined) body.details = appError.details;

  return res.status(appError.status).json({ error: body });
}
