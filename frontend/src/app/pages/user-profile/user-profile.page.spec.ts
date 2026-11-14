import { HttpErrorResponse } from '@angular/common/http';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UsersApi } from '../../api/users.api';
import type { UserReview } from '../../models/review.model';
import type { PublicProfile } from '../../models/user.model';

import { UserProfilePage } from './user-profile.page';

const PROFILE: PublicProfile = {
  _id: 'u9',
  username: 'maria.reviews',
  type: 'critic',
  createdAt: '2025-01-14T00:00:00.000Z',
  reviewsCount: 2,
  pointsMean: 81,
};

const REVIEW: UserReview = {
  _id: 'r1',
  program: { _id: 'p1', title: 'Severance', type: 'series', year: 2022, posterUrl: null },
  points: 90,
  comment: null,
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('UserProfilePage', () => {
  let fixture: ComponentFixture<UserProfilePage>;
  let usersApi: Record<string, ReturnType<typeof vi.fn>>;
  const html = () => fixture.nativeElement as HTMLElement;

  async function render(getProfile: () => unknown, total = 2) {
    usersApi = {
      getProfile: vi.fn(getProfile),
      listReviews: vi.fn(() => of({ data: [REVIEW], page: 1, limit: 10, total })),
    };
    await TestBed.configureTestingModule({
      imports: [UserProfilePage],
      providers: [provideRouter([]), { provide: UsersApi, useValue: usersApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfilePage);
    fixture.componentRef.setInput('id', 'u9');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('shows the info, the stats and the reviews linked to Details', async () => {
    await render(() => of(PROFILE));

    expect(usersApi['getProfile']).toHaveBeenCalledWith('u9');
    expect(usersApi['listReviews']).toHaveBeenCalledWith('u9', 1);
    expect(html().querySelector('app-user-profile-info h1')?.textContent).toBe('maria.reviews');
    expect(html().querySelector('app-profile-reviews-card .number')?.textContent).toBe('2');
    expect(html().querySelector('app-profile-points-card .number')?.textContent).toBe('81');
    expect(html().querySelectorAll('app-user-program-card').length).toBe(1);
    expect(html().querySelector('a.card-link')?.getAttribute('href')).toBe('/programs/p1');
    expect(html().querySelector('.load-more')).not.toBeNull();
  });

  it('shows the error with a retry button when the profile fails', async () => {
    const notFound = new HttpErrorResponse({
      status: 404,
      error: { error: { code: 'NOT_FOUND', message: 'User not found' } },
    });
    await render(() => throwError(() => notFound));

    expect(html().querySelector('[role="alert"]')?.textContent).toContain('User not found');
  });
});
