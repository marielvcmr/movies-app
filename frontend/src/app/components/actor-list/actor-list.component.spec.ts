import { TestBed } from '@angular/core/testing';

import { ActorListComponent } from './actor-list.component';

describe('ActorListComponent', () => {
  it('shows one actor-chip per actor', () => {
    const fixture = TestBed.createComponent(ActorListComponent);
    fixture.componentRef.setInput('actors', ['Adam Scott', 'Britt Lower', 'Zach Cherry']);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-actor-chip').length).toBe(3);
  });
});
