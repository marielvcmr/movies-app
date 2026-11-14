import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, ribbonOutline } from 'ionicons/icons';

import { REVIEW_GROUP_ICONS } from '../../constants/icons';
import { GENRE_LABELS } from '../../constants/labels';
import type { Program } from '../../models/program.model';
import { formatScore } from '../../utils/format';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';

// One card of the Home grid: poster (program-card-simple) + title, year, first two
// categories and the two averages. The same card for movies and series.
// The page wraps it in a link to Details: <a [routerLink]="..."><app-program-home-card [program]="p" /></a>
@Component({
  selector: 'app-program-home-card',
  templateUrl: './program-home-card.component.html',
  styleUrls: ['./program-home-card.component.scss'],
  imports: [IonIcon, ProgramCardSimpleComponent],
})
export class ProgramHomeCardComponent {
  program = input.required<Program>();

  readonly icons = REVIEW_GROUP_ICONS;

  genreText = computed(() =>
    this.program()
      .genres.slice(0, 2)
      .map((genre) => GENRE_LABELS[genre])
      .join(', '),
  );
  critics = computed(() => formatScore(this.program().pointsMeanCritics));
  audience = computed(() => formatScore(this.program().pointsMeanNormal));

  constructor() {
    addIcons({ ribbonOutline, peopleOutline });
  }
}
