import { signal } from '@angular/core';
import type { WritableSignal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';

import { ReviewsApi } from '../../api/reviews.api';
import { UsersApi } from '../../api/users.api';
import type { UserReview } from '../../models/review.model';
import type { PublicProfile, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

import { MyProfilePage } from './my-profile.page';

const ME: User = {
  _id: 'u1',
  username: 'marielv',
  email: 'marielv@example.com',
  type: 'normal',
  createdAt: '2026-11-08T00:00:00.000Z',
  updatedAt: '2026-11-08T00:00:00.000Z',
};

const PROFILE: PublicProfile = { ...ME, reviewsCount: 1, pointsMean: 88 };

const REVIEW: UserReview = {
  _id: 'r1',
  program: { _id: 'p1', title: 'Dune: Part Two', type: 'movie', year: 2024, posterUrl: null },
  points: 88,
  comment: 'Loved it',
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('MyProfilePage', () => {
  let fixture: ComponentFixture<MyProfilePage>;
  let page: MyProfilePage;
  let usersApi: Record<string, ReturnType<typeof vi.fn>>;
  let reviewsApi: Record<string, ReturnType<typeof vi.fn>>;
  let auth: Record<'logout' | 'deleteAccount', ReturnType<typeof vi.fn>> & { user: WritableSignal<User | null> };
  let nav: { navigateRoot: ReturnType<typeof vi.fn> };
  const html = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    usersApi = {
      getProfile: vi.fn(() => of(PROFILE)),
      listReviews: vi.fn(() => of({ data: [REVIEW], page: 1, limit: 10, total: 1 })),
    };
    reviewsApi = {
      update: vi.fn(() => of({ ...REVIEW, points: 60 })),
      remove: vi.fn(() => of(undefined)),
    };
    auth = { user: signal<User | null>(ME), logout: vi.fn(async () => {}), deleteAccount: vi.fn(async () => {}) };
    nav = { navigateRoot: vi.fn(async () => true) };

    await TestBed.configureTestingModule({
      imports: [MyProfilePage],
      providers: [
        provideRouter([]),
        { provide: UsersApi, useValue: usersApi },
        { provide: ReviewsApi, useValue: reviewsApi },
        { provide: AuthService, useValue: auth },
        { provide: NavController, useValue: nav },
        { provide: AlertController, useValue: { create: vi.fn(async () => ({ present: vi.fn() })) } },
        { provide: ToastController, useValue: { create: vi.fn(async () => ({ present: vi.fn() })) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePage);
    page = fixture.componentInstance;
    page.ionViewWillEnter(); // what Ionic calls every time the tab is shown
    fixture.detectChanges();
  });

  it('shows my info with the email, the stats and my reviews', () => {
    expect(usersApi['getProfile']).toHaveBeenCalledWith('u1');
    expect(usersApi['listReviews']).toHaveBeenCalledWith('u1', 1);
    expect(html().querySelector('app-my-profile-info .address')?.textContent).toBe('marielv@example.com');
    expect(html().querySelector('app-profile-reviews-card .number')?.textContent).toBe('1');
    expect(html().querySelector('app-profile-points-card .number')?.textContent).toBe('88');
    expect(html().querySelectorAll('app-my-profile-program-card').length).toBe(1);
  });

  it('editing opens the popup and saving calls update and reloads', () => {
    page.openEdit(REVIEW);
    expect(page.sheetOpen()).toBe(true);

    page.saveReview({ points: 60, comment: null });
    expect(reviewsApi['update']).toHaveBeenCalledWith('r1', { points: 60, comment: null });
    expect(page.sheetOpen()).toBe(false);
    expect(usersApi['listReviews']).toHaveBeenCalledTimes(2);
  });

  it('deleting from the popup calls remove', () => {
    page.openEdit(REVIEW);
    page.deleteEditing();
    expect(reviewsApi['remove']).toHaveBeenCalledWith('r1');
  });

  it('delete account goes back to Log in', async () => {
    await page.deleteAccount();
    expect(auth.deleteAccount).toHaveBeenCalled();
    expect(nav.navigateRoot).toHaveBeenCalledWith('/login');
  });

  it('log out goes back to Log in', async () => {
    await page.logout();
    expect(auth.logout).toHaveBeenCalled();
    expect(nav.navigateRoot).toHaveBeenCalledWith('/login');
  });
});
