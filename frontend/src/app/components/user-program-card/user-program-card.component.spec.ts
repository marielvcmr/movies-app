import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { UserReview } from '../../models/review.model';

import { UserProgramCardComponent } from './user-program-card.component';

const REVIEW: UserReview = {
  _id: 'r1',
  program: { _id: 'p1', title: 'Severance', type: 'series', year: 2022, posterUrl: null },
  points: 90,
  comment: 'Unsettling office satire.',
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('UserProgramCardComponent', () => {
  let fixture: ComponentFixture<UserProgramCardComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  function render(review: UserReview) {
    fixture = TestBed.createComponent(UserProgramCardComponent);
    fixture.componentRef.setInput('review', review);
    fixture.detectChanges();
  }

  it('shows the poster without name, title, meta, points and comment', () => {
    render(REVIEW);
    expect(html().querySelector('.fallback-title')).toBeNull();
    expect(html().querySelector('.title')?.textContent).toBe('Severance');
    expect(html().querySelector('.meta')?.textContent).toBe('Series · 2022');
    expect(html().querySelector('.number')?.textContent).toBe('90');
    expect(html().querySelector('.comment')?.textContent).toBe('Unsettling office satire.');
  });

  it('no paragraph without comment', () => {
    render({ ...REVIEW, comment: null });
    expect(html().querySelector('.comment')).toBeNull();
  });
});
