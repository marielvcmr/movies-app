import { Component, input } from '@angular/core';

import { ActorChipComponent } from '../actor-chip/actor-chip.component';

// The actors of a program, one actor-chip each, wrapping to the next line.
// <app-actor-list [actors]="program.actors" />
@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.scss'],
  imports: [ActorChipComponent],
})
export class ActorListComponent {
  actors = input.required<string[]>();
}
