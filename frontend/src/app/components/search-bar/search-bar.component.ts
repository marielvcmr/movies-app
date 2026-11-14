import { Component, input, output } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import type { SearchbarCustomEvent } from '@ionic/angular';

// Search field. It waits until the user stops typing (`debounce` ms) before emitting,
// so the page doesn't call the API on every letter.
// Usage: <app-search-bar [(query)]="query" placeholder="Search movies by name" />
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonSearchbar],
})
export class SearchBarComponent {
  query = input('');
  queryChange = output<string>();
  placeholder = input('Search by name');
  debounce = input(350);

  onInput(event: SearchbarCustomEvent): void {
    this.queryChange.emit(event.detail.value ?? '');
  }
}
