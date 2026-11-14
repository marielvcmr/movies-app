import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { DEFAULT_FILTERS, PROGRAMS_PAGE_SIZE, YEAR_MAX, YEAR_MIN } from '../constants/filters';
import type { Page } from '../models/api.model';
import type { Program, ProgramQuery } from '../models/program.model';
import { starsToMinPoints } from '../utils/stars';

import { mockGetProgram, mockListPrograms } from './mocks/programs.mock';

// Calls to /programs (backend/README.md → Programas).
// While environment.mockPrograms is true, the same methods answer with sample data instead.
@Injectable({ providedIn: 'root' })
export class ProgramsApi {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/programs`;

  // One page of a tab (movies or series) with search, filters and sort.
  list(query: ProgramQuery): Observable<Page<Program>> {
    if (environment.mockPrograms) return mockListPrograms(query, PROGRAMS_PAGE_SIZE);
    return this.http.get<Page<Program>>(this.url, { params: toQueryParams(query) });
  }

  // Full detail of one program.
  // Assumes the API wraps it like GET /auth/me does ({ user }): { program }. Adjust here if not.
  getById(id: string): Observable<Program> {
    if (environment.mockPrograms) return mockGetProgram(id);
    return this.http.get<{ program: Program }>(`${this.url}/${id}`).pipe(map((res) => res.program));
  }
}

// ProgramQuery → ?type=movie&q=dune&genres=action,drama&yearFrom=2000&minCritics=61&page=1&limit=20
// Values left at their default aren't sent.
export function toQueryParams({ type, q, filters, page }: ProgramQuery): HttpParams {
  let params = new HttpParams().set('type', type).set('page', page).set('limit', PROGRAMS_PAGE_SIZE);

  const text = q.trim();
  if (text) params = params.set('q', text);
  if (filters.genres.length) params = params.set('genres', filters.genres.join(','));
  if (filters.yearFrom !== null && filters.yearFrom > YEAR_MIN) params = params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo !== null && filters.yearTo < YEAR_MAX) params = params.set('yearTo', filters.yearTo);
  if (filters.minCriticsStars > 0) params = params.set('minCritics', starsToMinPoints(filters.minCriticsStars));
  if (filters.minAudienceStars > 0) params = params.set('minAudience', starsToMinPoints(filters.minAudienceStars));
  if (filters.sort !== DEFAULT_FILTERS.sort) params = params.set('sort', filters.sort);

  return params;
}
