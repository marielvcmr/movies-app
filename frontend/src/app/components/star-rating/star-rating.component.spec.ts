import { TestBed } from '@angular/core/testing';

import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent', () => {
  function create(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(StarRatingComponent);
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('turns points into stars', () => {
    expect(create({ points: 92 }).filled()).toBe(5);
    expect(create({ points: 41 }).filled()).toBe(3);
    expect(create({ points: 40 }).filled()).toBe(2);
  });

  it('shows 0 stars when there is no score', () => {
    expect(create({ points: null }).filled()).toBe(0);
  });

  it('can receive the stars directly', () => {
    const rating = create({ stars: 3 });
    expect(rating.icons()).toEqual(['star', 'star', 'star', 'star-outline', 'star-outline']);
    expect(rating.label()).toBe('3 of 5 stars');
  });
});
