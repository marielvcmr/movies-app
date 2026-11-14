import * as programService from '../services/program.service.js';
import { HttpStatus } from '../constants/httpStatus.js';

export async function listPrograms(req, res) {
  const result = await programService.listPrograms(req.validated.query);
  res.status(HttpStatus.OK).json(result);
}

export async function getProgram(req, res) {
  const program = await programService.getProgramById(req.validated.params.id);
  res.status(HttpStatus.OK).json({ program });
}
