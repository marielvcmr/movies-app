import { z } from 'zod';
import { ProgramType, ProgramSort, Genre } from '../constants/enums.js';
import { ScoreFilter } from '../constants/queryLimits.js';
import { paginationShape, objectIdSchema } from './common.schema.js';


const LIST_SEPARATOR = ',';

// "action,drama" → ['action', 'drama'], each one a valid Genre.
const genreListSchema = z
  .string()
  .transform((text) => text.split(LIST_SEPARATOR).map((genre) => genre.trim()).filter(Boolean))
  .pipe(z.array(z.enum(Object.values(Genre))).min(1));

const yearSchema = z.coerce.number().int();
const scoreSchema = z.coerce.number().min(ScoreFilter.MIN).max(ScoreFilter.MAX);

export const listProgramsQuerySchema = z
  .object({
    type: z.enum(Object.values(ProgramType)),
    q: z.string().trim().min(1).optional(),
    genres: genreListSchema.optional(),
    yearFrom: yearSchema.optional(),
    yearTo: yearSchema.optional(),
    minCritics: scoreSchema.optional(),
    minAudience: scoreSchema.optional(),
    sort: z.enum(Object.values(ProgramSort)).default(ProgramSort.NEWEST),
    ...paginationShape,
  })
  .refine(
    ({ yearFrom, yearTo }) => yearFrom === undefined || yearTo === undefined || yearFrom <= yearTo,
    { message: 'yearFrom must not be after yearTo', path: ['yearTo'] },
  );

  export const programIdParamsSchema = z.object({
  id: objectIdSchema,
});
