import { TestBed } from '@angular/core/testing';

import type { ReviewGroup } from '../../models/review.model';

import { UserTypeSelectorComponent } from './user-type-selector.component';

describe('UserTypeSelectorComponent', () => {
  it('shows Critics / Audience and emits only real changes', () => {
    const fixture = TestBed.createComponent(UserTypeSelectorComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('group', 'critics');
    const emitted: ReviewGroup[] = [];
    component.groupChange.subscribe((group) => emitted.push(group));
    fixture.detectChanges();

    // (Ionic's ion-label hides its textContent in jsdom, so check the options and the buttons.)
    expect(component.options.map((option) => option.label)).toEqual(['Critics', 'Audience']);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('ion-segment-button').length).toBe(2);

    component.select('critics');
    component.select('everyone');
    component.select('audience');
    expect(emitted).toEqual(['audience']);
  });
});
