import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { ProgramsApi } from '../../api/programs.api';
import { ReviewsApi } from '../../api/reviews.api';
import type { Program } from '../../models/program.model';
import type { ProgramReview, Review } from '../../models/review.model';
import { AuthService } from '../../services/auth.service';

import { ProgramDetailPage } from './program-detail.page';

const SEVERANCE: Program = {
  _id: 's3',
  type: 'series',
  externalId: 'tt11280740',
  title: 'Severance',
  year: 2022,
  releaseDate: '2022-02-18T00:00:00.000Z',
  posterUrl: null,
  genres: ['drama', 'science_fiction'],
  actors: ['Adam Scott', 'Britt Lower'],
  synopsis: 'Office workers have their memories split.',
  pointsMeanCritics: 95,
  pointsMeanNormal: 92,
  seasonsCount: 2,
};

const CRITIC_REVIEW: ProgramReview = {
  _id: 'c1',
  author: { _id: 'u9', username: 'maria.reviews', type: 'critic' },
  program: 's3',
  points: 95,
  comment: 'Great.',
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

const MINE: Review = {
  _id: 'r1',
  author: 'u1',
  program: 's3',
  points: 80,
  comment: null,
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('ProgramDetailPage', () => {
  let fixture: ComponentFixture<ProgramDetailPage>;
  let page: ProgramDetailPage;
  let reviewsApi: Record<string, ReturnType<typeof vi.fn>>;
  const html = () => fixture.nativeElement as HTMLElement;

  async function render(getById: () => unknown, mine: Review | null = null) {
    reviewsApi = {
      listByProgram: vi.fn(() => of({ data: [CRITIC_REVIEW], page: 1, limit: 5, total: 1 })),
      getMine: vi.fn(() => of(mine)),
      create: vi.fn(() => of({ ...MINE, points: 90 })),
      update: vi.fn(() => of({ ...MINE, points: 60 })),
      remove: vi.fn(() => of(undefined)),
    };
    await TestBed.configureTestingModule({
      imports: [ProgramDetailPage],
      providers: [
        provideRouter([]),
        { provide: ProgramsApi, useValue: { getById: vi.fn(getById) } },
        { provide: ReviewsApi, useValue: reviewsApi },
        { provide: AuthService, useValue: { user: signal({ type: 'critic' }) } },
        { provide: ToastController, useValue: { create: vi.fn(async () => ({ present: vi.fn() })) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramDetailPage);
    page = fixture.componentInstance;
    fixture.componentRef.setInput('id', 's3');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('shows every part of the program, the actors and the critics reviews', async () => {
    await render(() => of(SEVERANCE));

    expect(html().querySelector('app-program-detail-card')).not.toBeNull();
    expect(html().querySelectorAll('app-score-detail-card').length).toBe(2);
    expect(html().querySelector('app-program-facts')).not.toBeNull();
    expect(html().querySelector('.synopsis')?.textContent).toContain('memories split');
    expect(html().querySelectorAll('app-actor-chip').length).toBe(2);
    expect(page.genreLabels()).toEqual(['Drama', 'Sci-Fi']);

    expect(reviewsApi['listByProgram']).toHaveBeenCalledWith('s3', 'critics', 1);
    expect(html().querySelectorAll('app-review-details').length).toBe(1);
    expect(html().querySelector('ion-footer app-button')?.textContent).toContain('Write a review');
    expect(page.userType()).toBe('critic');
  });

  it('switching to Audience reloads the list', async () => {
    await render(() => of(SEVERANCE));
    page.reviewGroup.set('audience');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(reviewsApi['listByProgram']).toHaveBeenLastCalledWith('s3', 'audience', 1);
  });

  it('publishing a new review calls create and closes the popup', async () => {
    await render(() => of(SEVERANCE));
    page.openSheet();
    page.saveReview({ points: 90, comment: 'Wow' });

    expect(reviewsApi['create']).toHaveBeenCalledWith('s3', { points: 90, comment: 'Wow' });
    expect(page.myReview()?.points).toBe(90);
    expect(page.sheetOpen()).toBe(false);
    expect(page.reviewButtonLabel()).toBe('Edit your review');
  });

  it('with a review already written, saving calls update', async () => {
    await render(() => of(SEVERANCE), MINE);
    expect(page.reviewButtonLabel()).toBe('Edit your review');

    page.saveReview({ points: 60, comment: null });
    expect(reviewsApi['update']).toHaveBeenCalledWith('r1', { points: 60, comment: null });
  });

  it('keeps the popup open and shows the error when saving fails', async () => {
    await render(() => of(SEVERANCE));
    reviewsApi['create'].mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            error: { error: { code: 'CONFLICT', message: 'You have already reviewed this program' } },
          }),
      ),
    );
    page.openSheet();
    page.saveReview({ points: 90, comment: null });

    expect(page.sheetOpen()).toBe(true);
    expect(page.sheetError()).toBe('You have already reviewed this program');
  });

  it('shows the error with a retry button when the program fails', async () => {
    const notFound = new HttpErrorResponse({
      status: 404,
      error: { error: { code: 'NOT_FOUND', message: 'Program not found' } },
    });
    await render(() => throwError(() => notFound));

    expect(html().querySelector('[role="alert"]')?.textContent).toContain('Program not found');
    expect(html().querySelector('ion-footer')).toBeNull();
  });
});
