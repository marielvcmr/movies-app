import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

import { toStars } from '../../utils/stars';

const MAX_STARS = 5;

// The 5 stars. Give it a score or a number of stars:
// <app-star-rating [points]="92" />      → 5 filled (92 points = 5 stars)
// <app-star-rating [stars]="3" />        → 3 filled
// <app-star-rating [points]="x" [size]="20" />
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  imports: [IonIcon],
  host: { '[style.--star-size.px]': 'size()' },
})
export class StarRatingComponent {
  points = input<number | null>(null);
  stars = input<number | null>(null);
  size = input(16);

  filled = computed(() => this.stars() ?? toStars(this.points()));
  icons = computed(() => Array.from({ length: MAX_STARS }, (_, i) => (i < this.filled() ? 'star' : 'star-outline')));
  label = computed(() => `${this.filled()} of ${MAX_STARS} stars`);

  constructor() {
    addIcons({ star, starOutline });
  }
}
