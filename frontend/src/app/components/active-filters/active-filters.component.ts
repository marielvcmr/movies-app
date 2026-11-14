import { Component, computed, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, peopleOutline, ribbonOutline, swapVerticalOutline } from 'ionicons/icons';

import { DEFAULT_FILTERS } from '../../constants/filters';
import { REVIEW_GROUP_ICONS } from '../../constants/icons';
import { GENRE_LABELS, SORT_LABELS } from '../../constants/labels';
import type { ProgramFilters } from '../../models/program.model';

// One chip of the row. `without` = the filters after removing this chip (null = can't be removed).
export interface FilterChip {
  id: string;
  label: string;
  icon?: string;
  group?: 'critics' | 'audience'; // colors the icon (red badge / yellow people)
  without: ProgramFilters | null;
}

// Filters → chips, in the same order as the popup: sort, categories, year, critics, audience.
// The sort chip is always there (it says how the list is ordered); the default one can't be removed.
export function filterChips(filters: ProgramFilters): FilterChip[] {
  const chips: FilterChip[] = [
    {
      id: 'sort',
      label: SORT_LABELS[filters.sort],
      icon: 'swap-vertical-outline',
      without: filters.sort === DEFAULT_FILTERS.sort ? null : { ...filters, sort: DEFAULT_FILTERS.sort },
    },
  ];

  for (const genre of filters.genres) {
    chips.push({
      id: `genre-${genre}`,
      label: GENRE_LABELS[genre],
      without: { ...filters, genres: filters.genres.filter((g) => g !== genre) },
    });
  }

  const { yearFrom, yearTo } = filters;
  if (yearFrom !== null || yearTo !== null) {
    const label =
      yearFrom !== null && yearTo !== null
        ? yearFrom === yearTo
          ? `${yearFrom}`
          : `${yearFrom} – ${yearTo}`
        : yearFrom !== null
          ? `From ${yearFrom}`
          : `Until ${yearTo}`;
    chips.push({ id: 'year', label, without: { ...filters, yearFrom: null, yearTo: null } });
  }

  if (filters.minCriticsStars > 0) {
    chips.push({
      id: 'critics',
      label: `Critics ${filters.minCriticsStars}★+`,
      icon: REVIEW_GROUP_ICONS.critics,
      group: 'critics',
      without: { ...filters, minCriticsStars: 0 },
    });
  }

  if (filters.minAudienceStars > 0) {
    chips.push({
      id: 'audience',
      label: `Audience ${filters.minAudienceStars}★+`,
      icon: REVIEW_GROUP_ICONS.audience,
      group: 'audience',
      without: { ...filters, minAudienceStars: 0 },
    });
  }

  return chips;
}

// Row of chips under the search bar with the filters that are on. Tapping the × of a chip
// removes that filter; "Clear" goes back to the defaults. The page reloads the list by itself.
// Usage: <app-active-filters [(filters)]="filters" />
@Component({
  selector: 'app-active-filters',
  templateUrl: './active-filters.component.html',
  styleUrls: ['./active-filters.component.scss'],
  imports: [IonIcon],
})
export class ActiveFiltersComponent {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();

  chips = computed(() => filterChips(this.filters()));
  // "Clear" only makes sense with two or more removable chips (with one, its × is enough).
  canClear = computed(() => this.chips().filter((chip) => chip.without).length > 1);

  constructor() {
    addIcons({ closeOutline, swapVerticalOutline, ribbonOutline, peopleOutline });
  }

  remove(chip: FilterChip): void {
    if (chip.without) this.filtersChange.emit(chip.without);
  }

  clear(): void {
    this.filtersChange.emit(DEFAULT_FILTERS);
  }
}
