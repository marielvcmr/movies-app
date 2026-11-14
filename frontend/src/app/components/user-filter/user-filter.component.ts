import { Component, input, output } from '@angular/core';

import { USER_FILTER_OPTIONS } from '../../constants/labels';
import type { UserType } from '../../models/user.model';

// Chips under the search bar of the Users module: All / Normal / Critics.
// Only one is on at a time. null = All (no type filter).
// Usage with two-way binding: <app-user-filter [(type)]="type" />
@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
})
export class UserFilterComponent {
  type = input<UserType | null>(null);
  typeChange = output<UserType | null>();

  readonly options = USER_FILTER_OPTIONS;

  pick(value: UserType | null): void {
    if (value !== this.type()) this.typeChange.emit(value);
  }
}
