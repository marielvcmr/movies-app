// "Program" = a movie or a series (backend/docs/DESIGN.md → Program).
// The enums are copies of backend/src/constants/enums.js. Keep the values identical.

export const ProgramType = {
  MOVIE: 'movie',
  SERIES: 'series',
} as const;
export type ProgramType = (typeof ProgramType)[keyof typeof ProgramType];

export const Genre = {
  ACTION: 'action',
  ADVENTURE: 'adventure',
  ANIMATION: 'animation',
  BIOGRAPHY: 'biography',
  COMEDY: 'comedy',
  CRIME: 'crime',
  DOCUMENTARY: 'documentary',
  DRAMA: 'drama',
  FAMILY: 'family',
  FANTASY: 'fantasy',
  HISTORY: 'history',
  HORROR: 'horror',
  MUSIC: 'music',
  MYSTERY: 'mystery',
  REALITY: 'reality',
  ROMANCE: 'romance',
  SCIENCE_FICTION: 'science_fiction',
  SPORT: 'sport',
  THRILLER: 'thriller',
  WAR: 'war',
  WESTERN: 'western',
  OTHER: 'other',
} as const;
export type Genre = (typeof Genre)[keyof typeof Genre];

export const ProgramSort = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  CRITICS: 'critics',
  AUDIENCE: 'audience',
} as const;
export type ProgramSort = (typeof ProgramSort)[keyof typeof ProgramSort];

// Fields that movies and series share.
interface ProgramBase {
  _id: string;
  externalId: string; // IMDb id, e.g. tt1375666
  title: string;
  synopsis: string | null; // null until the API fetches the full detail from OMDb
  year: number;
  releaseDate: string | null; // ISO date
  posterUrl: string | null;
  genres: Genre[];
  actors: string[];
  pointsMeanNormal: number | null; // audience average (normal + admin); null = no reviews
  pointsMeanCritics: number | null; // critics average; null = no reviews
}

export interface Movie extends ProgramBase {
  type: typeof ProgramType.MOVIE;
  durationMin: number | null;
}

export interface Series extends ProgramBase {
  type: typeof ProgramType.SERIES;
  seasonsCount: number | null;
}

// `type` tells them apart: inside `if (program.type === 'movie')`
// TypeScript knows `program.durationMin` exists.
export type Program = Movie | Series;

// The short version of a program that comes inside a user's review list (GET /users/:id/reviews).
export type ProgramSummary = Pick<Program, '_id' | 'title' | 'type' | 'year' | 'posterUrl'>;

// What the Home filter panel edits. api/programs.api.ts turns it into query params.
export interface ProgramFilters {
  sort: ProgramSort;
  genres: Genre[];
  yearFrom: number | null; // null = no lower limit
  yearTo: number | null; // null = no upper limit
  minCriticsStars: number; // 0 = any
  minAudienceStars: number; // 0 = any
}

// Everything GET /programs needs to return one page.
export interface ProgramQuery {
  type: ProgramType;
  q: string;
  filters: ProgramFilters;
  page: number;
}
