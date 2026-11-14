import { TestBed } from '@angular/core/testing';

import type { ProgramReview } from '../../models/review.model';

import { ReviewDetailsComponent } from './review-details.component';

const BASE: ProgramReview = {
  _id: 'r1',
  author: { _id: 'u1', username: 'maria.reviews', type: 'critic' },
  program: 'p1',
  points: 95,
  comment: 'A towering epic.',
  createdAt: '2026-03-03T00:00:00.000Z',
  updatedAt: '2026-03-03T00:00:00.000Z',
};

describe('ReviewDetailsComponent', () => {
  function render(review: ProgramReview): HTMLElement {
    const fixture = TestBed.createComponent(ReviewDetailsComponent);
    fixture.componentRef.setInput('review', review);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows a critic review with badge, date, points and comment', () => {
    const html = render(BASE);
    expect(html.querySelector('.avatar')?.textContent).toBe('M');
    expect(html.querySelector('.username')?.textContent).toBe('maria.reviews');
    expect(html.querySelector('.critic-badge')).not.toBeNull();
    expect(html.querySelector('.date')?.textContent).toBe('Mar 3, 2026');
    expect(html.querySelector('.number')?.textContent).toBe('95');
    expect(html.querySelector('.comment')?.textContent).toBe('A towering epic.');
  });

  it('no badge for standard users, no paragraph without comment', () => {
    const html = render({ ...BASE, author: { ...BASE.author, type: 'normal' }, comment: null });
    expect(html.querySelector('.critic-badge')).toBeNull();
    expect(html.querySelector('.comment')).toBeNull();
  });
});
