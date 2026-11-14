import { TestBed } from '@angular/core/testing';

import type { Movie } from '../../models/program.model';

import { ProgramHomeCardComponent } from './program-home-card.component';

const DUNE: Movie = {
  _id: 'm1',
  type: 'movie',
  externalId: 'tt15239678',
  title: 'Dune: Part Two',
  year: 2024,
  releaseDate: null,
  posterUrl: null,
  genres: ['science_fiction', 'adventure', 'drama'],
  actors: [],
  synopsis: null,
  pointsMeanCritics: 91.6,
  pointsMeanNormal: null,
  durationMin: 166,
};

describe('ProgramHomeCardComponent', () => {
  it('shows the first two categories and the rounded scores', () => {
    const fixture = TestBed.createComponent(ProgramHomeCardComponent);
    fixture.componentRef.setInput('program', DUNE);
    fixture.detectChanges();
    const card = fixture.componentInstance;

    expect(card.genreText()).toBe('Sci-Fi, Adventure');
    expect(card.critics()).toBe('92');
    expect(card.audience()).toBe('—'); // no audience reviews yet
    expect((fixture.nativeElement as HTMLElement).querySelector('app-program-card-simple')).not.toBeNull();
  });
});
