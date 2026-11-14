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

  it('the sample list is split by group and paginated', async () => {
    const critics = await firstValueFrom(api.listByProgram('p1', 'critics', 1));
    expect(critics.data.every((r) => r.author.type === 'critic')).toBe(true);
    expect(critics.data.length).toBe(5);
    expect(critics.total).toBe(6);

    const page2 = await firstValueFrom(api.listByProgram('p1', 'critics', 2));
    expect(page2.data.length).toBe(1);

    const audience = await firstValueFrom(api.listByProgram('p1', 'audience', 1));
    expect(audience.data.some((r) => r.author.type === 'critic')).toBe(false);
  });
});
