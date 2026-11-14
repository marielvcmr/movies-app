import { Genre } from './enums.js';

// OMDb genre names that don't simply become their lowercase form.
// Every other name is lowercased and kept if it's a known Genre; anything else → Genre.OTHER.
export const OMDB_GENRE_MAP = Object.freeze({
  'Sci-Fi': Genre.SCIENCE_FICTION,
  Musical: Genre.MUSIC,
  'Film-Noir': Genre.CRIME,
  'Reality-TV': Genre.REALITY,
  Short: Genre.OTHER,
  News: Genre.OTHER,
  'Talk-Show': Genre.OTHER,
  'Game-Show': Genre.OTHER,
});

// OMDb uses ", " between genres, e.g. "Action, Sci-Fi".
const OMDB_GENRE_SEPARATOR = ',';

const KNOWN_GENRES = new Set(Object.values(Genre));

// Translates one OMDb genre name (e.g. "Sci-Fi") into a Genre value.
export function toGenre(omdbGenreName) {
  const name = omdbGenreName.trim();
  if (name in OMDB_GENRE_MAP) return OMDB_GENRE_MAP[name];

  const lowercased = name.toLowerCase();
  return KNOWN_GENRES.has(lowercased) ? lowercased : Genre.OTHER;
}

// Translates OMDb's genre text ("Action, Sci-Fi") into a list of unique Genre values.
export function mapOmdbGenres(omdbGenreText) {
  if (!omdbGenreText) return [];

  const genres = omdbGenreText
    .split(OMDB_GENRE_SEPARATOR)
    .filter((name) => name.trim() !== '')
    .map(toGenre);

  return [...new Set(genres)];
}
