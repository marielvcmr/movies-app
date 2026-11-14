import { Component, computed, input } from '@angular/core';

import { toStars } from '../../utils/stars';

const BANDS = [
  { stars: 1, range: '1–20' },
  { stars: 2, range: '21–40' },
  { stars: 3, range: '41–60' },
  { stars: 4, range: '61–80' },
  { stars: 5, range: '81–100' },
];

// The 5 boxes under the score slider that explain the scale (1–20 = 1 star ... 81–100 = 5 stars).
// The box of the current score is highlighted in yellow.
// <app-score-stars [points]="points" />
@Component({
  selector: 'app-score-stars',
  templateUrl: './score-stars.component.html',
  styleUrls: ['./score-stars.component.scss'],
})
export class ScoreStarsComponent {
  points = input.required<number>();

  bands = computed(() => {
    const current = toStars(this.points());
    return BANDS.map((band) => ({
      ...band,
      label: band.stars === 1 ? '1 star' : `${band.stars} stars`,
      active: band.stars === current,
    }));
  });
}
