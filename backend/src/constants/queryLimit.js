// Pagination for every list endpoint (README: default 20, max 50).
export const Pagination = Object.freeze({
  FIRST_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
});

// Range accepted by the minCritics / minAudience filters.
export const ScoreFilter = Object.freeze({
  MIN: 0,
  MAX: 100,
});
