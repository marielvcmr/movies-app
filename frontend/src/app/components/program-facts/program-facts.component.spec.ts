import { TestBed } from '@angular/core/testing';

import type { Program } from '../../models/program.model';

import { ProgramFactsComponent } from './program-facts.component';

const BASE = {
  _id: 'x',
  externalId: 'tt0',
  title: 'Title',
  year: 2024,
  posterUrl: null,
  genres: [],
  actors: [],
  synopsis: null,
  pointsMeanCritics: null,
  pointsMeanNormal: null,
};

describe('ProgramFactsComponent', () => {
  function facts(program: Program) {
    const fixture = TestBed.createComponent(ProgramFactsComponent);
    fixture.componentRef.setInput('program', program);
    fixture.detectChanges();
    return fixture.componentInstance.facts();
  }

  it('movie: release date and duration', () => {
    expect(facts({ ...BASE, type: 'movie', releaseDate: '2024-03-01T00:00:00.000Z', durationMin: 166 })).toEqual([
      { label: 'Released', value: 'Mar 1, 2024' },
      { label: 'Duration', value: '166 min' },
    ]);
  });

  it('series: seasons, and leaves out what is missing', () => {
    expect(facts({ ...BASE, type: 'series', releaseDate: null, seasonsCount: 2 })).toEqual([
      { label: 'Seasons', value: '2 seasons' },
    ]);
  });
});
