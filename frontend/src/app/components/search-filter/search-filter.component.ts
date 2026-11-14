import { Component, computed, input, output, signal } from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from '@ionic/angular';
import type { RangeCustomEvent, SelectCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, optionsOutline, peopleOutline, ribbonOutline } from 'ionicons/icons';

import { DEFAULT_FILTERS, STARS_MAX, YEAR_MAX, YEAR_MIN } from '../../constants/filters';
import { REVIEW_GROUP_ICONS } from '../../constants/icons';
import { GENRE_LABELS, SORT_LABELS } from '../../constants/labels';
import type { ProgramFilters } from '../../models/program.model';
import { Genre, ProgramSort } from '../../models/program.model';
import { ButtonComponent } from '../button/button.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

type StarsKey = 'minCriticsStars' | 'minAudienceStars';

// How many filters differ from the defaults (the red number on the button).
export function countActiveFilters(filters: ProgramFilters): number {
  return [
    filters.sort !== DEFAULT_FILTERS.sort,
    filters.genres.length > 0,
    filters.yearFrom !== null || filters.yearTo !== null,
    filters.minCriticsStars > 0,
    filters.minAudienceStars > 0,
  ].filter(Boolean).length;
}

// Filter button + the popup it opens (a bottom sheet). Inside the popup the user edits a
// copy (`draft`); only "Apply" sends it to the page. Closing it any other way discards it.
// Usage: <app-search-filter [(filters)]="filters" />
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  imports: [
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonRange,
    IonSelect,
    IonSelectOption,
    ButtonComponent,
    StarRatingComponent,
  ],
})
export class SearchFilterComponent {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();

  isOpen = signal(false);
  draft = signal<ProgramFilters>(DEFAULT_FILTERS);

  readonly yearMin = YEAR_MIN;
  readonly yearMax = YEAR_MAX;
  readonly starsMax = STARS_MAX;
  readonly sortOptions = Object.values(ProgramSort).map((value) => ({ value, label: SORT_LABELS[value] }));
  // The two star sliders are the same block with a different key, label and icon.
  // To keep only one, delete its line.
  readonly starSliders: { key: StarsKey; label: string; icon: string; group: string }[] = [
    { key: 'minCriticsStars', label: 'Min. critics stars', icon: REVIEW_GROUP_ICONS.critics, group: 'critics' },
    { key: 'minAudienceStars', label: 'Min. audience stars', icon: REVIEW_GROUP_ICONS.audience, group: 'audience' },
  ];
  readonly genreLabels = GENRE_LABELS;

  activeCount = computed(() => countActiveFilters(this.filters()));

  // The dropdown only offers the categories that aren't added yet.
  availableGenres = computed(() =>
    Object.values(Genre)
      .filter((genre) => !this.draft().genres.includes(genre))
      .map((genre) => ({ value: genre, label: GENRE_LABELS[genre] })),
  );

  yearRange = computed(() => ({
    lower: this.draft().yearFrom ?? YEAR_MIN,
    upper: this.draft().yearTo ?? YEAR_MAX,
  }));

  yearLabel = computed(() => {
    const { yearFrom, yearTo } = this.draft();
    if (yearFrom === null && yearTo === null) return 'Any year';
    return `${yearFrom ?? YEAR_MIN} – ${yearTo ?? YEAR_MAX}`;
  });

  constructor() {
    addIcons({ optionsOutline, closeOutline, ribbonOutline, peopleOutline });
  }

  open(): void {
    this.draft.set({ ...this.filters(), genres: [...this.filters().genres] });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  apply(): void {
    this.filtersChange.emit(this.draft());
    this.close();
  }

  reset(): void {
    this.draft.set(DEFAULT_FILTERS);
  }

  setSort(sort: ProgramSort): void {
    this.draft.update((f) => ({ ...f, sort }));
  }

  // Picking a category in the dropdown adds it as a chip, then the dropdown empties
  // again so another one can be added.
  addGenre(event: SelectCustomEvent<Genre | null>): void {
    const genre = event.detail.value;
    if (genre && !this.draft().genres.includes(genre)) {
      this.draft.update((f) => ({ ...f, genres: [...f.genres, genre] }));
    }
    event.target.value = null;
  }

  removeGenre(genre: Genre): void {
    this.draft.update((f) => ({ ...f, genres: f.genres.filter((g) => g !== genre) }));
  }

  // A knob left at an end of the slider means "no limit" → null.
  onYearChange(event: RangeCustomEvent): void {
    const { lower, upper } = event.detail.value as { lower: number; upper: number };
    this.draft.update((f) => ({
      ...f,
      yearFrom: lower <= YEAR_MIN ? null : lower,
      yearTo: upper >= YEAR_MAX ? null : upper,
    }));
  }

  onStarsChange(key: StarsKey, event: RangeCustomEvent): void {
    const stars = event.detail.value as number;
    this.draft.update((f) => ({ ...f, [key]: stars }));
  }
}
