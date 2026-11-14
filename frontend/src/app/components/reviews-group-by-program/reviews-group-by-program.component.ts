import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonRouterLinkWithHref, IonSpinner } from '@ionic/angular';

import type { ProgramReview, ReviewGroup } from '../../models/review.model';
import { ReviewDetailsComponent } from '../review-details/review-details.component';

// The reviews of one program for one group (Critics or Audience): one review-details each,
// "Load more reviews" while there are more, and messages for loading / empty / error.
// It only shows them: the page loads the pages and listens to (loadMore) and (retry).
// Each review opens its author's profile (/users/:id); your own review (myUserId) opens My profile.
// <app-reviews-group-by-program [group]="g" [reviews]="list" [hasMore]="more" [loading]="l"
//                               [error]="e" [myUserId]="me" (loadMore)="..." (retry)="..." />
@Component({
  selector: 'app-reviews-group-by-program',
  templateUrl: './reviews-group-by-program.component.html',
  styleUrls: ['./reviews-group-by-program.component.scss'],
  imports: [RouterLink, IonRouterLinkWithHref, IonSpinner, ReviewDetailsComponent],
})
export class ReviewsGroupByProgramComponent {
  group = input.required<ReviewGroup>();
  reviews = input.required<ProgramReview[]>();
  hasMore = input(false);
  loading = input(false);
  error = input<string | null>(null);
  myUserId = input<string | null>(null);

  loadMore = output<void>();
  retry = output<void>();

  // Where tapping a review goes.
  authorLink(review: ProgramReview): string[] {
    return review.author._id === this.myUserId() ? ['/tabs/profile'] : ['/users', review.author._id];
  }

  emptyText = computed(() =>
    this.group() === 'critics' ? 'No critic reviews yet.' : 'No audience reviews yet. Be the first!',
  );
}
