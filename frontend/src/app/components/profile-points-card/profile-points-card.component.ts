import { Component, computed, input } from '@angular/core';

import { formatScore } from '../../utils/format';

// Profile stat: average points the user gives in their reviews, out of 100.
// Without reviews (null) it shows "—". Used in My profile and in a user's profile.
// <app-profile-points-card [points]="profile.pointsMean" />
@Component({
  selector: 'app-profile-points-card',
  templateUrl: './profile-points-card.component.html',
  styleUrls: ['./profile-points-card.component.scss'],
})
export class ProfilePointsCardComponent {
  points = input.required<number | null>();

  score = computed(() => formatScore(this.points()));
}
