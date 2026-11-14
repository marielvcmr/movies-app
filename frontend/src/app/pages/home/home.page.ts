import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRouterLinkWithHref,
  IonSpinner,
} from '@ionic/angular';
import type { InfiniteScrollCustomEvent } from '@ionic/angular';
import type { Subscription } from 'rxjs';

import { apiErrorMessage } from '../../api/api-error';
import { ProgramsApi } from '../../api/programs.api';
import { ActiveFiltersComponent } from '../../components/active-filters/active-filters.component';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';
import { ProgramHomeCardComponent } from '../../components/program-home-card/program-home-card.component';
import { ProgramSelectorComponent } from '../../components/program-selector/program-selector.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchFilterComponent } from '../../components/search-filter/search-filter.component';
import { DEFAULT_FILTERS } from '../../constants/filters';
import type { Program, ProgramFilters, ProgramType } from '../../models/program.model';

// Home: Movies / Series tabs, search, filters and the grid of cards.
// The page owns the state (type, query, filters) and loads the list; the components only
// show it and report changes with two-way bindings like [(type)].
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    RouterLink,
    IonRouterLinkWithHref,
    HomeHeaderComponent,
    ProgramSelectorComponent,
    SearchBarComponent,
    SearchFilterComponent,
    ActiveFiltersComponent,
    ProgramHomeCardComponent,
  ],
})
export class HomePage {
  private programsApi = inject(ProgramsApi);
  private request?: Subscription;

  // What the user chose
  type = signal<ProgramType>('movie');
  query = signal('');
  filters = signal<ProgramFilters>(DEFAULT_FILTERS);

  // What the API answered
  programs = signal<Program[]>([]);
  total = signal(0);
  page = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  hasMore = computed(() => this.programs().length < this.total());
  searchPlaceholder = computed(() => (this.type() === 'movie' ? 'Search movies by name' : 'Search series by name'));
  // "10 movies". The sort and the other filters are shown as chips by <app-active-filters>.
  summary = computed(() => {
    const total = this.total();
    const noun = this.type() === 'series' ? 'series' : total === 1 ? 'movie' : 'movies';
    return `${total} ${noun}`;
  });

  constructor() {
    // Runs now and every time the tab, the search text or the filters change:
    // load the list again from page 1. `untracked` = don't re-run when load() changes other signals.
    effect(() => {
      this.type();
      this.query();
      this.filters();
      untracked(() => this.load(1));
    });
  }

  // Infinite scroll reached the bottom: ask for the next page.
  loadMore(event: InfiniteScrollCustomEvent): void {
    this.load(this.page() + 1, () => void event.target.complete());
  }

  retry(): void {
    this.load(1);
  }

  private load(page: number, done?: () => void): void {
    // If an older request is still running (e.g. the user kept typing), drop it.
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);
    if (page === 1) this.programs.set([]);

    this.request = this.programsApi
      .list({ type: this.type(), q: this.query(), filters: this.filters(), page })
      .subscribe({
        next: (result) => {
          this.programs.update((list) => (page === 1 ? result.data : [...list, ...result.data]));
          this.total.set(result.total);
          this.page.set(page);
          this.loading.set(false);
          done?.();
        },
        error: (err: unknown) => {
          this.error.set(apiErrorMessage(err));
          this.loading.set(false);
          done?.();
        },
      });
  }
}
