import { Component, input, output } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';

import type { SelectorOption } from '../../constants/labels';

// Two-option switch about user types. It only shows the options and emits the one tapped;
// the parent decides what that means:
//   Details → which reviews to show (filters the list):
//     <app-user-type-selector [(value)]="reviewGroup" [options]="REVIEW_GROUP_OPTIONS" label="Reviews by" />
//   Users (user-view-card) → the type of that user (the page saves it with the API):
//     <app-user-type-selector [value]="user.type" [options]="ASSIGNABLE_USER_TYPE_OPTIONS"
//                             (valueChange)="typeChange.emit($event)" />
// <T> = the type of the values ('critics' | 'audience', 'normal' | 'critic'...). Angular takes it
// from the options passed in, so [(value)] still checks that the parent's signal has that type.
// Same look as program-selector (.sa-segment in global.scss).
@Component({
  selector: 'app-user-type-selector',
  templateUrl: './user-type-selector.component.html',
  styleUrls: ['./user-type-selector.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel],
})
export class UserTypeSelectorComponent<T extends string> {
  value = input.required<T>();
  options = input.required<SelectorOption<T>[]>();
  label = input('User type'); // read by screen readers
  disabled = input(false);

  valueChange = output<T>();

  // Emits only a real option that is different from the current one.
  select(picked: unknown): void {
    const option = this.options().find((o) => o.value === picked);
    if (option && option.value !== this.value()) {
      this.valueChange.emit(option.value);
    }
  }
}
