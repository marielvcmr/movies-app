import { HttpErrorResponse } from '@angular/common/http';

import { apiErrorMessage } from './api-error';

function httpError(status: number, error: unknown): HttpErrorResponse {
  return new HttpErrorResponse({ status, error });
}

describe('apiErrorMessage', () => {
  it('says the server is unreachable when there is no answer', () => {
    expect(apiErrorMessage(httpError(0, null))).toContain("Can't reach the server");
  });

  it('uses the API message for wrong credentials', () => {
    const err = httpError(401, { error: { code: 'UNAUTHORIZED', message: 'Invalid login or password' } });
    expect(apiErrorMessage(err)).toBe('Invalid login or password');
  });

  it('explains the first invalid field', () => {
    const err = httpError(400, {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: [{ path: 'password', message: 'x' }],
      },
    });
    expect(apiErrorMessage(err)).toBe('Password: 8–72 characters, no spaces.');
  });

  it('explains a duplicate email', () => {
    const err = httpError(409, {
      error: { code: 'CONFLICT', message: 'Already in use: email', details: { fields: ['email'] } },
    });
    expect(apiErrorMessage(err)).toBe('That email is already registered.');
  });

  it('hides internal errors behind a generic message', () => {
    const err = httpError(500, { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
    expect(apiErrorMessage(err)).toBe('Something went wrong. Please try again.');
    expect(apiErrorMessage(new Error('boom'))).toBe('Something went wrong. Please try again.');
  });
});
