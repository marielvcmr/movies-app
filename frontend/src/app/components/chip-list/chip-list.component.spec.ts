import { TestBed } from '@angular/core/testing';

import { ChipListComponent } from './chip-list.component';

describe('ChipListComponent', () => {
  it('shows one chip per item', () => {
    const fixture = TestBed.createComponent(ChipListComponent);
    fixture.componentRef.setInput('items', ['Sci-Fi', 'Drama']);
    fixture.detectChanges();

    const chips = (fixture.nativeElement as HTMLElement).querySelectorAll('.chip');
    expect(Array.from(chips).map((chip) => chip.textContent?.trim())).toEqual(['Sci-Fi', 'Drama']);
  });
});
