import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { USERS_PAGE_SIZE } from '../constants/filters';
import { PROFILE_REVIEWS_PAGE_SIZE } from '../constants/review-limits';
import type { Page } from '../models/api.model';
import type { UserReview } from '../models/review.model';
import type {
  AssignableUserType,
  ProfileChanges,
  PublicProfile,
  User,
  UserListItem,
  UserType,
} from '../models/user.model';

// What the Users module asks for: search text, type chip and page.
export interface UserListQuery {
  q: string;
  type: UserType | null; // null = every type
  page: number;
}

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

  // PATCH /users/me — only the fields that changed. Answers the updated user.
  updateMe(changes: ProfileChanges): Observable<User> {
    return this.http.patch<{ user: User }>(`${this.url}/me`, changes).pipe(map((res) => res.user));
  }

  // ── Admin (Users module) ──

  // GET /users?q=&type=&page=&limit= — newest first, with each user's number of reviews.
  list({ q, type, page }: UserListQuery): Observable<Page<UserListItem>> {
    let params = new HttpParams().set('page', page).set('limit', USERS_PAGE_SIZE);
    const text = q.trim();
    if (text) params = params.set('q', text);
    if (type) params = params.set('type', type);
    return this.http.get<Page<UserListItem>>(this.url, { params });
  }

  // PATCH /users/:id/type — normal ↔ critic. The API recalculates the averages of the titles
  // that user reviewed, and refuses (403) to change an admin.
  changeType(userId: string, type: AssignableUserType): Observable<User> {
    return this.http.patch<{ user: User }>(`${this.url}/${userId}/type`, { type }).pipe(map((res) => res.user));
  }
}
