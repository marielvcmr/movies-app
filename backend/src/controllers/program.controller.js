import * as programService from '../services/program.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function listPrograms(req, res) {
  const result = await programService.listPrograms(req.validated.query);
  res.status(HttpStatus.OK).json(result);
}
