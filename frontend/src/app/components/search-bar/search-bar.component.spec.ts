import { TestBed } from '@angular/core/testing';
import type { SearchbarCustomEvent } from '@ionic/angular';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  it('emits what the user typed', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    const emitted: string[] = [];
    fixture.componentInstance.queryChange.subscribe((q) => emitted.push(q));
    fixture.detectChanges();

    fixture.componentInstance.onInput({ detail: { value: 'dune' } } as SearchbarCustomEvent);
    fixture.componentInstance.onInput({ detail: { value: null } } as unknown as SearchbarCustomEvent);

    expect(emitted).toEqual(['dune', '']);
  });
});
