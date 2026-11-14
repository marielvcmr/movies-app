import { TestBed } from '@angular/core/testing';

import type { ReviewGroup } from '../../models/review.model';

import { ScoreDetailCardComponent } from './score-detail-card.component';

describe('ScoreDetailCardComponent', () => {
  function create(group: ReviewGroup, points: number | null, count: number | null = null) {
    const fixture = TestBed.createComponent(ScoreDetailCardComponent);
    fixture.componentRef.setInput('group', group);
    fixture.componentRef.setInput('points', points);
    fixture.componentRef.setInput('count', count);
    fixture.detectChanges();
    return { card: fixture.componentInstance, host: fixture.nativeElement as HTMLElement };
  }

  it('critics: badge icon and "critics" class', () => {
    const { card, host } = create('critics', 92, 41);
    expect(card.label()).toBe('Critics');
    expect(card.icon()).toBe('ribbon-outline');
    expect(host.classList).toContain('critics');
    expect(card.countText()).toBe('41 reviews');
  });

  it('audience: people icon and "audience" class', () => {
    const { card, host } = create('audience', 88.6);
    expect(card.label()).toBe('Audience');
    expect(card.icon()).toBe('people-outline');
    expect(host.classList).toContain('audience');
    expect(card.score()).toBe('89');
  });

  it('shows "—" and "No reviews yet" without reviews', () => {
    const { card, host } = create('critics', null);
    expect(card.score()).toBe('—');
    expect(card.countText()).toBe('No reviews yet');
    expect(host.querySelector('.max')).toBeNull();
  });
});
