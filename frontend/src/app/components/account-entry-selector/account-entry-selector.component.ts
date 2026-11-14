import { Component, input, output } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular';

import type { AccountMode } from '../../models/auth.model';

// Log in / Sign up switch. It does not decide what the screen shows: it only
// reports the choice, and the page that holds it swaps the form.
// Usage with two-way binding: <app-account-entry-selector [(mode)]="mode" />
@Component({
  selector: 'app-account-entry-selector',
  templateUrl: './account-entry-selector.component.html',
  styleUrls: ['./account-entry-selector.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel],
})
export class AccountEntrySelectorComponent {
  mode = input.required<AccountMode>();
  modeChange = output<AccountMode>(); // the "Change" suffix enables [(mode)]

  select(value: unknown): void {
    if ((value === 'login' || value === 'signup') && value !== this.mode()) {
      this.modeChange.emit(value);
    }
  }
}
