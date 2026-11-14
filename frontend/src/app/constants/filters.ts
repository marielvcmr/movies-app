import type { ProgramFilters } from '../models/program.model';

// Ends of the year slider. A knob left at an end means "no limit" (the param isn't sent).
export const YEAR_MIN = 1950;
export const YEAR_MAX = new Date().getFullYear();

export const STARS_MAX = 5;

// Home starts like this: newest first, no filters.
export const DEFAULT_FILTERS: ProgramFilters = {
  sort: 'newest',
  genres: [],
  yearFrom: null,
  yearTo: null,
  minCriticsStars: 0,
  minAudienceStars: 0,
};

// Results per page of GET /programs (the API allows up to 50).
export const PROGRAMS_PAGE_SIZE = 20;

// Users per page of GET /users (Users module, admins only).
export const USERS_PAGE_SIZE = 20;
