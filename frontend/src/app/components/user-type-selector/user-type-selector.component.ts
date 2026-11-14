import { Component, input, output } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';

import { REVIEW_GROUP_LABELS } from '../../constants/labels';
import type { ReviewGroup } from '../../models/review.model';

const GROUPS: ReviewGroup[] = ['critics', 'audience'];

// Critics / Audience switch above the reviews in Details: whose reviews to show.
// Critics = reviews by critic users; Audience = reviews by standard users.
// Same look as program-selector (.sa-segment in global.scss).
// Usage with two-way binding: <app-user-type-selector [(group)]="reviewGroup" />
@Component({
  selector: 'app-user-type-selector',
  templateUrl: './user-type-selector.component.html',
  styleUrls: ['./user-type-selector.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel],
})
export class UserTypeSelectorComponent {
  group = input.required<ReviewGroup>();
  groupChange = output<ReviewGroup>();

  readonly options = GROUPS.map((value) => ({ value, label: REVIEW_GROUP_LABELS[value] }));

  select(value: unknown): void {
    if (GROUPS.includes(value as ReviewGroup) && value !== this.group()) {
      this.groupChange.emit(value as ReviewGroup);
    }
  }
}
