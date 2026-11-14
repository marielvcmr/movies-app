import { Component, computed, input } from '@angular/core';

import { PROGRAM_TYPE_LABELS } from '../../constants/labels';
import type { Program } from '../../models/program.model';
import { formatProgramLength } from '../../utils/format';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';

// Which program you're reviewing: mini poster (program-card-simple size="mini") + title
// + "Movie · 2024 · 166 min". Top of the Write a review popup; later, the review lists of the profiles.
// <app-program-review-card [program]="program" />
@Component({
  selector: 'app-program-review-card',
  templateUrl: './program-review-card.component.html',
  styleUrls: ['./program-review-card.component.scss'],
  imports: [ProgramCardSimpleComponent],
})
export class ProgramReviewCardComponent {
  program = input.required<Program>();

  // "Movie · 2024 · 166 min" — the parts it doesn't have are left out.
  meta = computed(() => {
    const program = this.program();
    return [PROGRAM_TYPE_LABELS[program.type], String(program.year), formatProgramLength(program)]
      .filter(Boolean)
      .join(' · ');
  });
}
