import { Component, computed, input } from '@angular/core';

// One actor: a circle with the initial + the name.
// <app-actor-chip name="Zendaya" />
@Component({
  selector: 'app-actor-chip',
  templateUrl: './actor-chip.component.html',
  styleUrls: ['./actor-chip.component.scss'],
})
export class ActorChipComponent {
  name = input.required<string>();

  initial = computed(() => this.name().trim().charAt(0).toUpperCase());
}
