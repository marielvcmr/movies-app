import * as userService from '../services/user.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function updateMe(req, res) {
  const user = await userService.updateMe(req.user, req.validated.body);
  res.status(HttpStatus.OK).json({ user });
}

export async function deleteMe(req, res) {
  await userService.deleteMe(req.user);
  res.status(HttpStatus.NO_CONTENT).end();
}

export async function getProfile(req, res) {
  const user = await userService.getPublicProfile(req.validated.params.id);
  res.status(HttpStatus.OK).json({ user });
}

export async function listUserReviews(req, res) {
  const result = await userService.listUserReviews(req.validated.params.id, req.validated.query);
  res.status(HttpStatus.OK).json(result);
}

export async function listUsers(req, res) {
  const result = await userService.listUsers(req.validated.query);
  res.status(HttpStatus.OK).json(result);
}

export async function changeType(req, res) {
  const user = await userService.changeUserType(req.validated.params.id, req.validated.body.type);
  res.status(HttpStatus.OK).json({ user });
}
