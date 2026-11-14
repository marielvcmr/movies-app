import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DetailSectionComponent } from './detail-section.component';

// A tiny host to check that the content between the tags shows up.
@Component({
  imports: [DetailSectionComponent],
  template: `<app-detail-section heading="Synopsis"><p class="body">A long story.</p></app-detail-section>`,
})
class HostComponent {}

describe('DetailSectionComponent', () => {
  it('shows the heading and the projected content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('h2')?.textContent).toBe('Synopsis');
    expect(html.querySelector('.body')?.textContent).toBe('A long story.');
  });
});
