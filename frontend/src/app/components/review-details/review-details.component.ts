import { Component, computed, input } from '@angular/core';

import type { ProgramReview } from '../../models/review.model';
import { UserType } from '../../models/user.model';
import { avatarColor } from '../../utils/colors';
import { formatDate } from '../../utils/format';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// One review in Details: avatar with the author's initial, username, "Critic" badge
// (only for critics), date, points /100, stars and the comment if there is one.
// <app-review-details [review]="review" />
@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss'],
  imports: [StarRatingComponent],
})
export class ReviewDetailsComponent {
  review = input.required<ProgramReview>();

  username = computed(() => this.review().author.username);
  initial = computed(() => this.username().charAt(0).toUpperCase());
  avatar = computed(() => avatarColor(this.username()));
  isCritic = computed(() => this.review().author.type === UserType.CRITIC);
  date = computed(() => formatDate(this.review().createdAt));
}
