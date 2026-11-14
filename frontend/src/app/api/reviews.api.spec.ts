import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

import { ReviewsApi } from './reviews.api';

describe('ReviewsApi', () => {
  let api: ReviewsApi;
  let http: HttpTestingController;
  const programUrl = `${environment.apiUrl}/programs/p1`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ReviewsApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getMine returns the review', async () => {
    const result = firstValueFrom(api.getMine('p1'));
    http.expectOne(`${programUrl}/reviews/mine`).flush({ review: { _id: 'r1', points: 80 } });
    expect((await result)?.points).toBe(80);
  });

  it('getMine returns null when the user has not reviewed it (404)', async () => {
    const result = firstValueFrom(api.getMine('p1'));
    http
      .expectOne(`${programUrl}/reviews/mine`)
      .flush(
        { error: { code: 'NOT_FOUND', message: 'You have not reviewed this program' } },
        { status: 404, statusText: 'Not Found' },
      );
    expect(await result).toBeNull();
  });

  it('create posts points and comment', async () => {
    const result = firstValueFrom(api.create('p1', { points: 90, comment: 'Great' }));
    const req = http.expectOne(`${programUrl}/reviews`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ points: 90, comment: 'Great' });
    req.flush({ review: { _id: 'r1', points: 90, comment: 'Great' } });
    expect((await result)._id).toBe('r1');
  });

  it('listByProgram asks for one group and one page', async () => {
    const result = firstValueFrom(api.listByProgram('p1', 'critics', 2));
    const req = http.expectOne((r) => r.url === `${programUrl}/reviews`);
    expect(req.request.params.get('group')).toBe('critics');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('5');
    req.flush({ data: [], page: 2, limit: 5, total: 6 });
    expect((await result).total).toBe(6);
  });
});
