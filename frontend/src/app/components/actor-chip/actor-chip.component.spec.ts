import { TestBed } from '@angular/core/testing';

import { ActorChipComponent } from './actor-chip.component';

describe('ActorChipComponent', () => {
  it('shows the initial and the name', () => {
    const fixture = TestBed.createComponent(ActorChipComponent);
    fixture.componentRef.setInput('name', 'zendaya');
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;

    expect(html.querySelector('.initial')?.textContent).toBe('Z');
    expect(html.querySelector('.name')?.textContent).toBe('zendaya');
  });
});
