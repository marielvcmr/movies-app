import { TestBed } from '@angular/core/testing';

import { HomeHeaderComponent } from './home-header.component';

describe('HomeHeaderComponent', () => {
  it('shows SpoilerAlert by default', () => {
    const fixture = TestBed.createComponent(HomeHeaderComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('SpoilerAlert');
  });

  it('shows the title it receives', () => {
    const fixture = TestBed.createComponent(HomeHeaderComponent);
    fixture.componentRef.setInput('title', 'My profile');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('My profile');
  });
});
