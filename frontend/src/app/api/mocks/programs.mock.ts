// TEMPORARY sample data, used while environment.mockPrograms is true (the backend has no
// /programs routes yet). It filters, sorts and paginates the same way backend/README.md says the
// API will, so Home and Details can be tested now. Delete this folder once the API is ready.

import { HttpErrorResponse } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { delay, mergeMap, of, throwError, timer } from 'rxjs';

import type { Page } from '../../models/api.model';
import type { Program, ProgramQuery } from '../../models/program.model';
import { starsToMinPoints } from '../../utils/stars';

const NETWORK_DELAY_MS = 300;

const PROGRAMS: Program[] = [
  {
    _id: 'm1',
    type: 'movie',
    externalId: 'tt15239678',
    title: 'Dune: Part Two',
    year: 2024,
    releaseDate: '2024-03-01T00:00:00.000Z',
    posterUrl: null,
    genres: ['science_fiction', 'adventure', 'drama'],
    actors: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    synopsis:
      'Paul Atreides joins the Fremen and Chani to fight the empire that destroyed his family, while visions of a holy war push him toward a choice he fears.',
    pointsMeanCritics: 92,
    pointsMeanNormal: 89,
    durationMin: 166,
  },
  {
    _id: 'm2',
    type: 'movie',
    externalId: 'tt15398776',
    title: 'Oppenheimer',
    year: 2023,
    releaseDate: '2023-07-21T00:00:00.000Z',
    posterUrl: null,
    genres: ['biography', 'drama', 'history'],
    actors: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    synopsis:
      'The story of the physicist who led the project that built the first atomic bomb, and of what it cost him.',
    pointsMeanCritics: 94,
    pointsMeanNormal: 91,
    durationMin: 180,
  },
  {
    _id: 'm3',
    type: 'movie',
    externalId: 'tt1517268',
    title: 'Barbie',
    year: 2023,
    releaseDate: '2023-07-21T00:00:00.000Z',
    posterUrl: null,
    genres: ['comedy', 'fantasy'],
    actors: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'],
    synopsis:
      'A doll living in a perfect pink world starts having very real doubts and sets off to the human world to find answers.',
    pointsMeanCritics: 78,
    pointsMeanNormal: 71,
    durationMin: 114,
  },
  {
    _id: 'm4',
    type: 'movie',
    externalId: 'tt6710474',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    releaseDate: '2022-04-08T00:00:00.000Z',
    posterUrl: null,
    genres: ['comedy', 'action', 'science_fiction'],
    actors: ['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu', 'Jamie Lee Curtis'],
    synopsis:
      'A laundromat owner buried in taxes discovers she can borrow skills from versions of herself in other universes.',
    pointsMeanCritics: 93,
    pointsMeanNormal: 86,
    durationMin: 139,
  },
  {
    _id: 'm5',
    type: 'movie',
    externalId: 'tt5108870',
    title: 'Morbius',
    year: 2022,
    releaseDate: '2022-04-01T00:00:00.000Z',
    posterUrl: null,
    genres: ['action', 'horror', 'science_fiction'],
    actors: ['Jared Leto', 'Matt Smith', 'Adria Arjona'],
    synopsis: 'A scientist trying to cure his rare blood disease ends up with a dangerous thirst instead.',
    pointsMeanCritics: 22,
    pointsMeanNormal: 38,
    durationMin: 104,
  },
  {
    _id: 'm6',
    type: 'movie',
    externalId: 'tt1160419',
    title: 'Dune',
    year: 2021,
    releaseDate: '2021-10-22T00:00:00.000Z',
    posterUrl: null,
    genres: ['science_fiction', 'adventure', 'drama'],
    actors: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Zendaya'],
    synopsis:
      'The heir of a noble family is sent to the most dangerous planet in the universe, the only source of a precious spice.',
    pointsMeanCritics: 83,
    pointsMeanNormal: 84,
    durationMin: 155,
  },
  {
    _id: 'm7',
    type: 'movie',
    externalId: 'tt6751668',
    title: 'Parasite',
    year: 2019,
    releaseDate: '2019-05-30T00:00:00.000Z',
    posterUrl: null,
    genres: ['thriller', 'drama', 'comedy'],
    actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    synopsis:
      'A poor family slowly works its way into the lives of a wealthy one, until a secret in the basement changes everything.',
    pointsMeanCritics: 96,
    pointsMeanNormal: 90,
    durationMin: 132,
  },
  {
    _id: 'm8',
    type: 'movie',
    externalId: 'tt1375666',
    title: 'Inception',
    year: 2010,
    releaseDate: '2010-07-16T00:00:00.000Z',
    posterUrl: null,
    genres: ['action', 'science_fiction', 'thriller'],
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    synopsis: 'A thief who steals secrets from dreams is offered one last job: planting an idea instead of taking one.',
    pointsMeanCritics: 87,
    pointsMeanNormal: 88,
    durationMin: 148,
  },
  {
    _id: 'm9',
    type: 'movie',
    externalId: 'tt0000001',
    title: 'Untitled Indie Project',
    year: 2024,
    releaseDate: null,
    posterUrl: null,
    genres: ['documentary'],
    actors: [],
    synopsis: null,
    pointsMeanCritics: null,
    pointsMeanNormal: null,
    durationMin: null,
  },
  {
    _id: 's1',
    type: 'series',
    externalId: 'tt3581920',
    title: 'The Last of Us',
    year: 2023,
    releaseDate: '2023-01-15T00:00:00.000Z',
    posterUrl: null,
    genres: ['drama', 'action', 'adventure'],
    actors: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna'],
    synopsis:
      'Twenty years after a fungal outbreak, a hardened survivor is hired to smuggle a teenage girl across a ruined country.',
    pointsMeanCritics: 90,
    pointsMeanNormal: 87,
    seasonsCount: 2,
  },
  {
    _id: 's2',
    type: 'series',
    externalId: 'tt14452776',
    title: 'The Bear',
    year: 2022,
    releaseDate: '2022-06-23T00:00:00.000Z',
    posterUrl: null,
    genres: ['comedy', 'drama'],
    actors: ['Jeremy Allen White', 'Ebon Moss-Bachrach', 'Ayo Edebiri'],
    synopsis: 'A young fine-dining chef comes home to run his family’s chaotic sandwich shop.',
    pointsMeanCritics: 91,
    pointsMeanNormal: 85,
    seasonsCount: 3,
  },
  {
    _id: 's3',
    type: 'series',
    externalId: 'tt11280740',
    title: 'Severance',
    year: 2022,
    releaseDate: '2022-02-18T00:00:00.000Z',
    posterUrl: null,
    genres: ['drama', 'mystery', 'science_fiction'],
    actors: ['Adam Scott', 'Britt Lower', 'Zach Cherry', 'Patricia Arquette', 'John Turturro'],
    synopsis:
      'Office workers have their memories split between work and home, until one team starts asking what they really do all day.',
    pointsMeanCritics: 95,
    pointsMeanNormal: 92,
    seasonsCount: 2,
  },
  {
    _id: 's4',
    type: 'series',
    externalId: 'tt13443470',
    title: 'Wednesday',
    year: 2022,
    releaseDate: '2022-11-23T00:00:00.000Z',
    posterUrl: null,
    genres: ['comedy', 'fantasy', 'mystery'],
    actors: ['Jenna Ortega', 'Emma Myers', 'Gwendoline Christie'],
    synopsis: 'A sharp, gloomy teenager solves a string of murders at her new boarding school for outcasts.',
    pointsMeanCritics: null,
    pointsMeanNormal: 74,
    seasonsCount: 1,
  },
  {
    _id: 's5',
    type: 'series',
    externalId: 'tt5753856',
    title: 'Dark',
    year: 2017,
    releaseDate: '2017-12-01T00:00:00.000Z',
    posterUrl: null,
    genres: ['mystery', 'science_fiction', 'thriller'],
    actors: ['Louis Hofmann', 'Lisa Vicari', 'Maja Schöne'],
    synopsis: 'The disappearance of two children exposes the secrets of four families in a small German town.',
    pointsMeanCritics: 88,
    pointsMeanNormal: 93,
    seasonsCount: 3,
  },
  {
    _id: 's6',
    type: 'series',
    externalId: 'tt4574334',
    title: 'Stranger Things',
    year: 2016,
    releaseDate: '2016-07-15T00:00:00.000Z',
    posterUrl: null,
    genres: ['drama', 'fantasy', 'horror'],
    actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
    synopsis:
      'When a boy vanishes, his friends, family and the police get pulled into a world of experiments and monsters.',
    pointsMeanCritics: 86,
    pointsMeanNormal: 89,
    seasonsCount: 4,
  },
  {
    _id: 's7',
    type: 'series',
    externalId: 'tt0903747',
    title: 'Breaking Bad',
    year: 2008,
    releaseDate: '2008-01-20T00:00:00.000Z',
    posterUrl: null,
    genres: ['crime', 'drama', 'thriller'],
    actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    synopsis: 'A chemistry teacher with a terminal diagnosis starts cooking meth to secure his family’s future.',
    pointsMeanCritics: 94,
    pointsMeanNormal: 96,
    seasonsCount: 5,
  },
];

export function mockListPrograms({ type, q, filters, page }: ProgramQuery, limit: number): Observable<Page<Program>> {
  const text = q.trim().toLowerCase();
  const minCritics = starsToMinPoints(filters.minCriticsStars);
  const minAudience = starsToMinPoints(filters.minAudienceStars);

  const matches = PROGRAMS.filter(
    (p) =>
      p.type === type &&
      (!text || p.title.toLowerCase().includes(text)) &&
      (!filters.genres.length || p.genres.some((g) => filters.genres.includes(g))) &&
      (filters.yearFrom === null || p.year >= filters.yearFrom) &&
      (filters.yearTo === null || p.year <= filters.yearTo) &&
      (minCritics === 0 || (p.pointsMeanCritics ?? -1) >= minCritics) &&
      (minAudience === 0 || (p.pointsMeanNormal ?? -1) >= minAudience),
  );

  // Programs without a score go last when sorting by score.
  const score = (value: number | null) => value ?? -1;
  const sorters: Record<string, (a: Program, b: Program) => number> = {
    newest: (a, b) => b.year - a.year,
    oldest: (a, b) => a.year - b.year,
    critics: (a, b) => score(b.pointsMeanCritics) - score(a.pointsMeanCritics),
    audience: (a, b) => score(b.pointsMeanNormal) - score(a.pointsMeanNormal),
  };
  const sorted = [...matches].sort(sorters[filters.sort]);

  const start = (page - 1) * limit;
  const result: Page<Program> = { data: sorted.slice(start, start + limit), page, limit, total: sorted.length };
  return of(result).pipe(delay(NETWORK_DELAY_MS));
}

export function mockGetProgram(id: string): Observable<Program> {
  const program = PROGRAMS.find((p) => p._id === id);
  if (program) return of(program).pipe(delay(NETWORK_DELAY_MS));

  const notFound = new HttpErrorResponse({
    status: 404,
    error: { error: { code: 'NOT_FOUND', message: 'Program not found' } },
  });
  // `delay` only delays values, not errors, so wait first and then fail.
  return timer(NETWORK_DELAY_MS).pipe(mergeMap(() => throwError(() => notFound)));
}
