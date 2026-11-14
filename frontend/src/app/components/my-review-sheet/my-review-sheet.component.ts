import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AlertController, IonContent, IonFooter, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, trashOutline } from 'ionicons/icons';

import { REVIEW_POINTS_DEFAULT } from '../../constants/review-limits';
import type { ProgramSummary } from '../../models/program.model';
import type { Review, ReviewInput } from '../../models/review.model';
import { UserType } from '../../models/user.model';
import { ButtonComponent } from '../button/button.component';
import { MyCommentSectionComponent } from '../my-comment-section/my-comment-section.component';
import { MyScoreCardComponent } from '../my-score-card/my-score-card.component';
import { ProgramReviewCardComponent } from '../program-review-card/program-review-card.component';

// "Write a review" popup (a bottom sheet, like the filters one). Inside:
//   program-review-card  → which program
//   my-score-card        → 1–100 slider with live stars (+ score-stars scale)
//   my-comment-section   → optional comment, max 300
//   Delete review        → only when editing
// Without `review` it creates one ("Your review" / "Publish review"); with `review` it edits it
// ("Edit review" / "Cancel" + "Save changes"). It doesn't call the API: it emits and the page does.
// Used by Details and by My profile; `program` can be a full Program or a ProgramSummary.
// <app-my-review-sheet [isOpen]="open" [program]="p" [review]="mine" [userType]="type"
//                      [busy]="saving" [error]="err"
//                      (submitted)="save($event)" (deleted)="delete()" (closed)="open = false" />
@Component({
  selector: 'app-my-review-sheet',
  templateUrl: './my-review-sheet.component.html',
  styleUrls: ['./my-review-sheet.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonIcon,
    ButtonComponent,
    ProgramReviewCardComponent,
    MyScoreCardComponent,
    MyCommentSectionComponent,
  ],
})
export class MyReviewSheetComponent {
  private alertCtrl = inject(AlertController);

  isOpen = input(false);
  program = input.required<ProgramSummary>();
  // Only points and comment are used, so a Review (Details) or a UserReview (My profile) both work.
  review = input<Pick<Review, 'points' | 'comment'> | null>(null);
  userType = input<UserType>(UserType.NORMAL);
  busy = input(false);
  error = input<string | null>(null);

  submitted = output<ReviewInput>();
  deleted = output<void>();
  closed = output<void>();

  // What the user is editing; filled every time the popup opens.
  points = signal(REVIEW_POINTS_DEFAULT);
  comment = signal('');

  isEdit = computed(() => this.review() !== null);
  heading = computed(() => (this.isEdit() ? 'Edit review' : 'Your review'));
  saveLabel = computed(() => (this.isEdit() ? 'Save changes' : 'Publish review'));

  constructor() {
    addIcons({ closeOutline, trashOutline });
  }

  // Before showing: start from the existing review, or from scratch.
  prepare(): void {
    const review = this.review();
    this.points.set(review?.points ?? REVIEW_POINTS_DEFAULT);
    this.comment.set(review?.comment ?? '');
  }

  submit(): void {
    if (this.busy()) return;
    const comment = this.comment().trim();
    this.submitted.emit({ points: this.points(), comment: comment || null });
  }

  async askDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete your review?',
      message: 'Your score and comment will be removed and the averages will be updated.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => this.deleted.emit() },
      ],
    });
    await alert.present();
  }
}
