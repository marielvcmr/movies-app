import { Program, Movie, Series } from '../models/Program.js';
import { ProgramType, ProgramSort } from '../constants/enums.js';
import { Pagination } from '../constants/queryLimits.js';
import { searchTitles } from '../clients/omdb.js';
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
