import { Component, input } from '@angular/core';

// A row of outlined, rounded labels that wraps to the next line (categories in Details).
// <app-chip-list [items]="genreLabels" />
// Actors have their own component: actor-list.
@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
})
export class ChipListComponent {
  items = input.required<string[]>();
}
