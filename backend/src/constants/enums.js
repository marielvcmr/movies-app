// Shared with the frontend — keep values identical on both sides.
// Step 9 adds ProgramType and Genre here.

export const UserType = Object.freeze({
  NORMAL: 'normal',
  CRITIC: 'critic',
  ADMIN: 'admin',
});

export const ProgramType = Object.freeze({
  MOVIE: 'movie',
  SERIES: 'series',
});

export const Genre = Object.freeze({
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
});