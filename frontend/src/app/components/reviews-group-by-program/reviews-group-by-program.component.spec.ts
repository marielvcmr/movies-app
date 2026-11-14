import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { ProgramReview } from '../../models/review.model';

import { ReviewsGroupByProgramComponent } from './reviews-group-by-program.component';

const REVIEW: ProgramReview = {
  _id: 'r1',
  author: { _id: 'u1', username: 'jose23', type: 'normal' },
  program: 'p1',
  points: 100,
  comment: null,
  createdAt: '2026-03-05T00:00:00.000Z',
  updatedAt: '2026-03-05T00:00:00.000Z',
};

describe('ReviewsGroupByProgramComponent', () => {
  let fixture: ComponentFixture<ReviewsGroupByProgramComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  function render(inputs: Record<string, unknown>) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(ReviewsGroupByProgramComponent);
    fixture.componentRef.setInput('group', 'audience');
    fixture.componentRef.setInput('reviews', []);
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  }

  it('shows one review-details per review and "Load more" when there are more', () => {
    render({ reviews: [REVIEW, { ...REVIEW, _id: 'r2' }], hasMore: true });
    expect(html().querySelectorAll('app-review-details').length).toBe(2);

    let loadMoreClicks = 0;
    fixture.componentInstance.loadMore.subscribe(() => loadMoreClicks++);
    html().querySelector<HTMLButtonElement>('.load-more')?.click();
    expect(loadMoreClicks).toBe(1);
  });

  it("links each review to its author's profile, and mine to My profile", () => {
    render({ reviews: [REVIEW, { ...REVIEW, _id: 'r2', author: { ...REVIEW.author, _id: 'me' } }], myUserId: 'me' });
    const links = html().querySelectorAll('a.review-link');
    expect(links[0].getAttribute('href')).toBe('/users/u1');
    expect(links[1].getAttribute('href')).toBe('/tabs/profile');
  });

  it('shows the empty message for the group', () => {
    render({ group: 'critics' });
    expect(html().querySelector('.message')?.textContent).toContain('No critic reviews yet.');
  });

  it('shows the error with a retry button', () => {
    render({ error: "Can't reach the server." });
    let retries = 0;
    fixture.componentInstance.retry.subscribe(() => retries++);
    html().querySelector<HTMLButtonElement>('.link')?.click();
    expect(retries).toBe(1);
  });
});
