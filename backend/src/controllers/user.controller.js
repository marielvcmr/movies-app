import * as userService from '../services/user.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function updateMe(req, res) {
  const user = await userService.updateMe(req.user, req.validated.body);
  res.status(HttpStatus.OK).json({ user });
}
