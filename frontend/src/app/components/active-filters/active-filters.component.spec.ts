import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_FILTERS } from '../../constants/filters';
import type { ProgramFilters } from '../../models/program.model';

import { ActiveFiltersComponent, filterChips } from './active-filters.component';

const ALL_ON: ProgramFilters = {
  sort: 'critics',
  genres: ['action', 'science_fiction'],
  yearFrom: 2000,
  yearTo: 2010,
  minCriticsStars: 3,
  minAudienceStars: 4,
};

describe('filterChips', () => {
  it('shows only the default sort, which cannot be removed', () => {
    const chips = filterChips(DEFAULT_FILTERS);
    expect(chips.map((c) => c.label)).toEqual(['Newest first']);
    expect(chips[0].without).toBeNull();
  });

  it('shows one chip per active filter, in the popup order', () => {
    expect(filterChips(ALL_ON).map((c) => c.label)).toEqual([
      'Critics score',
      'Action',
      'Sci-Fi',
      '2000 – 2010',
      'Critics 3★+',
      'Audience 4★+',
    ]);
  });

  it('labels an open year range', () => {
    expect(filterChips({ ...DEFAULT_FILTERS, yearFrom: 2015 })[1].label).toBe('From 2015');
    expect(filterChips({ ...DEFAULT_FILTERS, yearTo: 1999 })[1].label).toBe('Until 1999');
  });

  it('removing a category keeps the other filters', () => {
    const action = filterChips(ALL_ON).find((c) => c.id === 'genre-action');
    expect(action?.without).toEqual({ ...ALL_ON, genres: ['science_fiction'] });
  });
});

describe('ActiveFiltersComponent', () => {
  let fixture: ComponentFixture<ActiveFiltersComponent>;
  let component: ActiveFiltersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ActiveFiltersComponent] }).compileComponents();
    fixture = TestBed.createComponent(ActiveFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filters', ALL_ON);
    fixture.detectChanges();
  });

  it('emits the filters without the tapped chip', () => {
    const emitted: ProgramFilters[] = [];
    component.filtersChange.subscribe((f) => emitted.push(f));

    const yearButton = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-label="Remove filter 2000 – 2010"]',
    );
    yearButton?.click();

    expect(emitted).toEqual([{ ...ALL_ON, yearFrom: null, yearTo: null }]);
  });

  it('"Clear" goes back to the defaults', () => {
    const emitted: ProgramFilters[] = [];
    component.filtersChange.subscribe((f) => emitted.push(f));

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button.clear')?.click();

    expect(emitted).toEqual([DEFAULT_FILTERS]);
  });
});
