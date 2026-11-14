import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { UserType } from '../constants/enums.js';

// README access "Admin". Use after authenticate (it needs req.user).
export function requireAdmin(req, res, next) {
  if (req.user.type !== UserType.ADMIN) {
    throw new AppError(HttpStatus.FORBIDDEN, 'Only admins can do this');
  }
  next();
}
