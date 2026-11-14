import { Component, computed, input, linkedSignal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { filmOutline, tvOutline } from 'ionicons/icons';

import { PROGRAM_TYPE_ICONS } from '../../constants/icons';
import type { Program } from '../../models/program.model';
import { posterTone } from '../../utils/poster-tone';

// Only what the poster needs, so any object with these 3 fields works.
export type PosterData = Pick<Program, 'title' | 'type' | 'posterUrl'>;

export type PosterSize = 'large' | 'small';

// The poster of a movie or series: the OMDb image, or a colored box with the title when
// there's no image (or it fails to load). The corner icon depends on the type:
// clapperboard for movies, TV for series.
// The parent decides the width; the height follows (2:3, like a real poster).
// <app-program-card-simple [program]="p" />               → Home cards
// <app-program-card-simple [program]="p" size="small" />  → Details header, My review
@Component({
  selector: 'app-program-card-simple',
  templateUrl: './program-card-simple.component.html',
  styleUrls: ['./program-card-simple.component.scss'],
  imports: [IonIcon],
  host: { '[class]': "'size-' + size()" },
})
export class ProgramCardSimpleComponent {
  program = input.required<PosterData>();
  size = input<PosterSize>('large');

  // Back to false every time the poster URL changes, true if that image fails.
  imageFailed = linkedSignal({ source: () => this.program().posterUrl, computation: () => false });

  showImage = computed(() => !!this.program().posterUrl && !this.imageFailed());
  icon = computed(() => PROGRAM_TYPE_ICONS[this.program().type]);
  tone = computed(() => posterTone(this.program().title));

  constructor() {
    addIcons({ filmOutline, tvOutline });
  }
}
