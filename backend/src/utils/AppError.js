import { DEFAULT_CODE_BY_STATUS, ErrorCode } from '../constants/errorCodes.js';

// An error we throw on purpose; its status, code and message are safe to send to the client.
export class AppError extends Error {
  constructor(status, message, { code, details } = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code =
      code ??
      DEFAULT_CODE_BY_STATUS[status] ??
      (status < 500 ? ErrorCode.BAD_REQUEST : ErrorCode.INTERNAL_ERROR);
    this.details = details;
  }
}
