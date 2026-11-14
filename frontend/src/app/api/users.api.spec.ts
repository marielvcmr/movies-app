import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

import { UsersApi } from './users.api';

describe('UsersApi', () => {
  let api: UsersApi;
  let http: HttpTestingController;
  const usersUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(UsersApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getProfile returns the public profile', async () => {
    const result = firstValueFrom(api.getProfile('u1'));
    http.expectOne(`${usersUrl}/u1`).flush({ user: { _id: 'u1', username: 'jose23', reviewsCount: 3 } });
    expect((await result).reviewsCount).toBe(3);
  });

  it('listReviews asks for one page', async () => {
    const result = firstValueFrom(api.listReviews('u1', 2));
    const req = http.expectOne((r) => r.url === `${usersUrl}/u1/reviews`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush({ data: [], page: 2, limit: 10, total: 12 });
    expect((await result).total).toBe(12);
  });

  it('deleteMe sends DELETE /users/me', async () => {
    const result = firstValueFrom(api.deleteMe(), { defaultValue: undefined });
    const req = http.expectOne(`${usersUrl}/me`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
    await result;
  });
});
