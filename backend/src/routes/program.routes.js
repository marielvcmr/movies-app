import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate, RequestPart } from '../middlewares/validate.js';
import { listProgramsQuerySchema, programIdParamsSchema } from '../schemas/program.schema.js';
import * as programController from '../controllers/program.controller.js';

const router = Router();

router.get('/', authenticate, validate(listProgramsQuerySchema, RequestPart.QUERY), programController.listPrograms);

router.get('/:id', authenticate, validate(programIdParamsSchema, RequestPart.PARAMS), programController.getProgram);


export default router;
