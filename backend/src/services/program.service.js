import { AppError } from '../utils/AppError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { Program, Movie, Series } from '../models/Program.js';
import { ProgramType, ProgramSort } from '../constants/enums.js';
import { Pagination } from '../constants/queryLimits.js';
import { searchTitles, getById } from '../clients/omdb.js';
import { normalizeTitle, escapeRegex } from '../utils/text.js';

const MODEL_BY_TYPE = Object.freeze({
  [ProgramType.MOVIE]: Movie,
  [ProgramType.SERIES]: Series,
});

const ASCENDING = 1;
const DESCENDING = -1;

// _id breaks ties so pages never repeat or skip items when many titles share a year or score.
const SORT_BY = Object.freeze({
  [ProgramSort.NEWEST]: { year: DESCENDING, releaseDate: DESCENDING, _id: DESCENDING },
  [ProgramSort.OLDEST]: { year: ASCENDING, releaseDate: ASCENDING, _id: ASCENDING },
  // Titles without reviews (null) sort last when descending.
  [ProgramSort.CRITICS]: { pointsMeanCritics: DESCENDING, _id: DESCENDING },
  [ProgramSort.AUDIENCE]: { pointsMeanNormal: DESCENDING, _id: DESCENDING },
});

// Saves OMDb search results that aren't stored yet. Existing titles are never modified.
// Any failure is logged and ignored: the request still answers from the local database.
async function importFromOmdb(q, type) {
  console.info(`OMDb search: "${q}" (${type})`);
  const results = await searchTitles(q, type);
  const Model = MODEL_BY_TYPE[type];
  const now = new Date();

  const outcomes = await Promise.allSettled(
    results.map((item) =>
      Model.updateOne(
        { externalId: item.externalId },
        {
          $setOnInsert: {
            ...item,
            titleNormalized: normalizeTitle(item.title),
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true, timestamps: false },
      ),
    ),
  );

  const failed = outcomes.filter((outcome) => outcome.status === 'rejected').length;
  if (failed > 0) console.warn(`OMDb import: ${failed} of ${results.length} titles could not be saved`);
}

function buildFilter({ type, q, genres, yearFrom, yearTo, minCritics, minAudience }) {
  const filter = { type };

  if (q) filter.titleNormalized = { $regex: escapeRegex(normalizeTitle(q)) };
  if (genres) filter.genres = { $in: genres };
  if (yearFrom !== undefined || yearTo !== undefined) {
    filter.year = {};
    if (yearFrom !== undefined) filter.year.$gte = yearFrom;
    if (yearTo !== undefined) filter.year.$lte = yearTo;
  }
  if (minCritics !== undefined) filter.pointsMeanCritics = { $gte: minCritics };
  if (minAudience !== undefined) filter.pointsMeanNormal = { $gte: minAudience };

  return filter;
}

export async function listPrograms(query) {
  const { q, page, limit, sort } = query;

  // OMDb only for a text search, and only on the first page (README: protects the daily quota).
  if (q && page === Pagination.FIRST_PAGE) {
    await importFromOmdb(q, query.type);
  }

  const filter = buildFilter(query);
  const [data, total] = await Promise.all([
    Program.find(filter).sort(SORT_BY[sort]).skip((page - 1) * limit).limit(limit),
    Program.countDocuments(filter),
  ]);

  return { data, page, limit, total };
}

// Gets the full detail from OMDb and saves it. If OMDb fails, the program stays as it is.
async function fillDetailFromOmdb(program) {
  console.info(`OMDb detail: ${program.externalId}`);
  const detail = await getById(program.externalId);
  if (!detail) return; // OMDb failed: keep the stored data, try again next time.

  const { releaseDate, synopsis, genres, actors, durationMin, seasonsCount } = detail;
  program.set({ releaseDate, synopsis, genres, actors, detailFetchedAt: new Date() });

  if (program.type === ProgramType.MOVIE) {
    program.durationMin = durationMin;
  } else {
    program.seasonsCount = seasonsCount;
  }
  await program.save();
}

export async function getProgramById(programId) {
  const program = await Program.findById(programId);
  if (!program) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Program not found');
  }

  if (program.detailFetchedAt === null) {
    await fillDetailFromOmdb(program);
  }
  return program;
}

// Results of importProgramWithDetail, for the seed script's summary.
export const ImportResult = Object.freeze({
  CREATED: 'created',
  UPDATED: 'updated',
  SKIPPED: 'skipped',
  FAILED: 'failed',
});

// Imports one title with its full detail (used by the seed script).
// Titles that already have their detail are skipped: no OMDb request, so re-runs are free.
export async function importProgramWithDetail(externalId) {
  const existing = await Program.findOne({ externalId });

  if (existing?.detailFetchedAt) return ImportResult.SKIPPED;

  // Stored from a search, but without detail: reuse the same logic as GET /programs/:id.
  if (existing) {
    await fillDetailFromOmdb(existing);
    return existing.detailFetchedAt ? ImportResult.UPDATED : ImportResult.FAILED;
  }

  const detail = await getById(externalId);
  if (!detail) return ImportResult.FAILED;

  const Model = MODEL_BY_TYPE[detail.type];
  await Model.create({
    ...detail,
    titleNormalized: normalizeTitle(detail.title),
    detailFetchedAt: new Date(),
  });
  return ImportResult.CREATED;
}
