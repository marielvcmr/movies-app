import { Component, input, output } from '@angular/core';
import { IonRange } from '@ionic/angular';
import type { RangeCustomEvent } from '@ionic/angular';

import { REVIEW_POINTS_MAX, REVIEW_POINTS_MIN } from '../../constants/review-limits';
import { ScoreStarsComponent } from '../score-stars/score-stars.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// "Your score" box of the Write a review popup: big number, live stars (star-rating),
// a 1–100 slider and the scale (score-stars). The stars update while the knob moves.
// Usage with two-way binding: <app-my-score-card [(points)]="points" />
@Component({
  selector: 'app-my-score-card',
  templateUrl: './my-score-card.component.html',
  styleUrls: ['./my-score-card.component.scss'],
  imports: [IonRange, StarRatingComponent, ScoreStarsComponent],
})
export class MyScoreCardComponent {
  points = input.required<number>();
  pointsChange = output<number>();

  readonly min = REVIEW_POINTS_MIN;
  readonly max = REVIEW_POINTS_MAX;

  // ionInput fires while dragging (ionChange only when the knob is released).
  onInput(event: RangeCustomEvent): void {
    this.pointsChange.emit(event.detail.value as number);
  }
}
