import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, map, of, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { REVIEWS_PAGE_SIZE } from '../constants/review-limits';
import type { Page } from '../models/api.model';
import type { ProgramReview, Review, ReviewGroup, ReviewInput } from '../models/review.model';

// Calls about reviews (backend/README.md → Reseñas).
@Injectable({ providedIn: 'root' })
export class ReviewsApi {
  private http = inject(HttpClient);
  private programsUrl = `${environment.apiUrl}/programs`;
  private reviewsUrl = `${environment.apiUrl}/reviews`;

  // GET /programs/:id/reviews?group=critics|audience — newest first, with the author's name and type.
  listByProgram(programId: string, group: ReviewGroup, page: number): Observable<Page<ProgramReview>> {
    const params = new HttpParams().set('group', group).set('page', page).set('limit', REVIEWS_PAGE_SIZE);
    return this.http.get<Page<ProgramReview>>(`${this.programsUrl}/${programId}/reviews`, { params });
  }

  // GET /programs/:id/reviews/mine — the logged-in user's review of this program, or null if none.
  getMine(programId: string): Observable<Review | null> {
    return this.http.get<{ review: Review }>(`${this.programsUrl}/${programId}/reviews/mine`).pipe(
      map((res) => res.review),
      // 404 here just means "you haven't reviewed it yet".
      catchError((err: unknown) =>
        err instanceof HttpErrorResponse && err.status === 404 ? of(null) : throwError(() => err),
      ),
    );
  }

  // POST /programs/:id/reviews — one per user and program (409 if it already exists).
  create(programId: string, input: ReviewInput): Observable<Review> {
    return this.http
      .post<{ review: Review }>(`${this.programsUrl}/${programId}/reviews`, input)
      .pipe(map((res) => res.review));
  }

  // PATCH /reviews/:id — only the author.
  update(reviewId: string, input: ReviewInput): Observable<Review> {
    return this.http.patch<{ review: Review }>(`${this.reviewsUrl}/${reviewId}`, input).pipe(map((res) => res.review));
  }

  // DELETE /reviews/:id — only the author.
  remove(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.reviewsUrl}/${reviewId}`);
  }
}
