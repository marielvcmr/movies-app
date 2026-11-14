import { TestBed } from '@angular/core/testing';

import { ProfileReviewsCardComponent } from './profile-reviews-card.component';

describe('ProfileReviewsCardComponent', () => {
  it('shows the label and the number of reviews', () => {
    const fixture = TestBed.createComponent(ProfileReviewsCardComponent);
    fixture.componentRef.setInput('count', 24);
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.label')?.textContent).toBe('Reviews');
    expect(html.querySelector('.number')?.textContent).toBe('24');
  });
});
