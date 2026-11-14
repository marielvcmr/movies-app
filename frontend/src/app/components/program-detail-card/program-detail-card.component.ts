import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { filmOutline, tvOutline } from 'ionicons/icons';

import { PROGRAM_TYPE_ICONS } from '../../constants/icons';
import { PROGRAM_TYPE_LABELS } from '../../constants/labels';
import type { Program } from '../../models/program.model';
import { formatCount, formatMinutes } from '../../utils/format';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';

// Top of Details: small poster (program-card-simple size="small") + type badge,
// title, and "year · duration" for movies or "year · seasons" for series.
// <app-program-detail-card [program]="program" />
@Component({
  selector: 'app-program-detail-card',
  templateUrl: './program-detail-card.component.html',
  styleUrls: ['./program-detail-card.component.scss'],
  imports: [IonIcon, ProgramCardSimpleComponent],
})
export class ProgramDetailCardComponent {
  program = input.required<Program>();

  typeLabel = computed(() => PROGRAM_TYPE_LABELS[this.program().type]);
  typeIcon = computed(() => PROGRAM_TYPE_ICONS[this.program().type]);

  // "166 min" or "2 seasons"; null when OMDb didn't give it.
  length = computed(() => {
    const program = this.program();
    return program.type === 'movie' ? formatMinutes(program.durationMin) : formatCount(program.seasonsCount, 'season');
  });

  constructor() {
    addIcons({ filmOutline, tvOutline });
  }
}
