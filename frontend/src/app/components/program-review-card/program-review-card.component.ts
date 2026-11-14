import { Component, computed, input } from '@angular/core';

import { PROGRAM_TYPE_LABELS } from '../../constants/labels';
import type { ProgramSummary } from '../../models/program.model';
import { formatProgramLength } from '../../utils/format';
import { ProgramCardSimpleComponent } from '../program-card-simple/program-card-simple.component';

// Which program you're reviewing: mini poster (program-card-simple size="mini") + title
// + "Movie · 2024 · 166 min". Top of the Write a review popup (from Details and from My profile).
// Takes a full Program or the summary of the profile lists; without the length it shows "Movie · 2024".
// <app-program-review-card [program]="program" />
@Component({
  selector: 'app-program-review-card',
  templateUrl: './program-review-card.component.html',
  styleUrls: ['./program-review-card.component.scss'],
  imports: [ProgramCardSimpleComponent],
})
export class ProgramReviewCardComponent {
  program = input.required<ProgramSummary>();

  // "Movie · 2024 · 166 min" — the parts it doesn't have are left out.
  meta = computed(() => {
    const program = this.program();
    return [PROGRAM_TYPE_LABELS[program.type], String(program.year), formatProgramLength(program)]
      .filter(Boolean)
      .join(' · ');
  });
}
