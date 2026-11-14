import { env } from '../config/env.js';
import { ProgramType } from '../constants/enums.js';
import { mapOmdbGenres } from '../constants/omdbGenreMap.js';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
// Give up on OMDb after 5s so a slow OMDb never makes our API hang.
const REQUEST_TIMEOUT_MS = 5000;
// OMDb's placeholder for missing data, and its success flag ("True"/"False" as text).
const NOT_AVAILABLE = 'N/A';
const OMDB_SUCCESS = 'True';
const FULL_PLOT = 'full';
const FIRST_PAGE = 1;
const DECIMAL_RADIX = 10;
const LIST_SEPARATOR = ',';

// "2010" or "2008–2013" → the first 4 digits.
const FIRST_YEAR_PATTERN = /^\d{4}/;
// "16 Jul 2010"
const RELEASE_DATE_PATTERN = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/;
const MONTH_INDEX = Object.freeze({
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
});

// OMDb also returns "episode" and "game"; only movies and series are kept.
const SUPPORTED_TYPES = new Set(Object.values(ProgramType));

// ── HTTP ────────────────────────────────────────────────────────────────────

// Returns OMDb's JSON on success, or null on ANY failure (network, timeout, bad key, not found, quota).
async function requestOmdb(params) {
  const url = new URL(OMDB_BASE_URL);
  url.search = new URLSearchParams({ ...params, apikey: env.OMDB_API_KEY });

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    const body = await response.json();
    if (body.Response !== OMDB_SUCCESS) {
      console.warn(`OMDb: ${body.Error ?? `HTTP ${response.status}`}`);
      return null;
    }
    return body;
  } catch (err) {
    // Never log the URL: it contains the API key.
    console.warn(`OMDb request failed: ${err.message}`);
    return null;
  }
}

// ── Translation helpers (OMDb sends everything as text) ─────────────────────

// "N/A", empty or missing → null; otherwise the trimmed text.
function clean(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' || trimmed === NOT_AVAILABLE ? null : trimmed;
}

function parseFirstYear(text) {
  const match = FIRST_YEAR_PATTERN.exec(clean(text) ?? '');
  return match ? Number(match[0]) : null;
}

// Built in UTC so the stored date never shifts a day because of the server's timezone.
function parseReleaseDate(text) {
  const match = RELEASE_DATE_PATTERN.exec(clean(text) ?? '');
  if (!match) return null;
  const [, day, monthName, year] = match;
  const month = MONTH_INDEX[monthName];
  return month === undefined ? null : new Date(Date.UTC(Number(year), month, Number(day)));
}

// "148 min" → 148, "5" → 5, "N/A" → null.
function parseLeadingInteger(text) {
  const number = Number.parseInt(clean(text) ?? '', DECIMAL_RADIX);
  return Number.isNaN(number) ? null : number;
}

// "Leonardo DiCaprio, Elliot Page" → ['Leonardo DiCaprio', 'Elliot Page'], keeping OMDb's order.
function parseList(text) {
  const cleaned = clean(text);
  return cleaned ? cleaned.split(LIST_SEPARATOR).map((item) => item.trim()).filter(Boolean) : [];
}

// Fields shared by search results and details. null if it can't become a valid Program.
function toBaseProgram(item) {
  const externalId = clean(item.imdbID);
  const title = clean(item.Title);
  const year = parseFirstYear(item.Year);
  const type = item.Type;

  if (!externalId || !title || year === null || !SUPPORTED_TYPES.has(type)) return null;
  return { externalId, type, title, year, posterUrl: clean(item.Poster) };
}

// ── Public API ──────────────────────────────────────────────────────────────

// Search by title. Returns basic records (no synopsis), or [] if nothing found or OMDb failed.
export async function searchTitles(query, type) {
  const body = await requestOmdb({ s: query, type, page: String(FIRST_PAGE) });
  if (!body || !Array.isArray(body.Search)) return [];
  return body.Search.map(toBaseProgram).filter(Boolean);
}

// Full detail of one title, or null if not found, not a movie/series, or OMDb failed.
export async function getById(imdbId) {
  const body = await requestOmdb({ i: imdbId, plot: FULL_PLOT });
  if (!body) return null;

  const base = toBaseProgram(body);
  if (!base) return null;

  const detail = {
    ...base,
    releaseDate: parseReleaseDate(body.Released),
    synopsis: clean(body.Plot),
    genres: mapOmdbGenres(clean(body.Genre)),
    actors: parseList(body.Actors),
  };

  if (base.type === ProgramType.MOVIE) {
    detail.durationMin = parseLeadingInteger(body.Runtime);
  } else {
    detail.seasonsCount = parseLeadingInteger(body.totalSeasons);
  }
  return detail;
}
