import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import type { OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonSpinner,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import type { Observable, Subscription } from 'rxjs';

import { apiErrorMessage } from '../../api/api-error';
import { ProgramsApi } from '../../api/programs.api';
import { ReviewsApi } from '../../api/reviews.api';
import { ActorListComponent } from '../../components/actor-list/actor-list.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ChipListComponent } from '../../components/chip-list/chip-list.component';
import { DetailSectionComponent } from '../../components/detail-section/detail-section.component';
import { MyReviewSheetComponent } from '../../components/my-review-sheet/my-review-sheet.component';
import { ProgramDetailCardComponent } from '../../components/program-detail-card/program-detail-card.component';
import { ProgramFactsComponent } from '../../components/program-facts/program-facts.component';
import { ReviewsGroupByProgramComponent } from '../../components/reviews-group-by-program/reviews-group-by-program.component';
import { ScoreDetailCardComponent } from '../../components/score-detail-card/score-detail-card.component';
import { UserTypeSelectorComponent } from '../../components/user-type-selector/user-type-selector.component';
import { GENRE_LABELS } from '../../constants/labels';
import type { Program } from '../../models/program.model';
import type { ProgramReview, Review, ReviewGroup, ReviewInput } from '../../models/review.model';
import { UserType } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { posterTone } from '../../utils/colors';

// Details of one movie or series (/programs/:id). Top to bottom:
//   program-detail-card, categories (chip-list), the two score-detail-cards, program-facts,
//   Synopsis and Actors (detail-section + actor-list),
//   Reviews: user-type-selector (Critics / Audience) + reviews-group-by-program,
//   and "Write a review" fixed at the bottom, which opens my-review-sheet.
@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.page.html',
  styleUrls: ['./program-detail.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonSpinner,
    ActorListComponent,
    ButtonComponent,
    ChipListComponent,
    DetailSectionComponent,
    MyReviewSheetComponent,
    ProgramDetailCardComponent,
    ProgramFactsComponent,
    ReviewsGroupByProgramComponent,
    ScoreDetailCardComponent,
    UserTypeSelectorComponent,
  ],
})
export class ProgramDetailPage implements OnInit {
  private programsApi = inject(ProgramsApi);
  private reviewsApi = inject(ReviewsApi);
  private auth = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private reviewsRequest?: Subscription;

  // The :id of the URL (withComponentInputBinding in main.ts).
  id = input.required<string>();

  // ── The program ──
  program = signal<Program | null>(null);
  error = signal<string | null>(null);

  genreLabels = computed(() => (this.program()?.genres ?? []).map((genre) => GENRE_LABELS[genre]));
  // Blurred poster behind the header; a solid tone when there's no image.
  heroImage = computed(() => {
    const url = this.program()?.posterUrl;
    return url ? `url("${url}")` : 'none';
  });
  heroTone = computed(() => posterTone(this.program()?.title ?? ''));

  // ── Reviews list (Critics / Audience) ──
  reviewGroup = signal<ReviewGroup>('critics');
  reviews = signal<ProgramReview[]>([]);
  reviewsTotal = signal(0);
  reviewsPage = signal(1);
  reviewsLoading = signal(false);
  reviewsError = signal<string | null>(null);
  hasMoreReviews = computed(() => this.reviews().length < this.reviewsTotal());

  // ── My review + the Write a review popup ──
  myReview = signal<Review | null>(null);
  sheetOpen = signal(false);
  saving = signal(false);
  sheetError = signal<string | null>(null);
  userType = computed(() => this.auth.user()?.type ?? UserType.NORMAL);
  // Tapping my own review in the list opens My profile instead of the public profile.
  myUserId = computed(() => this.auth.user()?._id ?? null);
  reviewButtonLabel = computed(() => (this.myReview() ? 'Edit your review' : 'Write a review'));

  constructor() {
    addIcons({ createOutline });

    // Now and every time Critics / Audience changes: reload the list from page 1.
    effect(() => {
      this.reviewGroup();
      untracked(() => this.loadReviews(1));
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error.set(null);
    this.programsApi.getById(this.id()).subscribe({
      next: (program) => this.program.set(program),
      error: (err: unknown) => this.error.set(apiErrorMessage(err)),
    });
    // If this fails, the button just says "Write a review"; the API will answer 409 if one exists.
    this.reviewsApi.getMine(this.id()).subscribe({
      next: (review) => this.myReview.set(review),
      error: () => this.myReview.set(null),
    });
  }

  loadReviews(page: number): void {
    this.reviewsRequest?.unsubscribe();
    this.reviewsLoading.set(true);
    this.reviewsError.set(null);
    if (page === 1) this.reviews.set([]);

    this.reviewsRequest = this.reviewsApi.listByProgram(this.id(), this.reviewGroup(), page).subscribe({
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

  openSheet(): void {
    this.sheetError.set(null);
    this.sheetOpen.set(true);
  }

  // New review → POST /programs/:id/reviews. Existing one → PATCH /reviews/:id.
  saveReview(input: ReviewInput): void {
    const mine = this.myReview();
    const request = mine ? this.reviewsApi.update(mine._id, input) : this.reviewsApi.create(this.id(), input);
    this.runReviewAction(
      request,
      (review) => this.myReview.set(review),
      mine ? 'Review updated.' : 'Review published.',
    );
  }

  // DELETE /reviews/:id (the popup already asked for confirmation).
  deleteReview(): void {
    const mine = this.myReview();
    if (!mine) return;
    this.runReviewAction(this.reviewsApi.remove(mine._id), () => this.myReview.set(null), 'Review deleted.');
  }

  private runReviewAction<T>(request: Observable<T>, onDone: (result: T) => void, message: string): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.sheetError.set(null);

    request.subscribe({
      next: (result) => {
        onDone(result);
        this.saving.set(false);
        this.sheetOpen.set(false);
        void this.showToast(message);
        this.refreshAfterReview();
      },
      error: (err: unknown) => {
        this.sheetError.set(apiErrorMessage(err));
        this.saving.set(false);
      },
    });
  }

  // The averages and the list change after a review: ask for them again (without the spinner).
  private refreshAfterReview(): void {
    this.programsApi.getById(this.id()).subscribe({ next: (program) => this.program.set(program) });
    this.loadReviews(1);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'top' });
    await toast.present();
  }
}
