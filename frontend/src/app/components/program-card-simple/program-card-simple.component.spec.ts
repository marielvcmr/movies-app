import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { PosterData } from './program-card-simple.component';
import { ProgramCardSimpleComponent } from './program-card-simple.component';

describe('ProgramCardSimpleComponent', () => {
  let fixture: ComponentFixture<ProgramCardSimpleComponent>;
  const html = () => fixture.nativeElement as HTMLElement;

  function render(program: PosterData) {
    fixture = TestBed.createComponent(ProgramCardSimpleComponent);
    fixture.componentRef.setInput('program', program);
    fixture.detectChanges();
  }

  it('uses the clapperboard icon for movies and the TV for series', () => {
    render({ title: 'Dune', type: 'movie', posterUrl: null });
    expect(fixture.componentInstance.icon()).toBe('film-outline');

    render({ title: 'Dark', type: 'series', posterUrl: null });
    expect(fixture.componentInstance.icon()).toBe('tv-outline');
  });

  it('shows the title when there is no image', () => {
    render({ title: 'Dune', type: 'movie', posterUrl: null });
    expect(html().querySelector('img')).toBeNull();
    expect(html().querySelector('.fallback-title')?.textContent).toContain('Dune');
  });

  it('shows the image, and falls back to the title if it fails', () => {
    render({ title: 'Dune', type: 'movie', posterUrl: 'https://example.com/dune.jpg' });
    expect(html().querySelector('img')).not.toBeNull();

    fixture.componentInstance.imageFailed.set(true);
    fixture.detectChanges();
    expect(html().querySelector('img')).toBeNull();
    expect(html().querySelector('.fallback-title')).not.toBeNull();
  });
});
