import { TestBed } from '@angular/core/testing';

import { ASSIGNABLE_USER_TYPE_OPTIONS, REVIEW_GROUP_OPTIONS } from '../../constants/labels';
import type { ReviewGroup } from '../../models/review.model';
import type { AssignableUserType } from '../../models/user.model';

import { UserTypeSelectorComponent } from './user-type-selector.component';

describe('UserTypeSelectorComponent', () => {
  it('Details: shows Critics / Audience and emits only real changes', () => {
    const fixture = TestBed.createComponent(UserTypeSelectorComponent<ReviewGroup>);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'critics');
    fixture.componentRef.setInput('options', REVIEW_GROUP_OPTIONS);
    const emitted: ReviewGroup[] = [];
    component.valueChange.subscribe((group) => emitted.push(group));
    fixture.detectChanges();

    // (Ionic's ion-label hides its textContent in jsdom, so check the buttons.)
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('ion-segment-button').length).toBe(2);

    component.select('critics'); // already selected
    component.select('everyone'); // not an option
    component.select('audience');
    expect(emitted).toEqual(['audience']);
  });

  it('Users: the same component with Normal / Critic', () => {
    const fixture = TestBed.createComponent(UserTypeSelectorComponent<AssignableUserType>);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'normal');
    fixture.componentRef.setInput('options', ASSIGNABLE_USER_TYPE_OPTIONS);
    const emitted: AssignableUserType[] = [];
    component.valueChange.subscribe((type) => emitted.push(type));
    fixture.detectChanges();

    component.select('admin'); // admins can't be assigned
    component.select('critic');
    expect(emitted).toEqual(['critic']);
  });
});
