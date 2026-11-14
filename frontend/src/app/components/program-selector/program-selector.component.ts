import { Component, input, output } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';

import { PROGRAM_TYPE_PLURAL_LABELS } from '../../constants/labels';
import { ProgramType } from '../../models/program.model';

// Movies / Series switch on Home. Same idea as account-entry-selector: it only reports
// the choice and the page reloads the list.
// Usage with two-way binding: <app-program-selector [(type)]="type" />
@Component({
  selector: 'app-program-selector',
  templateUrl: './program-selector.component.html',
  styleUrls: ['./program-selector.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel],
})
export class ProgramSelectorComponent {
  type = input.required<ProgramType>();
  typeChange = output<ProgramType>(); // the "Change" suffix enables [(type)]

  // One button per ProgramType value: movie → "Movies", series → "Series".
  readonly options = Object.values(ProgramType).map((value) => ({
    value,
    label: PROGRAM_TYPE_PLURAL_LABELS[value],
  }));

  select(value: unknown): void {
    const isProgramType = this.options.some((option) => option.value === value);
    if (isProgramType && value !== this.type()) {
      this.typeChange.emit(value as ProgramType);
    }
  }
}
