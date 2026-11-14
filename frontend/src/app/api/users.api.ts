import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { PROFILE_REVIEWS_PAGE_SIZE } from '../constants/review-limits';
import type { Page } from '../models/api.model';
import type { UserReview } from '../models/review.model';
import type { PublicProfile } from '../models/user.model';

// Calls to /users (backend/README.md → Usuarios).
@Injectable({ providedIn: 'root' })
export class UsersApi {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  // GET /users/:id — public profile: username, type, member since, number of reviews and average.
  getProfile(userId: string): Observable<PublicProfile> {
    return this.http.get<{ user: PublicProfile }>(`${this.url}/${userId}`).pipe(map((res) => res.user));
  }

  // GET /users/:id/reviews — newest first, each one with a summary of its program.
  listReviews(userId: string, page: number): Observable<Page<UserReview>> {
    const params = new HttpParams().set('page', page).set('limit', PROFILE_REVIEWS_PAGE_SIZE);
    return this.http.get<Page<UserReview>>(`${this.url}/${userId}/reviews`, { params });
  }

  // DELETE /users/me — deletes the logged-in account and all its reviews. Answers 204.
  deleteMe(): Observable<void> {
    return this.http.delete<void>(`${this.url}/me`);
  }
}
