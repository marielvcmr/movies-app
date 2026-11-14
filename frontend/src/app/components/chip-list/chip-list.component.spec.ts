import { TestBed } from '@angular/core/testing';

import { ChipListComponent } from './chip-list.component';

describe('ChipListComponent', () => {
  function render(items: string[], avatars = false): HTMLElement {
    const fixture = TestBed.createComponent(ChipListComponent);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('avatars', avatars);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows one chip per item', () => {
    const html = render(['Sci-Fi', 'Drama']);
    expect(html.querySelectorAll('.chip').length).toBe(2);
    expect(html.querySelector('.initial')).toBeNull();
  });

  it('adds the initial when avatars is on', () => {
    const html = render(['Zendaya'], true);
    expect(html.querySelector('.initial')?.textContent).toBe('Z');
    expect(html.classList).toContain('with-avatars');
  });
});
