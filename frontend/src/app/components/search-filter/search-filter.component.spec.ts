import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { RangeCustomEvent, SelectCustomEvent } from '@ionic/angular';

import { DEFAULT_FILTERS, YEAR_MAX, YEAR_MIN } from '../../constants/filters';
import type { Genre, ProgramFilters } from '../../models/program.model';

import { SearchFilterComponent, countActiveFilters } from './search-filter.component';

describe('countActiveFilters', () => {
  it('is 0 for the defaults', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
  });

  it('counts each changed group once', () => {
    const filters: ProgramFilters = {
      ...DEFAULT_FILTERS,
      sort: 'critics',
      genres: ['action', 'drama'],
      yearFrom: 2000,
      yearTo: 2010,
      minAudienceStars: 3,
    };
    expect(countActiveFilters(filters)).toBe(4);
  });
});

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  let applied: ProgramFilters[];

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filters', DEFAULT_FILTERS);
    applied = [];
    component.filtersChange.subscribe((f) => applied.push(f));
    fixture.detectChanges();
    component.open();
  });

  it('adds categories from the dropdown and stops offering them', () => {
    const select = { value: 'action' };
    component.addGenre({ detail: { value: 'action' }, target: select } as unknown as SelectCustomEvent<Genre | null>);

    expect(component.draft().genres).toEqual(['action']);
    expect(component.availableGenres().some((g) => g.value === 'action')).toBe(false);
    expect(select.value).toBeNull(); // dropdown empty again, ready for the next one
  });

  it('removes a category chip', () => {
    component.draft.set({ ...DEFAULT_FILTERS, genres: ['action', 'drama'] });
    component.removeGenre('action');
    expect(component.draft().genres).toEqual(['drama']);
  });

  it('treats the ends of the year slider as "no limit"', () => {
    component.onYearChange({ detail: { value: { lower: YEAR_MIN, upper: 2010 } } } as RangeCustomEvent);
    expect(component.draft()).toMatchObject({ yearFrom: null, yearTo: 2010 });

    component.onYearChange({ detail: { value: { lower: 1990, upper: YEAR_MAX } } } as RangeCustomEvent);
    expect(component.draft()).toMatchObject({ yearFrom: 1990, yearTo: null });
  });

  it('only sends the filters on Apply', () => {
    component.onStarsChange('minCriticsStars', { detail: { value: 4 } } as RangeCustomEvent);
    expect(applied).toEqual([]);

    component.apply();
    expect(applied).toEqual([{ ...DEFAULT_FILTERS, minCriticsStars: 4 }]);
    expect(component.isOpen()).toBe(false);
  });

  it('Reset goes back to the defaults without applying', () => {
    component.setSort('oldest');
    component.reset();
    expect(component.draft()).toEqual(DEFAULT_FILTERS);
    expect(applied).toEqual([]);
  });
});
