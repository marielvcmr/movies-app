import { Component, computed, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';

import { REVIEW_COMMENT_MAX } from '../../constants/review-limits';
import { UserType } from '../../models/user.model';

// "Comment (optional)" of the Write a review popup: text box with a 0/300 counter, and a note
// saying which average the review counts toward, which depends on who is writing it:
//   userType="critic"            → "...counts toward the Critics score."
//   userType="normal" | "admin"  → "...counts toward the Audience score."
// Usage with two-way binding: <app-my-comment-section [(comment)]="comment" [userType]="user.type" />
@Component({
  selector: 'app-my-comment-section',
  templateUrl: './my-comment-section.component.html',
  styleUrls: ['./my-comment-section.component.scss'],
  imports: [IonIcon],
})
export class MyCommentSectionComponent {
  comment = input.required<string>();
  commentChange = output<string>();
  userType = input<UserType>(UserType.NORMAL);

  readonly maxLength = REVIEW_COMMENT_MAX;

  counter = computed(() => `${this.comment().length}/${this.maxLength}`);
  countsToward = computed(() =>
    this.userType() === UserType.CRITIC
      ? 'You are a critic: this review counts toward the Critics score.'
      : 'This review counts toward the Audience score.',
  );

  constructor() {
    addIcons({ informationCircleOutline });
  }

  onInput(event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    this.commentChange.emit(text.slice(0, this.maxLength));
  }
}
