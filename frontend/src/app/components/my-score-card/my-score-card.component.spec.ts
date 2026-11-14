import { TestBed } from '@angular/core/testing';
import type { RangeCustomEvent } from '@ionic/angular';

import { MyScoreCardComponent } from './my-score-card.component';

describe('MyScoreCardComponent', () => {
  it('shows the score and emits it while the slider moves', () => {
    const fixture = TestBed.createComponent(MyScoreCardComponent);
    fixture.componentRef.setInput('points', 70);
    const emitted: number[] = [];
    fixture.componentInstance.pointsChange.subscribe((p) => emitted.push(p));
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.number')?.textContent).toBe('70');
    expect(html.querySelector('app-score-stars')).not.toBeNull();

    fixture.componentInstance.onInput({ detail: { value: 88 } } as RangeCustomEvent);
    expect(emitted).toEqual([88]);
  });
});
