import { Component, input } from '@angular/core';

// Profile stat: how many reviews the user has written. Used in My profile and in a user's profile.
// <app-profile-reviews-card [count]="profile.reviewsCount" />
@Component({
  selector: 'app-profile-reviews-card',
  templateUrl: './profile-reviews-card.component.html',
  styleUrls: ['./profile-reviews-card.component.scss'],
})
export class ProfileReviewsCardComponent {
  count = input.required<number>();
}
