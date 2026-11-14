import { firstValueFrom } from 'rxjs';

import { DEFAULT_FILTERS, YEAR_MAX, YEAR_MIN } from '../constants/filters';
import type { ProgramQuery } from '../models/program.model';

import { mockGetProgram, mockListPrograms } from './mocks/programs.mock';
import { toQueryParams } from './programs.api';

const QUERY: ProgramQuery = { type: 'movie', q: '', filters: DEFAULT_FILTERS, page: 1 };

describe('toQueryParams', () => {
  it('sends only type, page and limit with the defaults', () => {
    expect(toQueryParams(QUERY).toString()).toBe('type=movie&page=1&limit=20');
  });

  it('turns the filters into the params of GET /programs', () => {
    const params = toQueryParams({
      type: 'series',
      q: '  dark ',
      page: 2,
      filters: {
        sort: 'critics',
        genres: ['mystery', 'science_fiction'],
        yearFrom: 2000,
        yearTo: 2020,
        minCriticsStars: 4,
        minAudienceStars: 1,
      },
    });

    expect(params.get('q')).toBe('dark');
    expect(params.get('genres')).toBe('mystery,science_fiction');
    expect(params.get('yearFrom')).toBe('2000');
    expect(params.get('yearTo')).toBe('2020');
    expect(params.get('minCritics')).toBe('61'); // 4 stars = 61 points or more
    expect(params.get('minAudience')).toBe('1');
    expect(params.get('sort')).toBe('critics');
    expect(params.get('page')).toBe('2');
  });

  it('leaves out years at the ends of the slider', () => {
    const params = toQueryParams({ ...QUERY, filters: { ...DEFAULT_FILTERS, yearFrom: YEAR_MIN, yearTo: YEAR_MAX } });
    expect(params.has('yearFrom')).toBe(false);
    expect(params.has('yearTo')).toBe(false);
  });
});

describe('programs mock', () => {
  it('filters by type, text and minimum stars, newest first', async () => {
    // 5 stars = 81+ points: Dune: Part Two (92) and Dune (83) pass.
    const fiveStars = await firstValueFrom(
      mockListPrograms({ ...QUERY, q: 'dune', filters: { ...DEFAULT_FILTERS, minCriticsStars: 5 } }, 20),
    );
    expect(fiveStars.data.map((p) => p.title)).toEqual(['Dune: Part Two', 'Dune']);

    const series = await firstValueFrom(mockListPrograms({ ...QUERY, type: 'series', q: 'dune' }, 20));
    expect(series.total).toBe(0);
  });

  it('paginates', async () => {
    const page2 = await firstValueFrom(mockListPrograms({ ...QUERY, page: 2 }, 4));
    expect(page2.page).toBe(2);
    expect(page2.data.length).toBe(4);
    expect(page2.total).toBe(9);
  });

  it('answers 404 for an unknown id', async () => {
    await expect(firstValueFrom(mockGetProgram('nope'))).rejects.toMatchObject({ status: 404 });
  });
});
