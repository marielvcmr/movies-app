import { TestBed } from '@angular/core/testing';

import type { Movie, Series } from '../../models/program.model';

import { ProgramDetailCardComponent } from './program-detail-card.component';

const BASE = {
  _id: 'x',
  externalId: 'tt0',
  title: 'Title',
  year: 2022,
  releaseDate: null,
  posterUrl: null,
  genres: [],
  actors: [],
  synopsis: null,
  pointsMeanCritics: null,
  pointsMeanNormal: null,
};

describe('ProgramDetailCardComponent', () => {
  function create(program: Movie | Series) {
    const fixture = TestBed.createComponent(ProgramDetailCardComponent);
    fixture.componentRef.setInput('program', program);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('shows the duration for a movie', () => {
    const card = create({ ...BASE, type: 'movie', durationMin: 166 });
    expect(card.typeLabel()).toBe('Movie');
    expect(card.length()).toBe('166 min');
  });

  it('shows the seasons for a series', () => {
    const card = create({ ...BASE, type: 'series', seasonsCount: 1 });
    expect(card.typeLabel()).toBe('Series');
    expect(card.length()).toBe('1 season');
  });

  it('hides the length when it is unknown', () => {
    expect(create({ ...BASE, type: 'movie', durationMin: null }).length()).toBeNull();
  });
});
