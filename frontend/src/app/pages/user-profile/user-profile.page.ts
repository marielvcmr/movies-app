import { Component, computed, inject, input, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonRouterLinkWithHref,
  IonSpinner,
  IonToolbar,
} from '@ionic/angular';
import type { Subscription } from 'rxjs';

import { apiErrorMessage } from '../../api/api-error';
import { UsersApi } from '../../api/users.api';
import { ProfilePointsCardComponent } from '../../components/profile-points-card/profile-points-card.component';
import { ProfileReviewsCardComponent } from '../../components/profile-reviews-card/profile-reviews-card.component';
import { UserProfileInfoComponent } from '../../components/user-profile-info/user-profile-info.component';
import { UserProgramCardComponent } from '../../components/user-program-card/user-program-card.component';
import type { UserReview } from '../../models/review.model';
import type { PublicProfile } from '../../models/user.model';

// Public profile of another user (/users/:id), opened by tapping one of their reviews in Details.
// Top to bottom: back button, user-profile-info, the two stats (profile-reviews-card +
// profile-points-card) and their reviews: one user-program-card each, which opens Details.
// Only public data: the API never sends the email here.
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonSpinner,
    RouterLink,
    IonRouterLinkWithHref,
    ProfilePointsCardComponent,
    ProfileReviewsCardComponent,
    UserProfileInfoComponent,
    UserProgramCardComponent,
  ],
})
export class UserProfilePage implements OnInit {
  private usersApi = inject(UsersApi);
  private reviewsRequest?: Subscription;

  // The :id of the URL (withComponentInputBinding in main.ts).
  id = input.required<string>();

  profile = signal<PublicProfile | null>(null);
  error = signal<string | null>(null);

  reviews = signal<UserReview[]>([]);
  reviewsTotal = signal(0);
  reviewsPage = signal(1);
  reviewsLoading = signal(false);
  reviewsError = signal<string | null>(null);
  hasMoreReviews = computed(() => this.reviews().length < this.reviewsTotal());

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.usersApi.getProfile(this.id()).subscribe({
      next: (profile) => this.profile.set(profile),
      error: (err: unknown) => this.error.set(apiErrorMessage(err)),
    });
    this.loadReviews(1);
  }

  loadReviews(page: number): void {
    this.reviewsRequest?.unsubscribe();
    this.reviewsLoading.set(true);
    this.reviewsError.set(null);
    if (page === 1) this.reviews.set([]);

    this.reviewsRequest = this.usersApi.listReviews(this.id(), page).subscribe({
      next: (result) => {
        this.reviews.update((list) => (page === 1 ? result.data : [...list, ...result.data]));
        this.reviewsTotal.set(result.total);
        this.reviewsPage.set(page);
        this.reviewsLoading.set(false);
      },
      error: (err: unknown) => {
        this.reviewsError.set(apiErrorMessage(err));
        this.reviewsLoading.set(false);
      },
    });
  }

  loadMoreReviews(): void {
    this.loadReviews(this.reviewsPage() + 1);
  }
}
