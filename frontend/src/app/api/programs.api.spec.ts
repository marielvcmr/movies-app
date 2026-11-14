import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { DEFAULT_FILTERS, YEAR_MAX, YEAR_MIN } from '../constants/filters';
import type { ProgramQuery } from '../models/program.model';

import { ProgramsApi, toQueryParams } from './programs.api';

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

describe('ProgramsApi', () => {
  let api: ProgramsApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ProgramsApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists from GET /programs', async () => {
    const result = firstValueFrom(api.list({ ...QUERY, q: 'dune' }));
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/programs`);
    expect(req.request.params.get('q')).toBe('dune');
    req.flush({ data: [], page: 1, limit: 20, total: 0 });
    expect((await result).total).toBe(0);
  });

  it('unwraps { program } from GET /programs/:id', async () => {
    const result = firstValueFrom(api.getById('abc'));
    http.expectOne(`${environment.apiUrl}/programs/abc`).flush({ program: { _id: 'abc', title: 'Dune' } });
    expect((await result).title).toBe('Dune');
  });
});
