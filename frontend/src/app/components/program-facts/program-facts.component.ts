import { Component, computed, input } from '@angular/core';

import type { Program } from '../../models/program.model';
import { formatCount, formatDate, formatMinutes } from '../../utils/format';

interface Fact {
  label: string;
  value: string;
}

// The "label → value" list in Details: release date, plus duration (movies)
// or number of seasons (series). Rows without data are left out.
// <app-program-facts [program]="program" />
@Component({
  selector: 'app-program-facts',
  templateUrl: './program-facts.component.html',
  styleUrls: ['./program-facts.component.scss'],
})
export class ProgramFactsComponent {
  program = input.required<Program>();

  facts = computed<Fact[]>(() => {
    const program = this.program();
    const rows: { label: string; value: string | null }[] = [
      { label: 'Released', value: formatDate(program.releaseDate) },
      program.type === 'movie'
        ? { label: 'Duration', value: formatMinutes(program.durationMin) }
        : { label: 'Seasons', value: formatCount(program.seasonsCount, 'season') },
    ];
    return rows.filter((row): row is Fact => row.value !== null);
  });
}
