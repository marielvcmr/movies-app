import { TestBed } from '@angular/core/testing';

import type { UserType } from '../../models/user.model';

import { UserFilterComponent } from './user-filter.component';

describe('UserFilterComponent', () => {
  it('marks the current chip and emits the tapped type (null = All)', () => {
    const fixture = TestBed.createComponent(UserFilterComponent);
    fixture.componentRef.setInput('type', 'critic');
    const emitted: (UserType | null)[] = [];
    fixture.componentInstance.typeChange.subscribe((type) => emitted.push(type));
    fixture.detectChanges();

    const chips = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button.chip');
    expect([...chips].map((chip) => chip.textContent?.trim())).toEqual(['All', 'Normal', 'Critics']);
    expect(chips[2].getAttribute('aria-pressed')).toBe('true');

    chips[2].click(); // already on: nothing
    chips[1].click();
    chips[0].click();
    expect(emitted).toEqual(['normal', null]);
  });
});
