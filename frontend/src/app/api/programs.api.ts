import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { DEFAULT_FILTERS, PROGRAMS_PAGE_SIZE, YEAR_MAX, YEAR_MIN } from '../constants/filters';
import type { Page } from '../models/api.model';
import type { Program, ProgramQuery } from '../models/program.model';
import { starsToMinPoints } from '../utils/stars';

// Calls to /programs (backend/README.md → Programas).
@Injectable({ providedIn: 'root' })
export class ProgramsApi {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/programs`;

  // One page of a tab (movies or series) with search, filters and sort.
  // With a search text, the API first imports from OMDb the titles it doesn't have yet.
  list(query: ProgramQuery): Observable<Page<Program>> {
    return this.http.get<Page<Program>>(this.url, { params: toQueryParams(query) });
  }

  // Full detail of one program. The first time it's opened, the API completes it from OMDb.
  getById(id: string): Observable<Program> {
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
