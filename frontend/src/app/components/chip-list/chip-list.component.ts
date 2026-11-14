import { Component, input } from '@angular/core';

// A row of rounded labels that wraps to the next line. One component, two looks:
// <app-chip-list [items]="genreLabels" />                 → categories (outlined)
// <app-chip-list [items]="actors" [avatars]="true" />     → actors (filled, with their initial)
@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  host: { '[class.with-avatars]': 'avatars()' },
})
export class ChipListComponent {
  items = input.required<string[]>();
  avatars = input(false);
}
