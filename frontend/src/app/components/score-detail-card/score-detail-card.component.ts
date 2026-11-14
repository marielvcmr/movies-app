import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, ribbonOutline } from 'ionicons/icons';

import { REVIEW_GROUP_ICONS } from '../../constants/icons';
import { REVIEW_GROUP_LABELS } from '../../constants/labels';
import type { ReviewGroup } from '../../models/review.model';
import { formatCount, formatScore } from '../../utils/format';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// One average of a program in Details. `group` picks which one it is:
//   group="critics"  → reviews by critic users, red badge icon   ([points] = pointsMeanCritics)
//   group="audience" → reviews by standard users, yellow people icon ([points] = pointsMeanNormal)
// <app-score-detail-card group="critics" [points]="p.pointsMeanCritics" />
// `count` (number of reviews) is optional: the API doesn't send it yet.
@Component({
  selector: 'app-score-detail-card',
  templateUrl: './score-detail-card.component.html',
  styleUrls: ['./score-detail-card.component.scss'],
  imports: [IonIcon, StarRatingComponent],
  host: { '[class]': 'group()' },
})
export class ScoreDetailCardComponent {
  group = input.required<ReviewGroup>();
  points = input.required<number | null>();
  count = input<number | null>(null);

  label = computed(() => REVIEW_GROUP_LABELS[this.group()]);
  icon = computed(() => REVIEW_GROUP_ICONS[this.group()]);
  score = computed(() => formatScore(this.points()));
  hasScore = computed(() => this.points() !== null);

  countText = computed(() => {
    if (!this.hasScore()) return 'No reviews yet';
    return formatCount(this.count(), 'review');
  });

  constructor() {
    addIcons({ ribbonOutline, peopleOutline });
  }
}
