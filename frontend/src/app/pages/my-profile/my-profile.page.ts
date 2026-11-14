import { Component, computed, inject, signal } from '@angular/core';
import { AlertController, IonContent, IonIcon, IonSpinner, NavController, ToastController } from '@ionic/angular';
import type { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, trashOutline } from 'ionicons/icons';
import type { Observable, Subscription } from 'rxjs';

import { apiErrorMessage } from '../../api/api-error';
import { ReviewsApi } from '../../api/reviews.api';
import { UsersApi } from '../../api/users.api';
import { ButtonComponent } from '../../components/button/button.component';
import { MyProfileInfoComponent } from '../../components/my-profile-info/my-profile-info.component';
import { MyProfileProgramCardComponent } from '../../components/my-profile-program-card/my-profile-program-card.component';
import { MyReviewSheetComponent } from '../../components/my-review-sheet/my-review-sheet.component';
import { ProfilePointsCardComponent } from '../../components/profile-points-card/profile-points-card.component';
import { ProfileReviewsCardComponent } from '../../components/profile-reviews-card/profile-reviews-card.component';
import type { ReviewInput, UserReview } from '../../models/review.model';
import type { PublicProfile } from '../../models/user.model';
import { UserType } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

// My profile (/tabs/profile). Top to bottom:
//   "My profile" + Log out, my-profile-info (with my email), the two stats
//   (profile-reviews-card + profile-points-card), Delete account,
//   and My reviews: one my-profile-program-card each, with edit and delete.
// Editing opens the same my-review-sheet as Details (Cancel / Save changes).
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    ButtonComponent,
    MyProfileInfoComponent,
    MyProfileProgramCardComponent,
    MyReviewSheetComponent,
    ProfilePointsCardComponent,
    ProfileReviewsCardComponent,
  ],
})
export class MyProfilePage implements ViewWillEnter {
  auth = inject(AuthService);
  private usersApi = inject(UsersApi);
  private reviewsApi = inject(ReviewsApi);
  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private reviewsRequest?: Subscription;

  // ── Stats (GET /users/:id with my own id) ──
  profile = signal<PublicProfile | null>(null);
  profileError = signal<string | null>(null);

  // ── My reviews (GET /users/:id/reviews) ──
  reviews = signal<UserReview[]>([]);
  reviewsTotal = signal(0);
  reviewsPage = signal(1);
  reviewsLoading = signal(false);
  reviewsError = signal<string | null>(null);
  hasMoreReviews = computed(() => this.reviews().length < this.reviewsTotal());

  // ── The Edit review popup ──
  editing = signal<UserReview | null>(null);
  sheetOpen = signal(false);
  saving = signal(false);
  sheetError = signal<string | null>(null);
  userType = computed(() => this.auth.user()?.type ?? UserType.NORMAL);

  constructor() {
    addIcons({ logOutOutline, trashOutline });
  }

  // Every time the tab is shown (Ionic keeps it cached): you may have reviewed something in Details.
  ionViewWillEnter(): void {
    this.load();
  }

  load(): void {
    this.loadProfile();
    this.loadReviews(1);
  }

  loadProfile(): void {
    const userId = this.auth.user()?._id;
    if (!userId) return;

    this.profileError.set(null);
    this.usersApi.getProfile(userId).subscribe({
      next: (profile) => this.profile.set(profile),
      error: (err: unknown) => this.profileError.set(apiErrorMessage(err)),
    });
  }

  loadReviews(page: number): void {
    const userId = this.auth.user()?._id;
    if (!userId) return;

    this.reviewsRequest?.unsubscribe();
    this.reviewsLoading.set(true);
    this.reviewsError.set(null);
    if (page === 1) this.reviews.set([]);

    this.reviewsRequest = this.usersApi.listReviews(userId, page).subscribe({
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

  // ── Session ──

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.navCtrl.navigateRoot('/login');
  }

  async askDeleteAccount(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete your account?',
      message: "Your profile and all your reviews will be deleted. This can't be undone.",
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => void this.deleteAccount() },
      ],
    });
    await alert.present();
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.auth.deleteAccount();
      await this.navCtrl.navigateRoot('/login');
    } catch (err) {
      await this.showToast(apiErrorMessage(err));
    }
  }

  // ── My reviews: edit and delete ──

  openEdit(review: UserReview): void {
    this.editing.set(review);
    this.sheetError.set(null);
    this.sheetOpen.set(true);
  }

  // PATCH /reviews/:id from the popup.
  saveReview(input: ReviewInput): void {
    const review = this.editing();
    if (!review) return;
    this.runReviewAction(this.reviewsApi.update(review._id, input), 'Review updated.');
  }

  // "Delete review" inside the popup (the popup already asked for confirmation).
  deleteEditing(): void {
    const review = this.editing();
    if (!review) return;
    this.runReviewAction(this.reviewsApi.remove(review._id), 'Review deleted.');
  }

  // Trash button of a card: ask first, like the popup does.
  async askDeleteReview(review: UserReview): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete your review?',
      message: 'Your score and comment will be removed and the averages will be updated.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.runReviewAction(this.reviewsApi.remove(review._id), 'Review deleted.'),
        },
      ],
    });
    await alert.present();
  }

  private runReviewAction<T>(request: Observable<T>, message: string): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.sheetError.set(null);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.sheetOpen.set(false);
        void this.showToast(message);
        // The stats and the list change: ask for them again.
        this.load();
      },
      error: (err: unknown) => {
        const text = apiErrorMessage(err);
        this.saving.set(false);
        // With the popup open the error shows inside it; otherwise as a toast.
        if (this.sheetOpen()) this.sheetError.set(text);
        else void this.showToast(text);
      },
    });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'top' });
    await toast.present();
  }
}
