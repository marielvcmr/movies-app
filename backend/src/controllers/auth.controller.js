import * as authService from '../services/auth.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function register(req, res) {
  const session = await authService.register(req.validated.body);
  res.status(HttpStatus.CREATED).json(session);
}

export async function login(req, res) {
  const session = await authService.login(req.validated.body);
  res.status(HttpStatus.OK).json(session);
}

export function me(req, res) {
  res.status(HttpStatus.OK).json({ user: req.user });
}
