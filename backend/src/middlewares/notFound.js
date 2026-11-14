import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';

// Runs only when no route matched the request.
export function notFound(req, res, next) {
  next(new AppError(HttpStatus.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`));
}
