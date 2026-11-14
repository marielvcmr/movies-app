import { TestBed } from '@angular/core/testing';

import { ScoreStarsComponent } from './score-stars.component';

describe('ScoreStarsComponent', () => {
  function activeRange(points: number): string | undefined {
    const fixture = TestBed.createComponent(ScoreStarsComponent);
    fixture.componentRef.setInput('points', points);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('li.active .range')?.textContent ?? undefined;
  }

  it('highlights the band of the current score', () => {
    expect(activeRange(1)).toBe('1–20');
    expect(activeRange(20)).toBe('1–20');
    expect(activeRange(21)).toBe('21–40');
    expect(activeRange(70)).toBe('61–80');
    expect(activeRange(100)).toBe('81–100');
  });
});
