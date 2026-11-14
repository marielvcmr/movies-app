import { AppError } from '../utils/AppError.js';
import { ErrorCode } from '../constants/errorCodes.js';
import { HttpStatus } from '../constants/httpStatus.js';

// Which part of the request a schema validates.
export const RequestPart = Object.freeze({
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params',
});

// Validates req[part] with a zod schema. On success, the cleaned data goes to req.validated[part].
export function validate(schema, part = RequestPart.BODY) {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid request data', {
        code: ErrorCode.VALIDATION_ERROR,
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    req.validated = { ...req.validated, [part]: result.data };
    next();
  };
}
